import React, { createContext, useContext, useState, useEffect } from 'react';

const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('google_calendar_token');
        if (storedToken) {
            setToken(storedToken);
        }

        // Listen for token updates from OAuth callback page
        const handleTokenUpdate = () => {
            const newToken = localStorage.getItem('google_calendar_token');
            if (newToken) setToken(newToken);
        };
        window.addEventListener('calendar_token_updated', handleTokenUpdate);
        return () => window.removeEventListener('calendar_token_updated', handleTokenUpdate);
    }, []);

    /**
     * Redirect-based Google OAuth login (avoids popup blocker issues).
     * Redirects the user to Google's OAuth consent page.
     * After consent, Google redirects to /oauth-callback where the token is extracted.
     */
    const login = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId || clientId === 'placeholder') {
            alert('Google Client ID is not configured. Please contact the administrator.');
            return;
        }

        const redirectUri = `${window.location.origin}/oauth-callback`;
        const scope = 'https://www.googleapis.com/auth/calendar.events';
        const state = Math.random().toString(36).substring(2, 10);

        // Save state for CSRF verification and where to redirect back after auth
        sessionStorage.setItem('oauth_state', state);
        sessionStorage.setItem('oauth_redirect_back', window.location.pathname);

        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.set('client_id', clientId);
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('response_type', 'token');
        authUrl.searchParams.set('scope', scope);
        authUrl.searchParams.set('state', state);
        authUrl.searchParams.set('include_granted_scopes', 'true');
        authUrl.searchParams.set('prompt', 'consent');

        window.location.href = authUrl.toString();
    };

    const logout = () => {
        setToken(null);
        setEvents([]);
        localStorage.removeItem('google_calendar_token');
    };

    const fetchEvents = async () => {
        if (!token) return;
        setIsLoading(true);
        setError(null);
        try {
            const timeMin = new Date();
            timeMin.setDate(1);
            const timeMax = new Date();
            timeMax.setMonth(timeMax.getMonth() + 2);

            const response = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}&singleEvents=true&orderBy=startTime`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                    throw new Error('Authentication expired. Please reconnect Google Calendar.');
                }
                throw new Error('Failed to fetch events');
            }

            const data = await response.json();
            setEvents(data.items || []);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const addEvent = async (event) => {
        if (!token) return false;
        try {
            const response = await fetch(
                'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(event),
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                    throw new Error('Authentication expired. Please reconnect Google Calendar.');
                }
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData?.error?.message || 'Failed to add event');
            }

            const newEvent = await response.json();
            setEvents(prev => [...prev, newEvent]);
            return newEvent;
        } catch (err) {
            console.error('Error adding event:', err);
            setError(err.message);
            return null;
        }
    };

    useEffect(() => {
        if (token) fetchEvents();
    }, [token]);

    return (
        <CalendarContext.Provider value={{ token, events, isLoading, error, login, logout, fetchEvents, addEvent }}>
            {children}
        </CalendarContext.Provider>
    );
};

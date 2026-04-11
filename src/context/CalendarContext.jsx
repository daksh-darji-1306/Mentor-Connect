import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initial check if we have a token stored
    useEffect(() => {
        const storedToken = localStorage.getItem('google_calendar_token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setToken(codeResponse.access_token);
            localStorage.setItem('google_calendar_token', codeResponse.access_token);
        },
        onError: (error) => {
            console.error('Login Failed:', error);
            setError('Login Failed');
        },
        scope: 'https://www.googleapis.com/auth/calendar.events',
    });

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
            timeMin.setDate(1); // Start of month
            
            const timeMax = new Date();
            timeMax.setMonth(timeMax.getMonth() + 2); // Until end of next month
            
            const response = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}&singleEvents=true&orderBy=startTime`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            if (!response.ok) {
                if (response.status === 401) {
                    logout(); // Token expired
                    throw new Error("Authentication expired. Please log in again.");
                }
                throw new Error("Failed to fetch events");
            }

            const data = await response.json();
            setEvents(data.items || []);
        } catch (err) {
            console.error("Error fetching events:", err);
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
                    throw new Error("Authentication expired. Please log in again.");
                }
                throw new Error("Failed to add event");
            }

            const newEvent = await response.json();
            setEvents(prev => [...prev, newEvent]);
            return newEvent;
        } catch (err) {
            console.error("Error adding event:", err);
            setError(err.message);
            return null;
        }
    };

    useEffect(() => {
        if (token) {
            fetchEvents();
        }
    }, [token]);

    return (
        <CalendarContext.Provider
            value={{
                token,
                events,
                isLoading,
                error,
                login,
                logout,
                fetchEvents,
                addEvent
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};

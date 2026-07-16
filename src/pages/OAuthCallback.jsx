import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Handles the Google OAuth redirect callback.
 * Parses the access_token from the URL hash and stores it,
 * then redirects back to the mentor dashboard.
 */
const OAuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1)); // remove leading '#'
            const accessToken = params.get('access_token');
            const state = params.get('state');
            const storedState = sessionStorage.getItem('oauth_state');
            const redirectBack = sessionStorage.getItem('oauth_redirect_back') || '/dashboard';

            if (accessToken && state === storedState) {
                localStorage.setItem('google_calendar_token', accessToken);
                sessionStorage.removeItem('oauth_state');
                sessionStorage.removeItem('oauth_redirect_back');
                // Dispatch custom event so CalendarContext picks up the new token
                window.dispatchEvent(new Event('calendar_token_updated'));
            }
            // Navigate back regardless
            navigate(redirectBack, { replace: true });
        } else {
            // No hash means error or direct navigation — go back to dashboard
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground text-sm">Connecting Google Calendar...</p>
            </div>
        </div>
    );
};

export default OAuthCallback;

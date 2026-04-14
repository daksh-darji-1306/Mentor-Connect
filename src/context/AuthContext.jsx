import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (authUser) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            const profileExists = !!data;
            const signupIntent = localStorage.getItem('signup_intent') === 'true';

            // If profile doesn't exist
            if (!profileExists) {
                // If they are just "signing in" (no signup intent), reject them
                if (!signupIntent) {
                    console.log("No profile found and no signup intent. Rejecting user.");
                    await supabase.auth.signOut();
                    setUser(null);
                    setLoading(false);
                    // Crucial: use a direct redirect to avoid React state race conditions
                    window.location.href = window.location.origin + '/login?error=not_registered';
                    return null;
                }
                
                // If it IS a signup attempt, we create the profile row immediately
                // This ensures they are "registered" and also sets their initial role
                const savedRole = localStorage.getItem('signup_role') || 'mentee';
                
                const { data: newProfile, error: upsertError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: authUser.id,
                        full_name: authUser.user_metadata?.full_name || 'User',
                        email: authUser.email,
                        role: savedRole,
                        profile_data: { onboardingCompleted: false }
                    })
                    .select()
                    .single();

                if (upsertError) {
                    console.error("Error creating initial profile:", upsertError);
                }

                setUser({ ...authUser, ...newProfile });
                localStorage.removeItem('signup_intent');
                localStorage.removeItem('signup_role');
                setLoading(false);
                return;
            }

            // Profile exists, we are good to go
            setUser({ ...authUser, ...data });
        } catch (error) {
            console.error('Error fetching profile:', error);
            setUser(authUser);
        } finally {
            setLoading(false);
        }
    };

    const signupWithEmail = async (email, password, profileData) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: profileData.fullName,
                    role: profileData.role || 'mentee',
                    avatar_url: ''
                }
            }
        });

        if (error) throw error;

        if (data.user) {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    profile_data: profileData,
                })
                .eq('id', data.user.id);

            if (updateError) console.error('Error updating profile details:', updateError);

            if (data.session) {
                await fetchProfile(data.user);
            }
        }

        return data.user;
    };

    const loginWithEmail = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
    };

    const loginWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/dashboard` }
        });
        if (error) throw error;
        return data;
    };

    const loginWithLinkedIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'linkedin',
            options: { redirectTo: `${window.location.origin}/dashboard` }
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        try {
            // Add a safety timeout so signOut doesn't hang the UI forever
            const signOutPromise = supabase.auth.signOut();
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Sign out timed out')), 3000)
            );

            await Promise.race([signOutPromise, timeoutPromise]);
        } catch (error) {
            console.error('Logout error/timeout:', error);
        } finally {
            // Always clear state and localStorage even on failure/timeout
            setUser(null);
            localStorage.removeItem('google_calendar_token');
            localStorage.removeItem('signup_intent');
            localStorage.removeItem('signup_role');
        }
    };

    useEffect(() => {
        const safetyTimeout = setTimeout(() => setLoading(false), 4000);

        supabase.auth.getSession().then(({ data: { session } }) => {
            clearTimeout(safetyTimeout);
            if (session?.user) {
                fetchProfile(session.user);
            } else {
                setUser(null);
                setLoading(false);
            }
        }).catch(() => {
            clearTimeout(safetyTimeout);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                await fetchProfile(session.user);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            clearTimeout(safetyTimeout);
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        user,
        loading,
        signupWithEmail,
        loginWithEmail,
        loginWithGoogle,
        loginWithLinkedIn,
        refreshProfile: () => fetchProfile(user),
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: '100vh', background: '#0a0a0a', flexDirection: 'column', gap: '12px'
                }}>
                    <div style={{
                        width: '40px', height: '40px', border: '3px solid #333',
                        borderTop: '3px solid #a78bfa', borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Loading...</p>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

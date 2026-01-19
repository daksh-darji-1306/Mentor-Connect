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

            if (data) {
                setUser({ ...authUser, ...data });
            } else {
                setUser(authUser);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
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

        // If signup is successful, we might want to update the profile with the full form data
        // The trigger handles basic fields (id, name, role), but we have extra data in profileData
        if (data.user) {
            // Update the profile with the rich data (headline, company, etc.)
            // We store this in the new 'profile_data' JSONB column for flexibility
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    profile_data: profileData,
                    country: profileData.country,        // if you want explicit col
                    language: profileData.language       // if you want explicit col
                })
                .eq('id', data.user.id);

            if (updateError) console.error("Error updating profile details:", updateError);

            // If session exists (auto-login enabled), fetch full profile
            if (data.session) {
                await fetchProfile(data.user);
            }
        }

        return data.user;
    };

    const loginWithEmail = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data.user;
    };

    const loginWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        });
        if (error) throw error;
        return data;
    };

    const loginWithLinkedIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'linkedin',
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
    };

    useEffect(() => {
        // Initial Session Check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchProfile(session.user);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                await fetchProfile(session.user);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        signupWithEmail,
        loginWithEmail,
        loginWithGoogle,
        loginWithLinkedIn,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

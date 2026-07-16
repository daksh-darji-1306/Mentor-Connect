import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signInWithRedirect,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
    deleteUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { logActivity } from '../utils/activityLogger';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (authUser) => {
        try {
            const profileRef = doc(db, 'profiles', authUser.uid);
            const profileSnap = await getDoc(profileRef);

            const profileExists = profileSnap.exists();


            // If profile doesn't exist, create a default one (this helps users who deleted their profile but not their auth)
            if (!profileExists) {
                const savedRole = localStorage.getItem('signup_role') || 'mentee';
                
                const newProfile = {
                    id: authUser.uid,
                    full_name: authUser.displayName || 'User',
                    email: authUser.email,
                    role: savedRole,
                    profile_data: { onboardingCompleted: false }
                };

                try {
                    await setDoc(profileRef, newProfile);
                } catch (upsertError) {
                    console.error("Error creating initial profile:", upsertError);
                }

                setUser({ ...authUser, ...newProfile, id: authUser.uid });
                localStorage.removeItem('signup_intent');
                localStorage.removeItem('signup_role');
                setLoading(false);
                return;
            }

            setUser({ ...authUser, ...profileSnap.data(), id: authUser.uid });
            
            if (!sessionStorage.getItem('session_logged_in') && authUser.uid) {
                sessionStorage.setItem('session_logged_in', 'true');
                logActivity(authUser.uid, 'user_login');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setUser({ ...authUser, id: authUser.uid });
        } finally {
            setLoading(false);
        }
    };

    const signupWithEmail = async (email, password, profileData) => {
        localStorage.setItem('signup_intent', 'true');
        localStorage.setItem('signup_role', profileData.role || 'mentee');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user) {
            const profileRef = doc(db, 'profiles', user.uid);
            await setDoc(profileRef, {
                id: user.uid,
                full_name: profileData.fullName || 'User',
                email: user.email,
                role: profileData.role || 'mentee',
                profile_data: profileData
            });

            await fetchProfile(user);
        }
        return user;
    };

    const loginWithEmail = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            return result.user;
        } catch (error) {
            if (error.code === 'auth/popup-blocked') {
                console.warn('Popup blocked, falling back to redirect...');
                await signInWithRedirect(auth, provider);
                return null;
            }
            console.error('Firebase OAuth Error:', error);
            throw error;
        }
    };

    const loginWithLinkedIn = async () => {
        throw new Error("LinkedIn authentication is not configured in Firebase yet.");
    };

    const logout = async () => {
        try {
            const signOutPromise = signOut(auth);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Sign out timed out')), 3000)
            );

            await Promise.race([signOutPromise, timeoutPromise]);
        } catch (error) {
            console.error('Logout error/timeout:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('google_calendar_token');
            localStorage.removeItem('signup_intent');
            localStorage.removeItem('signup_role');
        }
    };

    const deleteAccount = async () => {
        if (!auth.currentUser) throw new Error("No user is logged in");
        
        // Delete profile from Firestore
        try {
            const profileRef = doc(db, 'profiles', auth.currentUser.uid);
            await deleteDoc(profileRef);
        } catch (err) {
            console.error('Error deleting profile:', err);
        }

        await deleteUser(auth.currentUser);
        setUser(null);
        localStorage.removeItem('google_calendar_token');
        localStorage.removeItem('signup_intent');
        localStorage.removeItem('signup_role');
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                await fetchProfile(currentUser);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        signupWithEmail,
        loginWithEmail,
        loginWithGoogle,
        loginWithLinkedIn,
        refreshProfile: () => fetchProfile(auth.currentUser),
        logout,
        deleteAccount
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

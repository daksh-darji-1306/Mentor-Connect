import { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, linkedinProvider } from '../lib/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper to sync user to Firestore on login/signup
    const syncUserToFirestore = async (user, additionalData = {}) => {
        if (!user) return;

        try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            // If user doesn't exist, create them
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || additionalData.displayName || '',
                    photoURL: user.photoURL || '',
                    role: additionalData.role || 'mentee', // Default to mentee if not specified
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp(),
                    provider: user.providerData[0]?.providerId || 'email'
                });
            } else {
                // Just update last login
                await setDoc(userRef, {
                    lastLogin: serverTimestamp()
                }, { merge: true });
            }
        } catch (error) {
            console.error("Firestore Sync Error (Offline/Network):", error);
            // Optionally: Persist locally or retry later
        }
    };

    const signupWithEmail = async (email, password, profileData) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            // Update the Firebase Auth profile with the name immediately
            await updateProfile(result.user, { displayName: profileData.fullName });

            // Sync to Firestore with all profile data
            await syncUserToFirestore(result.user, profileData);
            return result.user;
        } catch (error) {
            console.error("Signup Error:", error);
            throw error;
        }
    };

    const loginWithEmail = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await syncUserToFirestore(result.user);
            return result.user;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // Google doesn't provide a role, so we rely on default or existing
            await syncUserToFirestore(result.user);
            return result.user;
        } catch (error) {
            console.error("Google Login Error:", error);
            throw error;
        }
    };

    const loginWithLinkedIn = async () => {
        try {
            const result = await signInWithPopup(auth, linkedinProvider);
            await syncUserToFirestore(result.user);
            return result.user;
        } catch (error) {
            console.error("LinkedIn Login Error:", error);
            throw error;
        }
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    // Fetch the role and additional data from Firestore
                    const userRef = doc(db, 'users', currentUser.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        // Merge auth user with firestore data
                        setUser({ ...currentUser, ...userData });
                    } else {
                        // Fallback if firestore doc is missing (rare)
                        setUser(currentUser);
                    }
                } catch (error) {
                    console.error("Error fetching user role (Offline/Network): Using Auth defaults", error);
                    // Fallback to basic auth user if Firestore fails
                    setUser(currentUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
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
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

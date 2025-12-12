import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For technical security, these should be in a .env file
// VITE_FIREBASE_API_KEY
// VITE_FIREBASE_AUTH_DOMAIN
// VITE_FIREBASE_PROJECT_ID
// ... etc
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth Providers
const googleProvider = new GoogleAuthProvider();
const linkedinProvider = new OAuthProvider('oidc.linkedin'); // Or whatever provider ID you assigned in Firebase Console

export { auth, db, googleProvider, linkedinProvider };

import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function findAndDelete() {
  const q = query(collection(db, 'profiles'), where('full_name', '==', 'Pratham Darji'));
  const snap = await getDocs(q);
  
  if (snap.empty) {
    console.log("No profiles found for 'Pratham Darji'");
    process.exit(0);
  }

  const profiles = [];
  snap.forEach(d => profiles.push({ id: d.id, ...d.data() }));

  console.log("Found profiles:", JSON.stringify(profiles, null, 2));

  const oldId = "3MQJtUth9AhSAqAJUdB09pFtubm2";
  console.log("Deleting old profile:", oldId);
  try {
      await deleteDoc(doc(db, 'profiles', oldId));
      console.log("Deleted successfully.");
  } catch(e) {
      console.log("Error:", e);
  }
  process.exit(0);
}

findAndDelete();

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
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

const initialResources = [
  { title: 'React Advanced Patterns', type: 'Course', icon: 'BookOpen', progress: 0, color: '#a889ff' },
  { title: 'System Design Mastery', type: 'Guide', icon: 'Target', progress: 0, color: '#ff6b9d' },
  { title: 'Web Performance', type: 'Article', icon: 'Zap', progress: 0, color: '#4ade80' },
  { title: 'Scaling Applications', type: 'Video', icon: 'TrendingUp', progress: 0, color: '#f59e0b' }
];

async function seed() {
  const q = await getDocs(collection(db, 'resources'));
  if (!q.empty) {
    console.log("Resources already seeded");
    process.exit(0);
  }

  for (const r of initialResources) {
    await addDoc(collection(db, 'resources'), r);
  }
  console.log("Seeded resources!");
  process.exit(0);
}

seed();

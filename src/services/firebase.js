import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Live Firebase Configuration for EVEX project: evex-1c901
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAYuMlp4ftdi3ynx5R3SnHUYC7jb4692j4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "evex-1c901.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "evex-1c901",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "evex-1c901.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "721394236496",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:721394236496:web:0db930d02623f41c8ea555",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-79JF1EP3CC"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable persistent login across browser refreshes and restarts
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Firebase setPersistence notice:', err.message);
  });
}

export default app;

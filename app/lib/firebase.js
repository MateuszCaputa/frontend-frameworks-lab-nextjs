import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * (Lab 7, Task 5 & 9)
 * Firebase configuration object.
 * Values are loaded from environment variables for security.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

/**
 * (Lab 7, Task 5) & (Lab 9, Prep)
 * Initialize Firebase application using Singleton pattern.
 * Exports 'auth' for authentication and 'db' for Firestore database.
 */
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app); // (Lab 9) Initialize Firestore

export { app, auth, db };

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * (Lab 7, Task 5 & 9)
 * Firebase configuration object.
 * Values are loaded from environment variables for security (Task 9).
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
 * Initialize Firebase application.
 * Uses Singleton pattern to prevent multiple initializations during HMR.
 */
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };

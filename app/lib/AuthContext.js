"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext({
  user: null,
  loading: true,
});

/**
 * Authentication Provider Component.
 * Manages the global authentication state using Firebase Auth observer.
 * Provides the current user object and loading state to the application tree.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context data.
 * @returns {{ user: object|null, loading: boolean }} The auth context value.
 */
export const useAuth = () => useContext(AuthContext);

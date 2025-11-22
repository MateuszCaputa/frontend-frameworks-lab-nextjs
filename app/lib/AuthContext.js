"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext({
  user: null,
  loading: true,
});

/**
 * (Lab 7, Task 5)
 * Authentication Context Provider.
 * Monitors Firebase auth state changes and provides user data to the app.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
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
 * Custom hook to access authentication state.
 * @returns {object} { user, loading }
 */
export const useAuth = () => useContext(AuthContext);

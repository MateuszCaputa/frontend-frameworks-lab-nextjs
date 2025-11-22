"use client";
import { useAuth } from "@/app/lib/AuthContext";
import { useLayoutEffect } from "react";
import { redirect, usePathname } from "next/navigation";

/**
 * (Lab 7, Task 6)
 * Protected Route Layout.
 * Guards child routes by checking authentication state.
 * Redirects unauthenticated users to sign-in with a return URL.
 */
function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const returnUrl = usePathname();

  useLayoutEffect(() => {
    if (!loading && !user) {
      redirect(`/user/signin?returnUrl=${returnUrl}`);
    }
  }, [user, loading, returnUrl]);

  // Do not render children until user is confirmed
  if (loading || !user) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedLayout;

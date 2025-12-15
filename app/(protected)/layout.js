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
    if (!loading) {
      if (!user) {
        redirect(`/user/signin?returnUrl=${returnUrl}`);
      } else if (!user.emailVerified) {
        redirect(`/user/verify?email=${encodeURIComponent(user.email)}`);
      }
    }
  }, [user, loading, returnUrl]);

  // Nie renderuj treści chronionej, dopóki nie mamy pewności, że user jest zweryfikowany
  if (loading || !user || !user.emailVerified) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedLayout;

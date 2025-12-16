"use client";
import { useAuth } from "@/app/lib/AuthContext";
import { useLayoutEffect } from "react";
import { redirect, usePathname } from "next/navigation";

/**
 * Protected Route Layout.
 * Higher-order component that guards child routes.
 * Checks authentication status and email verification.
 * Redirects unauthorized users to the sign-in page or verification page.
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

  if (loading || !user || !user.emailVerified) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedLayout;

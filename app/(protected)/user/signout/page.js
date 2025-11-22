"use client";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

/**
 * (Lab 7, Task 1 - Protected Routes)
 * Page component that handles user sign out.
 * Automatically logs the user out via Firebase upon mounting and redirects to the sign-in page.
 */
export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    signOut(auth).then(() => {
      router.push("/user/signin");
    });
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-full mt-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">
          Wylogowywanie...
        </h2>
        <p className="text-gray-500 text-sm">Do zobaczenia wkrótce.</p>
      </div>
    </div>
  );
}

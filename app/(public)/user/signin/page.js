"use client";

import { useState, Suspense } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

/**
 * (Lab 7, Task 3, 7, 8) & (Lab 8, Task 6)
 * Sign In Page.
 * Handles user authentication and enforces email verification.
 * Redirects to the returnUrl upon successful login.
 */
function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        const user = userCredential.user;

        // (Lab 8, Task 6) Enforce email verification
        if (!user.emailVerified) {
          router.push(`/user/verify?email=${encodeURIComponent(user.email)}`);
          return;
        }

        router.push(returnUrl);
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-credential":
            setError("Nieprawidłowy email lub hasło.");
            break;
          case "auth/user-not-found":
            setError("Nie znaleziono użytkownika o takim adresie email.");
            break;
          case "auth/wrong-password":
            setError("Nieprawidłowe hasło.");
            break;
          case "auth/too-many-requests":
            setError("Zbyt wiele nieudanych prób. Spróbuj ponownie później.");
            break;
          default:
            setError(`Wystąpił błąd: ${error.message}`);
        }
        setLoading(false);
      });
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 relative flex flex-col min-w-0 break-words mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="text-center text-gray-500 mb-2">
            <small>Zaloguj się danymi konta</small>
          </div>
        </div>

        <div className="flex-auto px-6 py-8 pt-4">
          {error && (
            <div
              className="relative px-4 py-3 mb-4 leading-normal text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              <span className="absolute inset-y-0 left-0 flex items-center ml-4">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </span>
              <p className="ml-6 font-bold">Błąd logowania</p>
              <p className="ml-6 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-4 text-gray-700">
              <label
                className="block mb-1 font-bold text-xs uppercase"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full h-10 px-3 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                placeholder="Email"
              />
            </div>

            <div className="mb-4 text-gray-700">
              <label
                className="block mb-1 font-bold text-xs uppercase"
                htmlFor="password"
              >
                Hasło
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full h-10 px-3 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                placeholder="Hasło"
              />
            </div>

            <div className="text-center mt-6">
              <button
                className={`w-full h-10 px-5 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800 font-bold uppercase text-sm ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Logowanie..." : "Zaloguj się"}
              </button>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 text-center">
          <Link
            href="/user/register"
            className="text-gray-500 hover:text-indigo-600 text-sm font-bold transition-colors"
          >
            <small>Nie masz konta? Zarejestruj się</small>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * (Lab 11)
 * Main Sign In Page Component.
 * Wraps the content in Suspense to satisfy Next.js build requirements.
 */
export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 h-full flex justify-center items-center mt-12">
      <Suspense
        fallback={<div className="text-center">Ładowanie formularza...</div>}
      >
        <SignInContent />
      </Suspense>
    </div>
  );
}

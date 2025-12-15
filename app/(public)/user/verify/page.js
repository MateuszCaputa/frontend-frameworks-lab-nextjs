"use client";

import { useState, Suspense } from "react";
import { signOut, sendEmailVerification } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/lib/AuthContext";

/**
 * (Lab 8, Task 4)
 * Internal component containing Verification Logic.
 * * Allows users to resend the verification email and provides a manual logout.
 */
function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push("/user/signin");
    });
  };

  const handleResend = () => {
    if (!user) {
      setError(
        "Musisz być zalogowany, aby wysłać ponownie. Spróbuj zalogować się raz jeszcze."
      );
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    sendEmailVerification(user)
      .then(() => {
        setMessage(
          "Link weryfikacyjny został wysłany ponownie! Sprawdź skrzynkę (oraz SPAM)."
        );
      })
      .catch((err) => {
        if (err.code === "auth/too-many-requests") {
          console.warn("Rate limit hit for email verification.");
          setError(
            "Zbyt wiele prób. Poczekaj chwilę przed ponownym wysłaniem."
          );
        } else {
          console.error("Verification error:", err);
          setError("Wystąpił błąd podczas wysyłania. Spróbuj później.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
      <div className="mb-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
          <svg
            className="h-10 w-10 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Weryfikacja Emaila
        </h2>
        <p className="mt-2 text-gray-600">
          Twoje konto nie jest jeszcze aktywne.
        </p>
        <p className="font-medium text-indigo-600 mt-1 text-lg">
          {user?.email || emailParam || "Twój adres email"}
        </p>
      </div>

      {message && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-md text-left mb-6 text-sm text-blue-800">
        <p>
          <strong>Co zrobić?</strong> Sprawdź swoją skrzynkę pocztową i kliknij
          w link weryfikacyjny. Jeśli nie widzisz wiadomości, sprawdź folder
          SPAM.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleResend}
          disabled={loading}
          className={`w-full bg-white text-indigo-600 font-bold py-3 px-4 rounded border border-indigo-600 hover:bg-indigo-50 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Wysyłanie..." : "Wyślij link ponownie"}
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded hover:bg-indigo-700 transition-colors"
        >
          Wróć do logowania
        </button>
      </div>
    </div>
  );
}

/**
 * (Lab 11)
 * Main Verification Page.
 * Wraps content in Suspense to allow build with search params.
 */
export default function VerifyEmailPage() {
  return (
    <div className="container mx-auto px-4 h-full flex justify-center items-center mt-20">
      <Suspense fallback={<div className="text-center">Ładowanie...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}

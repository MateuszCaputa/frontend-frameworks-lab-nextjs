"use client";

import Link from "next/link";
import { useAuth } from "@/app/lib/AuthContext";

/**
 * Landing Page Component.
 * Displays project information and conditional action buttons based on user state.
 */
export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
        Frontend Laboratory <span className="text-indigo-600">App</span>
      </h1>

      <p className="text-xl text-gray-600 max-w-2xl mb-10">
        Projekt zaliczeniowy realizujący zagadnienia z laboratoriów 6-11.
        Aplikacja wykorzystuje <strong>Next.js</strong>,{" "}
        <strong>Firebase Authentication</strong> oraz{" "}
        <strong>Tailwind CSS</strong>.
      </p>

      <div className="flex gap-4 justify-center flex-wrap">
        {user ? (
          <>
            <Link
              href="/schedule"
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              Przejdź do Planera
            </Link>
            <Link
              href="/user/profile"
              className="px-8 py-3 bg-white text-indigo-600 font-semibold border border-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors"
            >
              Mój Profil
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/user/signin"
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              Zaloguj się
            </Link>

            <Link
              href="/user/register"
              className="px-8 py-3 bg-white text-indigo-600 font-semibold border border-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors"
            >
              Załóż konto
            </Link>
          </>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl w-full">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600 font-bold">
            1
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Autoryzacja</h3>
          <p className="text-gray-600 text-sm">
            Kompletny system logowania i rejestracji oparty na Firebase Auth.
            Obsługa chronionych ścieżek i sesji użytkownika.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600 font-bold">
            2
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Architektura</h3>
          <p className="text-gray-600 text-sm">
            Projekt oparty na Next.js App Router z podziałem na strefy publiczne
            i chronione. Czysty kod i modularna struktura.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600 font-bold">
            3
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Stylizacja</h3>
          <p className="text-gray-600 text-sm">
            Nowoczesny interfejs użytkownika zbudowany z użyciem Tailwind CSS,
            zapewniający responsywność i spójny design.
          </p>
        </div>
      </div>
    </div>
  );
}

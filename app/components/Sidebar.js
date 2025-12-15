"use client";
import Link from "next/link";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaCalendarAlt,
  FaKey,
  FaSignInAlt,
} from "react-icons/fa";
import { useAuth } from "@/app/lib/AuthContext";

/**
 * Client Component for Sidebar Navigation.
 * Conditionally renders menu items based on authentication state.
 */
export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white shadow-md hidden md:flex flex-col z-10">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-600 uppercase tracking-wider">
          LabApp
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
          Menu
        </p>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          <FaHome className="text-lg" /> Strona Główna
        </Link>
        <Link
          href="/schedule"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          <FaCalendarAlt className="text-lg" /> Planer (Temat 2)
        </Link>

        {user ? (
          <>
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase mt-6">
              Użytkownik
            </p>
            <Link
              href="/user/profile"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <FaUser className="text-lg" /> Profil
            </Link>
            <Link
              href="/user/changepassword"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <FaKey className="text-lg" /> Zmień hasło
            </Link>
            <Link
              href="/user/signout"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt className="text-lg" /> Wyloguj
            </Link>
          </>
        ) : (
          <>
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase mt-6">
              Dostęp
            </p>
            <Link
              href="/user/signin"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <FaSignInAlt className="text-lg" /> Zaloguj się
            </Link>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-center text-gray-400">
          &copy; 2025 Student 15300
        </div>
      </div>
    </aside>
  );
}

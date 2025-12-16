"use client";
import Link from "next/link";
import Image from "next/image";
import { FaSignInAlt, FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/app/lib/AuthContext";

/**
 * Topbar Navigation Component.
 * Renders the top header bar with responsive controls.
 * Displays user avatar/info if logged in, or Login/Register buttons otherwise.
 */
export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 lg:px-8 z-0">
      <div className="text-lg font-medium text-gray-700">Panel Aplikacji</div>

      <div className="flex items-center gap-4">
        {user ? (
          <Link
            href="/user/profile"
            className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors group"
          >
            <span className="text-sm font-medium hidden sm:block group-hover:text-indigo-600 transition-colors">
              {user.displayName || user.email}
            </span>

            {user.photoURL ? (
              <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-200 group-hover:border-indigo-400 transition-colors">
                <Image
                  src={user.photoURL}
                  alt="Avatar"
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="32px"
                />
              </div>
            ) : (
              <FaUserCircle className="text-3xl text-gray-400 group-hover:text-indigo-600 transition-colors" />
            )}
          </Link>
        ) : (
          <>
            <Link
              href="/user/signin"
              className="text-sm font-medium text-gray-500 hover:text-indigo-600 flex items-center gap-2 transition-colors"
            >
              <FaSignInAlt /> Logowanie
            </Link>
            <Link
              href="/user/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded shadow transition-colors"
            >
              Rejestracja
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

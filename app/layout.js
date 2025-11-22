import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/lib/AuthContext";
import Link from "next/link";
import {
  FaHome,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaCalendarAlt,
  FaKey,
} from "react-icons/fa";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Frontend Laboratory App",
  description: "Projekt zaliczeniowy na Lab 7-11",
};

/**
 * (Lab 7, Task 2)
 * Root Layout component.
 * Defines the global structure (Sidebar, Topbar) and provides the AuthContext.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="pl" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-800`}
      >
        <AuthProvider>
          <div className="flex min-h-screen flex-row">
            {/* Sidebar Navigation (Task 2) */}
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

                <p className="px-4 text-xs font-semibold text-gray-400 uppercase mt-6">
                  Użytkownik
                </p>
                <Link
                  href="/user/profile"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <FaUser className="text-lg" /> Profil (Chroniony)
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
              </nav>

              <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-center text-gray-400">
                  &copy; 2025 Student 15300
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative">
              {/* Topbar Navigation (Task 2) */}
              <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 lg:px-8 z-0">
                <div className="text-lg font-medium text-gray-700">
                  Panel Aplikacji
                </div>

                <div className="flex items-center gap-4">
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
                </div>
              </header>

              {/* Page Content */}
              <main className="flex-1 p-6 lg:p-10 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

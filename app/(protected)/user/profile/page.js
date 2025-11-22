"use client";
import { useAuth } from "@/app/lib/AuthContext";

/**
 * (Lab 7, Task 1 & 5)
 * Protected Profile Page.
 * Displays detailed information about the currently logged-in user.
 * Accesses user data via AuthContext.
 */
export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">
            Profil Użytkownika
          </h3>
          <p className="text-sm text-gray-500">Szczegóły Twojego konta.</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="border-b pb-4">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                Nazwa użytkownika
              </p>
              <p className="text-lg text-gray-900">
                {user.displayName || "Nie ustawiono"}
              </p>
            </div>

            <div className="border-b pb-4">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                Email
              </p>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>

            <div className="border-b pb-4">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                Zweryfikowany
              </p>
              <p className="text-lg">
                {user.emailVerified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Tak
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Nie
                  </span>
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                UID
              </p>
              <p className="text-sm font-mono text-gray-600 bg-gray-100 p-2 rounded inline-block">
                {user.uid}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

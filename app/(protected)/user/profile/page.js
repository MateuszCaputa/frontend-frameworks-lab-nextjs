"use client";

import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";
import Image from "next/image";

/**
 * (Lab 7, Task 1) & (Lab 8, Task 3 & 5)
 * Protected Profile Page with Edit Form.
 * Allows updating displayName and photoURL. Utilizes 'key' for state reset on user load.
 */
export default function ProfilePage() {
  const { user } = useAuth();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  if (!user) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    updateProfile(user, {
      displayName: displayName,
      photoURL: photoURL,
    })
      .then(() => {
        setMessage({ type: "success", text: "Profil został zaktualizowany." });
        window.location.reload();
      })
      .catch((error) => {
        setMessage({ type: "error", text: `Błąd: ${error.message}` });
        setLoading(false);
      });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Profil Użytkownika
            </h3>
            <p className="text-sm text-gray-500">Edytuj swoje dane.</p>
          </div>

          {/* (Lab 8, Task 5) Conditional rendering of profile photo */}
          {photoURL && (
            <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-200">
              <Image
                src={photoURL}
                alt="Profile"
                fill
                sizes="48px"
                className="object-cover"
                unoptimized
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}
        </div>

        <div className="p-6">
          {message.text && (
            <div
              className={`px-4 py-3 mb-6 rounded-lg text-sm ${
                message.type === "error"
                  ? "bg-red-100 text-red-700 border border-red-400"
                  : "bg-green-100 text-green-700 border border-green-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6" key={user.uid}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="text"
                defaultValue={user.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Emaila nie można zmienić w tym formularzu.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Nazwa użytkownika
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Twoja nazwa"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                URL Zdjęcia (Avatar)
              </label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://example.com/my-photo.jpg"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

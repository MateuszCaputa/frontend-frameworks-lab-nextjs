"use client";

import { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/app/lib/AuthContext";
import Image from "next/image";

/**
 * (Lab 7, 8, 9)
 * Protected Profile Page.
 *  * Protected Profile Page with Edit Form.
 * Handles Auth profile updates (displayName, photoURL) and Firestore data (address).
 * Implements "Loading" state to block inputs while fetching data (Lab 9, Task 4).
 */
export default function ProfilePage() {
  const { user } = useAuth();

  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Auth Data
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  // Firestore Data (Address)
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  // (Lab 9, Task 4) Fetch address data
  useEffect(() => {
    if (!user?.uid) return;

    const fetchUserData = async () => {
      setIsFetching(true);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.address) {
            setStreet(data.address.street || "");
            setCity(data.address.city || "");
            setZipCode(data.address.zipCode || "");
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setMessage({ type: "error", text: "Nie udało się pobrać adresu." });
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // 1. Auth Profile Update
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });

      // 2. Firestore Document Update (Lab 9 Task 1)
      await setDoc(
        doc(db, "users", user.uid),
        {
          address: {
            street,
            city,
            zipCode,
          },
        },
        { merge: true }
      );

      setMessage({
        type: "success",
        text: "Profil i adres zostały zaktualizowane.",
      });
      window.location.reload();
    } catch (error) {
      setMessage({ type: "error", text: `Błąd: ${error.message}` });
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Profil Użytkownika
            </h3>
            <p className="text-sm text-gray-500">
              Edytuj dane osobowe i adres.
            </p>
          </div>

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
            {/* Sekcja: Dane Logowania */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-700 border-b pb-2">
                Dane Podstawowe
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Nazwa użytkownika
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={isSaving} // Blokada przy zapisie
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  URL Zdjęcia
                </label>
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  disabled={isSaving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Sekcja: Adres (Firestore) */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <h4 className="text-md font-semibold text-gray-700">
                  Adres Zamieszkania
                </h4>
                {isFetching && (
                  <span className="text-xs text-indigo-500 animate-pulse">
                    (Pobieranie danych...)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Ulica i numer
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    // (Lab 9 Task 4) Blokada pól przed pobraniem danych
                    disabled={isFetching || isSaving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder={
                      isFetching ? "Ładowanie..." : "ul. Sezamkowa 12/5"
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Kod pocztowy
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    disabled={isFetching || isSaving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder={isFetching ? "..." : "00-000"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Miasto
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={isFetching || isSaving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder={isFetching ? "..." : "Kraków"}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isSaving || isFetching}
                className={`px-6 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors shadow-sm ${
                  isSaving || isFetching ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

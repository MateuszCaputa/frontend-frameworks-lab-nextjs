"use client";
import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";

/**
 * (Lab 7, Task 1)
 * Protected page for changing password.
 * Uses Firebase updatePassword functionality with re-authentication check.
 */
export default function ChangePasswordPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const newPassword = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Hasła nie są identyczne." });
      setLoading(false);
      return;
    }

    try {
      if (user) {
        await updatePassword(user, newPassword);
        setMessage({
          type: "success",
          text: "Hasło zostało zmienione pomyślnie.",
        });
        e.target.reset();
      }
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        setMessage({
          type: "error",
          text: "Dla bezpieczeństwa musisz się wylogować i zalogować ponownie.",
        });
      } else {
        setMessage({ type: "error", text: `Błąd: ${error.message}` });
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        Zmień hasło
      </h2>

      {message.text && (
        <div
          className={`px-4 py-3 mb-4 rounded-lg text-sm ${
            message.type === "error"
              ? "bg-red-100 text-red-700 border border-red-400"
              : "bg-green-100 text-green-700 border border-green-400"
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="text-gray-700">
          <label className="block mb-1 font-bold text-xs uppercase">
            Nowe Hasło
          </label>
          <input
            name="password"
            type="password"
            required
            className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
          />
        </div>
        <div className="text-gray-700">
          <label className="block mb-1 font-bold text-xs uppercase">
            Powtórz Nowe Hasło
          </label>
          <input
            name="confirmPassword"
            type="password"
            required
            className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-10 px-5 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800 font-bold uppercase text-sm ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Zmienianie..." : "Zmień hasło"}
        </button>
      </form>
    </div>
  );
}

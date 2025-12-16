"use client";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * (Lab 7, Task 3) & (Lab 8, Task 2)
 * Registration Page.
 * Handles user creation, profile update, email verification sending, and error handling.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setError("Podane hasła nie są identyczne.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      // (Lab 8, Task 2) Send verification email
      await sendEmailVerification(user);

      router.push(`/user/verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Registration error:", error.code);

      switch (error.code) {
        case "auth/email-already-in-use":
          setError(
            "Ten adres email jest już zarejestrowany. Spróbuj się zalogować."
          );
          break;
        case "auth/weak-password":
          setError("Hasło jest za słabe (min. 6 znaków).");
          break;
        case "auth/invalid-email":
          setError("Nieprawidłowy format adresu email.");
          break;
        default:
          setError(`Błąd rejestracji: ${error.message}`);
      }
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 h-full flex justify-center items-center mt-10 mb-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 relative flex flex-col min-w-0 break-words mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="text-center text-gray-500 mb-2">
              <small>Załóż nowe konto</small>
            </div>
          </div>

          <div className="flex-auto px-6 py-8 pt-4">
            {error && (
              <div
                className="relative px-4 py-3 mb-4 leading-normal text-red-700 bg-red-100 rounded-lg"
                role="alert"
              >
                <p className="font-bold">Błąd rejestracji</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={onSubmit}>
              <div className="mb-4 text-gray-700">
                <label
                  className="block mb-1 font-bold text-xs uppercase"
                  htmlFor="name"
                >
                  Imię / Nazwa
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full h-10 px-3 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                  placeholder="Jan Kowalski"
                />
              </div>

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
                  placeholder="Hasło (min. 6 znaków)"
                />
              </div>

              <div className="mb-4 text-gray-700">
                <label
                  className="block mb-1 font-bold text-xs uppercase"
                  htmlFor="confirmPassword"
                >
                  Powtórz Hasło
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full h-10 px-3 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                  placeholder="Powtórz hasło"
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
                  {loading ? "Rejestracja..." : "Zarejestruj się"}
                </button>
              </div>
            </form>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 text-center">
            <Link
              href="/user/signin"
              className="text-gray-500 hover:text-indigo-600 text-sm font-bold transition-colors"
            >
              <small>Masz już konto? Zaloguj się</small>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

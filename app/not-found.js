import Link from "next/link";

/**
 * (Lab 7, Task 4)
 * Global 404 Page.
 * Displays a user-friendly error message for undefined routes.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">
        404 - Nie znaleziono
      </h2>
      <p className="text-gray-600 mb-8">
        Przepraszamy, nie mogliśmy znaleźć tej strony.
      </p>
      <Link
        href="/"
        className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
      >
        Wróć do strony głównej
      </Link>
    </div>
  );
}

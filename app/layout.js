import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/lib/AuthContext";
import MainLayoutClient from "@/app/components/MainLayoutClient"; // Używamy nowego klienta

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
  description: "Projekt zaliczeniowy na Lab 6-11",
};

/**
 * Root Layout Component.
 * Defines the global application structure including fonts, AuthProvider,
 * Sidebar, and Topbar components.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="pl" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-800`}
      >
        <AuthProvider>
          <MainLayoutClient>{children}</MainLayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}

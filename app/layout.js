import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/lib/AuthContext";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";

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
 * (Lab 7, Task 2 & 5)
 * Root Layout component.
 * Integrates Sidebar and Topbar components within AuthProvider.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="pl" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-800`}
      >
        <AuthProvider>
          <div className="flex min-h-screen flex-row">
            <Sidebar />

            <div className="flex-1 flex flex-col relative">
              <Topbar />

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

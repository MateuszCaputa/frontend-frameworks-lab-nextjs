"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";

/**
 * Client-side layout wrapper.
 * Manages the state of the mobile sidebar (open/close) and responsiveness.
 * Closes sidebar automatically on route change.
 */
export default function MainLayoutClient({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Close sidebar when route changes (mobile UX)
  useEffect(() => {
    // Sprawdzamy, czy ścieżka jest inna niż przy ostatnim renderze.
    if (prevPathname.current !== pathname) {
      // eslint-disable-next-line
      setIsSidebarOpen(false);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Mobile Overlay (Dark background when menu is open) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-100 bg-opacity-50 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar with mobile transition state */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Topbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

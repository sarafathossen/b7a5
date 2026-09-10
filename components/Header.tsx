"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // ব্যাকএন্ডের লগআউট এপিআই কল (যদি কুকি ক্লিয়ার করার কোড ব্যাকএন্ডে থাকে)
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      // Ignore error
    }

    // ব্যাকএন্ড কুকি ক্লিয়ার না করলেও যাতে ফ্রন্টএন্ড থেকে রাউটার রিফ্রেশ ও হোমপেজে পার্মানেন্ট রিডাইরেক্ট হয়
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600">
          GearUp <span className="text-slate-800">Rental</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <Link href="/#gears" className="hover:text-indigo-600 transition-colors">
            Explore Gears
          </Link>
          {isLoggedIn && (
            <Link href="/provider-dashboard" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors shadow-sm cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
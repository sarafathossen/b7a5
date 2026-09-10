"use client";

import Link from "next/link";
// যদি আপনার প্রোজেক্টে LogoutButton কম্পোনেন্ট অন্য ফোল্ডারে থাকে তবে পাথ ঠিক করে নেবেন
// import LogoutButton from "@/components/LogoutButton";

export default function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
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
            /* <LogoutButton /> */
            <span className="text-sm font-medium text-slate-600">Logged In</span>
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
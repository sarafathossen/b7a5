"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    // অন্য কোনো লিঙ্ক বা ফর্মে ইভেন্ট যাওয়া বন্ধ করবে
    e.preventDefault();
    e.stopPropagation();

    // ১. কুকি থেকে টোকেন সম্পূর্ণ রিমুভ করা
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "token=; path=/; max-age=0;";

    // ২. স্টেট রিফ্রেশ করা এবং হোম/লগইন পেজে পাঠোনো
    router.refresh();
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      type="button"
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm cursor-pointer z-50"
    >
      Logout
    </button>
  );
}
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("user_role")?.value?.toUpperCase();
  const { pathname } = request.nextUrl;

  // ড্যাশবোর্ড রুটের নিরাপত্তা
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // কাস্টমারদের জন্য এক্সেস কন্ট্রোল
    if (userRole === "CUSTOMER") {
      if (
        pathname.startsWith("/dashboard/provider") ||
        pathname.startsWith("/dashboard/admin")
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // প্রোভাইডারদের জন্য এক্সেস কন্ট্রোল
    if (userRole === "PROVIDER") {
      if (pathname.startsWith("/dashboard/admin")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // লগইন ও রেজিস্টার পেজ প্রোটেকশন (লগইন থাকলে ড্যাশবোর্ডে পাঠাবে)
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
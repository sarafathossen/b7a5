"use server";

import { cookies } from "next/headers";

// ১. পাবলিক গিয়ার লিস্ট ও ফিল্টার (GET /api/gear)
export async function getAllGears(searchParams?: {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
}) {
  try {
    const params = new URLSearchParams();
    if (searchParams?.category) params.append("category", searchParams.category);
    if (searchParams?.minPrice) params.append("minPrice", searchParams.minPrice);
    if (searchParams?.maxPrice) params.append("maxPrice", searchParams.maxPrice);
    if (searchParams?.search) params.append("search", searchParams.search);

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/gear?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch gear data");
    const result = await res.json();
    return result?.data || [];
  } catch (error) {
    console.error("Error fetching gear list:", error);
    return [];
  }
}

// ২. সিঙ্গেল গিয়ার ডিটেইলস (GET /api/gear/:id)
export async function getSingleGear(id: string) {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/gear/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch gear details");
    const result = await res.json();
    return result?.data || null;
  } catch (error) {
    console.error("Error fetching single gear:", error);
    return null;
  }
}

// ৩. কাস্টমার রেন্টাল অর্ডার তৈরি (POST /api/rentals)
export async function createRentalOrder(payload: {
  gearId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Please login to rent gear." };
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (res.ok && result?.success) {
      return { success: true, message: "Rental order created successfully!", data: result?.data };
    }

    return { success: false, message: result?.message || "Failed to create order" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

// ৪. কাস্টমার রিভিউ দেওয়া (POST /api/reviews)
export async function createReview(payload: {
  gearId: string;
  rating: number;
  comment: string;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Authentication required." };
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (res.ok && result?.success) {
      return { success: true, message: result?.message || "Review submitted successfully" };
    }

    return { success: false, message: result?.message || "Failed to submit review" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BASE_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

// ৪.১ Create New Rental Order (POST /api/rentals)
export async function createRentalOrderAction(orderData: {
  gearId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}) {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_URL}/api/rentals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    if (res.ok) {
      revalidatePath("/dashboard/my-gear");
      return { success: true, message: data.message || "Order created successfully", data: data.data };
    }
    return { success: false, message: data.message || "Failed to create order" };
  } catch (error) {
    return { success: false, message: "Server connection error" };
  }
}

// ৪.২ Get User's Rental Orders (GET /api/rentals)
export async function getUserRentalOrdersAction() {
  try {
    const token = await getToken();
    if (!token) return { success: false, data: [] };

    const res = await fetch(`${BASE_URL}/api/rentals`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json();
    return { success: res.ok, data: data.data || data || [] };
  } catch (error) {
    return { success: false, data: [] };
  }
}

// ৪.৩ Get Rental Order Details (GET /api/rentals/:id)
export async function getRentalOrderDetailsAction(orderId: string) {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_URL}/api/rentals/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json();
    if (res.ok) {
      return { success: true, data: data.data || data };
    }
    return { success: false, message: data.message || "Failed to fetch order details" };
  } catch (error) {
    return { success: false, message: "Server error" };
  }
}
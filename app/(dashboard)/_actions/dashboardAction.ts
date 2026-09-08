"use server";

import { cookies } from "next/headers";

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

// ================= CUSTOMER API ACTIONS =================

// কাস্টমারের নিজের রেন্টাল অর্ডার লিস্ট (GET /api/rentals)
export async function getCustomerRentals() {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const result = await res.json();
    return result?.data || [];
  } catch {
    return [];
  }
}

// কাস্টমার পেমেন্ট শুরু করা (POST /api/payments/create)
export async function createPaymentSession(rentalOrderId: string, paymentMethod: string = "SSLCommerz") {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rentalOrderId, paymentMethod }),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ================= PROVIDER API ACTIONS =================

// প্রোভাইডারের নতুন গিয়ার যোগ করা (POST /api/provider/gear)
export async function addProviderGear(data: any) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/gear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// প্রোভাইডারের কাছে আসা অর্ডার লিস্ট (GET /api/provider/orders)
export async function getProviderOrders() {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const result = await res.json();
    return result?.data || [];
  } catch {
    return [];
  }
}

// প্রোভাইডার অর্ডার স্ট্যাটাস পরিবর্তন (PATCH /api/provider/orders/:id)
// Flow: PLACED -> CONFIRMED -> PICKED_UP -> RETURNED
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ================= ADMIN API ACTIONS =================

// এডমিনের ক্যাটাগরি তৈরি করা (POST /api/categories)
export async function createCategory(data: { name: string; description: string }) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// এডমিনের সকল ইউজার দেখা (GET /api/admin/users)
export async function getAllUsers() {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const result = await res.json();
    return result?.data || [];
  } catch {
    return [];
  }
}

// ইউজার ব্লক/আনব্লক করা (PATCH /api/admin/users/:id)
export async function toggleUserStatus(userId: string, isActive: boolean) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive }),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
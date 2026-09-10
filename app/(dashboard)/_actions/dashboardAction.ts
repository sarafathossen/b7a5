"use server";

import { cookies } from "next/headers";

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};


export async function getCustomerRentals() {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/rentals`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const result = await res.json();
    return result?.data || [];
  } catch {
    return [];
  }
}


export async function createPaymentSession(rentalOrderId: string, paymentMethod: string = "SSLCommerz") {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/create`, {
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


export async function addProviderGear(data: any) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/provider/gear`, {
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


export async function getProviderOrders() {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/provider/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const result = await res.json();
    return result?.data || [];
  } catch {
    return [];
  }
}


export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/provider/orders/${orderId}`, {
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


export async function createCategory(data: { name: string; description: string }) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/categories`, {
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


export async function getAllUsers() {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const result = await res.json();
    return result?.data || [];
  } catch {
    return [];
  }
}


export async function toggleUserStatus(userId: string, isActive: boolean) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/users/${userId}`, {
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
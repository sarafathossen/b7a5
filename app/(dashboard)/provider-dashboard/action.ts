"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

// ৩.১ Add Gear to Inventory (POST /api/gear/)
export async function addGearAction(formData: any) {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_URL}/api/gear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      revalidatePath("/provider-dashboard/gear");
      return { success: true, message: data.message || "Gear added successfully", data: data.data };
    }
    return { success: false, message: data.message || "Failed to add gear" };
  } catch (error) {
    return { success: false, message: "Server connection failed" };
  }
}

// Fetch Provider Gears (GET /api/gear)
export async function getProviderGearsAction() {
  try {
    const token = await getToken();
    if (!token) return { success: false, data: [] };

    const res = await fetch(`${BASE_URL}/api/gear`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json();
    return { success: res.ok, data: data.data || data || [] };
  } catch (error) {
    return { success: false, data: [] };
  }
}

// ৩.২ Update Gear Listing (PUT /api/gear/:id)
export async function updateGearAction(gearId: string, updatedData: any) {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_URL}/api/gear/${gearId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();
    if (res.ok) {
      revalidatePath("/provider-dashboard/gear");
      return { success: true, message: data.message || "Gear updated successfully", data: data.data };
    }
    return { success: false, message: data.message || "Failed to update gear" };
  } catch (error) {
    return { success: false, message: "Server error" };
  }
}

// ৩.৩ Remove Gear from Inventory (DELETE /api/gear/:id)
export async function deleteGearAction(gearId: string) {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_URL}/api/gear/${gearId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) {
      revalidatePath("/provider-dashboard/gear");
      return { success: true, message: data.message || "Gear removed successfully" };
    }
    return { success: false, message: data.message || "Failed to remove gear" };
  } catch (error) {
    return { success: false, message: "Server error" };
  }
}

// ৩.৪ Get Provider's Incoming Orders (GET /api/provider/orders)
export async function getProviderOrdersAction() {
  try {
    const token = await getToken();
    if (!token) return { success: false, data: [] };

    const res = await fetch(`${BASE_URL}/api/provider/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json();
    return { success: res.ok, data: data.data || data || [] };
  } catch (error) {
    return { success: false, data: [] };
  }
}

// ৩.৫ Update Rental Order Status (PATCH /api/provider/orders/:id)
export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_URL}/api/provider/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (res.ok) {
      revalidatePath("/provider-dashboard/orders");
      return { success: true, message: data.message || "Order status updated", data: data.data };
    }
    return { success: false, message: data.message || "Failed to update order status" };
  } catch (error) {
    return { success: false, message: "Server error" };
  }
}
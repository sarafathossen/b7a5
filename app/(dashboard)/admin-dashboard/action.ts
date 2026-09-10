"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

// ৭.১ Get All Users (GET /api/admin/users)
export async function getAllUsersAction() {
  try {
    const token = await getToken();
    if (!token) return { success: false, data: [] };

    const res = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json();
    return { success: res.ok, data: data.data || data || [] };
  } catch (error) {
    return { success: false, data: [] };
  }
}

// ৭.২ Update User Status (Suspend/Activate) (PATCH /api/admin/users/:id)
export async function updateUserStatusAction(userId: string, isBlocked: boolean) {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: isBlocked ? "SUSPENDED" : "ACTIVE",
        isBlocked: isBlocked,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      revalidatePath("/admin-dashboard/users");
      return { success: true, message: data.message || "User status updated" };
    }
    return { success: false, message: data.message || "Failed to update user status" };
  } catch (error) {
    return { success: false, message: "Server error" };
  }
}

// ৭.৫ Update User Role (ADMIN, CUSTOMER, PROVIDER) (PATCH /api/admin/users/:id)
export async function updateUserRoleAction(userId: string, newRole: string) {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        role: newRole,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      revalidatePath("/admin-dashboard/users");
      return { success: true, message: data.message || "User role updated successfully" };
    }
    return { success: false, message: data.message || "Failed to update user role" };
  } catch (error) {
    return { success: false, message: "Server error" };
  }
}

// ৭.৩ Get All Gear Listings (GET /api/admin/gear)
export async function getAllAdminGearsAction() {
  try {
    const token = await getToken();
    if (!token) return { success: false, data: [] };

    const res = await fetch(`${BASE_URL}/api/admin/gear`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json();
    return { success: res.ok, data: data.data || data || [] };
  } catch (error) {
    return { success: false, data: [] };
  }
}

// ৭.৪ Get All Rental Orders (GET /api/admin/rentals)
export async function getAllAdminRentalsAction() {
  try {
    const token = await getToken();
    if (!token) return { success: false, data: [] };

    const res = await fetch(`${BASE_URL}/api/admin/rentals`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json();
    return { success: res.ok, data: data.data || data || [] };
  } catch (error) {
    return { success: false, data: [] };
  }
}
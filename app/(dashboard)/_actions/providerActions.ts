"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

// ১. প্রোভাইডারের সব গিয়ার/ইনভেন্টরি পাওয়ার এপিআই
export async function getProviderGears() {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/gears`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const result = await res.json();
    return result?.data || [];
  } catch (error) {
    console.error("Error fetching gears:", error);
    return [];
  }
}

// ২. নতুন গিয়ার যুক্ত করার এপিআই
export async function createProviderGear(formData: FormData) {
  try {
    const token = await getAuthToken();
    const gearData = {
      name: formData.get("name"),
      category: formData.get("category"),
      pricePerDay: Number(formData.get("pricePerDay")),
      description: formData.get("description"),
      imageUrl: formData.get("imageUrl"),
    };

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/gears`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(gearData),
    });

    const result = await res.json();
    revalidatePath("/provider-dashboard/gear");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ৩. প্রোভাইডারের ইনকামিং রেন্টাল অর্ডার পাওয়ার এপিআই
export async function getProviderOrders() {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const result = await res.json();
    return result?.data || [];
  } catch (error) {
    console.error("Error fetching provider orders:", error);
    return [];
  }
}

// ৪. অর্ডারের স্ট্যাটাস আপডেট করার এপিআই (CONFIRMED / PICKED_UP / RETURNED)
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

    const result = await res.json();
    revalidatePath("/provider-dashboard/orders");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
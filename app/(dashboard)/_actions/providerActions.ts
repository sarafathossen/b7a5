"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BASE_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

// ১. নতুন Gear যোগ করার অ্যাকশন
export async function createProviderGear(formData: FormData) {
  try {
    const token = await getAuthToken();

    // এপিআই ডকুমেন্টেশন অনুযায়ী হুবহু JSON পে-লোড
    const gearData = {
      name: formData.get("name")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      pricePerDay: Number(formData.get("pricePerDay")),
      category: formData.get("category")?.toString() || "",
      brand: formData.get("brand")?.toString() || "",
      stock: Number(formData.get("stock")),
    };

    const res = await fetch(`${BASE_URL}/api/provider/gear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(gearData),
    });

    const result = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || result?.error || `Error ${res.status}: Request failed`,
      };
    }

    revalidatePath("/provider-dashboard/gear");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to submit gear" };
  }
}

// ২. সকল Gear ফেচ করার অ্যাকশন (বিল্ড এরর সমাধানের জন্য যোগ করা হয়েছে)
export async function getProviderGears() {
  try {
    const token = await getAuthToken();

    const res = await fetch(`${BASE_URL}/api/provider/gear`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const result = await res.json();
    return result?.data || result || [];
  } catch (error) {
    console.error("Error fetching gears:", error);
    return [];
  }
}
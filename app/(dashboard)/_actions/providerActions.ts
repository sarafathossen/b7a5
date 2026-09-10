"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};


export async function createProviderGear(formData: FormData) {
  try {
    const token = await getAuthToken();

    // এখানে 'category'-র পরিবর্তে 'categoryId' করা হয়েছে, যা আপনার ব্যাকএন্ডের সাথে হুবহু মিলবে
    const gearData = {
      name: formData.get("name")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      pricePerDay: Number(formData.get("pricePerDay")),
      categoryId: formData.get("categoryId")?.toString() || formData.get("category")?.toString() || "",
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
"use server";

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
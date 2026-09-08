"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function GearFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    router.push(`/gear?${params.toString()}`);
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4 mb-6">
      <h3 className="font-semibold text-lg">Filter & Search Gear</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-background"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-background"
        >
          <option value="">All Categories</option>
          <option value="camping">Camping</option>
          <option value="cycling">Cycling</option>
          <option value="hiking">Hiking</option>
          <option value="water-sports">Water Sports</option>
        </select>

        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
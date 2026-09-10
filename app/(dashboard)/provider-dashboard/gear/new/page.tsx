"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addGearAction } from "../../action";

export default function AddGearPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]); // ক্যাটাগরি লিস্ট ফেচ করার জন্য স্টেট
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerDay: "",
    categoryId: "",
    brand: "",
    stock: "",
  });

  // ব্যাকএন্ড বা এপিআই থেকে ক্যাটাগরি ফেচ করার অপশনাল ইফেক্ট (যদি ক্যাটাগরি লিস্ট এপিআই থাকে)
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:5000/api/categories"); // আপনার ব্যাকএন্ডের ক্যাটাগরি এপিআই রুট
        const data = await res.json();
        if (data && Array.isArray(data)) {
          setCategories(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      } catch (error) {
        // ফেইল করলে ম্যানুয়াল বা আগের মতো কাজ করবে
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      alert("Please select a valid category!");
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      pricePerDay: Number(formData.pricePerDay),
      categoryId: formData.categoryId,
      brand: formData.brand,
      stock: Number(formData.stock),
    };

    const res = await addGearAction(payload);
    setLoading(false);

    if (res.success) {
      alert("Gear added successfully");
      router.push("/provider-dashboard/gear");
    } else {
      alert(res.message || "Failed to add gear. Please check category ID.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Gear to Inventory</h1>
        <p className="text-sm text-muted-foreground">Post a new gear for rental.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border rounded-xl p-6 bg-card">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            required
            placeholder="Hiking Backpack 60L"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full mt-1 p-2 border rounded-lg bg-background"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            required
            placeholder="Ergonomic mountain hiking backpack"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full mt-1 p-2 border rounded-lg bg-background h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Brand</label>
            <input
              type="text"
              required
              placeholder="Deuter"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full mt-1 p-2 border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            {categories.length > 0 ? (
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full mt-1 p-2 border rounded-lg bg-background text-sm"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat._id} value={cat.id || cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                placeholder="db029424-c988-40dd-8887-c25e4e0fbfc6"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full mt-1 p-2 border rounded-lg bg-background text-sm"
              />
            )}
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              সঠিক Category UUID অথবা ড্রপডাউন থেকে সিলেক্ট করুন।
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Price Per Day</label>
            <input
              type="number"
              required
              placeholder="300"
              value={formData.pricePerDay}
              onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
              className="w-full mt-1 p-2 border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Stock</label>
            <input
              type="number"
              required
              placeholder="10"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full mt-1 p-2 border rounded-lg bg-background"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          {loading ? "Adding Gear..." : "Add Gear"}
        </button>
      </form>
    </div>
  );
}
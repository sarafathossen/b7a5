"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getProviderGearsAction, updateGearAction, deleteGearAction } from "../action";

export default function ProviderInventoryPage() {
  const [gears, setGears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGear, setEditingGear] = useState<any | null>(null);

  const fetchGears = async () => {
    setLoading(true);
    const res = await getProviderGearsAction();
    if (res.success) {
      // ডেটাবেজ থেকে আসা ডেটা শুধুমাত্র নিজস্ব প্রোভাইডারের কি না তা নিশ্চিত করতে সরাসরি সেট করা হচ্ছে
      setGears(res.data || []);
    } else {
      toast.error(res.message || "Failed to load inventory.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGears();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this gear?")) {
      const res = await deleteGearAction(id);
      if (res.success) {
        toast.success("Gear removed from inventory successfully!");
        fetchGears();
      } else {
        toast.error(res.message || "Failed to delete gear.");
      }
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGear) return;

    // Prisma এর ক্ষেত্রে id-কে আগে প্রাধান্য দেওয়া হয়েছে
    const gearId = editingGear.id || editingGear._id;
    const res = await updateGearAction(gearId, {
      pricePerDay: Number(editingGear.pricePerDay),
      stock: Number(editingGear.stock),
    });

    if (res.success) {
      toast.success("Gear updated successfully!");
      setEditingGear(null);
      fetchGears();
    } else {
      toast.error(res.message || "Failed to update gear.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Gear Inventory</h1>
          <p className="text-sm text-muted-foreground">Manage your gear listings, update stock/price, or remove items.</p>
        </div>
        <Link
          href="/provider-dashboard/gear/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add New Gear
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading gears...</div>
      ) : gears.length === 0 ? (
        <div className="p-12 text-center border rounded-xl bg-card">
          <p className="text-muted-foreground">No gear found in inventory.</p>
        </div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/50 border-b text-muted-foreground">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Price / Day</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {gears.map((item) => {
                // গিয়ার আইটেমের আইডি ফিল্টার করা (Prisma - id)
                const targetId = item.id || item._id;

                return (
                  <tr key={targetId} className="hover:bg-accent/20">
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4">{item.brand}</td>
                    <td className="p-4 font-semibold">${item.pricePerDay}</td>
                    <td className="p-4">{item.stock}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingGear(item)}
                          className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(targetId)}
                          className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal for PUT request */}
      {editingGear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card p-6 rounded-xl w-full max-w-md border shadow-lg space-y-4">
            <h2 className="text-lg font-bold">Update Gear Listing</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold">Price Per Day</label>
                <input
                  type="number"
                  value={editingGear.pricePerDay}
                  onChange={(e) => setEditingGear({ ...editingGear, pricePerDay: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-background mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold">Stock</label>
                <input
                  type="number"
                  value={editingGear.stock}
                  onChange={(e) => setEditingGear({ ...editingGear, stock: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-background mt-1"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingGear(null)}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
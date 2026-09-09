"use client";

import { useEffect, useState } from "react";
import { getAllAdminGearsAction } from "../action";

export default function AdminGearPage() {
  const [gears, setGears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await getAllAdminGearsAction();
      if (res.success) {
        setGears(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Gear Listings</h1>
        <p className="text-sm text-muted-foreground">Monitor all listed gears across all providers.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading gear listings...</div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/50 border-b text-muted-foreground">
              <tr>
                <th className="p-4">Gear ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Price/Day</th>
                <th className="p-4">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {gears.map((g) => (
                <tr key={g._id || g.id}>
                  <td className="p-4 font-mono text-xs">{g._id || g.id}</td>
                  <td className="p-4 font-semibold">{g.name}</td>
                  <td className="p-4">{g.brand}</td>
                  <td className="p-4 font-semibold">${g.pricePerDay}</td>
                  <td className="p-4">{g.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
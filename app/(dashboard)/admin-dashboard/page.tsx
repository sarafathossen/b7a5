"use client";

import { useEffect, useState } from "react";
import { Users, Package, ShoppingCart } from "lucide-react";
import { getAllUsersAction, getAllAdminGearsAction, getAllAdminRentalsAction } from "./action";

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({ users: 0, gears: 0, rentals: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [uRes, gRes, rRes] = await Promise.all([
        getAllUsersAction(),
        getAllAdminGearsAction(),
        getAllAdminRentalsAction(),
      ]);

      setStats({
        users: uRes.data?.length || 0,
        gears: gRes.data?.length || 0,
        rentals: rRes.data?.length || 0,
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">Manage users, listings, and platform-wide rental orders.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border rounded-xl bg-card flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <h3 className="text-2xl font-bold">{loading ? "..." : stats.users}</h3>
          </div>
        </div>

        <div className="p-5 border rounded-xl bg-card flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">All Gear Listings</p>
            <h3 className="text-2xl font-bold">{loading ? "..." : stats.gears}</h3>
          </div>
        </div>

        <div className="p-5 border rounded-xl bg-card flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Rental Orders</p>
            <h3 className="text-2xl font-bold">{loading ? "..." : stats.rentals}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
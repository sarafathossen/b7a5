"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Clock, CheckCircle, Package } from "lucide-react";
import { getUserRentalOrdersAction } from "./action";

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await getUserRentalOrdersAction();
      if (res.success) {
        setOrders(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const totalRentals = orders.length;
  const activeRentals = orders.filter((o) => o.status === "PLACED" || o.status === "CONFIRMED" || o.status === "PICKED_UP").length;
  const completedRentals = orders.filter((o) => o.status === "RETURNED").length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your rentals and active bookings.</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border rounded-xl bg-card flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <h3 className="text-2xl font-bold">{loading ? "..." : totalRentals}</h3>
          </div>
        </div>

        <div className="p-5 border rounded-xl bg-card flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Rentals</p>
            <h3 className="text-2xl font-bold">{loading ? "..." : activeRentals}</h3>
          </div>
        </div>

        <div className="p-5 border rounded-xl bg-card flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Returned Gear</p>
            <h3 className="text-2xl font-bold">{loading ? "..." : completedRentals}</h3>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="border rounded-xl bg-card p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Recent Rental Orders</h2>
          <Link href="/dashboard/my-gear" className="text-sm text-primary hover:underline font-medium">
            View All
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground py-4">Loading active orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No rental orders placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-accent/50 border-b text-muted-foreground">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Total Price</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id || order.id}>
                    <td className="p-3 font-mono text-xs">{order._id || order.id}</td>
                    <td className="p-3 font-semibold">${order.totalPrice}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
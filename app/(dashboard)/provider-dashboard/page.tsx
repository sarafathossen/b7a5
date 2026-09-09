"use client";

import { useEffect, useState } from "react";
import { getProviderOrders, updateOrderStatus } from "../_actions/dashboardAction";


export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    const data = await getProviderOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    const res = await updateOrderStatus(id, status);
    if (res?.success || res?._id) {
      loadOrders();
    } else {
      alert(res?.message || "Failed to update order status");
    }
  };

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Incoming Rental Orders</h1>

      <div className="border rounded-xl overflow-hidden bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted border-b">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action / Update Flow</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">
                  No orders placed yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id || o.id}>
                  <td className="p-4 font-mono text-xs">{o._id || o.id}</td>
                  <td className="p-4 font-bold">${o.totalPrice}</td>
                  <td className="p-4 font-medium uppercase text-xs">{o.status}</td>
                  <td className="p-4 text-right space-x-2">
                    {o.status === "PLACED" && (
                      <button
                        onClick={() => handleStatusChange(o._id || o.id, "CONFIRMED")}
                        className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-medium"
                      >
                        Confirm
                      </button>
                    )}
                    {o.status === "PAID" && (
                      <button
                        onClick={() => handleStatusChange(o._id || o.id, "PICKED_UP")}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                      >
                        Mark Picked Up
                      </button>
                    )}
                    {o.status === "PICKED_UP" && (
                      <button
                        onClick={() => handleStatusChange(o._id || o.id, "RETURNED")}
                        className="px-3 py-1 bg-gray-700 text-white rounded text-xs font-medium"
                      >
                        Mark Returned
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { getProviderOrders, updateOrderStatus } from "../../_actions/dashboardAction";

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = async () => {
    const data = await getProviderOrders();
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    const res = await updateOrderStatus(id, status);
    if (res.success) {
      loadOrders();
    } else {
      alert(res.message || "Failed to update order status");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Rental Requests</h1>

      <div className="border rounded-xl overflow-hidden bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted border-b">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Update Flow</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((o) => (
              <tr key={o._id || o.id}>
                <td className="p-3 font-mono">{o._id || o.id}</td>
                <td className="p-3 font-bold">${o.totalPrice}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3 text-right space-x-2">
                  {o.status === "PLACED" && (
                    <button
                      onClick={() => handleStatusChange(o._id || o.id, "CONFIRMED")}
                      className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                    >
                      Confirm
                    </button>
                  )}
                  {o.status === "PAID" && (
                    <button
                      onClick={() => handleStatusChange(o._id || o.id, "PICKED_UP")}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-xs"
                    >
                      Mark Picked Up
                    </button>
                  )}
                  {o.status === "PICKED_UP" && (
                    <button
                      onClick={() => handleStatusChange(o._id || o.id, "RETURNED")}
                      className="px-3 py-1 bg-gray-700 text-white rounded text-xs"
                    >
                      Mark Returned
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
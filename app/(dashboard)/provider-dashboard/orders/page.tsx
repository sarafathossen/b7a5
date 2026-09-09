"use client";

import { useEffect, useState } from "react";
import { getProviderOrdersAction, updateOrderStatusAction } from "../action";

export default function IncomingOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getProviderOrdersAction();
    if (res.success) {
      setOrders(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    const res = await updateOrderStatusAction(orderId, status);
    if (res.success) {
      alert("Order status updated");
      fetchOrders();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Incoming Rental Orders</h1>
        <p className="text-sm text-muted-foreground">Manage incoming rental order requests for your gear.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center border rounded-xl bg-card">
          <p className="text-muted-foreground">No incoming orders found.</p>
        </div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/50 border-b text-muted-foreground">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Gear ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order._id || order.id} className="hover:bg-accent/20">
                  <td className="p-4 font-mono text-xs">{order._id || order.id}</td>
                  <td className="p-4 font-mono text-xs">{order.gearId || order.gear?._id}</td>
                  <td className="p-4 font-medium">{order.customer?.name || order.customer}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id || order.id, e.target.value)}
                      className="p-1.5 border rounded-lg text-xs bg-background cursor-pointer"
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PICKED_UP">PICKED_UP</option>
                      <option value="RETURNED">RETURNED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
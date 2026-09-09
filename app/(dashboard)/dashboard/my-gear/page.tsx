"use client";

import { useEffect, useState } from "react";
import { getUserRentalOrdersAction, getRentalOrderDetailsAction } from "../action";
import { Eye, Package } from "lucide-react";

export default function MyGearRentalsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getUserRentalOrdersAction();
    if (res.success) {
      setOrders(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = async (orderId: string) => {
    setDetailLoading(true);
    const res = await getRentalOrderDetailsAction(orderId);
    if (res.success) {
      setSelectedOrder(res.data);
    } else {
      alert(res.message);
    }
    setDetailLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Rental Orders</h1>
        <p className="text-sm text-muted-foreground">View all your gear rental histories and current statuses.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading rental orders...</div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center border rounded-xl bg-card space-y-3">
          <Package className="w-10 h-10 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">You haven't rented any gear yet.</p>
        </div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/50 border-b text-muted-foreground">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Gear ID</th>
                <th className="p-4">Total Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => {
                const id = order._id || order.id;
                return (
                  <tr key={id} className="hover:bg-accent/20">
                    <td className="p-4 font-mono text-xs">{id}</td>
                    <td className="p-4 font-mono text-xs">{order.gearId || order.gear?._id || "N/A"}</td>
                    <td className="p-4 font-semibold">${order.totalPrice}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleViewDetails(id)}
                        className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal (For GET /api/rentals/:id) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card p-6 rounded-xl w-full max-w-md border shadow-lg space-y-4">
            <h2 className="text-lg font-bold">Rental Order Details</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Order ID:</span> {selectedOrder._id || selectedOrder.id}</p>
              <p><span className="font-semibold">Gear ID:</span> {selectedOrder.gearId || selectedOrder.gear?._id || "N/A"}</p>
              <p><span className="font-semibold">Start Date:</span> {selectedOrder.startDate || "N/A"}</p>
              <p><span className="font-semibold">End Date:</span> {selectedOrder.endDate || "N/A"}</p>
              <p><span className="font-semibold">Total Price:</span> ${selectedOrder.totalPrice}</p>
              <p><span className="font-semibold">Status:</span> <span className="px-2 py-0.5 rounded bg-accent font-semibold">{selectedOrder.status}</span></p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
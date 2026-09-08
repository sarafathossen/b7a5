"use client";

import { useEffect, useState } from "react";
import { getCustomerRentals, createPaymentSession } from "../../_actions/dashboardAction";

export default function CustomerMyGearPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const data = await getCustomerRentals();
    setRentals(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePayment = async (orderId: string) => {
    const res = await createPaymentSession(orderId, "SSLCommerz");
    if (res?.paymentUrl) {
      window.location.href = res.paymentUrl;
    } else {
      alert(res?.message || "Payment initiation failed");
    }
  };

  if (loading) return <div className="p-6">Loading rental orders...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Rental Orders</h1>

      <div className="border rounded-xl overflow-hidden bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted border-b">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Gear Name</th>
              <th className="p-3">Total Cost</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rentals.map((order) => (
              <tr key={order._id || order.id}>
                <td className="p-3 font-mono">{order._id || order.id}</td>
                <td className="p-3 font-medium">{order.gearId?.name || "Equipment"}</td>
                <td className="p-3 font-bold">${order.totalPrice}</td>
                <td className="p-3 font-semibold">{order.status}</td>
                <td className="p-3 text-right">
                  {order.status === "CONFIRMED" && (
                    <button
                      onClick={() => handlePayment(order._id || order.id)}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs"
                    >
                      Pay Now
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
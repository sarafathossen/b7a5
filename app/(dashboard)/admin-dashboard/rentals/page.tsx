"use client";

import { useEffect, useState } from "react";
import { getAllAdminRentalsAction } from "../action";

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await getAllAdminRentalsAction();
      if (res.success) {
        setRentals(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  
  const renderCustomer = (customer: any) => {
    if (!customer) return "N/A";
    if (typeof customer === "object") {
      return customer.email || customer.name || customer.id || customer._id || JSON.stringify(customer);
    }
    return customer;
  };

  
  const renderGear = (gear: any) => {
    if (!gear) return "N/A";
    if (typeof gear === "object") {
      return gear.name || gear.title || gear.id || gear._id || "Gear Object";
    }
    return gear;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Platform Rentals</h1>
        <p className="text-sm text-muted-foreground">View all customer rental orders across the platform.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading rental orders...</div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/50 border-b text-muted-foreground">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Gear</th>
                <th className="p-4">Total Price</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rentals.map((r) => (
                <tr key={r._id || r.id}>
                  <td className="p-4 font-mono text-xs">{r._id || r.id}</td>
                  <td className="p-4 font-mono text-xs">{renderCustomer(r.customer || r.user)}</td>
                  <td className="p-4 font-mono text-xs">{renderGear(r.gearId || r.gear)}</td>
                  <td className="p-4 font-semibold">${r.totalPrice}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent">
                      {r.status}
                    </span>
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
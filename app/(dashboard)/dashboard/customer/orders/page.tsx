import { cookies } from "next/headers";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

async function getCustomerOrders(token: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/rental/my-rentals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    const result = await res.json();
    return result.data || result || [];
  } catch (error) {
    console.error("Failed to fetch customer orders:", error);
    return [];
  }
}

export default async function CustomerOrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const orders = token ? await getCustomerOrders(token) : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Rental Orders</h1>
            <p className="text-sm text-slate-500 mt-1">
              View and manage all your gear rental bookings.
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Browse More Gears
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
            <h3 className="text-lg font-medium text-slate-700 mb-2">No rental orders found</h3>
            <p className="text-sm text-slate-500 mb-6">You haven't rented any gears yet.</p>
            <Link
              href="/#gears"
              className="inline-block px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Explore Gears Now
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <th className="py-4 px-6">Gear Name</th>
                    <th className="py-4 px-6">Rental Period</th>
                    <th className="py-4 px-6">Total Price</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {orders.map((order: any) => (
                    <tr key={order.id || order._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900">
                        {order.gearItem?.name || "Outdoor Gear"}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {new Date(order.startDate).toLocaleDateString()} &rarr;{" "}
                        {new Date(order.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        ${order.totalPrice}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            order.status === "PLACED"
                              ? "bg-amber-50 text-amber-700"
                              : order.status === "RETURNED"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
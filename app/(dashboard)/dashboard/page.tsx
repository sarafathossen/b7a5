import { cookies } from "next/headers";
import { Package, ShoppingBag, Clock, DollarSign } from "lucide-react";

async function fetchStats() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const result = await res.json();
    return result.data;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const stats = await fetchStats();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Manage your listed equipment and rental orders here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* My Listed Gears */}
        <div className="p-5 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">My Listed Gears</span>
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="text-3xl font-bold">{stats?.myListedGears ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Items available for rent</p>
          </div>
        </div>

        {/* Total Rentals */}
        <div className="p-5 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Total Rentals</span>
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <div className="text-3xl font-bold">{stats?.totalRentals ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total orders processed</p>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="p-5 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Pending Requests</span>
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-3xl font-bold">{stats?.pendingRequests ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires approval</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-5 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Total Revenue</span>
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <div className="text-3xl font-bold">
              ${stats?.totalEarnings ? stats.totalEarnings.toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Calculated from completed rentals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
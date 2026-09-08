import { getCustomerRentals } from "../_actions/dashboardAction";

export default async function CustomerDashboardPage() {
  const rentals = await getCustomerRentals();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Customer Dashboard</h1>
        <p className="text-muted-foreground">Overview of your rented items and account activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-xl bg-card shadow-sm">
          <p className="text-sm text-muted-foreground">Total Rentals</p>
          <p className="text-2xl font-bold mt-1">{rentals.length}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card shadow-sm">
          <p className="text-sm text-muted-foreground">Active Orders</p>
          <p className="text-2xl font-bold mt-1">
            {rentals.filter((item: any) => item.status !== "RETURNED").length}
          </p>
        </div>
      </div>
    </div>
  );
}
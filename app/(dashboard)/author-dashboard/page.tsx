import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Clock,
  CheckCircle2,
  DollarSign,
  Plus,
  Eye,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";

const mockRentalRequests = [
  {
    id: "ORD-101",
    gearName: "Sony Alpha A7 IV Camera",
    customer: "Rahim Ahmed",
    dates: "Sep 10 - Sep 12",
    totalPrice: "$135",
    status: "PENDING",
  },
  {
    id: "ORD-102",
    gearName: "DJI Mavic 3 Pro Drone",
    customer: "Tanvir Hasan",
    dates: "Sep 15 - Sep 18",
    totalPrice: "$280",
    status: "APPROVED",
  },
];

export default function AuthorDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Provider Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your rental equipment, respond to requests, and view earnings.
          </p>
        </div>
        <Link href="/dashboard/my-gear">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Gear
          </Button>
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Listed Gear</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active on marketplace</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-amber-600 font-medium">Needs your response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Rentals</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Successfully returned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,450.00</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Booking Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Rental Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRentalRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.id}</TableCell>
                  <TableCell>{req.gearName}</TableCell>
                  <TableCell>{req.customer}</TableCell>
                  <TableCell>{req.dates}</TableCell>
                  <TableCell className="font-semibold">{req.totalPrice}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        req.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {req.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="default" className="bg-emerald-600 hover:bg-emerald-700 h-8">
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" className="h-8">
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" className="h-8">
                        <Eye className="h-4 w-4 mr-1" /> Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
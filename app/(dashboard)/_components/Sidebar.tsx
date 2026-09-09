"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/app/(auth)/_actions/authAction";
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingBag, 
  Users, 
  ShieldAlert, 
  User, 
  Home, 
  LogOut 
} from "lucide-react";

interface SidebarProps {
  userRole?: string;
}

export default function Sidebar({ userRole = "PROVIDER" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const role = userRole.toUpperCase();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
    router.refresh();
  };

  const getMenuItems = () => {
    switch (role) {
      case "ADMIN":
        return [
          { name: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
          { name: "User Management", href: "/admin-dashboard/users", icon: Users },
          { name: "Content Moderation", href: "/admin-dashboard/moderation", icon: ShieldAlert },
        ];
      case "PROVIDER":
      case "AUTHOR":
        return [
          { name: "Overview", href: "/provider-dashboard", icon: LayoutDashboard },
          { name: "My Inventory", href: "/provider-dashboard/gear", icon: Package },
          { name: "Add New Gear", href: "/provider-dashboard/gear/new", icon: PlusCircle },
          { name: "Incoming Orders", href: "/provider-dashboard/orders", icon: ShoppingBag },
        ];
      case "CUSTOMER":
      default:
        return [
          { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
          { name: "My Rentals", href: "/dashboard/my-gear", icon: ShoppingBag },
          { name: "Profile", href: "/dashboard/profile", icon: User },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-card border-r min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="mb-6 px-2 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">GearUp</h2>
          <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-semibold uppercase">
            {role}
          </span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/provider-dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "@/components/LogoutButton";

const BASE_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

async function getPublicGears() {
  try {
    const res = await fetch(`${BASE_URL}/api/gear`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const result = await res.json();

    if (Array.isArray(result?.data)) {
      return result.data;
    } else if (result?.data && typeof result.data === "object") {
      return [result.data];
    } else if (Array.isArray(result)) {
      return result;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch gears:", error);
    return [];
  }
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isLoggedIn = !!token;

  const gears = await getPublicGears();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900">
      {/* ================= Header / Navbar ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600">
            GearUp <span className="text-slate-800">Rental</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link href="#gears" className="hover:text-indigo-600 transition-colors">
              Explore Gears
            </Link>
            {isLoggedIn && (
              <Link href="/provider-dashboard/gear" className="hover:text-indigo-600 transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <LogoutButton />
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================= Hero Section ================= */}
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-indigo-50/50 to-slate-50 py-16 md:py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Rent Premium Outdoor & Adventure Gear
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-8">
              Explore quality gears for your next outdoor adventure at an affordable daily price.
            </p>
            <a
              href="#gears"
              className="inline-block px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-xl shadow-md hover:bg-indigo-700 transition-all"
            >
              Browse Inventory
            </a>
          </div>
        </section>

        {/* ================= Gear Collection Section ================= */}
        <section id="gears" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Featured Gear Items</h2>
              <p className="text-sm text-slate-500 mt-1">
                Showing {gears.length} items available for rent
              </p>
            </div>
          </div>

          {gears.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium">No gear items available right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gears.map((item: any) => (
                <div
                  key={item._id || item.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                        {item.brand || "Outdoor"}
                      </span>
                      <span className="text-xs text-slate-400">Stock: {item.stock ?? 0}</span>
                    </div>

                    <h3 className="font-semibold text-slate-900 text-lg mb-1 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                      {item.description || "No description provided."}
                    </p>
                  </div>

                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-lg font-bold text-slate-900">${item.pricePerDay}</span>
                      <span className="text-xs text-slate-500"> / day</span>
                    </div>

                    <Link
                      href={`/gear/${item._id || item.id}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ================= Footer ================= */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-xl font-bold text-white tracking-tight">GearUp</span>
            <p className="mt-2 text-sm text-slate-400">
              Your trusted platform for outdoor gear rental.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#gears" className="hover:text-white transition-colors">
                  Explore Gears
                </Link>
              </li>
              {isLoggedIn && (
                <li>
                  <Link href="/provider-dashboard/gear" className="hover:text-white transition-colors">
                    Provider Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Support
            </h4>
            <p className="text-sm text-slate-400">Need help with your booking?</p>
            <p className="text-sm text-indigo-400 mt-2">support@gearup.com</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 text-center">
          &copy; {new Date().getFullYear()} GearUp Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
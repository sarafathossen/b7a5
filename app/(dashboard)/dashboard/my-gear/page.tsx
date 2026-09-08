import { cookies } from "next/headers";
import Image from "next/image";

async function getMyGear() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/gear/my-gear`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return [];
    const result = await res.json();
    return result.data || [];
  } catch {
    return [];
  }
}

export default async function MyGearPage() {
  const gears = await getMyGear();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Gear</h1>
          <p className="text-muted-foreground">
            Manage your listed gears, rental items, and listings.
          </p>
        </div>
      </div>

      {gears.length === 0 ? (
        <div className="border rounded-xl p-12 text-center bg-card text-muted-foreground">
          <p className="text-lg font-medium">No gear items found.</p>
          <p className="text-sm">You haven&apos;t listed or rented any gear yet.</p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Gear Name</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Price / Day</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {gears.map((item: any) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name || "Gear"}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                      )}
                      <span>{item.name}</span>
                    </td>
                    <td className="px-6 py-4">{item.brand || "N/A"}</td>
                    <td className="px-6 py-4 font-semibold">${item.pricePerDay}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.isAvailable
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {item.isAvailable ? "Available" : "Booked"}
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
  );
}
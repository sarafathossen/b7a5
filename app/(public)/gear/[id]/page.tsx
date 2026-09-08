 import Image from "next/image";
import { getSingleGear } from "../../_actions/gearAction";
import { notFound } from "next/navigation";

export default async function GearDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const gear = await getSingleGear(resolvedParams.id);

  if (!gear) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card border rounded-2xl p-6 shadow-sm">
        <div className="relative h-96 w-full rounded-xl overflow-hidden bg-muted">
          <Image
            src={gear.image || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4"}
            alt={gear.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase px-2.5 py-1 bg-primary/10 text-primary rounded-full">
              {gear.category}
            </span>
            <h1 className="text-3xl font-bold mt-3">{gear.name}</h1>
            <p className="text-muted-foreground mt-2">{gear.description}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">${gear.pricePerDay}</span>
              <span className="text-sm text-muted-foreground">/ day</span>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm">Select Rental Dates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Start Date</label>
                <input type="date" className="w-full border rounded-lg p-2 text-sm bg-background" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">End Date</label>
                <input type="date" className="w-full border rounded-lg p-2 text-sm bg-background" />
              </div>
            </div>

            <button
              disabled={!gear.isAvailable}
              className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {gear.isAvailable ? "Rent Now" : "Currently Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
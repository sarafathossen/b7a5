import { getAllGears } from "../_actions/gearAction";
import GearCard from "../_components/gearCard";
import GearFilter from "../_components/GearFilter";

export default async function BrowseGearPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const filters = await searchParams;
  const gears = await getAllGears(filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Browse Sports & Outdoor Gear</h1>
        <p className="text-muted-foreground mt-1">
          Find and rent the best outdoor equipment instantly.
        </p>
      </div>

      <GearFilter />

      {gears.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-card">
          <p className="text-muted-foreground">No equipment found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gears.map((gear: any) => (
            <GearCard key={gear._id || gear.id} gear={gear} />
          ))}
        </div>
      )}
    </div>
  );
}
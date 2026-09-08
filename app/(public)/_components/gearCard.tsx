import Image from "next/image";
import Link from "next/link";

interface GearCardProps {
  gear: {
    _id: string;
    id?: string;
    name: string;
    image?: string;
    pricePerDay: number;
    category: string;
    isAvailable: boolean;
  };
}

export default function GearCard({ gear }: GearCardProps) {
  const gearId = gear._id || gear.id;

  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div className="relative h-48 w-full bg-muted">
        <Image
          src={gear.image || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4"}
          alt={gear.name}
          fill
          className="object-cover"
        />
        <span
          className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            gear.isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {gear.isAvailable ? "Available" : "Rented"}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-medium uppercase text-muted-foreground">
            {gear.category}
          </span>
          <h3 className="text-lg font-bold text-foreground mt-1 line-clamp-1">
            {gear.name}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary">
              ${gear.pricePerDay}
            </span>
            <span className="text-xs text-muted-foreground"> / day</span>
          </div>

          <Link
            href={`/gear/${gearId}`}
            className="px-3.5 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
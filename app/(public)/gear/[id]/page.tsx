"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSingleGear, createRentalOrder } from "../../_actions/gearAction";
import navbar from "../_components/navbar";
import Link from "next/link";

export default function GearDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [gear, setGear] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      const data = await getSingleGear(resolvedParams.id);
      setGear(data);
      setLoading(false);
    }
    loadData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Loading gear details...</p>
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold">Gear not found!</h2>
        <Link
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Back Home
        </Link>
      </div>
    );
  }

  // দিন হিসাব করে মোট প্রাইজ ক্যালকুলেট করা
  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * gear.pricePerDay : 0;
  };

  const totalPrice = calculateTotal();

  const handleRent = async () => {
    setErrorMessage("");

    if (!startDate || !endDate) {
      setErrorMessage("Please select both start and end dates.");
      return;
    }

    if (totalPrice <= 0) {
      setErrorMessage("End date must be after start date.");
      return;
    }

    setSubmitting(true);

    const res = await createRentalOrder({
      gearItemId: gear._id || gear.id, 
      startDate,
      endDate,
      totalPrice,
    });

    setSubmitting(false);

    if (res.success) {
      // ✅ সফলভাবে রেন্ট হওয়ার পর সরাসরি এই লিঙ্কে রিডাইরেক্ট হবে
      router.push("/dashboard/my-gear");
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ব্যাক হোম বাটন */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-xl hover:bg-muted transition-colors"
        >
          ← Back Home
        </Link>
      </div>

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
              {gear.category?.name || gear.category || "Equipment"}
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
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm bg-background"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm bg-background"
                />
              </div>
            </div>

            {totalPrice > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg flex justify-between items-center text-sm font-medium">
                <span>Total Estimated Cost:</span>
                <span className="text-lg font-bold text-primary">${totalPrice}</span>
              </div>
            )}

            {errorMessage && (
              <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
            )}

            <button
              onClick={handleRent}
              disabled={!gear.isAvailable || submitting}
              className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
            >
              {submitting
                ? "Processing..."
                : gear.isAvailable
                ? "Rent Now"
                : "Currently Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
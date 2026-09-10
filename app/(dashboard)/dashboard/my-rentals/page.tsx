"use client";

import { useEffect, useState } from "react";
import { 
  getUserRentalOrdersAction, 
  getRentalOrderDetailsAction, 
  createReviewAction, 
  createPaymentSessionAction 
} from "../action";
import { Eye, Package, Star, CreditCard } from "lucide-react";
import { toast } from "sonner";

export default function MyGearRentalsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Payment State
  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null);

  // Review Modal States
  const [selectedGearId, setSelectedGearId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getUserRentalOrdersAction();
    if (res.success) {
      setOrders(res.data);
    }
    setLoading(false);
  };

  // পেমেন্ট সফল হয়ে ফিরে আসলে ডাটাবেজে সেভ করার জন্য useEffect
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get("payment");
    const rentalOrderId = queryParams.get("rentalOrderId");

    if (paymentStatus === "success" && rentalOrderId) {
      // ব্যাকএন্ডের পেমেন্ট ভেরিফাই এবং সেভ করার রাউট কল করা
      const verifyAndSavePayment = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/payment/verify", { // আপনার ব্যাকএন্ড পোর্ট ও রুট অনুযায়ী লিংক দিন
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // যদি টোকেন প্রয়োজন হয় তবে এখানে অথেন্টিকেশন হেডার দিতে পারেন:
              // "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ rentalOrderId }),
          });

          const result = await response.json();
          if (result.success) {
            toast.success("Payment saved successfully in database!");
            window.history.replaceState({}, document.title, window.location.pathname); // ইউআরএল ক্লিন করার জন্য
            fetchOrders(); // ডাটা রিফ্রেশ করা
          } else {
            toast.error(result.message || "Failed to save payment in DB");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
        }
      };

      verifyAndSavePayment();
    }

    fetchOrders();
  }, []);

  // Stripe Payment Function
  const handlePayNow = async (orderId: string) => {
    setPaymentLoadingId(orderId);
    
    const res = await createPaymentSessionAction({
      rentalOrderId: orderId,
      paymentMethod: "STRIPE",
    });

    if (res.success && res.paymentUrl) {
      toast.success("Redirecting to Stripe Checkout...");
      window.location.href = res.paymentUrl;
    } else {
      toast.error(res.message || "Payment initiation failed!");
    }
    setPaymentLoadingId(null);
  };

  const handleViewDetails = async (orderId: string) => {
    const res = await getRentalOrderDetailsAction(orderId);
    if (res.success) {
      setSelectedOrder(res.data);
    } else {
      toast.error(res.message || "Failed to load details");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGearId) return;

    setReviewSubmitting(true);
    const res = await createReviewAction({
      gearId: selectedGearId,
      rating,
      comment,
    });

    if (res.success) {
      toast.success(res.message || "Review submitted successfully!");
      setSelectedGearId(null);
      setComment("");
      setRating(5);
    } else {
      toast.error(res.message || "Failed to submit review");
    }
    setReviewSubmitting(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Rental Orders</h1>
        <p className="text-sm text-muted-foreground">View all your gear rental histories, statuses and manage payments.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading rental orders...</div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center border rounded-xl bg-card space-y-3">
          <Package className="w-10 h-10 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">You haven't rented any gear yet.</p>
        </div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/50 border-b text-muted-foreground">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Gear ID</th>
                <th className="p-4">Total Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">View</th>
                <th className="p-4">Payment</th>
                <th className="p-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => {
                const id = order._id || order.id;
                const gearId = order.gearItemId || order.gearId || order.gear?._id || order.gear?.id || null;
                
                // ডাটাবেজ থেকে পেমেন্ট বা স্ট্যাটাস PAID চেক করা
                const hasPaymentInDB = 
                  (order.payment && order.payment.length > 0) || 
                  (order.payments && order.payments.length > 0) ||
                  order.status === "PAID" || 
                  order.paymentStatus === "PAID";

                return (
                  <tr key={id} className="hover:bg-accent/20">
                    <td className="p-4 font-mono text-xs">{id}</td>
                    <td className="p-4 font-mono text-xs">{gearId || "N/A"}</td>
                    <td className="p-4 font-semibold">${order.totalPrice}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                        hasPaymentInDB ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {hasPaymentInDB ? "PAID" : order.status}
                      </span>
                    </td>
                    
                    {/* View Column */}
                    <td className="p-4">
                      <button
                        onClick={() => handleViewDetails(id)}
                        className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>

                    {/* Payment Column: পেমেন্ট করা থাকলে Paid এবং না থাকলে Pay Now বাটন দেখাবে */}
                    <td className="p-4">
                      {!hasPaymentInDB ? (
                        <button
                          disabled={paymentLoadingId === id}
                          onClick={() => handlePayNow(id)}
                          className="px-2.5 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg inline-flex items-center gap-1 text-xs font-medium transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          {paymentLoadingId === id ? "Processing..." : "Pay Now"}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600">
                          Paid
                        </span>
                      )}
                    </td>

                    {/* Review Column */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          if (!gearId) {
                            toast.error("Gear ID not found for this order!");
                            return;
                          }
                          setSelectedGearId(gearId);
                        }}
                        className="px-2.5 py-1.5 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 rounded-lg inline-flex items-center gap-1 text-xs font-medium"
                      >
                        <Star className="w-3.5 h-3.5" /> Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card p-6 rounded-xl w-full max-w-md border shadow-lg space-y-4">
            <h2 className="text-lg font-bold">Rental Order Details</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Order ID:</span> {selectedOrder._id || selectedOrder.id}</p>
              <p><span className="font-semibold">Gear ID:</span> {selectedOrder.gearId || selectedOrder.gear?._id || "N/A"}</p>
              <p><span className="font-semibold">Start Date:</span> {selectedOrder.startDate || "N/A"}</p>
              <p><span className="font-semibold">End Date:</span> {selectedOrder.endDate || "N/A"}</p>
              <p><span className="font-semibold">Total Price:</span> ${selectedOrder.totalPrice}</p>
              <p><span className="font-semibold">Status:</span> <span className="px-2 py-0.5 rounded bg-accent font-semibold">{selectedOrder.status}</span></p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

       
      {selectedGearId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border p-6 rounded-xl w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-lg font-bold">Write a Review</h2>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full border p-2 rounded-lg bg-background text-sm"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Very comfortable tent, kept us warm all night!"
                  className="w-full border p-2 rounded-lg bg-background text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGearId(null)}
                  className="px-4 py-2 border rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { fetchUserBookings, type Booking } from "../../utils/api/bookings";
import { isAxiosError } from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PayNow from "../../components/PaymentCard";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Bookings() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetchUserBookings();
        if (response.success) setBookings(response.bookings);
        else setError(response.message || "Failed to load bookings");
      } catch (err: unknown) {
        let message = "An unexpected error occurred while fetching bookings.";
        if (isAxiosError(err) && err.response?.data.message)
          message = err.response.data.message;
        else if (err instanceof Error) message = err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    if (filter === "upcoming") return bookingDate >= today;
    if (filter === "past") return bookingDate < today;
    return true;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
            Loading bookings...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-red-600 dark:text-red-400 text-lg font-semibold">
          {error}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          My Bookings
        </h1>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          {["all", "upcoming", "past"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as "all" | "upcoming" | "past")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === tab
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {filter === "upcoming"
                ? "No upcoming bookings"
                : filter === "past"
                ? "No past bookings"
                : "No bookings found"}
            </p>
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
  <div
    key={booking._id}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col sm:flex-row sm:justify-between gap-4"
  >
    <div className="flex flex-col gap-1">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {booking.experience?.name || "Experience"}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Booking ID: {booking._id}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Date: {formatDate(booking.date)}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Total: ${booking.totalAmount?.toFixed(2) || "0.00"}
      </p>
    </div>

    <div className="flex flex-col gap-2 items-start sm:items-end w-full sm:w-auto">
      <p
        className={`text-sm font-semibold ${
          booking.isPaid
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {booking.isPaid ? "Paid" : "Not Paid"}
      </p>

      {/* ✅ FIX HERE */}
      {!booking.isPaid && (
        <Elements stripe={stripePromise}>
          <PayNow booking={booking} />
        </Elements>
      )}

      {booking.isPaid && (
        <p className="text-green-600 font-semibold">Payment Completed</p>
      )}
    </div>
  </div>
))}

            </div>
          </Elements>
        )}
      </div>
    </div>
  );
}

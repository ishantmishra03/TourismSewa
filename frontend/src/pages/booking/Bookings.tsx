import { useEffect, useState } from "react";
import { fetchUserBookings, type Booking } from "../../utils/api/bookings";
import {
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Tag,
  Clock,
} from "lucide-react";
import { isAxiosError } from "axios";

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
        if (response.success) {
          setBookings(response.bookings);
        } else {
          setError(response.message || "Failed to load bookings");
        }
      } catch (err: unknown) {
        let message = "An unexpected error occurred while fetching bookings.";
        if (isAxiosError(err) && err.response?.data.message) {
          message = err.response?.data.message;
        } else if (err instanceof Error) {
          message = err.message;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isUpcoming = (date: string) => {
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);

    if (filter === "upcoming") return bookingDate >= today;
    if (filter === "past") return bookingDate < today;
    return true;
  });

  // Loader
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-red-600 dark:text-red-400 text-lg font-semibold">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all your experience bookings
          </p>
          <div className="h-1 w-24 bg-teal-600 rounded-full mt-4"></div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 inline-flex gap-2">
          {["all", "upcoming", "past"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as "all" | "upcoming" | "past")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                filter === tab
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Booking List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Bookings Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === "upcoming"
                ? "You don't have any upcoming bookings"
                : filter === "past"
                ? "You don't have any past bookings"
                : "You haven't made any bookings yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Experience Image Placeholder */}
                  <div className="lg:w-80 h-48 lg:h-auto relative bg-gray-200 dark:bg-gray-700">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                      No Image
                    </div>
                    {isUpcoming(booking.date) && (
                      <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Upcoming
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {booking.experience?.name || "Experience"}
                        </h2>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                            {booking.experience?.description ||
                              "No description"}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                            Experience
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                        <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Booking ID ({booking.isPaid ? "Paid" : "Not Paid"})
                          </p>
                          <p className="text-sm font-bold text-teal-700 dark:text-teal-300">
                            {booking._id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Booking Date
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(booking.date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <Phone className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Contact
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white wrap-break-word">
                            {booking.contactNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 sm:col-span-2">
                        <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Email
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white wrap-break-word">
                            {booking.email}
                          </p>
                        </div>
                      </div>

                      {/* Display Booking Status */}
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Status
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.status || "Unknown"}
                          </p>
                        </div>
                      </div>

                      {/* Total Amount */}
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Total Amount
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${booking.totalAmount?.toFixed(2) || "0.00"}
                          </p>
                        </div>
                      </div>

                      {/* Price per Person */}
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Price per Person
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            $
                            {booking.experience.pricePerPerson.toFixed(2) ||
                              "0.00"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    {booking.message && (
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                        <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Your Message
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {booking.message}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

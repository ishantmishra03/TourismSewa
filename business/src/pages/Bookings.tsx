import { useEffect, useState } from "react";
import {
  User,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/auth/useAuth";
import api from "@/utils/axios";
import { isAxiosError } from "axios";

interface Tourist {
  username: string;
  email: string;
}

interface Experience {
  name: string;
  description: string;
  location: string;
}

interface Booking {
  _id: string;
  date: string;
  message?: string;
  contactNumber: string;
  email: string;
  tourist: Tourist;
  experience: Experience;
  isPaid: boolean;
  status: string;
}

export default function Bookings() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/bookings/${user.id}`);
        setBookings(res.data.bookings);
      } catch (error: unknown) {
        let message = "Failed to fetch bookings.";
        if (isAxiosError(error) && error.response?.data.message) {
          message = error.response.data.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const { data } = await api.put(`/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      if (data.success) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: newStatus }
              : booking
          )
        );
      }
    } catch (error: unknown) {
      let message = "Failed to update booking status.";
      if (isAxiosError(error) && error.response?.data.message) {
        message = error.response.data.message;
      }
      alert(message);
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const { data } = await api.delete(`/bookings/${bookingId}`);
      if (data.success) {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
      }
    } catch (error: unknown) {
      let message = "Failed to delete booking.";
      if (isAxiosError(error) && error.response?.data.message) {
        message = error.response.data.message;
      }
      alert(message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <CheckCircle
            size={16}
            className="text-green-600 dark:text-green-400"
          />
        );
      case "canceled":
        return <XCircle size={16} className="text-red-600 dark:text-red-400" />;
      default:
        return (
          <Clock size={16} className="text-yellow-600 dark:text-yellow-400" />
        );
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
      case "canceled":
        return "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent dark:border-teal-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Error Loading Bookings
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Booking Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and track all bookings for your experiences
          </p>
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-teal-600 dark:bg-teal-400"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Total Bookings:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {bookings.length}
                </span>
              </span>
            </div>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No bookings yet
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              When customers book your experiences, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Header Section */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {booking.experience.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {booking.experience.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {booking.isPaid ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium rounded-md border border-teal-200 dark:border-teal-800">
                          <CheckCircle size={14} />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600">
                          <Clock size={14} />
                          Unpaid
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Customer & Details Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
                    {/* Customer Info */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Customer Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <User
                            size={18}
                            className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.tourist.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail
                            size={18}
                            className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                          />
                          <a
                            href={`mailto:${booking.tourist.email}`}
                            className="text-sm text-teal-600 dark:text-teal-400 hover:underline truncate"
                          >
                            {booking.tourist.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone
                            size={18}
                            className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                          />
                          <a
                            href={`tel:${booking.contactNumber}`}
                            className="text-sm text-gray-900 dark:text-white hover:underline"
                          >
                            {booking.contactNumber}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Booking Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Calendar
                            size={18}
                            className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                          />
                          <time className="text-sm text-gray-900 dark:text-white">
                            {new Date(booking.date).toLocaleDateString(
                              undefined,
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </time>
                        </div>
                        <div className="flex items-start gap-3">
                          <MessageSquare
                            size={18}
                            className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
                          />
                          <p className="text-sm text-gray-900 dark:text-white">
                            {booking.message || "No message provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex-1">
                      <label
                        htmlFor={`status-${booking._id}`}
                        className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                      >
                        Update Status
                      </label>
                      <select
                        id={`status-${booking._id}`}
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(booking._id, e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="canceled">Canceled</option>
                      </select>
                    </div>

                    <div className="sm:pt-6">
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
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

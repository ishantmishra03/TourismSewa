import { useEffect, useState } from "react";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  BarChart3,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
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

const COLORS = {
  confirmed: "#10b981",
  pending: "#f59e0b",
  canceled: "#ef4444",
};

export default function Dashboard() {
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
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: newStatus } : b
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
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      }
    } catch (error: unknown) {
      let message = "Failed to delete booking.";
      if (isAxiosError(error) && error.response?.data.message) {
        message = error.response.data.message;
      }
      alert(message);
    }
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    canceled: bookings.filter((b) => b.status === "canceled").length,
    paid: bookings.filter((b) => b.isPaid).length,
    unpaid: bookings.filter((b) => !b.isPaid).length,
  };

  const statusData = [
    { name: "Confirmed", value: stats.confirmed, color: COLORS.confirmed },
    { name: "Pending", value: stats.pending, color: COLORS.pending },
    { name: "Canceled", value: stats.canceled, color: COLORS.canceled },
  ];

  const bookingsByDate = bookings.reduce((acc, booking) => {
    const date = new Date(booking.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dateChartData = Object.entries(bookingsByDate)
    .map(([date, count]) => ({ date, bookings: count }))
    .slice(-7);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
      case "canceled":
        return "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800";
      default:
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800";
    }
  };

  if (authLoading || loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-gray-900 dark:to-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 border-4 border-teal-500 border-r-transparent animate-spin rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Error Loading Dashboard
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Monitor bookings, payments, and trends in real-time.
            </p>
          </div>
          <div className="hidden sm:block">
            <Activity className="h-10 w-10 text-teal-500" />
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Bookings",
              value: stats.total,
              icon: <Calendar className="text-teal-500" />,
              color: "from-teal-500 to-cyan-600",
            },
            {
              title: "Confirmed",
              value: stats.confirmed,
              icon: <CheckCircle className="text-green-500" />,
              color: "from-green-500 to-emerald-600",
            },
            {
              title: "Pending",
              value: stats.pending,
              icon: <Clock className="text-yellow-500" />,
              color: "from-amber-500 to-yellow-600",
            },
            {
              title: "Paid",
              value: stats.paid,
              icon: <DollarSign className="text-cyan-500" />,
              color: "from-cyan-500 to-blue-600",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex justify-between shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {card.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-80 shadow-inner text-white`}
              >
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Trend */}
          <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="text-teal-500" /> Booking Trend
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={dateChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderRadius: "8px",
                    color: "#fff",
                    border: "none",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#14b8a6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="text-green-500" /> Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${((percent as number) * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Bookings
            </h3>
            <Calendar className="text-gray-400" size={20} />
          </div>
          {recentBookings.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              No bookings yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-900/30 text-xs uppercase text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3 text-left">Customer</th>
                    <th className="px-6 py-3 text-left">Experience</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Payment</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {booking.tourist.username}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {booking.tourist.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {booking.experience.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {booking.experience.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {booking.isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                            <CheckCircle size={12} /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <Clock size={12} /> Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            handleStatusChange(booking._id, e.target.value)
                          }
                          className={`text-xs px-2 py-1.5 rounded-md border ${getStatusBadgeClass(
                            booking.status
                          )}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

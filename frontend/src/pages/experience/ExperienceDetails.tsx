import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Globe2,
  MessageCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Heart,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import type { Experience } from "../../types";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import api from "../../config/axios";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export function ExperienceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [experience, setExperience] = useState<Experience | null>(null);

  const getTypeColor = (type: string) => {
    const colors = {
      popular: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white",
      hidden_gem: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    );
  };

  useEffect(() => {
    const fetchExperience = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/experiences/${id}`);
        if (data.success) {
          setExperience(data.experience);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        setNotFound(true);
        if (isAxiosError(error) && error.response?.data.message) {
          toast.error(error.response.data.message);
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            Loading experience...
          </p>
        </div>
      </div>
    );
  }

  // Not Found state
  if (notFound || !experience) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Experience Not Found
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Actual experience detail rendering
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-96 sm:h-[500px] lg:h-[600px]">
        <img
          src={experience.image}
          alt={experience.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

        {/* Favorite Button */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            />
          </button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg ${getTypeColor(
                  experience.type
                )}`}
              >
                {experience.type}
              </span>
              <div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm ${
                  experience.isAvailable
                    ? "bg-green-500/90 text-white"
                    : "bg-red-500/90 text-white"
                }`}
              >
                {experience.isAvailable ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                {experience.isAvailable
                  ? "Available Now"
                  : "Currently Unavailable"}
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {experience.name}
            </h1>
            {experience.location && (
              <div className="flex items-center gap-2 text-white/90 text-lg">
                <MapPin className="w-5 h-5" />
                <span>{experience.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About This Experience
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {experience.description}
              </p>
              {/* New Duration and Price */}
              <div className="mt-6 p-4 bg-teal-100 dark:bg-teal-800 rounded-lg shadow-md hover:bg-teal-200 dark:hover:bg-teal-700 transition-all duration-300">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  <span className="text-teal-600 dark:text-teal-400">
                    Duration:
                  </span>{" "}
                  {experience.duration}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  <span className="text-teal-600 dark:text-teal-400">
                    Price per Person:
                  </span>{" "}
                  Rs. {experience.pricePerPerson.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Hosted By
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-linear-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shrink-0">
                  <Globe2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {experience.business.businessName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Verified Business Partner
                  </p>
                </div>
              </div>
            </div>

            {/* Leaflet Map Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Location
              </h2>
              <div className="aspect-video rounded-xl overflow-hidden">
                <MapContainer
                  center={[
                    experience.coordinates.lat,
                    experience.coordinates.lng,
                  ]}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker
                    position={[
                      experience.coordinates.lat,
                      experience.coordinates.lng,
                    ]}
                  >
                    <Popup>
                      {experience.name} <br />
                      {experience.location}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Right - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 sticky top-24">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Book This Experience
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Reserve your spot now
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-5 h-5 text-teal-500" />
                    <span>Flexible scheduling available</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Clock className="w-5 h-5 text-teal-500" />
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Star className="w-5 h-5 text-teal-500" />
                    <span>Premium experience</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/book-now", { state: {experience} })}
                  disabled={!experience.isAvailable}
                  className={`w-full flex items-center justify-center gap-3 ${
                    experience.isAvailable
                      ? "bg-linear-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
                      : "bg-gray-400 cursor-not-allowed opacity-60"
                  } text-white px-6 py-4 rounded-xl transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl disabled:hover:shadow-lg`}
                >
                  <MessageCircle className="w-6 h-6" />
                  {experience.isAvailable ? "Book Now" : "Not Available"}
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

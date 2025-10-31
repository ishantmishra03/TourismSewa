import { MessageCircle, MapPin, Globe2 } from "lucide-react";
import { type Experience } from "../types";
import { Link, useNavigate } from "react-router-dom";

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
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

  const navigate = useNavigate();

  const handleNavigate = (path: string, state?: unknown) => {
    navigate(path, { state });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <img
          src={experience.image}
          alt={experience.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Type Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg backdrop-blur-sm ${getTypeColor(
              experience.type
            )}`}
          >
            {experience.type.replace("_", " ")}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
              experience.isAvailable
                ? "bg-green-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                experience.isAvailable ? "bg-white" : "bg-white"
              } animate-pulse`}
            />
            {experience.isAvailable ? "Available" : "Unavailable"}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 flex flex-col gap-4">
        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200">
            {experience.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-2">
          {experience.description}
        </p>

        {/* Location */}
        {experience.location && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
            <span className="truncate">{experience.location}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700" />

        {/* Business Info */}
        <Link
          to={`/business/${experience.business._id}`}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          <Globe2 className="w-5 h-5 text-teal-500 shrink-0" />
          <span className="truncate">{experience.business.businessName}</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavigate(`/experience/${experience._id}`)}
            className="flex-1 text-teal-600 dark:text-teal-400 hover:text-white hover:bg-teal-600 dark:hover:bg-teal-500 font-semibold text-sm px-4 py-2.5 rounded-lg border-2 border-teal-600 dark:border-teal-400 transition-all duration-200"
            type="button"
          >
            View Details
          </button>

          <button
            onClick={() => handleNavigate("/book-now", { experience })}
            disabled={!experience.isAvailable}
            className={`flex-1 flex items-center justify-center gap-2 ${
              experience.isAvailable
                ? "bg-linear-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
                : "bg-linear-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-60"
            } text-white px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:hover:shadow-md`}
            type="button"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}

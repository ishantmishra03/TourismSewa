import { Phone, Mail, MapPin, Briefcase, ArrowRight, Tag } from "lucide-react";
import { type Business } from "../types";
import { useNavigate } from "react-router-dom";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-sm italic select-none">
        <Briefcase className="w-12 h-12 mb-2" />
        No image available
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {business.businessName}
        </h3>

        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300 mb-4">
          <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
          <span>{business.address}</span>
        </div>

        {/* Business categories */}
        <div className="mb-4 flex flex-wrap gap-2">
          {business.categories.map((cat, index) => (
            <span
              key={index}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold"
            >
              <Tag className="w-3 h-3" />
              {cat}
            </span>
          ))}
        </div>

        {/* Services description */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold mb-2">
            <Briefcase className="w-5 h-5" />
            <span>Services Offered:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {business.description ? (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-sm text-sm">
                {business.description}
              </span>
            ) : (
              <span className="text-gray-400 text-sm italic">
                No services listed
              </span>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4" />
            <a
              href={`tel:${business.contactNumber}`}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              {business.contactNumber}
            </a>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <a
              href={`mailto:${business.email}`}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              {business.email}
            </a>
          </div>
        </div>

        {/* View details button */}
        <button
          onClick={() => handleNavigate(`/business/${business._id}`)}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
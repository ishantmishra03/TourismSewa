import { useEffect, useState } from "react";
import { BusinessCard } from "../../components/BusinessCard";
import { Building2 } from "lucide-react";
import type { Business } from "../../types";
import api from "../../config/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const { data } = await api.get("/businesses");
        if (data.success) {
          setBusinesses(data.businesses);
        }
      } catch (error) {
        let message = "Failed to fetch businesses";
        if (isAxiosError(error) && error.response?.data.message) {
          message = error.response.data.message;
        } else if (error instanceof Error) {
          message = error.message;
        }
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            Loading businesses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Hero Section */}
      <div className="bg-teal-600 dark:bg-teal-700 py-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Local Businesses
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Connect with trusted local operators who bring authentic Nepali
            experiences to life.
          </p>
        </div>
      </div>

      {/* Business Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {businesses.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-300 text-lg">
            No businesses found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((business) => (
              <BusinessCard key={business._id} business={business} />
            ))}
          </div>
        )}

        {/* Call-to-action */}
        <div className="mt-16 bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 text-center transition-colors duration-200">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Want to List Your Business?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Join our network of trusted local businesses and reach travelers
            from around the world.
          </p>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExperienceCard } from "../../components/ExperienceCard";
import type { Business, Experience } from "../../types";
import api from "../../config/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { MapPin, Phone, Mail, Tag } from "lucide-react";

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessExperiences, setBusinessExperiences] = useState<Experience[]>(
    []
  );
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch business
        const { data: businessData } = await api.get(`/businesses/${id}`);
        if (!businessData.success) {
          setNotFound(true);
          return;
        }
        setBusiness(businessData.business);

        // 2. Fetch experiences for that business
        const { data: expData } = await api.get(`/experiences/2/${id}`);
        if (expData.success) {
          setBusinessExperiences(expData.experiences);
        } else {
          setBusinessExperiences([]);
        }
      } catch (error) {
        let message = "Something went wrong";
        if (isAxiosError(error) && error.response?.data.message) {
          message = error.response.data.message;
        } else if (error instanceof Error) {
          message = error.message;
        }
        toast.error(message);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border‑t‑transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            Loading business...
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Business Not Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-teal-600 hover:text-teal-700 font-semibold"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 sm:mb-12">
          <div className="bg-teal-600 dark:bg-teal-700 h-32 sm:h-40 lg:h-48"></div>

          <div className="px-6 sm:px-8 lg:px-12 pb-8 sm:pb-10 -mt-16 sm:-mt-20">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {business.businessName}
              </h1>

              {business.description && (
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {business.description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Address
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white arap-break-words">
                      {business.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Phone className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Phone
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white wrap-break-words">
                      {business.contactNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 sm:col-span-2 lg:col-span-1">
                  <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Email
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white wrap-break-words">
                      {business.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800">
                <Tag className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {business.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm font-medium text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/50 rounded-full border border-teal-200 dark:border-teal-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experiences Section */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Experiences Offered
            </h2>
            <div className="h-1 w-24 bg-blue-600 rounded-full"></div>
          </div>

          {businessExperiences.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Experiences Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This business hasn’t listed any experiences at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {businessExperiences.map((exp) => (
                <ExperienceCard key={exp._id} experience={exp} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { ExperienceCard } from "../ExperienceCard";
import { useEffect, useState } from "react";
import type { Experience } from "../../types";
import api from "../../config/axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export default function FeaturedExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data } = await api.get(`/experiences/featured`);
        if (data.success) {
          setExperiences(data.experiences);
        }
      } catch (error: unknown) {
        let message = "Something went wrong";
        if (isAxiosError(error) && error.response?.data.message) {
          message = error.response?.data.message;
        } else if (error instanceof Error) {
          message = error.message;
        }
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            Loading experiences...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="experiences"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Featured Experiences
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Handpicked adventures that showcase the best of Nepal. Book instantly
          through our chat assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.slice(0, 5).map((experience) => (
          <ExperienceCard key={experience._id} experience={experience} />
        ))}
      </div>
    </div>
  );
}

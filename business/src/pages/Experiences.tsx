import { ExperienceCard } from "@/components/ExperienceCard";
import { useAuth } from "@/contexts/auth/useAuth";
import type { Experience } from "@/types";
import api from "@/utils/axios";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Experiences() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data } = await api.get(`/experiences/2/${user?.id}`);
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
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium">Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="all-experiences"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          All Experiences
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover the full range of unique and immersive adventures in Nepal.
          Available to book via our AI travel assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((experience) => (
          <ExperienceCard key={experience._id} experience={experience} />
        ))}
      </div>
    </div>
  );
}

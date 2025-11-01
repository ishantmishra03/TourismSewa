import api from "../../config/axios";
import type { Experience } from "../../types";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ExperienceCard } from "../../components/ExperienceCard";

export default function SearchExperience() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search).get("q");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data } = await api.get(`/experiences/search?q=${searchParams}`);
        console.log(data);
        let parsed: Experience[] = [];
        if (Array.isArray(data.experiences)) {
          parsed = data.experiences;
        } else {
          try {
            parsed = JSON.parse(data.experiences);
          } catch (err) {
            console.error("Failed to parse experiences JSON", err);
            parsed = [];
          }
        }
        setExperiences(parsed);
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
  }, [searchParams]);

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-900 dark:bg-gray-900 text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Search results for:{" "}
        <span className="text-teal-400">{searchParams}</span>
      </h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading experiences...</p>
      ) : experiences.length === 0 ? (
        <p className="text-center text-gray-400">No experiences found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp: Experience) => (
            <ExperienceCard key={exp._id} experience={exp} />
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { MapPin, Image as ImageIcon, Type, FileText } from "lucide-react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth/useAuth";
import api from "@/utils/axios";
import { useNavigate } from "react-router-dom";

export interface IExperience {
  name: string;
  description: string;
  coordinates: { lat: number; lng: number };
  location: string;
  type: "popular" | "hidden_gem" | string;
  isAvailable: boolean;
  duration: "1 day" | "2 days" | "3 days";
  pricePerPerson: number;
}

export default function AddExperience() {
  const { user, loading, setLoading } = useAuth();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Omit<IExperience, "business">>({
    name: "",
    description: "",
    coordinates: {
      lat: 0,
      lng: 0,
    },
    location: "",
    type: "popular",
    isAvailable: true,
    duration: "1 day",
    pricePerPerson: 0, 
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Get coordinates
 const fetchCoordinates = async () => {
  if (!experience.location.trim()) {
    toast.error("Please enter a valid location before fetching coordinates.");
    return;
  }

  try {
    const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY; 
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        experience.location
      )}&key=${apiKey}`
    );

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      toast.error("No coordinates found for the given location.");
      return;
    }

    const { lat, lng } = data.results[0].geometry;

    setExperience((prev) => ({
      ...prev,
      coordinates: { lat, lng },
    }));

    toast.success("Coordinates fetched successfully!");
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    toast.error("Failed to fetch coordinates. Please try again.");
  }
};


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setExperience((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!experience.name.trim()) {
      toast.error("Experience name is required.");
      return false;
    }

    if (!experience.description.trim()) {
      toast.error("Description is required.");
      return false;
    }

    const { lat, lng } = experience.coordinates;
    if (isNaN(lat) || lat < -90 || lat > 90) {
      toast.error("Latitude must be a number between -90 and 90.");
      return false;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      toast.error("Longitude must be a number between -180 and 180.");
      return false;
    }

    if (!experience.location.trim()) {
      toast.error("Location is required.");
      return false;
    }

    if (experience.type !== "popular" && experience.type !== "hidden_gem") {
      toast.error("Invalid experience type selected.");
      return false;
    }

    if (imageFile && !imageFile.type.startsWith("image/")) {
      toast.error("Uploaded file must be an image.");
      return false;
    }

    if (experience.pricePerPerson <= 0) {
      toast.error("Price per person must be greater than zero.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user?.id) {
      toast.error("User not authenticated.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", experience.name);
      formData.append("description", experience.description);
      formData.append("coordinates", JSON.stringify(experience.coordinates));
      formData.append("type", experience.type);
      formData.append("businessId", user.id);
      formData.append("location", experience.location);
      formData.append("duration", experience.duration);
      formData.append("pricePerPerson", experience.pricePerPerson.toString());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const { data } = await api.post("/experiences", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/experiences");
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

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-teal-950 transition-colors duration-300 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 mb-6 border border-teal-100 dark:border-teal-900">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Add New Experience
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Share your amazing discovery with the community
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 border border-teal-100 dark:border-teal-900"
          >
            <div className="space-y-6">
              {/* Name */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <Type
                    size={18}
                    className="text-teal-600 dark:text-teal-400"
                  />
                  Experience Name
                </label>
                <input
                  name="name"
                  value={experience.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter experience name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/50 transition-all duration-200 outline-none"
                />
              </div>

              {/* Description */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <FileText
                    size={18}
                    className="text-teal-600 dark:text-teal-400"
                  />
                  Description
                </label>
                <textarea
                  name="description"
                  value={experience.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Describe what makes this experience special"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/50 transition-all duration-200 outline-none resize-none"
                />
              </div>

              {/* Coordinates (read-only) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    <MapPin
                      size={18}
                      className="text-teal-600 dark:text-teal-400"
                    />
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={experience.coordinates.lat}
                    readOnly
                    placeholder="Auto-filled"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    <MapPin
                      size={18}
                      className="text-teal-600 dark:text-teal-400"
                    />
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={experience.coordinates.lng}
                    readOnly
                    placeholder="Auto-filled"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Location + OK button */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <MapPin
                    size={18}
                    className="text-teal-600 dark:text-teal-400"
                  />
                  Location
                </label>
                <div className="flex items-center gap-2">
                  <input
                    name="location"
                    value={experience.location}
                    onChange={handleChange}
                    required
                    placeholder="City, Country"
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/50 transition-all duration-200 outline-none"
                  />
                  <button
                    type="button"
                    disabled={!experience.location}
                    onClick={fetchCoordinates}
                    className={`py-3 px-6 rounded-xl font-semibold text-white ${
                      experience.location
                        ? "bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                        : "bg-gray-500"
                    } transition-all duration-200`}
                  >
                    OK
                  </button>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <Type
                    size={18}
                    className="text-teal-600 dark:text-teal-400"
                  />
                  Duration
                </label>
                <select
                  name="duration"
                  value={experience.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/50 transition-all duration-200 outline-none cursor-pointer"
                >
                  <option value="1 day">1 day</option>
                  <option value="2 days">2 days</option>
                  <option value="3 days">3 days</option>
                </select>
              </div>

              {/* Price per Person */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <Type
                    size={18}
                    className="text-teal-600 dark:text-teal-400"
                  />
                  Price Per Person
                </label>
                <input
                  name="pricePerPerson"
                  type="number"
                  value={experience.pricePerPerson}
                  onChange={handleChange}
                  required
                  placeholder="Price per person"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/50 transition-all duration-200 outline-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <Type
                    size={18}
                    className="text-teal-600 dark:text-teal-400"
                  />
                  Experience Type
                </label>
                <select
                  name="type"
                  value={experience.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/50 transition-all duration-200 outline-none cursor-pointer"
                >
                  <option value="popular">Popular</option>
                  <option value="hidden_gem">Hidden Gem</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <ImageIcon
                    size={18}
                    className="text-teal-600 dark:text-teal-400"
                  />
                  Experience Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 dark:file:bg-teal-900/50 file:text-teal-700 dark:file:text-teal-300 hover:file:bg-teal-100 dark:hover:file:bg-teal-900 file:cursor-pointer cursor-pointer transition-all duration-200"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-4 rounded-xl overflow-hidden border-2 border-teal-200 dark:border-teal-800">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                <input
                  id="available"
                  type="checkbox"
                  checked={experience.isAvailable}
                  onChange={(e) =>
                    setExperience((prev) => ({
                      ...prev,
                      isAvailable: e.target.checked,
                    }))
                  }
                  className="h-5 w-5 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                />
                <label
                  htmlFor="available"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer select-none"
                >
                  This experience is currently available
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl text-white font-semibold text-base bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 dark:from-teal-500 dark:to-cyan-500 dark:hover:from-teal-600 dark:hover:to-cyan-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
              >
                {loading ? "Creating ..." : "Create Experience"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

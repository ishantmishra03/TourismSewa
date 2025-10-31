import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth/useAuth";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { createBooking, type BookingData } from "../../utils/api/bookings";
import type { Experience } from "../../types";
import {
  MapPin,
  Tag,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Loader2,
} from "lucide-react";

function TextAreaField({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <div className="relative">
        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-lg border pl-11 pr-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
          }`}
          rows={4}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface LocationState {
  experience?: Experience & { _id: string };
}

const BookingForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState;
  const experience = state?.experience;

  useEffect(() => {
    if (!experience) {
      toast.error("No experience data found. Please try again.");
      navigate("/experiences");
    }
  }, [experience, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    contactNumber: "",
    date: new Date().toISOString().split("T")[0],
    message: "",
    noOfPersons: 1, // Default value is 1
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Ensure noOfPersons is always treated as a number
    if (name === "noOfPersons") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : 1, // Convert to number, default to 1 if empty
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.contactNumber)
      newErrors.contactNumber = "Contact number is required";
    if (!formData.date) newErrors.date = "Date is required";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(formData.date);

    if (selectedDate < today) {
      newErrors.date = "The booking date cannot be in the past.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNavigate = (path: string, state: { bookingId: string }) => {
    navigate(path, { state: { ...state, experience } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !experience) return;

    setLoading(true);

    try {
      const booking: BookingData = {
        tourist: user?.id as string,
        experience: experience._id,
        date: new Date(formData.date),
        email: formData.email,
        contactNumber: formData.contactNumber,
        message: formData.message,
        noOfPersons: formData.noOfPersons,
      };

      const res = await createBooking(booking);

      if (res.success) {
        toast.success("Booking successful!");
        handleNavigate("/booking-confirmation", { bookingId: res.booking._id });
      } else {
        toast.error(res.message || "Booking failed");
      }
    } catch (err) {
      let message = "Something went wrong.";
      if (isAxiosError(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!experience) {
    return null;
  }

  const totalAmount = experience.pricePerPerson * formData.noOfPersons;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in your details to confirm your experience
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Experience Summary Card */}
          <div className="bg-linear-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <img
                src={experience.image}
                alt={experience.name}
                className="w-full lg:w-64 h-48 lg:h-56 object-cover rounded-xl shadow-lg"
              />
              <div className="flex-1 text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                  {experience.name}
                </h2>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 shrink-0" />
                    <span className="text-teal-50">{experience.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 shrink-0" />
                    <span className="text-teal-50">
                      {experience.type.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <p className="text-teal-50 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {experience.description}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 lg:p-10 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full rounded-lg border pl-11 pr-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none                     focus:ring-teal-500 ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="contactNumber"
                  className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="text"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="e.g. +1 234 567 890"
                    className={`w-full rounded-lg border pl-11 pr-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none focus:ring-teal-500 ${
                      errors.contactNumber
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                </div>
                {errors.contactNumber && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.contactNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Date Picker */}
            <div className="relative">
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Booking Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full rounded-lg border pl-11 pr-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none focus:ring-teal-500 ${
                    errors.date
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-xs text-red-500">{errors.date}</p>
              )}
            </div>

            {/* Number of Persons */}
            <div className="relative">
              <label
                htmlFor="noOfPersons"
                className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Number of Persons
              </label>
              <div className="relative">
                <input
                  id="noOfPersons"
                  name="noOfPersons"
                  type="number"
                  min="1"
                  value={formData.noOfPersons}
                  onChange={handleChange}
                  className={`w-full rounded-lg border pl-11 pr-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.noOfPersons
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
              </div>
              {errors.noOfPersons && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.noOfPersons}
                </p>
              )}
            </div>

            {/* Message */}
            <TextAreaField
              label="Message"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Add any special requests or notes"
              error={errors.message}
            />

            <div className="flex justify-between items-center mt-6">
              <div className="text-lg font-semibold">
                <span>Total: </span>
                <span className="text-teal-500">${totalAmount.toFixed(2)}</span>
              </div>
              <button
                type="submit"
                className={`px-6 py-3 rounded-lg text-white bg-teal-600 transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-300 disabled:cursor-not-allowed ${
                  loading ? "cursor-wait" : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;

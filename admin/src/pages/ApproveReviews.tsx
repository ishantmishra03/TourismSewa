import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  approveReview,
  getPendingReviews,
  rejectReview,
} from "@/utils/api/reviews";
import { Check, X } from "lucide-react";
import axios from "axios";

interface Review {
  _id: string;
  tourist: { name: string };
  experience: { name: string };
  rating: number;
  comment?: string;
}

export default function ApproveReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getPendingReviews();
      setReviews(data.reviews);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to fetch reviews");
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to fetch reviews");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id);
      toast.success("Review approved");
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to approve review");
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to approve review");
      }
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectReview(id);
      toast.success("Review rejected");
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to reject review");
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to reject review");
      }
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Approve Reviews
        </h1>

        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No pending reviews</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      Tourist:
                    </span>{" "}
                    {review.tourist.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      Experience:
                    </span>{" "}
                    {review.experience.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      Rating:
                    </span>{" "}
                    {review.rating} / 5
                  </p>
                  {review.comment && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        Comment:
                      </span>{" "}
                      {review.comment}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mt-3 sm:mt-0">
                  <button
                    onClick={() => handleApprove(review._id)}
                    className="flex items-center gap-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white rounded-lg transition-colors text-sm"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(review._id)}
                    className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 text-white rounded-lg transition-colors text-sm"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

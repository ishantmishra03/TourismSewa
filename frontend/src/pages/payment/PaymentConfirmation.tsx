import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl max-w-md w-full p-8 text-center transition-colors duration-300">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-24 h-24 text-teal-600 dark:text-teal-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for your payment. Your booking is now confirmed. 🎉
        </p>

        <button
          onClick={() => navigate("/bookings")}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 mb-3"
        >
          View My Bookings
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          Explore More Experiences
        </button>
      </div>
    </div>
  );
}

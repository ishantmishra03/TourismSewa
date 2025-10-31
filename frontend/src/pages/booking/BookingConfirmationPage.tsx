import { CheckCircle, Calendar, DollarSign, MessageCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Experience } from "../../types";
import { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import api from "../../config/axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import type { StripeError } from "@stripe/stripe-js/dist/stripe-js";

interface LocationState {
  experience: Experience | null;
  bookingId?: string;
}

export function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const state = location.state as LocationState;
  const experience = state?.experience ?? null;
  const bookingId = state?.bookingId;

  useEffect(() => {
    if (!experience) {
      navigate("/bookings");
    }
  }, [experience, navigate]);

  const stripe = useStripe();
  const elements = useElements();

  const handleBackToHome = () => {
    navigate("/");
  };

  const handlePayNow = async () => {
    setIsLoading(true);

    if (!experience || !experience.pricePerPerson) {
      setErrorMessage("Booking details are missing.");
      setIsLoading(false);
      return;
    }

    if (!stripe || !elements) {
      setErrorMessage("Stripe.js has not loaded yet.");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/payments/create-payment-intent", {
        bookingId,
        amount: experience.pricePerPerson * 100,
      });

      const { clientSecret } = data;

      // Retrieve the card element
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        setErrorMessage("Card element not found.");
        setIsLoading(false);
        return;
      }

      // Confirm the payment with Stripe using card details
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement, // Pass the card element here
          },
        });

      if (stripeError) {
        handleStripeError(stripeError);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment was successful
        toast.success("Payment Successful!");
        navigate("/payment-confirmation");
      }
    } catch (error: unknown) {
      let message = "An error occurred during payment processing.";
      if (isAxiosError(error) && error.response?.data.message) {
        message = error.response?.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripeError = (error: StripeError) => {
    let errorMessage = "An unknown error occurred during payment processing.";

    switch (error.type) {
      case "card_error":
      case "validation_error":
        errorMessage = `Card error: ${error.message}`;
        break;
      case "api_error":
        errorMessage = `API error: ${error.message}`;
        break;
      case "idempotency_error":
        errorMessage = `Idempotency error: ${error.message}`;
        break;
      case "authentication_error":
        errorMessage = `Authentication error: ${error.message}`;
        break;
      default:
        errorMessage = `Stripe error: ${error.message}`;
        break;
    }

    setErrorMessage(errorMessage);
  };

  if (!experience) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No booking information available
          </p>
          <button
            onClick={handleBackToHome}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
          <div className="bg-linear-to-r from-teal-500 to-teal-600 p-8 text-center">
            <CheckCircle className="w-20 h-20 text-white mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              Booking Request Received!
            </h1>
            <p className="text-teal-100 text-lg">
              We're excited to help you plan your adventure
            </p>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Experience Summary
              </h2>

              <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                <img
                  src={experience.image}
                  alt={experience.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-white/90 dark:bg-gray-900/90 rounded-full text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {experience.type}
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {experience.name}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {experience.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                  <Calendar className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Duration
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {experience.duration || "Flexible"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                  <DollarSign className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Price
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${experience.pricePerPerson} per person
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8 transition-colors duration-200">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                What Happens Next?
              </h3>

              <div className="space-y-4 mb-8">
                <Step
                  number={1}
                  title="Chat Confirmation"
                  description="Our team will reach out via chat to confirm details and answer questions"
                />
                <Step
                  number={2}
                  title="Personalize Your Trip"
                  description="Work with local experts to customize your experience"
                />
                <Step
                  number={3}
                  title="Start Your Adventure"
                  description="Receive your itinerary and prepare for an unforgettable journey"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBackToHome}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Explore More Experiences
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                  <MessageCircle className="w-5 h-5" />
                  Contact Us
                </button>
              </div>

              <div className="mt-8 bg-teal-50 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-4">
                  Secure Payment
                </h3>
                <div className="mb-6">
                  <CardElement />
                </div>
                {errorMessage && (
                  <p className="text-red-500 text-lg">{errorMessage}</p>
                )}
                <button
                  onClick={handlePayNow}
                  disabled={isLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  {isLoading ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h4>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}

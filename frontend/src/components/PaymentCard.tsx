import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { Booking } from "../utils/api/bookings";
import { useState } from "react";
import api from "../config/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function PayNow({ booking }: { booking: Booking }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayNow = async () => {
    if (!stripe || !elements || !booking.totalAmount) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Create payment intent on backend
      const { data } = await api.post("/payments/create-payment-intent", {
        bookingId: booking?._id,
        amount: booking?.totalAmount * 100, // cents
      });

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: { card: cardElement },
        });

      if (stripeError) {
        setErrorMessage(stripeError.message || "Something went wrong");
      } else if (paymentIntent?.status === "succeeded") {
        toast.success("Payment successful!");
        navigate("/payment-confirmation");
      }
    } catch (err) {
      setErrorMessage("Payment failed. Try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg shadow-lg">
      <CardElement />
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
      <button
        onClick={handlePayNow}
        disabled={isLoading}
        className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

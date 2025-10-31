import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

export const createPaymentIntent = async (amount, bookingId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { bookingId: bookingId },
    });
    return paymentIntent;
  } catch (error) {
    throw new Error("Failed to create payment intent");
  }
};

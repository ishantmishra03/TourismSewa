import Stripe from "stripe";
import Booking from "../models/Booking.js";
import { createPaymentIntent } from "../utils/stripeUtils.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

export const createPaymentIntent2 = async (req, res) => {
  const { bookingId, amount } = req.body;

  try {
    // Find the booking to make sure it's valid
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Create PaymentIntent
    const paymentIntent = await createPaymentIntent(amount, bookingId);

    // Optionally, store the paymentIntentId in the booking model
    // booking.paymentIntentId = paymentIntent.id;
    // await booking.save();

    // Send the clientSecret and bookingId back to the client
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
      bookingId: bookingId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating payment intent" });
  }
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;

// Handle Stripe Webhook
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const rawBody = req.body;
  let event;

  try {
    // Verify the webhook signature using the raw body
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log("Payment Intent Metadata:", paymentIntent.metadata);

      const bookingId = paymentIntent.metadata?.bookingId;

      if (bookingId) {
        const booking = await Booking.findById(bookingId);
        if (booking) {
          // Update booking status to 'Paid'
          booking.isPaid = true;
          await booking.save();
          console.log(`Booking ${bookingId} has been marked as paid.`);
        } else {
          console.log(`Booking with ID ${bookingId} not found.`);
        }
      }
    }

    // Acknowledge receipt of the event
    res.status(200).send("Event received");
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};

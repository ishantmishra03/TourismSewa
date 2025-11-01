import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import http from "http";

import authRouter from "./routes/auth/auth.routes.js";
import businessAuthRouter from "./routes/auth/businessAuth.routes.js";
import adminRouter from "./routes/auth/adminAuth.routes.js";
import experienceRouter from "./routes/experiences.routes.js";
import businessRouter from "./routes/business.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import reviewRouter from "./routes/review.routes.js";
import adminReviewRouter from "./routes/adminReview.routes.js";

import { connectDB2 } from "./config/db.js";
import bodyParser from "body-parser";
import { handleStripeWebhook } from "./controllers/payment.controller.js";

await connectDB2();

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Stripe webhook
app.post(
  "/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  handleStripeWebhook
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.send("Server working...");
});

app.use("/api/auth", authRouter);
app.use("/api/auth2", businessAuthRouter);
app.use("/api/admin", adminRouter);
app.use("/api/experiences", experienceRouter);
app.use("/api/businesses", businessRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin/reviews", adminReviewRouter);

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

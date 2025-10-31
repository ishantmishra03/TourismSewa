import express from "express";
import {
  createBooking,
  getBookings,
  getBookings2,
  getBookingById,
  deleteBooking,
  updateBookingStatus,
} from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { businessAuthMiddleware } from "../middlewares/businessAuthMiddleware.js";

const bookingRouter = express.Router();

bookingRouter.get("/get", authMiddleware, getBookings2);
bookingRouter.post("/", authMiddleware, createBooking);
bookingRouter.get("/:businessId", businessAuthMiddleware, getBookings);
bookingRouter.get("get/:id", authMiddleware, getBookingById);
bookingRouter.put("/:id/status", businessAuthMiddleware, updateBookingStatus);
bookingRouter.delete("/:id", authMiddleware, deleteBooking);

export default bookingRouter;

import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const bookingSchema = new Schema(
  {
    tourist: { type: Schema.Types.ObjectId, ref: "User", required: true },
    experience: {
      type: Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    date: { type: Date, required: true },
    message: { type: String },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    isPaid: { type: Boolean, default: false },
    noOfPersons: { type: Number, required: true },
    totalAmount: { type: Number },
    status: { type: String, enum: ["pending", "confirmed", "canceled"] },
  },
  { timestamps: true }
);

const Booking = model("Booking", bookingSchema);

export default Booking;

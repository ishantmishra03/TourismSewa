import mongoose from "mongoose";

const { Schema, model } = mongoose;

const experienceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    location: { type: String, required: true },
    image: { type: String, required: true },
    type: {
      type: String,
      enum: ["popular", "hidden_gem"],
      default: "popular",
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    isAvailable: { type: Boolean, default: true },
    duration: { type: String, required: true },
    pricePerPerson: { type: Number, required: true },
  },
  { timestamps: true }
);

const Experience = model("Experience", experienceSchema);

export default Experience;

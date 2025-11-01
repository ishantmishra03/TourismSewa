import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    tourist: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    experience: {
      type: Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

reviewSchema.index({ tourist: 1, experience: 1 }, { unique: true });

const Review = model("Review", reviewSchema);

export default Review;

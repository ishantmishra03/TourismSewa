import mongoose from "mongoose";

const { Schema, model } = mongoose;

const businessSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    businessName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String },

    verified: { type: Boolean, default: false },

    categories: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Business = model("Business", businessSchema);

export default Business;

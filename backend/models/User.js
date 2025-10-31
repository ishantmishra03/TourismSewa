import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
    nationality: { type: String, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

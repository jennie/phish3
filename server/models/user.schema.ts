import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["student", "employee", "governor", "gammaspace"],
    required: true,
  },
  bestScore: { type: Number, default: 0 },
  lastLoginAt: Date,
});

export default mongoose.model("User", userSchema);

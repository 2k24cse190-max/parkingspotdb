import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true
    },

    phone: String,

    vehicleNumber: String,

    vehicleType: {
      type: String,
      enum: ["SUV", "Sedan", "Bike"],
      default: "SUV"
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation"
    },

    parking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking"
    },

    slotCode: String,

    vehicleNumber: String,

    entryTime: Date,

    expiryTime: Date,

    exitTime: Date,

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Session", sessionSchema);
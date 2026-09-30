import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation"
    },

    userName: String,

    parkingAmount: Number,

    extensionAmount: {
      type: Number,
      default: 0
    },

    discount: {
      type: Number,
      default: 0
    },

    totalAmount: Number,

    method: {
      type: String,
      enum: ["UPI", "Card", "Wallet", "Cash"],
      default: "UPI"
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "success"
    },

    transactionId: String
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Payment",
  paymentSchema
);
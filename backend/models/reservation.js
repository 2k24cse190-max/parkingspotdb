import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    parking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking",
      required: true
    },

    slotCode: {
      type: String,
      required: true
    },

    userName: {
      type: String,
      default: "Demo User"
    },

    vehicleNumber: {
      type: String,
      default: "TN XX XX 1234"
    },

    startTime: Date,

    endTime: Date,

    duration: Number,

    amount: Number,

    status: {
      type: String,
      enum: [
        "reserved",
        "active",
        "completed",
        "cancelled"
      ],
      default: "reserved"
    },

    bookingId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Reservation",
  reservationSchema
);
import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["available", "reserved", "occupied"],
    default: "available"
  },

  vehicleType: {
    type: String,
    enum: ["All", "SUV", "Sedan", "Bike"],
    default: "All"
  },

  evCharging: {
    type: Boolean,
    default: false
  }
});

const parkingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    address: String,

    latitude: Number,

    longitude: Number,

    distance: Number,

    rating: {
      type: Number,
      default: 4
    },

    pricePerHour: {
      type: Number,
      required: true
    },

    totalSlots: Number,

    covered: Boolean,

    evCharging: Boolean,

    image: String,

    slots: [slotSchema]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Parking", parkingSchema);
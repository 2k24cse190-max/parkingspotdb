import express from "express";
import Parking from "../models/Parking.js";
import Reservation from "../models/reservation.js";

const router = express.Router();


/* GET RESERVATIONS */

router.get("/", async (req, res) => {

  try {

    const reservations =
      await Reservation.find()
        .populate("parking")
        .sort({
          createdAt: -1
        });

    res.json(reservations);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


/* CREATE RESERVATION */

router.post("/", async (req, res) => {

  try {

    const {
      parkingId,
      slotCode,
      userName,
      vehicleNumber,
      startTime,
      endTime
    } = req.body;

    const parking =
      await Parking.findById(parkingId);

    if (!parking) {

      return res.status(404).json({
        message: "Parking not found"
      });

    }

    const slot =
      parking.slots.find(
        slot => slot.code === slotCode
      );

    if (!slot) {

      return res.status(404).json({
        message: "Slot not found"
      });

    }

    if (slot.status !== "available") {

      return res.status(400).json({
        message: "Slot is not available"
      });

    }

    const start =
      new Date(startTime);

    const end =
      new Date(endTime);

    const duration =
      Math.max(
        1,
        Math.ceil(
          (end - start) / 3600000
        )
      );

    const amount =
      duration *
      parking.pricePerHour;

    slot.status = "reserved";

    await parking.save();

    const bookingId =
      "PN" +
      Date.now()
        .toString()
        .slice(-6);

    const reservation =
      await Reservation.create({

        parking: parking._id,

        slotCode,

        userName:
          userName || "Demo User",

        vehicleNumber:
          vehicleNumber ||
          "TN XX XX 1234",

        startTime: start,

        endTime: end,

        duration,

        amount,

        bookingId

      });

    const populated =
      await Reservation
        .findById(reservation._id)
        .populate("parking");

    res.status(201).json(populated);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


/* CANCEL */

router.patch(
  "/:id/cancel",
  async (req, res) => {

    try {

      const reservation =
        await Reservation.findById(
          req.params.id
        );

      if (!reservation) {

        return res.status(404).json({
          message: "Reservation not found"
        });

      }

      reservation.status =
        "cancelled";

      await reservation.save();

      await Parking.updateOne(

        {
          _id: reservation.parking,

          "slots.code":
            reservation.slotCode
        },

        {
          $set: {
            "slots.$.status":
              "available"
          }
        }

      );

      res.json(reservation);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);

export default router;
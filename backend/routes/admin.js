import express from "express";

import Parking from "../models/Parking.js";
import Reservation from "../models/reservation.js";
import Session from "../models/session.js";

const router = express.Router();


router.get("/dashboard", async (req, res) => {

  try {

    const parking =
      await Parking.find();

    const reservations =
      await Reservation.find();

    const activeSessions =
      await Session.countDocuments({
        status: "active"
      });


    let totalSlots = 0;

    let available = 0;

    let occupied = 0;

    let reserved = 0;


    parking.forEach(lot => {

      totalSlots +=
        lot.slots.length;

      lot.slots.forEach(slot => {

        if (
          slot.status ===
          "available"
        ) {
          available++;
        }

        if (
          slot.status ===
          "occupied"
        ) {
          occupied++;
        }

        if (
          slot.status ===
          "reserved"
        ) {
          reserved++;
        }

      });

    });


    const revenue =
      reservations
        .filter(
          r =>
            r.status !==
            "cancelled"
        )
        .reduce(
          (sum, r) =>
            sum + r.amount,
          0
        );


    const utilization =
      totalSlots === 0
        ? 0
        : Math.round(
            ((occupied +
              reserved) /
              totalSlots) *
              100
          );


    res.json({

      totalParking:
        parking.length,

      totalSlots,

      available,

      occupied,

      reserved,

      utilization,

      revenue,

      activeSessions

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


export default router;
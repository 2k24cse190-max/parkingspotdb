import express from "express";

import Session from "../models/session.js";
import Reservation from "../models/reservation.js";
import Parking from "../models/Parking.js";

const router = express.Router();


/* ACTIVE SESSION */

router.get("/active", async (req, res) => {

  try {

    const session =
      await Session.findOne({
        status: "active"
      })
      .populate("parking");

    res.json(session);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


/* START SESSION */

router.post(
  "/start/:reservationId",
  async (req, res) => {

    try {

      const reservation =
        await Reservation.findById(
          req.params.reservationId
        );

      if (!reservation) {

        return res.status(404).json({
          message: "Reservation not found"
        });

      }

      reservation.status =
        "active";

      await reservation.save();

      const session =
        await Session.create({

          reservation:
            reservation._id,

          parking:
            reservation.parking,

          slotCode:
            reservation.slotCode,

          vehicleNumber:
            reservation.vehicleNumber,

          entryTime:
            new Date(),

          expiryTime:
            reservation.endTime

        });

      await Parking.updateOne(

        {
          _id: reservation.parking,

          "slots.code":
            reservation.slotCode
        },

        {
          $set: {
            "slots.$.status":
              "occupied"
          }
        }

      );

      res.status(201).json(session);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);


/* EXTEND SESSION */

router.patch(
  "/:id/extend",
  async (req, res) => {

    try {

      const { minutes } = req.body;

      if (!minutes || Number(minutes) <= 0) {

        return res.status(400).json({
          message: "Invalid extension time"
        });

      }

      const session =
        await Session.findById(
          req.params.id
        );

      if (!session) {

        return res.status(404).json({
          message: "Session not found"
        });

      }

      if (session.status !== "active") {

        return res.status(400).json({
          message: "Session is not active"
        });

      }

      /* 
         IMPORTANT:
         Add the extra time to the
         EXISTING expiry time.
      */

      const currentExpiry =
        new Date(session.expiryTime);

      const newExpiry =
        new Date(
          currentExpiry.getTime() +
          Number(minutes) * 60 * 1000
        );

      session.expiryTime =
        newExpiry;

      await session.save();

      res.json({
        success: true,
        message:
          `Session extended by ${minutes} minutes`,
        data: session
      });

    } catch (error) {

      console.error(
        "Extend session error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to extend session"
      });

    }

  }
);


/* END SESSION */

router.patch(
  "/:id/end",
  async (req, res) => {

    try {

      const session =
        await Session.findById(
          req.params.id
        );

      if (!session) {

        return res.status(404).json({
          message: "Session not found"
        });

      }

      session.status =
        "completed";

      session.exitTime =
        new Date();

      await session.save();

      await Reservation.findByIdAndUpdate(
        session.reservation,
        {
          status: "completed"
        }
      );

      await Parking.updateOne(

        {
          _id: session.parking,

          "slots.code":
            session.slotCode
        },

        {
          $set: {
            "slots.$.status":
              "available"
          }
        }

      );

      res.json(session);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);


export default router;
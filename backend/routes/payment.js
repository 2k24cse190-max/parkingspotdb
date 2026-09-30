import express from "express";

import Payment from "../models/payment.js";
import Reservation from "../models/reservation.js";

const router = express.Router();


router.post("/", async (req, res) => {

  try {

    const {
      reservationId,
      method = "UPI",
      extensionAmount = 0,
      discount = 0
    } = req.body;

    const reservation =
      await Reservation.findById(
        reservationId
      );

    if (!reservation) {

      return res.status(404).json({
        message: "Reservation not found"
      });

    }

    const parkingAmount =
      reservation.amount;

    const totalAmount =
      parkingAmount +
      extensionAmount -
      discount;

    const payment =
      await Payment.create({

        reservation:
          reservation._id,

        userName:
          reservation.userName,

        parkingAmount,

        extensionAmount,

        discount,

        totalAmount,

        method,

        status: "success",

        transactionId:
          "TXN" +
          Date.now()

      });

    res.status(201).json(payment);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


router.get("/", async (req, res) => {

  const payments =
    await Payment.find()
      .populate("reservation")
      .sort({
        createdAt: -1
      });

  res.json(payments);

});


export default router;
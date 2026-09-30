import express from "express";
import Parking from "../models/Parking.js";

const router = express.Router();

/* GET ALL PARKING */

router.get("/", async (req, res) => {
  try {
    const {
      search,
      ev,
      covered
    } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },
        {
          address: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    if (ev === "true") {
      filter.evCharging = true;
    }

    if (covered === "true") {
      filter.covered = true;
    }

    const parking = await Parking.find(filter);

    res.json(parking);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});


/* GET SINGLE PARKING */

router.get("/:id", async (req, res) => {

  try {

    const parking =
      await Parking.findById(req.params.id);

    if (!parking) {

      return res.status(404).json({
        message: "Parking not found"
      });

    }

    res.json(parking);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


/* SMART SLOT RECOMMENDATION */

router.get(
  "/:id/recommend",
  async (req, res) => {

    try {

      const parking =
        await Parking.findById(req.params.id);

      if (!parking) {

        return res.status(404).json({
          message: "Parking not found"
        });

      }

      const {
        vehicleType = "SUV",
        preference = "near"
      } = req.query;

      let slots =
        parking.slots.filter(
          slot =>
            slot.status === "available"
        );

      /* VEHICLE FILTER */

      slots = slots.filter(slot =>
        slot.vehicleType === "All" ||
        slot.vehicleType === vehicleType
      );

      /* EV PREFERENCE */

      if (preference === "ev") {

        const evSlots =
          slots.filter(slot =>
            slot.evCharging
          );

        if (evSlots.length > 0) {
          slots = evSlots;
        }

      }

      if (slots.length === 0) {

        return res.status(404).json({
          message:
            "No suitable slot available"
        });

      }

      const selectedSlot = slots[0];

      res.json({

        slot: selectedSlot.code,

        reason:
          "Best available slot based on vehicle and availability",

        distanceFromEntrance:
          Math.floor(Math.random() * 30) + 5,

        estimatedPrice:
          parking.pricePerHour * 2

      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);

export default router;
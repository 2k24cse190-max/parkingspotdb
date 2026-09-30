import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import Parking from "./models/parkingspot.js";
import Reservation from "./models/reservation.js";
import Payment from "./models/payment.js";
import Session from "./models/session.js";

dotenv.config();

const app = express();


// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());
app.use(express.json());


// ==================================================
// BASIC ROUTES
// ==================================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ParkNex Backend is Running"
    });
});


app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "ParkNex API is working"
    });
});


// ==================================================
// GET ALL PARKING
// ==================================================

app.get("/api/parking", async (req, res) => {
    try {

        const parkingSpots = await Parking.find();

        res.status(200).json({
            success: true,
            count: parkingSpots.length,
            data: parkingSpots
        });

    } catch (error) {

        console.error("Error fetching parking:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch parking",
            error: error.message
        });
    }
});


// ==================================================
// SEARCH PARKING
// ==================================================

app.get("/api/parking/search", async (req, res) => {
    try {

        const { location } = req.query;

        if (!location) {
            return res.status(400).json({
                success: false,
                message: "Please provide a location"
            });
        }

        const parkingSpots = await Parking.find({
            $or: [
                {
                    name: {
                        $regex: location,
                        $options: "i"
                    }
                },
                {
                    address: {
                        $regex: location,
                        $options: "i"
                    }
                }
            ]
        });

        res.status(200).json({
            success: true,
            count: parkingSpots.length,
            data: parkingSpots
        });

    } catch (error) {

        console.error("Search error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to search parking",
            error: error.message
        });
    }
});


// ==================================================
// FILTER PARKING
// ==================================================

app.get("/api/parking/filter", async (req, res) => {
    try {

        const {
            maxPrice,
            covered,
            evCharging,
            vehicleType
        } = req.query;

        const query = {};

        if (maxPrice) {
            query.pricePerHour = {
                $lte: Number(maxPrice)
            };
        }

        if (covered !== undefined) {
            query.covered = covered === "true";
        }

        if (evCharging !== undefined) {
            query.evCharging = evCharging === "true";
        }

        if (vehicleType) {
            query.slots = {
                $elemMatch: {
                    vehicleType: {
                        $in: ["All", vehicleType]
                    },
                    status: "available"
                }
            };
        }

        const parkingSpots = await Parking.find(query);

        res.status(200).json({
            success: true,
            count: parkingSpots.length,
            data: parkingSpots
        });

    } catch (error) {

        console.error("Filter error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to filter parking",
            error: error.message
        });
    }
});


// ==================================================
// GET SINGLE PARKING
// ==================================================

app.get("/api/parking/:id", async (req, res) => {
    try {

        const parkingSpot = await Parking.findById(req.params.id);

        if (!parkingSpot) {
            return res.status(404).json({
                success: false,
                message: "Parking spot not found"
            });
        }

        res.status(200).json({
            success: true,
            data: parkingSpot
        });

    } catch (error) {

        console.error("Error fetching parking:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch parking",
            error: error.message
        });
    }
});


// ==================================================
// CREATE RESERVATION
// ==================================================

app.post("/api/reservations", async (req, res) => {

    try {

        const {
            parkingId,
            slotCode,
            userName,
            vehicleNumber,
            startTime,
            endTime,
            duration
        } = req.body;


        // ------------------------------------------
        // Check required fields
        // ------------------------------------------

        if (!parkingId || !slotCode) {

            return res.status(400).json({
                success: false,
                message: "Parking ID and slot code are required"
            });

        }


        // ------------------------------------------
        // Find parking
        // ------------------------------------------

        const parking = await Parking.findById(parkingId);

        if (!parking) {

            return res.status(404).json({
                success: false,
                message: "Parking not found"
            });

        }


        // ------------------------------------------
        // Find slot
        // ------------------------------------------

        const slot = parking.slots.find(
            (item) => item.code === slotCode
        );

        if (!slot) {

            return res.status(404).json({
                success: false,
                message: "Parking slot not found"
            });

        }


        // ------------------------------------------
        // Check availability
        // ------------------------------------------

        if (slot.status !== "available") {

            return res.status(400).json({
                success: false,
                message: `Slot ${slotCode} is not available`
            });

        }


        // ------------------------------------------
        // Calculate duration
        // ------------------------------------------

        const parkingDuration = Number(duration) || 1;


        // ------------------------------------------
        // Calculate amount
        // ------------------------------------------

        const amount =
            parking.pricePerHour * parkingDuration;


        // ------------------------------------------
        // Generate booking ID
        // ------------------------------------------

        const bookingId =
            "PNX-" + Date.now().toString().slice(-8);


        // ------------------------------------------
        // Create reservation
        // ------------------------------------------

        const reservation = new Reservation({

            parking: parkingId,

            slotCode: slotCode,

            userName: userName || "Demo User",

            vehicleNumber:
                vehicleNumber || "TN XX XX 1234",

            startTime,

            endTime,

            duration: parkingDuration,

            amount,

            status: "reserved",

            bookingId

        });


        await reservation.save();


        // ------------------------------------------
        // Change slot status
        // ------------------------------------------

        slot.status = "reserved";

        await parking.save();


        // ------------------------------------------
        // Response
        // ------------------------------------------

        res.status(201).json({

            success: true,

            message: "Parking slot reserved successfully",

            data: reservation

        });


    } catch (error) {

        console.error("Reservation Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to create reservation",

            error: error.message

        });

    }

});


// ==================================================
// GET ALL RESERVATIONS
// ==================================================

app.get("/api/reservations", async (req, res) => {

    try {

        const reservations = await Reservation
            .find()
            .populate("parking");

        res.status(200).json({

            success: true,

            count: reservations.length,

            data: reservations

        });

    } catch (error) {

        console.error("Reservation fetch error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to fetch reservations",

            error: error.message

        });

    }

});


// ==================================================
// GET SINGLE RESERVATION
// ==================================================

app.get("/api/reservations/:id", async (req, res) => {

    try {

        const reservation = await Reservation
            .findById(req.params.id)
            .populate("parking");

        if (!reservation) {

            return res.status(404).json({

                success: false,

                message: "Reservation not found"

            });

        }

        res.status(200).json({

            success: true,

            data: reservation

        });

    } catch (error) {

        console.error("Reservation error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to fetch reservation",

            error: error.message

        });

    }

});


// ==================================================
// CANCEL RESERVATION
// ==================================================

app.put("/api/reservations/:id/cancel", async (req, res) => {

    try {

        const reservation = await Reservation.findById(
            req.params.id
        );

        if (!reservation) {

            return res.status(404).json({

                success: false,

                message: "Reservation not found"

            });

        }


        if (reservation.status === "cancelled") {

            return res.status(400).json({

                success: false,

                message: "Reservation already cancelled"

            });

        }


        // ------------------------------------------
        // Find parking
        // ------------------------------------------

        const parking = await Parking.findById(
            reservation.parking
        );


        // ------------------------------------------
        // Release slot
        // ------------------------------------------

        if (parking) {

            const slot = parking.slots.find(
                (item) =>
                    item.code === reservation.slotCode
            );

            if (slot) {

                slot.status = "available";

                await parking.save();

            }
        }


        // ------------------------------------------
        // Update reservation
        // ------------------------------------------

        reservation.status = "cancelled";

        await reservation.save();


        res.status(200).json({

            success: true,

            message: "Reservation cancelled successfully",

            data: reservation

        });


    } catch (error) {

        console.error("Cancel error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to cancel reservation",

            error: error.message

        });

    }

});
// ==================================================
// CREATE PAYMENT
// ==================================================

app.post("/api/payments", async (req, res) => {

    try {

        const {
            reservationId,
            method,
            extensionAmount,
            discount
        } = req.body;


        // ------------------------------------------
        // Check reservation
        // ------------------------------------------

        if (!reservationId) {

            return res.status(400).json({
                success: false,
                message: "Reservation ID is required"
            });

        }


        // ------------------------------------------
        // Find reservation
        // ------------------------------------------

        const reservation = await Reservation.findById(
            reservationId
        );

        if (!reservation) {

            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });

        }


        // ------------------------------------------
        // Calculate payment
        // ------------------------------------------

        const parkingAmount = Number(
            reservation.amount || 0
        );

        const extraAmount = Number(
            extensionAmount || 0
        );

        const discountAmount = Number(
            discount || 0
        );

        const totalAmount =
            parkingAmount +
            extraAmount -
            discountAmount;


        // ------------------------------------------
        // Create transaction ID
        // ------------------------------------------

        const transactionId =
            "TXN" + Date.now();


        // ------------------------------------------
        // Create payment
        // ------------------------------------------

        const payment = new Payment({

            reservation: reservationId,

            userName:
                reservation.userName || "Demo User",

            parkingAmount,

            extensionAmount: extraAmount,

            discount: discountAmount,

            totalAmount,

            method: method || "UPI",

            status: "success",

            transactionId

        });


        await payment.save();


        // ------------------------------------------
        // Response
        // ------------------------------------------

        res.status(201).json({

            success: true,

            message: "Payment successful",

            data: payment

        });


    } catch (error) {

        console.error(
            "Payment Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Payment failed",

            error: error.message

        });

    }

});
// ==================================================
// GET ACTIVE PARKING SESSION
// ==================================================

app.get("/api/sessions/active", async (req, res) => {

    try {

        const session = await Session
            .findOne({ status: "active" })
            .populate("parking")
            .populate("reservation");

        if (!session) {

            return res.status(200).json({
                success: true,
                data: null
            });

        }

        res.status(200).json({
            success: true,
            data: session
        });

    } catch (error) {

        console.error(
            "Active session error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch active session",
            error: error.message
        });

    }

});


// ==================================================
// START PARKING SESSION
// ==================================================

app.post(
    "/api/sessions/start/:reservationId",
    async (req, res) => {

        try {

            const reservation =
                await Reservation.findById(
                    req.params.reservationId
                );

            if (!reservation) {

                return res.status(404).json({
                    success: false,
                    message: "Reservation not found"
                });

            }

            if (
                reservation.status === "cancelled"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Cancelled reservation cannot start a session"
                });

            }

            // Check if this reservation already has
            // an active session

            const existingSession =
                await Session.findOne({
                    reservation: reservation._id,
                    status: "active"
                });

            if (existingSession) {

                const populatedSession =
                    await Session
                        .findById(existingSession._id)
                        .populate("parking")
                        .populate("reservation");

                return res.status(200).json({
                    success: true,
                    message:
                        "Parking session already active",
                    data: populatedSession
                });

            }

            // Entry time

            const entryTime = new Date();

            // Reservation duration in hours

            const duration =
                Number(reservation.duration) || 1;

            // Calculate expiry time

            const expiryTime =
                new Date(
                    entryTime.getTime() +
                    duration * 60 * 60 * 1000
                );

            // Create session

            const session = new Session({

                reservation:
                    reservation._id,

                parking:
                    reservation.parking,

                slotCode:
                    reservation.slotCode,

                vehicleNumber:
                    reservation.vehicleNumber,

                entryTime,

                expiryTime,

                status: "active"

            });

            await session.save();

            // Update reservation

            reservation.status = "active";

            await reservation.save();

            // Populate session

            const populatedSession =
                await Session
                    .findById(session._id)
                    .populate("parking")
                    .populate("reservation");

            res.status(201).json({

                success: true,

                message:
                    "Parking session started successfully",

                data:
                    populatedSession

            });

        } catch (error) {

            console.error(
                "Start session error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to start parking session",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// END PARKING SESSION
// ==================================================

app.patch(
    "/api/sessions/:id/end",
    async (req, res) => {

        try {

            const session =
                await Session.findById(
                    req.params.id
                );

            if (!session) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Parking session not found"

                });

            }

            if (
                session.status === "completed"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Parking session already completed"

                });

            }

            // End session

            session.status = "completed";

            session.exitTime = new Date();

            await session.save();


            // Update reservation

            const reservation =
                await Reservation.findById(
                    session.reservation
                );

            if (reservation) {

                reservation.status = "completed";

                await reservation.save();

            }


            // Release parking slot

            const parking =
                await Parking.findById(
                    session.parking
                );

            if (parking) {

                const slot =
                    parking.slots.find(
                        (item) =>
                            item.code ===
                            session.slotCode
                    );

                if (slot) {

                    slot.status = "available";

                    await parking.save();

                }

            }


            // Get updated session

            const populatedSession =
                await Session
                    .findById(session._id)
                    .populate("parking")
                    .populate("reservation");


            res.status(200).json({

                success: true,

                message:
                    "Parking session ended successfully",

                data:
                    populatedSession

            });

        } catch (error) {

            console.error(
                "End session error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to end parking session",

                error:
                    error.message

            });

        }

    }
);

// ==================================================
// 404 ROUTE
// ==================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message:
            `Route ${req.method} ${req.originalUrl} not found`

    });

});


// ==================================================
// MONGODB CONNECTION
// ==================================================

const PORT = process.env.PORT || 5000;


mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log("=================================");
        console.log("MongoDB Connected Successfully");
        console.log("=================================");

        app.listen(PORT, () => {

            console.log(
                `ParkNex Server running on port ${PORT}`
            );

            console.log(
                `http://localhost:${PORT}`
            );

        });

    })

    .catch((error) => {

        console.error(
            "MongoDB Connection Failed:"
        );

        console.error(error.message);

    });
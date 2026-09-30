import mongoose from "mongoose";
import dotenv from "dotenv";
import Parking from "./models/parkingspot.js";

dotenv.config();

const parkingData = [
    {
        name: "Phoenix Marketcity Parking",
        address: "Velachery, Chennai",
        latitude: 12.9916,
        longitude: 80.2181,
        distance: 2.1,
        rating: 4.5,
        pricePerHour: 40,
        totalSlots: 20,
        covered: true,
        evCharging: true,
        image: "",
        slots: [
            {
                code: "A01",
                status: "available",
                vehicleType: "All",
                evCharging: false
            },
            {
                code: "A02",
                status: "available",
                vehicleType: "SUV",
                evCharging: false
            },
            {
                code: "A03",
                status: "available",
                vehicleType: "Sedan",
                evCharging: true
            },
            {
                code: "A04",
                status: "occupied",
                vehicleType: "All",
                evCharging: false
            },
            {
                code: "A05",
                status: "available",
                vehicleType: "Bike",
                evCharging: false
            }
        ]
    },

    {
        name: "T Nagar Smart Parking",
        address: "T Nagar, Chennai",
        latitude: 13.0418,
        longitude: 80.2341,
        distance: 3.5,
        rating: 4.2,
        pricePerHour: 30,
        totalSlots: 15,
        covered: false,
        evCharging: true,
        image: "",
        slots: [
            {
                code: "B01",
                status: "available",
                vehicleType: "All",
                evCharging: true
            },
            {
                code: "B02",
                status: "reserved",
                vehicleType: "Sedan",
                evCharging: false
            },
            {
                code: "B03",
                status: "available",
                vehicleType: "SUV",
                evCharging: false
            },
            {
                code: "B04",
                status: "occupied",
                vehicleType: "Bike",
                evCharging: false
            }
        ]
    },

    {
        name: "Anna Nagar Parking Hub",
        address: "Anna Nagar, Chennai",
        latitude: 13.0850,
        longitude: 80.2101,
        distance: 5.2,
        rating: 4.6,
        pricePerHour: 35,
        totalSlots: 25,
        covered: true,
        evCharging: true,
        image: "",
        slots: [
            {
                code: "C01",
                status: "available",
                vehicleType: "All",
                evCharging: false
            },
            {
                code: "C02",
                status: "available",
                vehicleType: "SUV",
                evCharging: true
            },
            {
                code: "C03",
                status: "occupied",
                vehicleType: "Sedan",
                evCharging: false
            },
            {
                code: "C04",
                status: "available",
                vehicleType: "Bike",
                evCharging: false
            },
            {
                code: "C05",
                status: "available",
                vehicleType: "All",
                evCharging: false
            }
        ]
    }
];

const seedDatabase = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Parking.deleteMany();

        await Parking.insertMany(parkingData);

        console.log("Parking data inserted successfully");

        await mongoose.connection.close();

        console.log("Database connection closed");

    } catch (error) {

        console.error("Error:", error.message);

        process.exit(1);
    }
};

seedDatabase();
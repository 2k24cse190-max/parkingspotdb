import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Car
} from "lucide-react";

import SlotGrid from "../components/SlotGrid";

function Booking() {

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const parkingId = searchParams.get("parking");

  const [selectedSlot, setSelectedSlot] = useState(null);

  const [date, setDate] = useState("");

  const [startTime, setStartTime] = useState("10:00");

  const [duration, setDuration] = useState("2");

  const [parking, setParking] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =================================
  // GET REAL PARKING FROM BACKEND
  // =================================

  useEffect(() => {

    if (!parkingId) {

      setError("Parking location not selected.");

      setLoading(false);

      return;
    }

    fetch(`http://localhost:5000/api/parking/${parkingId}`)

      .then((response) => {

        if (!response.ok) {

          throw new Error("Parking not found");

        }

        return response.json();

      })

      .then((result) => {

        console.log(
          "Booking parking data:",
          result
        );

        const parkingData =
          result.data || result;

        setParking(parkingData);

        setLoading(false);

      })

      .catch((error) => {

        console.error(error);

        setError(
          "Unable to load parking details."
        );

        setLoading(false);

      });

  }, [parkingId]);


  // =================================
  // TOTAL AMOUNT
  // =================================

  const totalAmount =
    parking
      ? parking.pricePerHour * Number(duration)
      : 0;


  // =================================
  // CONTINUE TO PAYMENT
  // =================================

  const handleContinue = async () => {

    if (!selectedSlot) {

      alert(
        "Please select a parking slot."
      );

      return;
    }

    if (!date) {

      alert(
        "Please select a parking date."
      );

      return;
    }


    try {

      // Create start date/time

      const startDateTime =
        `${date}T${startTime}:00`;


      // Calculate end time

      const start =
        new Date(startDateTime);

      const end =
        new Date(
          start.getTime() +
          Number(duration) *
          60 *
          60 *
          1000
        );


      const endDateTime =
        end.toISOString();


      // =================================
      // CREATE RESERVATION
      // =================================

      const response = await fetch(
        "http://localhost:5000/api/reservations",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            parkingId: parkingId,

            slotCode: selectedSlot,

            userName: "Demo User",

            vehicleNumber:
              "TN XX XX 1234",

            startTime:
              startDateTime,

            endTime:
              endDateTime

          })
        }
      );


      const result =
        await response.json();


      console.log(
        "Reservation response:",
        result
      );


      if (!response.ok) {

        alert(
          result.message ||
          "Unable to create reservation."
        );

        return;

      }


      // =================================
      // RESERVATION CREATED
      // =================================

      const reservation =
        result.data || result;


      // =================================
      // GO TO PAYMENT
      // =================================

      navigate(
        `/payment?reservationId=${reservation._id}` +
        `&parking=${parkingId}` +
        `&slot=${selectedSlot}` +
        `&date=${date}` +
        `&time=${startTime}` +
        `&duration=${duration}`
      );


    } catch (error) {

      console.error(
        "Reservation error:",
        error
      );

      alert(
        "Unable to connect to booking server."
      );

    }

  };


  // =================================
  // LOADING
  // =================================

  if (loading) {

    return (

      <div className="booking-page">

        <h2>
          Loading parking details...
        </h2>

      </div>

    );

  }


  // =================================
  // ERROR
  // =================================

  if (error || !parking) {

    return (

      <div className="booking-page">

        <h2>
          {error || "Parking not found"}
        </h2>

        <Link to="/find-parking">
          Back to parking
        </Link>

      </div>

    );

  }


  // =================================
  // MAIN PAGE
  // =================================

  return (

    <div className="booking-page">


      {/* =================================
          BACK
      ================================= */}

      <Link
        to="/find-parking"
        className="back-link"
      >

        <ArrowLeft size={17} />

        Back to parking

      </Link>


      {/* =================================
          HEADER
      ================================= */}

      <div className="booking-header">

        <div>

          <span className="section-label">

            RESERVE YOUR SPACE

          </span>

          <h1>

            Book your parking slot

          </h1>

          <p>

            Choose your date, time and preferred
            parking slot.

          </p>

        </div>

      </div>


      {/* =================================
          MAIN
      ================================= */}

      <div className="booking-layout">


        {/* =================================
            LEFT
        ================================= */}

        <div className="booking-main">


          {/* Parking Information */}

          <div className="booking-card parking-summary">


            <div className="booking-parking-icon">

              <MapPin size={25} />

            </div>


            <div className="parking-summary-content">


              <h2>

                {parking.name}

              </h2>


              <p>

                <MapPin size={14} />

                {parking.address}

              </p>


              <div className="summary-meta">


                <span>

                  <Star
                    size={14}
                    fill="currentColor"
                  />

                  {parking.rating}

                </span>


                <span>

                  <Car size={14} />

                  {parking.slots
                    ? parking.slots.filter(
                        (slot) =>
                          slot.status ===
                          "available"
                      ).length
                    : 0
                  }{" "}
                  spots

                </span>


                <span>

                  <Clock size={14} />

                  Open 24 hours

                </span>


              </div>

            </div>

          </div>


          {/* Date & Time */}

          <div className="booking-card">


            <div className="booking-card-title">


              <div className="title-icon">

                <CalendarDays size={19} />

              </div>


              <div>

                <h3>

                  Select date & time

                </h3>

                <p>

                  When will you park?

                </p>

              </div>

            </div>


            <div className="booking-fields">


              <div className="booking-field">

                <label>

                  Parking date

                </label>


                <input
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="booking-field">

                <label>

                  Start time

                </label>


                <input
                  type="time"
                  value={startTime}
                  onChange={(event) =>
                    setStartTime(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="booking-field">

                <label>

                  Duration

                </label>


                <select
                  value={duration}
                  onChange={(event) =>
                    setDuration(
                      event.target.value
                    )
                  }
                >

                  <option value="1">
                    1 hour
                  </option>

                  <option value="2">
                    2 hours
                  </option>

                  <option value="3">
                    3 hours
                  </option>

                  <option value="4">
                    4 hours
                  </option>

                  <option value="5">
                    5 hours
                  </option>

                  <option value="6">
                    6 hours
                  </option>

                </select>

              </div>

            </div>

          </div>


          {/* Slot Selection */}

          <div className="booking-card">


            <div className="booking-card-title">


              <div className="title-icon">

                <Car size={19} />

              </div>


              <div>

                <h3>

                  Choose your parking slot

                </h3>

                <p>

                  Select an available slot below.

                </p>

              </div>

            </div>


            <SlotGrid
  slots={parking.slots}
  onSlotSelect={setSelectedSlot}
/>


            {selectedSlot && (

              <div className="selected-slot-message">


                <div>

                  <strong>

                    Slot {selectedSlot}

                  </strong>


                  <span>

                    Your selected parking space

                  </span>

                </div>


                <span className="selected-check">

                  ✓

                </span>

              </div>

            )}

          </div>

        </div>


        {/* =================================
            RIGHT SUMMARY
        ================================= */}

        <aside className="booking-sidebar">


          <div className="booking-summary-card">


            <div className="summary-heading">


              <h3>

                Booking summary

              </h3>


              <span>

                #{parkingId || "001"}

              </span>

            </div>


            <div className="summary-location">


              <div className="summary-location-icon">

                <MapPin size={18} />

              </div>


              <div>

                <strong>

                  {parking.name}

                </strong>


                <span>

                  {parking.address}

                </span>

              </div>

            </div>


            <div className="summary-details">


              <div>

                <span>

                  Date

                </span>


                <strong>

                  {date ||
                    "Select date"}

                </strong>

              </div>


              <div>

                <span>

                  Start time

                </span>


                <strong>

                  {startTime}

                </strong>

              </div>


              <div>

                <span>

                  Duration

                </span>


                <strong>

                  {duration} hour
                  {Number(duration) > 1
                    ? "s"
                    : ""}

                </strong>

              </div>


              <div>

                <span>

                  Parking slot

                </span>


                <strong>

                  {selectedSlot ||
                    "Not selected"}

                </strong>

              </div>

            </div>


            <div className="summary-price">


              <span>

                Parking fee

              </span>


              <strong>

                ₹{totalAmount}

              </strong>

            </div>


            <div className="secure-booking">


              <ShieldCheck size={17} />


              <span>

                Secure booking

              </span>

            </div>


            <button
              className="continue-button"
              onClick={handleContinue}
            >

              Continue to Payment

              <ArrowRight size={18} />

            </button>

          </div>

        </aside>

      </div>

    </div>

  );

}

export default Booking;
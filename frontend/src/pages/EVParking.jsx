import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function EVParking() {
  const [parkingData, setParkingData] = useState([]);
  const [selectedCharger, setSelectedCharger] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ==========================================
  // FETCH REAL PARKING DATA
  // ==========================================

  useEffect(() => {
    const fetchParking = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:5000/api/parking"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch parking data");
        }

        const result = await response.json();

        setParkingData(result.data || []);
      } catch (err) {
        console.error("EV parking fetch error:", err);

        setError(
          "Unable to load EV parking data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchParking();
  }, []);

  // ==========================================
  // GET ALL EV SLOTS
  // ==========================================

  const chargers = parkingData.flatMap((parking) => {
    const evSlots =
      parking.slots?.filter(
        (slot) => slot.evCharging === true
      ) || [];

    return evSlots.map((slot) => ({
      id: slot.code,
      parkingId: parking._id,
      parkingName: parking.name,
      location: parking.address,
      status:
        slot.status === "available"
          ? "Available"
          : slot.status === "occupied"
          ? "Occupied"
          : "Reserved",
      price: parking.pricePerHour,
      evCharging: slot.evCharging,
    }));
  });

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalStations = chargers.length;

  const availableStations = chargers.filter(
    (charger) =>
      charger.status === "Available"
  ).length;

  const occupiedStations = chargers.filter(
    (charger) =>
      charger.status !== "Available"
  ).length;

  const prices = chargers.map(
    (charger) => charger.price
  );

  const startingPrice =
    prices.length > 0
      ? Math.min(...prices)
      : 0;

  // ==========================================
  // RESERVE / VIEW PARKING
  // ==========================================

  const handleReserve = (charger) => {
    setSelectedCharger(charger);
  };

  const closeReservation = () => {
    setSelectedCharger(null);
  };

  const handleContinue = () => {
    if (!selectedCharger) {
      return;
    }

    // Existing booking system can reserve
    // the parking slot through Booking.jsx
    navigate(
      `/booking?parking=${selectedCharger.parkingId}`
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="ev-page">
        <div style={{ padding: "30px" }}>
          Loading EV parking stations...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="ev-page">
        <div
          style={{
            padding: "30px",
            color: "red",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="ev-page">

      {/* Header */}

      <div className="ev-header">

        <div>

          <p className="page-label">
            PARKNEX EV SERVICES
          </p>

          <h1>
            EV Parking & Charging
          </h1>

          <p>
            Find available EV-enabled parking slots
            and reserve your parking space.
          </p>

        </div>

        <Link
          to="/find-parking"
          className="ev-back-btn"
        >
          Find Parking
        </Link>

      </div>


      {/* Summary */}

      <div className="ev-summary">

        <div className="ev-summary-card">

          <span className="ev-summary-icon">
            ⚡
          </span>

          <div>

            <span>
              Charging Stations
            </span>

            <strong>
              {totalStations}
            </strong>

          </div>

        </div>


        <div className="ev-summary-card">

          <span className="ev-summary-icon available">
            ✓
          </span>

          <div>

            <span>
              Available Now
            </span>

            <strong>
              {availableStations}
            </strong>

          </div>

        </div>


        <div className="ev-summary-card">

          <span className="ev-summary-icon occupied">
            ●
          </span>

          <div>

            <span>
              Currently Unavailable
            </span>

            <strong>
              {occupiedStations}
            </strong>

          </div>

        </div>


        <div className="ev-summary-card">

          <span className="ev-summary-icon">
            ₹
          </span>

          <div>

            <span>
              Parking Starting Price
            </span>

            <strong>
              ₹{startingPrice}/hr
            </strong>

          </div>

        </div>

      </div>


      {/* Charger List */}

      <div className="ev-section-header">

        <div>

          <h2>
            Available Charging Stations
          </h2>

          <p>
            EV-enabled parking slots from the
            parking system.
          </p>

        </div>

      </div>


      {chargers.length === 0 ? (

        <div style={{ padding: "30px" }}>
          No EV charging stations are currently
          available.
        </div>

      ) : (

        <div className="charger-grid">

          {chargers.map((charger) => (

            <div
              className="charger-card"
              key={`${charger.parkingId}-${charger.id}`}
            >

              <div className="charger-top">

                <div className="charger-icon">
                  ⚡
                </div>

                <span
                  className={`charger-status ${
                    charger.status.toLowerCase()
                  }`}
                >
                  {charger.status}
                </span>

              </div>


              <h3>
                {charger.id}
              </h3>


              <p className="charger-location">
                📍 {charger.parkingName}
              </p>


              <p className="charger-location">
                {charger.location}
              </p>


              <div className="charger-details">

                <div>

                  <span>
                    EV Charging
                  </span>

                  <strong>
                    Supported
                  </strong>

                </div>


                <div>

                  <span>
                    Slot
                  </span>

                  <strong>
                    {charger.id}
                  </strong>

                </div>


                <div>

                  <span>
                    Parking Price
                  </span>

                  <strong>
                    ₹{charger.price}/hr
                  </strong>

                </div>


                <div>

                  <span>
                    Status
                  </span>

                  <strong>
                    {charger.status}
                  </strong>

                </div>

              </div>


              <button
                className="reserve-charger-btn"
                disabled={
                  charger.status !== "Available"
                }
                onClick={() =>
                  handleReserve(charger)
                }
              >

                {charger.status === "Available"
                  ? "Reserve EV Slot"
                  : charger.status}

              </button>

            </div>

          ))}

        </div>

      )}


      {/* Reservation Modal */}

      {selectedCharger && (

        <div className="ev-modal-overlay">

          <div className="ev-modal">

            <button
              className="ev-close-btn"
              onClick={closeReservation}
            >
              ×
            </button>


            <div className="ev-modal-icon">
              ⚡
            </div>


            <h2>
              Reserve EV Parking
            </h2>


            <p>
              You selected EV-enabled slot{" "}
              <strong>
                {selectedCharger.id}
              </strong>.
            </p>


            <div className="reservation-details">

              <div>

                <span>
                  Parking
                </span>

                <strong>
                  {selectedCharger.parkingName}
                </strong>

              </div>


              <div>

                <span>
                  EV Slot
                </span>

                <strong>
                  {selectedCharger.id}
                </strong>

              </div>


              <div>

                <span>
                  EV Charging
                </span>

                <strong>
                  Supported
                </strong>

              </div>


              <div>

                <span>
                  Parking Price
                </span>

                <strong>
                  ₹{selectedCharger.price}/hr
                </strong>

              </div>

            </div>


            <button
              className="confirm-reservation-btn"
              onClick={handleContinue}
            >
              Continue to Booking
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default EVParking;
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Valet() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");
  const [pickupLocation, setPickupLocation] = useState("Main Entrance");
  const [requested, setRequested] = useState(false);

  const handleRequest = () => {
    if (!vehicleNumber.trim()) {
      alert("Please enter your vehicle number.");
      return;
    }

    setRequested(true);
  };

  const cancelRequest = () => {
    setRequested(false);
  };

  return (
    <div className="valet-page">

      {/* Header */}
      <div className="valet-header">
        <div>
          <p className="page-label">PARKINGSPOT SERVICE</p>
          <h1>Valet Parking</h1>
          <p>
            Request a valet and get your vehicle parked conveniently.
          </p>
        </div>

        <Link to="/find-parking" className="valet-back-btn">
          Find Parking
        </Link>
      </div>

      {!requested ? (
        <div className="valet-layout">

          {/* Request Card */}
          <div className="valet-request-card">
            <div className="valet-icon">🚗</div>

            <h2>Request a Valet</h2>
            <p className="valet-description">
              Enter your vehicle details and choose where you want
              to hand over your vehicle.
            </p>

            <div className="valet-form">

              <div className="form-group">
                <label>Vehicle Number</label>
                <input
                  type="text"
                  placeholder="e.g. TN 38 AB 1234"
                  value={vehicleNumber}
                  onChange={(e) =>
                    setVehicleNumber(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Vehicle Type</label>

                <select
                  value={vehicleType}
                  onChange={(e) =>
                    setVehicleType(e.target.value)
                  }
                >
                  <option>Car</option>
                  <option>Bike</option>
                  <option>SUV</option>
                  <option>Electric Car</option>
                </select>
              </div>

              <div className="form-group">
                <label>Pickup Location</label>

                <select
                  value={pickupLocation}
                  onChange={(e) =>
                    setPickupLocation(e.target.value)
                  }
                >
                  <option>Main Entrance</option>
                  <option>North Entrance</option>
                  <option>South Entrance</option>
                  <option>Hotel Entrance</option>
                </select>
              </div>

              <button
                className="request-valet-btn"
                onClick={handleRequest}
              >
                Request Valet
              </button>

            </div>
          </div>

          {/* Information */}
          <div className="valet-info-section">

            <div className="valet-info-card">
              <span>⏱️</span>
              <div>
                <h3>Quick Pickup</h3>
                <p>
                  Your valet will arrive at the selected pickup
                  location.
                </p>
              </div>
            </div>

            <div className="valet-info-card">
              <span>🔐</span>
              <div>
                <h3>Secure Parking</h3>
                <p>
                  Your vehicle is assigned to a secure parking
                  location.
                </p>
              </div>
            </div>

            <div className="valet-info-card">
              <span>📱</span>
              <div>
                <h3>Live Status</h3>
                <p>
                  Track the status of your valet request from
                  ParkNex.
                </p>
              </div>
            </div>

          </div>
        </div>
      ) : (

        /* Active Request */
        <div className="valet-active-wrapper">

          <div className="valet-active-card">

            <div className="success-icon">
              ✓
            </div>

            <h2>Valet Request Confirmed</h2>

            <p>
              Your valet has been requested successfully.
            </p>

            <div className="valet-status">

              <div className="status-step completed">
                <span>✓</span>
                <div>
                  <strong>Request Received</strong>
                  <small>Your request has been received.</small>
                </div>
              </div>

              <div className="status-line"></div>

              <div className="status-step active">
                <span>2</span>
                <div>
                  <strong>Valet Assigned</strong>
                  <small>Searching for an available valet.</small>
                </div>
              </div>

              <div className="status-line"></div>

              <div className="status-step">
                <span>3</span>
                <div>
                  <strong>Vehicle Picked Up</strong>
                  <small>Valet will collect your vehicle.</small>
                </div>
              </div>

              <div className="status-line"></div>

              <div className="status-step">
                <span>4</span>
                <div>
                  <strong>Vehicle Parked</strong>
                  <small>Your vehicle will be parked safely.</small>
                </div>
              </div>

            </div>

            <div className="valet-details">

              <div>
                <span>Vehicle</span>
                <strong>{vehicleNumber}</strong>
              </div>

              <div>
                <span>Type</span>
                <strong>{vehicleType}</strong>
              </div>

              <div>
                <span>Pickup</span>
                <strong>{pickupLocation}</strong>
              </div>

              <div>
                <span>Estimated Wait</span>
                <strong>5–10 min</strong>
              </div>

            </div>

            <button
              className="cancel-valet-btn"
              onClick={cancelRequest}
            >
              Cancel Request
            </button>

          </div>

        </div>
      )}
    </div>
  );
}

export default Valet;
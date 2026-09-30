import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Zap,
  Car,
  ShieldCheck,
  Clock,
  Check,
  X,
} from "lucide-react";

function Compare() {
  const [parkingData, setParkingData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch parking data from backend
  useEffect(() => {
    const fetchParking = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/parking");

        if (!response.ok) {
          throw new Error("Failed to fetch parking data");
        }

        const result = await response.json();

        const parkingList = result.data || result;

        const formattedData = parkingList.map((parking) => {
          const availableSlots = (parking.slots || []).filter(
            (slot) => slot.status === "available"
          ).length;

          const hasEV = (parking.slots || []).some(
            (slot) => slot.evCharging === true
          );

          return {
            id: parking._id,
            name: parking.name,
            location: parking.address || "Location unavailable",
            distance:
              parking.distance !== undefined
                ? `${parking.distance} km`
                : "N/A",
            price: parking.pricePerHour,
            slots: availableSlots,
            rating: parking.rating || 0,
            security: null,
            ev: parking.evCharging || hasEV,
            valet: null,
            hours: "Operating hours not available",
          };
        });

        setParkingData(formattedData);
      } catch (err) {
        console.error(err);
        setError("Unable to load parking locations.");
      } finally {
        setLoading(false);
      }
    };

    fetchParking();
  }, []);

  const toggleParking = (parking) => {
    if (selected.some((item) => item.id === parking.id)) {
      setSelected(
        selected.filter((item) => item.id !== parking.id)
      );
      return;
    }

    if (selected.length >= 3) {
      alert("You can compare up to 3 parking locations.");
      return;
    }

    setSelected([...selected, parking]);
  };

  return (
    <div className="compare-page">

      {/* Header */}
      <div className="compare-header">

        <div>
          <p className="page-label">PARKINGSPOT SMART PARKING</p>

          <h1>Compare Parking</h1>

          <p>
            Compare parking locations and choose the one that
            fits your needs.
          </p>
        </div>

        <Link
          to="/find-parking"
          className="compare-find-btn"
        >
          Find Parking
        </Link>

      </div>

      {/* Selection Info */}
      <div className="compare-selection-bar">

        <div>
          <strong>
            {selected.length} parking location
            {selected.length !== 1 ? "s" : ""} selected
          </strong>

          <span>
            Select up to 3 locations to compare
          </span>
        </div>

        {selected.length > 0 && (
          <button
            className="clear-selection-btn"
            onClick={() => setSelected([])}
          >
            Clear Selection
          </button>
        )}

      </div>

      {/* Loading */}
      {loading && (
        <div className="page-placeholder">
          <h2>Loading parking locations...</h2>
          <p>Please wait while we fetch the latest parking data.</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="page-placeholder">
          <h2>Unable to load parking</h2>
          <p>{error}</p>
        </div>
      )}

      {/* Parking Cards */}
      {!loading && !error && (
        <div className="compare-grid">

          {parkingData.map((parking) => {

            const isSelected = selected.some(
              (item) => item.id === parking.id
            );

            return (
              <div
                className={`compare-card ${
                  isSelected ? "selected" : ""
                }`}
                key={parking.id}
              >

                {/* Card Header */}
                <div className="compare-card-header">

                  <div className="compare-location-icon">
                    <MapPin size={21} />
                  </div>

                  <div className="compare-rating">
                    <Star size={15} fill="currentColor" />
                    {parking.rating}
                  </div>

                </div>

                <h2>{parking.name}</h2>

                <p className="compare-location">
                  {parking.location}
                </p>

                {/* Basic Info */}
                <div className="compare-basic-info">

                  <div>
                    <span>Distance</span>
                    <strong>{parking.distance}</strong>
                  </div>

                  <div>
                    <span>Price</span>
                    <strong>₹{parking.price}/hr</strong>
                  </div>

                  <div>
                    <span>Available</span>
                    <strong>{parking.slots} slots</strong>
                  </div>

                </div>

                {/* Features */}
                <div className="compare-features">

                  {/* Security */}
                  <div>
                    <ShieldCheck size={17} />
                    <span>Security</span>

                    {parking.security === true ? (
                      <Check
                        className="feature-check"
                        size={17}
                      />
                    ) : parking.security === false ? (
                      <X
                        className="feature-cross"
                        size={17}
                      />
                    ) : (
                      <span>—</span>
                    )}
                  </div>

                  {/* EV Charging */}
                  <div>
                    <Zap size={17} />
                    <span>EV Charging</span>

                    {parking.ev ? (
                      <Check
                        className="feature-check"
                        size={17}
                      />
                    ) : (
                      <X
                        className="feature-cross"
                        size={17}
                      />
                    )}
                  </div>

                  {/* Valet */}
                  <div>
                    <Car size={17} />
                    <span>Valet</span>

                    {parking.valet === true ? (
                      <Check
                        className="feature-check"
                        size={17}
                      />
                    ) : parking.valet === false ? (
                      <X
                        className="feature-cross"
                        size={17}
                      />
                    ) : (
                      <span>—</span>
                    )}
                  </div>

                  {/* Operating Hours */}
                  <div>
                    <Clock size={17} />
                    <span>{parking.hours}</span>
                  </div>

                </div>

                {/* Actions */}
                <div className="compare-actions">

                  <button
                    className={`compare-select-btn ${
                      isSelected ? "selected-btn" : ""
                    }`}
                    onClick={() => toggleParking(parking)}
                  >
                    {isSelected ? (
                      <>
                        <Check size={16} />
                        Selected
                      </>
                    ) : (
                      "Compare"
                    )}
                  </button>

                  <Link
                    to={`/booking?parking=${parking.id}`}
                    className="compare-book-btn"
                  >
                    Book Now
                  </Link>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* No parking */}
      {!loading && !error && parkingData.length === 0 && (
        <div className="page-placeholder">
          <h2>No parking locations found</h2>
          <p>No parking data is currently available.</p>
        </div>
      )}

      {/* Comparison Table */}
      {selected.length >= 2 && (
        <div className="comparison-result">

          <div className="comparison-result-header">
            <div>
              <h2>Parking Comparison</h2>
              <p>
                Side-by-side comparison of your selected
                locations.
              </p>
            </div>
          </div>

          <div className="comparison-table-wrapper">

            <table className="comparison-table">

              <thead>
                <tr>
                  <th>Feature</th>

                  {selected.map((parking) => (
                    <th key={parking.id}>
                      {parking.name}
                    </th>
                  ))}

                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>Distance</td>

                  {selected.map((parking) => (
                    <td key={parking.id}>
                      {parking.distance}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Price / Hour</td>

                  {selected.map((parking) => (
                    <td key={parking.id}>
                      ₹{parking.price}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Available Slots</td>

                  {selected.map((parking) => (
                    <td key={parking.id}>
                      {parking.slots}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Rating</td>

                  {selected.map((parking) => (
                    <td key={parking.id}>
                      ⭐ {parking.rating}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Security</td>

                  {selected.map((parking) => (
                    <td key={parking.id}>
                      {parking.security === true
                        ? "✓ Available"
                        : parking.security === false
                        ? "✕ No"
                        : "— Not Available"}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>EV Charging</td>

                  {selected.map((parking) => (
                    <td key={parking.id}>
                      {parking.ev
                        ? "✓ Available"
                        : "✕ No"}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Valet</td>

                  {selected.map((parking) => (
                    <td key={parking.id}>
                      {parking.valet === true
                        ? "✓ Available"
                        : parking.valet === false
                        ? "✕ No"
                        : "— Not Available"}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Operating Hours</td>

                  {selected.map((parking) => (
                    <td key={parking.id}>
                      {parking.hours}
                    </td>
                  ))}
                </tr>

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}

export default Compare;
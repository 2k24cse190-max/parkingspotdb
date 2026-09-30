import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

const getColor = (demand) => {
  if (demand === "High") return "#ef4444";
  if (demand === "Medium") return "#f59e0b";
  return "#22c55e";
};

function Heatmap() {
  const [period, setPeriod] = useState("Today");

  // Backend parking data
  const [parkingData, setParkingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get real parking data
  useEffect(() => {
    const fetchParking = async () => {
      try {
        setLoading(true);

        const response = await fetch(
  `${import.meta.env.VITE_API_URL}/parking`
);

        if (!response.ok) {
          throw new Error("Failed to fetch parking data");
        }

        const result = await response.json();

        setParkingData(result.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load parking data");
      } finally {
        setLoading(false);
      }
    };

    fetchParking();
  }, []);

  // Convert backend parking data into heatmap data
  const hotspots = parkingData
    .map((parking) => {
      const lat = Number(parking.latitude);
      const lng = Number(parking.longitude);

      // Ignore parking locations without valid coordinates
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null;
      }

      const totalSlots =
        parking.slots?.length || parking.totalSlots || 0;

      const availableSlots =
        parking.slots?.filter(
          (slot) => slot.status === "available"
        ).length || 0;

      const reservedSlots =
        parking.slots?.filter(
          (slot) => slot.status === "reserved"
        ).length || 0;

      const occupiedSlots =
        parking.slots?.filter(
          (slot) => slot.status === "occupied"
        ).length || 0;

      const usedSlots = reservedSlots + occupiedSlots;

      const occupancy =
        totalSlots > 0
          ? Math.round((usedSlots / totalSlots) * 100)
          : 0;

      // Determine demand
      let demand = "Low";

      if (occupancy >= 80) {
        demand = "High";
      } else if (occupancy >= 50) {
        demand = "Medium";
      }

      // Circle size
      let radius = 500;

      if (demand === "High") {
        radius = 900;
      } else if (demand === "Medium") {
        radius = 700;
      }

      return {
        id: parking._id,
        name: parking.name,
        lat,
        lng,
        demand,
        occupancy,
        radius,
        totalSlots,
        availableSlots,
        reservedSlots,
        occupiedSlots,
      };
    })
    .filter((spot) => spot !== null);

  // Total parking areas
  const totalParkingAreas = hotspots.length;

  // Average occupancy
  const averageOccupancy =
    hotspots.length > 0
      ? Math.round(
          hotspots.reduce(
            (total, spot) => total + spot.occupancy,
            0
          ) / hotspots.length
        )
      : 0;

  // Top hotspots
  const topHotspots = [...hotspots]
    .filter((spot) => spot.demand !== "Low")
    .sort((a, b) => b.occupancy - a.occupancy)
    .slice(0, 4);

  return (
    <div className="heatmap-page">

      {/* Header */}
      <div className="heatmap-header">
        <div>
          <p className="page-label">PARKNEX ANALYTICS</p>

          <h1>Parking Demand Heatmap</h1>

          <p>
            Visualize parking demand and identify high-traffic areas.
          </p>
        </div>

        <Link
          to="/find-parking"
          className="heatmap-find-btn"
        >
          Find Parking
        </Link>
      </div>

      {/* Period Selector */}
      <div className="heatmap-period">
        {["Today", "7 Days", "30 Days"].map((item) => (
          <button
            key={item}
            className={period === item ? "active" : ""}
            onClick={() => setPeriod(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ padding: "20px" }}>
          Loading parking demand data...
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: "20px", color: "red" }}>
          {error}
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <div className="heatmap-layout">

          {/* Map */}
          <div className="heatmap-map-card">

            <div className="heatmap-map-title">
              <div>
                <h2>Demand Map</h2>

                <p>
                  Parking demand across major locations
                </p>
              </div>

              <div className="heatmap-legend">

                <span>
                  <i className="legend-dot high"></i>
                  High
                </span>

                <span>
                  <i className="legend-dot medium"></i>
                  Medium
                </span>

                <span>
                  <i className="legend-dot low"></i>
                  Low
                </span>

              </div>
            </div>

            <MapContainer
              center={
                hotspots.length > 0
                  ? [hotspots[0].lat, hotspots[0].lng]
                  : [11.0168, 76.9558]
              }
              zoom={12}
              scrollWheelZoom={true}
              className="heatmap-map"
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* REAL PARKING CIRCLES */}
              {hotspots.map((spot) => (
                <Circle
                  key={spot.id}
                  center={[spot.lat, spot.lng]}
                  radius={spot.radius}
                  pathOptions={{
                    color: getColor(spot.demand),
                    fillColor: getColor(spot.demand),
                    fillOpacity: 0.35,
                    weight: 3,
                  }}
                >
                  <Popup>
                    <div>
                      <strong>{spot.name}</strong>

                      <br />

                      Demand: {spot.demand}

                      <br />

                      Occupancy: {spot.occupancy}%

                      <br />

                      Total Slots: {spot.totalSlots}

                      <br />

                      Available: {spot.availableSlots}

                      <br />

                      Reserved: {spot.reservedSlots}

                      <br />

                      Occupied: {spot.occupiedSlots}
                    </div>
                  </Popup>
                </Circle>
              ))}

            </MapContainer>
          </div>

          {/* Side Panel */}
          <div className="heatmap-sidebar">

            <div className="demand-overview">
              <h2>Demand Overview</h2>

              <p className="overview-period">
                {period}
              </p>

              <div className="overview-stat">
                <span>Total Parking Areas</span>

                <strong>
                  {totalParkingAreas}
                </strong>
              </div>

              <div className="overview-stat">
                <span>Average Occupancy</span>

                <strong>
                  {averageOccupancy}%
                </strong>
              </div>

              <div className="overview-stat">
                <span>Peak Hour</span>

                <strong>
                  Not Available
                </strong>
              </div>
            </div>

            {/* Hotspots */}
            <div className="hotspots-card">
              <h2>Top Hotspots</h2>

              {topHotspots.length === 0 ? (
                <p>No high-demand parking areas found.</p>
              ) : (
                topHotspots.map((spot, index) => (
                  <div
                    className="hotspot-item"
                    key={spot.id}
                  >
                    <div className="hotspot-number">
                      {index + 1}
                    </div>

                    <div className="hotspot-info">
                      <strong>{spot.name}</strong>

                      <span>
                        {spot.occupancy}% occupied
                      </span>
                    </div>

                    <span
                      className={`demand-badge ${spot.demand.toLowerCase()}`}
                    >
                      {spot.demand}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Info */}
            <div className="heatmap-info">
              <span>💡</span>

              <div>
                <strong>Smart Parking Insight</strong>

                <p>
                  High-demand areas may have limited parking availability.
                  Consider nearby locations before booking.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Heatmap;
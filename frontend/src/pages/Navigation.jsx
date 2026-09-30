import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CarFront,
  Clock3,
  ExternalLink,
  LocateFixed,
  MapPin,
  Navigation2,
  Route,
} from "lucide-react";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";


// ==========================================
// DEMO FALLBACK PARKING LOCATION
// ==========================================

const DEFAULT_PARKING_LOCATION = {
  lat: 11.0168,
  lng: 76.9558,
};


// ==========================================
// DEMO FALLBACK USER LOCATION
// ==========================================

const DEMO_USER_LOCATION = {
  lat: 11.0105,
  lng: 76.9610,
};


// ==========================================
// CUSTOM USER MARKER
// ==========================================

const userIcon = L.divIcon({
  className: "custom-map-icon",

  html: `
    <div class="map-user-pin">
      <span>🚗</span>
    </div>
  `,

  iconSize: [42, 42],
  iconAnchor: [21, 21],
});


// ==========================================
// CUSTOM PARKING MARKER
// ==========================================

const parkingIcon = L.divIcon({
  className: "custom-map-icon",

  html: `
    <div class="map-parking-pin">
      <span>🅿️</span>
    </div>
  `,

  iconSize: [46, 46],
  iconAnchor: [23, 46],
});


// ==========================================
// RECENTER MAP
// ==========================================

function RecenterMap({ position }) {

  const map = useMap();

  useEffect(() => {

    if (position) {

      map.flyTo(
        [position.lat, position.lng],
        15,
        {
          duration: 1,
        }
      );

    }

  }, [position, map]);

  return null;
}


// ==========================================
// CALCULATE DISTANCE
// ==========================================

function calculateDistance(point1, point2) {

  const R = 6371;

  const lat1 =
    (point1.lat * Math.PI) / 180;

  const lat2 =
    (point2.lat * Math.PI) / 180;

  const dLat =
    ((point2.lat - point1.lat) * Math.PI) / 180;

  const dLng =
    ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +

    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}


// ==========================================
// NAVIGATION PAGE
// ==========================================

export default function Navigation() {

  const [searchParams] =
    useSearchParams();


  // ========================================
  // PARKING ID
  // ========================================

  const parkingId =
    searchParams.get("parking");


  // ========================================
  // STATES
  // ========================================

  const [parking, setParking] =
    useState(null);

  const [parkingLoading, setParkingLoading] =
    useState(true);

  const [parkingError, setParkingError] =
    useState("");


  const [userLocation, setUserLocation] =
    useState(null);

  const [locationStatus, setLocationStatus] =
    useState("loading");


  // ========================================
  // GET REAL PARKING DATA
  // ========================================

  useEffect(() => {

    if (!parkingId) {

      setParkingError(
        "Parking information is missing."
      );

      setParkingLoading(false);

      return;
    }


    fetch(
      `http://localhost:5000/api/parking/${parkingId}`
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            "Failed to fetch parking details"
          );

        }

        return response.json();

      })
      .then((result) => {

        if (!result.success) {

          throw new Error(
            result.message ||
            "Parking not found"
          );

        }

        setParking(result.data);

        setParkingLoading(false);

      })
      .catch((error) => {

        console.error(
          "Parking fetch error:",
          error
        );

        setParkingError(
          "Unable to load parking location."
        );

        setParkingLoading(false);

      });

  }, [parkingId]);


  // ========================================
  // GET USER LOCATION
  // ========================================

  const getUserLocation = () => {

    if (!navigator.geolocation) {

      setUserLocation(
        DEMO_USER_LOCATION
      );

      setLocationStatus("fallback");

      return;
    }


    setLocationStatus("loading");


    navigator.geolocation.getCurrentPosition(

      (position) => {

        setUserLocation({

          lat:
            position.coords.latitude,

          lng:
            position.coords.longitude,

        });

        setLocationStatus("success");

      },

      () => {

        setUserLocation(
          DEMO_USER_LOCATION
        );

        setLocationStatus("fallback");

      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
      }

    );

  };


  useEffect(() => {

    getUserLocation();

  }, []);


  // ========================================
  // PARKING LOCATION
  // ========================================

  const parkingLocation = useMemo(() => {

    if (
      parking &&
      parking.latitude &&
      parking.longitude
    ) {

      return {

        lat: Number(parking.latitude),

        lng: Number(parking.longitude),

      };

    }

    return DEFAULT_PARKING_LOCATION;

  }, [parking]);


  // ========================================
  // CURRENT USER LOCATION
  // ========================================

  const currentLocation =
    userLocation ||
    DEMO_USER_LOCATION;


  // ========================================
  // DISTANCE
  // ========================================

  const distance = useMemo(() => {

    return calculateDistance(
      currentLocation,
      parkingLocation
    );

  }, [
    currentLocation,
    parkingLocation,
  ]);


  // ========================================
  // APPROXIMATE ETA
  // ========================================

  const estimatedMinutes =
    Math.max(
      1,
      Math.ceil(
        (distance / 25) * 60
      )
    );


  // ========================================
  // ROUTE PREVIEW
  // ========================================

  const route = [

    [
      currentLocation.lat,
      currentLocation.lng,
    ],

    [
      parkingLocation.lat,
      parkingLocation.lng,
    ],

  ];


  // ========================================
  // GOOGLE MAPS URL
  // ========================================

  const googleMapsUrl =
    `https://www.google.com/maps/dir/?api=1` +
    `&destination=${parkingLocation.lat},${parkingLocation.lng}` +
    `&travelmode=driving`;


  // ========================================
  // LOADING
  // ========================================

  if (parkingLoading) {

    return (

      <div className="navigation-page">

        <div className="navigation-header">

          <button
            className="back-button"
            onClick={() =>
              window.history.back()
            }
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div>

            <h1>
              Navigate to Parking
            </h1>

            <p>
              Loading parking location...
            </p>

          </div>

        </div>

      </div>

    );

  }


  // ========================================
  // ERROR
  // ========================================

  if (parkingError) {

    return (

      <div className="navigation-page">

        <div className="navigation-header">

          <button
            className="back-button"
            onClick={() =>
              window.history.back()
            }
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div>

            <h1>
              Unable to load parking
            </h1>

            <p>
              {parkingError}
            </p>

          </div>

        </div>

      </div>

    );

  }


  return (

    <div className="navigation-page">

      {/* =================================
          HEADER
      ================================= */}

      <div className="navigation-header">

        <button
          className="back-button"
          onClick={() =>
            window.history.back()
          }
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>

          <h1>
            Navigate to Parking
          </h1>

          <p>
            Find your reserved parking location
          </p>

        </div>

      </div>


      <div className="navigation-layout">


        {/* =================================
            MAP
        ================================= */}

        <div className="navigation-map-card">

          <div className="map-topbar">

            <div>

              <span className="map-label">
                LIVE MAP
              </span>

              <h2>
                Parking Route
              </h2>

            </div>


            <button
              className="location-button"
              onClick={getUserLocation}
            >

              <LocateFixed size={17} />

              My Location

            </button>

          </div>


          <div className="map-wrapper">

            <MapContainer

              center={[
                currentLocation.lat,
                currentLocation.lng,
              ]}

              zoom={14}

              scrollWheelZoom={true}

              className="parking-map"

            >

              <TileLayer

                attribution="&copy; OpenStreetMap contributors"

                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

              />


              <RecenterMap
                position={currentLocation}
              />


              {/* USER MARKER */}

              <Marker

                position={[
                  currentLocation.lat,
                  currentLocation.lng,
                ]}

                icon={userIcon}

              >

                <Popup>

                  <strong>
                    Your Location
                  </strong>

                  <br />

                  Current position

                </Popup>

              </Marker>


              {/* PARKING MARKER */}

              <Marker

                position={[
                  parkingLocation.lat,
                  parkingLocation.lng,
                ]}

                icon={parkingIcon}

              >

                <Popup>

                  <strong>
                    {parking?.name}
                  </strong>

                  <br />

                  {parking?.address}

                </Popup>

              </Marker>


              {/* ROUTE PREVIEW */}

              <Polyline

                positions={route}

                pathOptions={{
                  color: "#2563eb",
                  weight: 5,
                  opacity: 0.8,
                  dashArray: "10 8",
                }}

              />

            </MapContainer>

          </div>

        </div>


        {/* =================================
            SIDE PANEL
        ================================= */}

        <div className="navigation-side">


          {/* DESTINATION CARD */}

          <div className="destination-card">

            <div className="destination-icon">

              <MapPin size={24} />

            </div>


            <div>

              <span className="small-label">
                DESTINATION
              </span>

              <h2>
                {parking?.name}
              </h2>

              <p>
                {parking?.address}
              </p>

            </div>

          </div>


          {/* DISTANCE */}

          <div className="navigation-stats">


            <div className="nav-stat">

              <div className="stat-icon">

                <Route size={19} />

              </div>

              <div>

                <span>
                  Distance
                </span>

                <strong>
                  {distance.toFixed(1)} km
                </strong>

              </div>

            </div>


            <div className="nav-stat">

              <div className="stat-icon">

                <Clock3 size={19} />

              </div>

              <div>

                <span>
                  Estimated arrival
                </span>

                <strong>
                  {estimatedMinutes} min
                </strong>

              </div>

            </div>


          </div>


          {/* LOCATION STATUS */}

          <div className="location-status">

            <div
              className={
                locationStatus === "success"
                  ? "status-dot active"
                  : "status-dot"
              }
            />

            <span>

              {locationStatus === "loading" &&
                "Getting your location..."}

              {locationStatus === "success" &&
                "Live location detected"}

              {locationStatus === "fallback" &&
                "Using demo location"}

            </span>

          </div>


          {/* PARKING INFORMATION */}

          <div className="parking-info-card">


            <div className="info-row">

              <CarFront size={18} />

              <span>
                Parking ID
              </span>

              <strong>
                {parkingId}
              </strong>

            </div>


            <div className="info-row">

              <Navigation2 size={18} />

              <span>
                Travel mode
              </span>

              <strong>
                Driving
              </strong>

            </div>


            <div className="info-row">

              <MapPin size={18} />

              <span>
                Availability
              </span>

              <strong className="available">

                {parking?.slots
                  ? parking.slots.filter(
                      (slot) =>
                        slot.status ===
                        "available"
                    ).length
                  : 0
                }{" "}
                slots

              </strong>

            </div>


          </div>


          {/* NAVIGATION BUTTON */}

          <a

            href={googleMapsUrl}

            target="_blank"

            rel="noreferrer"

            className="start-navigation-button"

          >

            <Navigation2 size={19} />

            Start Navigation

            <ExternalLink size={16} />

          </a>


          <p className="navigation-note">

            Google Maps will open with the driving
            route to your parking location.

          </p>


        </div>

      </div>

    </div>

  );
}
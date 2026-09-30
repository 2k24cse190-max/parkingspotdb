import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  MapPin,
  CalendarDays,
  Clock3,
  Car,
  Navigation,
  Download,
  Share2,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

import { QRCodeCanvas } from "qrcode.react";

function DigitalPass() {

  const [searchParams] = useSearchParams();

  const parkingId =
    searchParams.get("parking");

  const slot =
    searchParams.get("slot");

  const date =
    searchParams.get("date");

  const time =
    searchParams.get("time");

  const duration =
    searchParams.get("duration") || "1";

  const amount =
    searchParams.get("amount");

  const reservationId =
    searchParams.get("reservationId");

  const transactionId =
    searchParams.get("transactionId");


  // ==========================================
  // REAL RESERVATION DATA
  // ==========================================

  const [reservation, setReservation] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // FETCH RESERVATION
  // ==========================================

  useEffect(() => {

    if (!reservationId) {

      setError(
        "Reservation information is missing."
      );

      setLoading(false);

      return;
    }


    fetch(
      `http://localhost:5000/api/reservations/${reservationId}`
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            "Failed to fetch reservation"
          );

        }

        return response.json();

      })
      .then((result) => {

        if (!result.success) {

          throw new Error(
            result.message ||
            "Reservation not found"
          );

        }

        setReservation(result.data);

        setLoading(false);

      })
      .catch((err) => {

        console.error(
          "Reservation fetch error:",
          err
        );

        setError(
          "Unable to load your booking details."
        );

        setLoading(false);

      });

  }, [reservationId]);


  // ==========================================
  // REAL DATA
  // ==========================================

  const realParking =
    reservation?.parking;

  const bookingId =
    reservation?.bookingId ||
    "Booking ID unavailable";


  const parkingName =
    realParking?.name ||
    "Parking";


  const parkingAddress =
    realParking?.address ||
    "Parking location";


  const realSlot =
    reservation?.slotCode ||
    slot ||
    "Not selected";


  const realAmount =
    amount ||
    reservation?.amount ||
    "0";


  const realDuration =
    reservation?.duration ||
    duration;


  const realDate =
    date ||
    (
      reservation?.startTime
        ? new Date(
            reservation.startTime
          ).toLocaleDateString("en-CA")
        : "Not selected"
    );


  const realTime =
    time ||
    (
      reservation?.startTime
        ? new Date(
            reservation.startTime
          ).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit"
            }
          )
        : "Not selected"
    );


  // ==========================================
  // QR DATA
  // ==========================================

  const qrData = JSON.stringify({

    bookingId,

    reservationId,

    transactionId,

    parkingId,

    parking: parkingName,

    address: parkingAddress,

    slot: realSlot,

    date: realDate,

    time: realTime,

    duration: realDuration,

    amount: realAmount

  });


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="digital-pass-page">

        <div className="pass-success">

          <div className="success-icon">
            <CheckCircle2 size={32} />
          </div>

          <span className="section-label">
            LOADING BOOKING
          </span>

          <h1>
            Preparing your parking pass...
          </h1>

          <p>
            Please wait while we load your
            booking details.
          </p>

        </div>

      </div>
    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (
      <div className="digital-pass-page">

        <div className="pass-success">

          <span className="section-label">
            BOOKING ERROR
          </span>

          <h1>
            Unable to load your pass
          </h1>

          <p>
            {error}
          </p>

          <Link
            to={`/booking?parking=${parkingId}`}
            className="pass-primary-button"
          >
            <ArrowRight size={17} />
            Back to Booking
          </Link>

        </div>

      </div>
    );

  }


  return (
    <div className="digital-pass-page">

      {/* ================================= 
          SUCCESS HEADER
      ================================= */}

      <div className="pass-success">

        <div className="success-icon">
          <CheckCircle2 size={32} />
        </div>

        <span className="section-label">
          BOOKING CONFIRMED
        </span>

        <h1>
          Your parking is reserved!
        </h1>

        <p>
          Your digital parking pass is ready.
          Show the QR code when you arrive.
        </p>

      </div>


      {/* ================================= 
          DIGITAL PASS
      ================================= */}

      <div className="digital-pass-card">

        {/* Pass top */}

        <div className="pass-top">

          <div className="pass-brand">

            <div className="pass-logo">
              P
            </div>

            <div>

              <strong>
                ParkNex
              </strong>

              <span>
                Smart Parking
              </span>

            </div>

          </div>


          <div className="confirmed-badge">

            <CheckCircle2 size={14} />

            Confirmed

          </div>

        </div>


        {/* Parking information */}

        <div className="pass-parking-info">

          <div className="pass-parking-icon">

            <MapPin size={25} />

          </div>

          <div>

            <h2>
              {parkingName}
            </h2>

            <p>
              {parkingAddress}
            </p>

          </div>

        </div>


        {/* Dashed separator */}

        <div className="pass-divider">

          <span></span>

        </div>


        {/* Main pass body */}

        <div className="pass-body">


          {/* Details */}

          <div className="pass-details">


            <div className="pass-detail">

              <div className="pass-detail-icon">
                <CalendarDays size={17} />
              </div>

              <div>

                <span>
                  DATE
                </span>

                <strong>
                  {realDate}
                </strong>

              </div>

            </div>


            <div className="pass-detail">

              <div className="pass-detail-icon">
                <Clock3 size={17} />
              </div>

              <div>

                <span>
                  ENTRY TIME
                </span>

                <strong>
                  {realTime}
                </strong>

              </div>

            </div>


            <div className="pass-detail">

              <div className="pass-detail-icon">
                <Car size={17} />
              </div>

              <div>

                <span>
                  PARKING SLOT
                </span>

                <strong className="slot-highlight">
                  {realSlot}
                </strong>

              </div>

            </div>


            <div className="pass-detail">

              <div className="pass-detail-icon">
                <Clock3 size={17} />
              </div>

              <div>

                <span>
                  DURATION
                </span>

                <strong>
                  {realDuration} hour
                  {Number(realDuration) > 1
                    ? "s"
                    : ""}
                </strong>

              </div>

            </div>


          </div>


          {/* QR */}

          <div className="qr-section">

            <div className="qr-container">

              <QRCodeCanvas
                value={qrData}
                size={155}
                bgColor="#ffffff"
                fgColor="#111827"
                level="H"
              />

            </div>

            <strong>
              Scan at entry
            </strong>

            <span>
              Show this QR code
              at the parking gate
            </span>

          </div>

        </div>


        {/* Booking ID */}

        <div className="booking-id">

          <span>
            BOOKING ID
          </span>

          <strong>
            {bookingId}
          </strong>

        </div>


        {/* Amount */}

        <div className="pass-price">

          <span>
            Total paid
          </span>

          <strong>
            ₹{realAmount}
          </strong>

        </div>


        {/* Transaction ID */}

        {transactionId && (

          <div className="booking-id">

            <span>
              TRANSACTION ID
            </span>

            <strong>
              {transactionId}
            </strong>

          </div>

        )}


        {/* Footer */}

        <div className="pass-footer">

          <ShieldCheck size={15} />

          <span>
            This digital pass is valid only for the
            selected date and time.
          </span>

        </div>

      </div>


      {/* ================================= 
          ACTIONS
      ================================= */}

      <div className="pass-actions">


        <button
          className="pass-secondary-button"
          onClick={() => window.print()}
        >

          <Download size={17} />

          Download / Print

        </button>


        <button
          className="pass-secondary-button"
          onClick={() => {

            if (navigator.share) {

              navigator.share({

                title:
                  "ParkNex Parking Pass",

                text:
                  `Parking slot ${realSlot} at ${parkingName}`,

                url:
                  window.location.href

              });

            } else {

              navigator.clipboard.writeText(
                window.location.href
              );

              alert(
                "Pass link copied!"
              );

            }

          }}
        >

          <Share2 size={17} />

          Share Pass

        </button>


        {/* =================================
            START PARKING SESSION
            ADDED - NOTHING ELSE CHANGED
        ================================= */}

        {reservationId && (

  <button
    className="pass-primary-button"
    onClick={() => {

      window.location.href =
        `/session?reservationId=${encodeURIComponent(reservationId)}&parking=${encodeURIComponent(parkingId || "")}&slot=${encodeURIComponent(realSlot)}`;

    }}
  >

    <Car size={17} />

    Start Parking Session

    <ArrowRight size={17} />

  </button>

)}


        <Link
          to={`/navigation?parking=${parkingId}`}
          className="pass-primary-button"
        >

          <Navigation size={17} />

          Navigate to Parking

          <ArrowRight size={17} />

        </Link>


      </div>


      {/* ================================= 
          HELP
      ================================= */}

      <div className="pass-help">

        <strong>
          Need help?
        </strong>

        <span>
          Keep your booking ID ready when contacting
          parking support.
        </span>

      </div>

    </div>
  );
}

export default DigitalPass;
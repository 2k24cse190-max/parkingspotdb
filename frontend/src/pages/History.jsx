import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  Download,
  MapPin,
  RotateCcw,
  Search,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function History() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * ==========================================
   * GET REAL RESERVATIONS
   * ==========================================
   */

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/reservations`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load booking history");
        }

        return response.json();
      })
      .then((result) => {
        const reservationData = result.data || result;

        if (!Array.isArray(reservationData)) {
          throw new Error("Invalid booking data");
        }

        const formattedBookings = reservationData.map(
          (reservation) => {
            const parking = reservation.parking;

            const startTime = reservation.startTime
              ? new Date(reservation.startTime)
              : null;

            let status = "Reserved";

            if (reservation.status === "completed") {
              status = "Completed";
            } else if (
              reservation.status === "cancelled"
            ) {
              status = "Cancelled";
            } else if (
              reservation.status === "active"
            ) {
              status = "Active";
            } else if (
              reservation.status === "reserved"
            ) {
              status = "Reserved";
            }

            return {
              id:
                reservation.bookingId ||
                reservation._id,

              reservationId:
                reservation._id,

              parking:
                parking?.name ||
                "Parking",

              location:
                parking?.address ||
                "Parking location",

              slot:
                reservation.slotCode ||
                "N/A",

              date: startTime
                ? startTime.toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "N/A",

              time: startTime
                ? startTime.toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "N/A",

              duration:
                `${reservation.duration || 1} hour${
                  Number(reservation.duration) > 1
                    ? "s"
                    : ""
                }`,

              amount:
                `₹${reservation.amount || 0}`,

              status,
            };
          }
        );

        setBookings(formattedBookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error(
          "History fetch error:",
          err
        );

        setError(
          "Unable to load your booking history."
        );

        setLoading(false);
      });
  }, []);

  /*
   * ==========================================
   * FILTER BOOKINGS
   * ==========================================
   */

  const filteredBookings = bookings.filter(
    (booking) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        booking.parking
          .toLowerCase()
          .includes(searchText) ||
        booking.id
          .toLowerCase()
          .includes(searchText) ||
        booking.slot
          .toLowerCase()
          .includes(searchText);

      const matchesFilter =
        filter === "All" ||
        booking.status === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    }
  );

  /*
   * ==========================================
   * REAL SUMMARY
   * ==========================================
   */

  const totalBookings =
    bookings.length;

  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Completed"
    ).length;

  const totalHours =
    bookings.reduce(
      (total, booking) => {
        const hours =
          parseInt(
            booking.duration,
            10
          ) || 0;

        return total + hours;
      },
      0
    );

  const thisMonthAmount =
    bookings.reduce(
      (total, booking) => {
        const amount =
          Number(
            booking.amount.replace(
              "₹",
              ""
            )
          ) || 0;

        return total + amount;
      },
      0
    );

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {
    return (
      <div className="history-page">

        <div className="history-header">
          <div>
            <span className="history-label">
              PARKNEX
            </span>

            <h1>Parking History</h1>

            <p>
              Loading your parking bookings...
            </p>
          </div>
        </div>

      </div>
    );
  }

  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (error) {
    return (
      <div className="history-page">

        <div className="history-header">
          <div>
            <span className="history-label">
              PARKNEX
            </span>

            <h1>Parking History</h1>

            <p>{error}</p>
          </div>

          <Link
            to="/find-parking"
            className="history-book-button"
          >
            Find Parking
          </Link>
        </div>

      </div>
    );
  }

  return (
    <div className="history-page">

      {/* HEADER */}

      <div className="history-header">

        <div>
          <span className="history-label">
            PARKNEX
          </span>

          <h1>Parking History</h1>

          <p>
            View and manage your previous parking
            bookings.
          </p>
        </div>

        <Link
          to="/find-parking"
          className="history-book-button"
        >
          Find Parking
        </Link>

      </div>


      {/* SUMMARY */}

      <div className="history-summary">

        <div className="history-summary-card">

          <div className="history-summary-icon blue">
            <CarFront size={20} />
          </div>

          <div>
            <span>Total Bookings</span>

            <strong>
              {totalBookings}
            </strong>
          </div>

        </div>


        <div className="history-summary-card">

          <div className="history-summary-icon green">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Completed</span>

            <strong>
              {completedBookings}
            </strong>
          </div>

        </div>


        <div className="history-summary-card">

          <div className="history-summary-icon orange">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Total Hours</span>

            <strong>
              {totalHours} hrs
            </strong>
          </div>

        </div>


        <div className="history-summary-card">

          <div className="history-summary-icon purple">
            <CalendarDays size={20} />
          </div>

          <div>
            <span>Total Paid</span>

            <strong>
              ₹{thisMonthAmount}
            </strong>
          </div>

        </div>

      </div>


      {/* SEARCH + FILTER */}

      <div className="history-toolbar">

        <div className="history-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search parking, booking ID or slot..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="history-filters">

          {[
            "All",
            "Completed",
            "Cancelled",
          ].map((item) => (

            <button
              key={item}
              className={
                filter === item
                  ? "history-filter active"
                  : "history-filter"
              }
              onClick={() =>
                setFilter(item)
              }
            >
              {item}
            </button>

          ))}

        </div>

      </div>


      {/* BOOKINGS */}

      <div className="history-list">

        {filteredBookings.length > 0 ? (

          filteredBookings.map(
            (booking) => (

              <div
                className="history-booking-card"
                key={booking.reservationId}
              >

                <div className="booking-main">

                  <div className="history-parking-icon">
                    <CarFront size={22} />
                  </div>

                  <div className="booking-info">

                    <div className="booking-title-row">

                      <h2>
                        {booking.parking}
                      </h2>

                      {booking.status ===
                      "Completed" ? (

                        <span className="booking-status completed">

                          <CheckCircle2 size={13} />

                          Completed

                        </span>

                      ) : booking.status ===
                        "Cancelled" ? (

                        <span className="booking-status cancelled">

                          <XCircle size={13} />

                          Cancelled

                        </span>

                      ) : (

                        <span className="booking-status completed">

                          <Clock3 size={13} />

                          {booking.status}

                        </span>

                      )}

                    </div>


                    <div className="booking-location">

                      <MapPin size={14} />

                      {booking.location}

                    </div>


                    <div className="booking-meta">

                      <span>

                        <CalendarDays size={14} />

                        {booking.date}

                      </span>

                      <span>

                        <Clock3 size={14} />

                        {booking.time}

                      </span>

                      <span>

                        Slot{" "}

                        <strong>
                          {booking.slot}
                        </strong>

                      </span>

                    </div>

                  </div>

                </div>


                <div className="booking-right">

                  <div className="booking-amount">

                    <span>Paid</span>

                    <strong>
                      {booking.amount}
                    </strong>

                  </div>


                  <span className="booking-duration">

                    {booking.duration}

                  </span>


                  <div className="booking-actions">

                    {booking.status ===
                      "Completed" && (

                      <Link
                        to={`/digital-pass?parking=${encodeURIComponent(
                          booking.parking
                        )}&slot=${encodeURIComponent(
                          booking.slot
                        )}&date=${encodeURIComponent(
                          booking.date
                        )}&time=${encodeURIComponent(
                          booking.time
                        )}&duration=${encodeURIComponent(
                          booking.duration
                        )}&amount=${encodeURIComponent(
                          booking.amount.replace(
                            "₹",
                            ""
                          )
                        )}&reservationId=${encodeURIComponent(
                          booking.reservationId
                        )}`}
                        className="history-pass-button"
                      >

                        <Download size={15} />

                        Pass

                      </Link>

                    )}


                    <Link
                      to="/find-parking"
                      className="history-rebook-button"
                    >

                      <RotateCcw size={15} />

                      Re-book

                    </Link>

                  </div>

                </div>

              </div>

            )
          )

        ) : (

          <div className="history-empty">

            <Search size={35} />

            <h2>
              No bookings found
            </h2>

            <p>
              Try a different search or filter.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}
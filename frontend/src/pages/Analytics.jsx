import {
  ArrowUp,
  BarChart3,
  CalendarDays,
  CarFront,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import { useEffect, useState } from "react";

export default function Analytics() {
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        // Reservations
        const reservationResponse = await fetch(
  `${import.meta.env.VITE_API_URL}/reservations`
);

        if (!reservationResponse.ok) {
          throw new Error("Failed to fetch reservations");
        }

        const reservationResult =
          await reservationResponse.json();

        setReservations(
          reservationResult.data || []
        );

        // Payments
        try {
          const paymentResponse = await fetch(
            "http://localhost:5000/api/payments"
          );

          if (paymentResponse.ok) {
            const paymentResult =
              await paymentResponse.json();

            setPayments(
              paymentResult.data || []
            );
          }
        } catch (paymentError) {
          console.log(
            "Payment data unavailable:",
            paymentError
          );

          setPayments([]);
        }

      } catch (err) {
        console.error(err);
        setError("Unable to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // --------------------------------
  // TOTAL BOOKINGS
  // --------------------------------

  const totalBookings = reservations.length;

  // --------------------------------
  // TOTAL REVENUE
  // --------------------------------

  const reservationRevenue = reservations.reduce(
    (total, reservation) => {
      if (reservation.status !== "cancelled") {
        return total + Number(reservation.amount || 0);
      }

      return total;
    },
    0
  );

  const paymentRevenue = payments.reduce(
    (total, payment) => {
      if (payment.status === "success") {
        return total + Number(payment.totalAmount || 0);
      }

      return total;
    },
    0
  );

  const totalRevenue =
    paymentRevenue > 0
      ? paymentRevenue
      : reservationRevenue;

  // --------------------------------
  // OCCUPANCY
  // --------------------------------

  const parkingMap = {};

  reservations.forEach((reservation) => {
    if (!reservation.parking) {
      return;
    }

    const parkingId = reservation.parking._id;

    if (!parkingMap[parkingId]) {
      parkingMap[parkingId] = reservation.parking;
    }
  });

  let totalSlots = 0;
  let usedSlots = 0;

  Object.values(parkingMap).forEach((parking) => {
    const slots = parking.slots || [];

    totalSlots += slots.length;

    usedSlots += slots.filter(
      (slot) =>
        slot.status === "reserved" ||
        slot.status === "occupied"
    ).length;
  });

  const averageOccupancy =
    totalSlots > 0
      ? Math.round(
          (usedSlots / totalSlots) * 100
        )
      : 0;

  // --------------------------------
  // AVG REVENUE / BOOKING
  // --------------------------------

  const averageRevenue =
    totalBookings > 0
      ? Math.round(
          totalRevenue / totalBookings
        )
      : 0;

  // --------------------------------
  // WEEKLY BOOKINGS
  // --------------------------------

  const dayNames = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const weeklyData = dayNames.map((day) => {

    const bookings = reservations.filter(
      (reservation) => {

        const dateValue =
          reservation.createdAt ||
          reservation.startTime;

        if (!dateValue) {
          return false;
        }

        const date = new Date(dateValue);

        return dayNames[date.getDay()] === day;
      }
    ).length;

    return {
      day,
      bookings,
      revenue: 0,
    };
  });

  const maxBookings = Math.max(
    ...weeklyData.map(
      (item) => item.bookings
    ),
    1
  );

  // --------------------------------
  // PAYMENT METHODS
  // --------------------------------

  const successfulPayments =
    payments.filter(
      (payment) =>
        payment.status === "success"
    );

  const getPaymentPercentage = (method) => {

    if (successfulPayments.length === 0) {
      return 0;
    }

    const count =
      successfulPayments.filter(
        (payment) =>
          payment.method === method
      ).length;

    return Math.round(
      (count / successfulPayments.length) *
        100
    );
  };

  const upiPercentage =
    getPaymentPercentage("UPI");

  const cardPercentage =
    getPaymentPercentage("Card");

  const walletPercentage =
    getPaymentPercentage("Wallet");

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <div className="analytics-page">
        <div style={{ padding: "30px" }}>
          Loading analytics...
        </div>
      </div>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------

  if (error) {
    return (
      <div className="analytics-page">
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
    <div className="analytics-page">

      {/* HEADER */}

      <div className="analytics-header">

        <div>

          <span className="analytics-label">
            PARKNEX ADMIN
          </span>

          <h1>Parking Analytics</h1>

          <p>
            Understand your parking performance and
            usage patterns.
          </p>

        </div>

        <button className="analytics-date-button">

          <CalendarDays size={17} />

          Last 7 Days

        </button>

      </div>


      {/* TOP STATS */}

      <div className="analytics-stats">

        {/* Revenue */}

        <div className="analytics-stat-card">

          <div className="analytics-stat-icon blue">
            <IndianRupee size={21} />
          </div>

          <div>

            <span>Total Revenue</span>

            <strong>
              ₹{totalRevenue.toLocaleString()}
            </strong>

            <small className="positive">
              <ArrowUp size={12} />
              Current revenue
            </small>

          </div>

        </div>


        {/* Bookings */}

        <div className="analytics-stat-card">

          <div className="analytics-stat-icon green">
            <CarFront size={21} />
          </div>

          <div>

            <span>Total Bookings</span>

            <strong>
              {totalBookings}
            </strong>

            <small className="positive">
              <ArrowUp size={12} />
              Reservations
            </small>

          </div>

        </div>


        {/* Occupancy */}

        <div className="analytics-stat-card">

          <div className="analytics-stat-icon orange">
            <BarChart3 size={21} />
          </div>

          <div>

            <span>Average Occupancy</span>

            <strong>
              {averageOccupancy}%
            </strong>

            <small className="positive">
              <ArrowUp size={12} />
              Current occupancy
            </small>

          </div>

        </div>


        {/* Average Revenue */}

        <div className="analytics-stat-card">

          <div className="analytics-stat-icon purple">
            <TrendingUp size={21} />
          </div>

          <div>

            <span>Avg. Revenue / Booking</span>

            <strong>
              ₹{averageRevenue}
            </strong>

            <small className="positive">
              <ArrowUp size={12} />
              Current average
            </small>

          </div>

        </div>

      </div>


      {/* CHART ROW */}

      <div className="analytics-chart-grid">

        {/* BOOKINGS */}

        <div className="analytics-card bookings-chart">

          <div className="analytics-card-header">

            <div>

              <h2>Weekly Bookings</h2>

              <p>
                Number of parking reservations
              </p>

            </div>

            <BarChart3 size={20} />

          </div>


          <div className="bar-chart">

            {weeklyData.map((item) => {

              const height =
                (item.bookings /
                  maxBookings) *
                100;

              return (
                <div
                  className="bar-column"
                  key={item.day}
                >

                  <span className="bar-value">
                    {item.bookings}
                  </span>

                  <div className="bar-background">

                    <div
                      className="bar-fill"
                      style={{
                        height:
                          `${height}%`,
                      }}
                    />

                  </div>

                  <span className="bar-label">
                    {item.day}
                  </span>

                </div>
              );

            })}

          </div>

        </div>


        {/* REVENUE */}

        <div className="analytics-card revenue-card">

          <div className="analytics-card-header">

            <div>

              <h2>Revenue</h2>

              <p>
                Current earnings
              </p>

            </div>

            <IndianRupee size={20} />

          </div>


          <div className="revenue-total">
            ₹{totalRevenue.toLocaleString()}
          </div>

          <div className="revenue-change">

            <ArrowUp size={14} />

            Current revenue

          </div>


          <div className="revenue-bars">

            {weeklyData.map((item) => {

              return (
                <div
                  className="revenue-bar-column"
                  key={item.day}
                >

                  <div className="revenue-bar-background">

                    <div
                      className="revenue-bar-fill"
                      style={{
                        height: "0%",
                      }}
                    />

                  </div>

                  <span>
                    {item.day}
                  </span>

                </div>
              );

            })}

          </div>

        </div>

      </div>


      {/* BOTTOM GRID */}

      <div className="analytics-bottom-grid">

        {/* PEAK HOURS */}

        <div className="analytics-card peak-hours-card">

          <div className="analytics-card-header">

            <div>

              <h2>Peak Parking Hours</h2>

              <p>
                Historical hourly data
                is not available
              </p>

            </div>

            <TrendingUp size={20} />

          </div>


          <div className="peak-hours-list">

            <div className="peak-hour-row">

              <span>Hourly Data</span>

              <div className="peak-progress">
                <div
                  style={{
                    width: "0%",
                  }}
                />
              </div>

              <strong>
                N/A
              </strong>

            </div>

          </div>

        </div>


        {/* PAYMENT SUMMARY */}

        <div className="analytics-card payment-summary">

          <div className="analytics-card-header">

            <div>

              <h2>Payment Summary</h2>

              <p>
                Transactions by method
              </p>

            </div>

            <IndianRupee size={20} />

          </div>


          {/* UPI */}

          <div className="payment-method">

            <div className="payment-method-icon upi">
              U
            </div>

            <div className="payment-method-info">

              <span>UPI</span>

              <div className="payment-progress">

                <div
                  style={{
                    width:
                      `${upiPercentage}%`,
                  }}
                />

              </div>

            </div>

            <strong>
              {upiPercentage}%
            </strong>

          </div>


          {/* CARD */}

          <div className="payment-method">

            <div className="payment-method-icon card">
              C
            </div>

            <div className="payment-method-info">

              <span>Card</span>

              <div className="payment-progress">

                <div
                  style={{
                    width:
                      `${cardPercentage}%`,
                  }}
                />

              </div>

            </div>

            <strong>
              {cardPercentage}%
            </strong>

          </div>


          {/* WALLET */}

          <div className="payment-method">

            <div className="payment-method-icon wallet">
              W
            </div>

            <div className="payment-method-info">

              <span>Wallet</span>

              <div className="payment-progress">

                <div
                  style={{
                    width:
                      `${walletPercentage}%`,
                  }}
                />

              </div>

            </div>

            <strong>
              {walletPercentage}%
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}
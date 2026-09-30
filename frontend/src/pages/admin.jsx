import {
  Activity,
  CarFront,
  CheckCircle2,
  Clock3,
  IndianRupee,
  ParkingSquare,
  Settings,
  Users,
} from "lucide-react";

const recentBookings = [
  {
    id: "PNX-10241",
    user: "Arun Kumar",
    slot: "A-12",
    time: "06:30 PM",
    amount: "₹65",
    status: "Active",
  },
  {
    id: "PNX-10240",
    user: "Priya S",
    slot: "B-08",
    time: "06:15 PM",
    amount: "₹95",
    status: "Active",
  },
  {
    id: "PNX-10239",
    user: "Rahul M",
    slot: "C-04",
    time: "05:50 PM",
    amount: "₹35",
    status: "Completed",
  },
  {
    id: "PNX-10238",
    user: "Divya R",
    slot: "A-21",
    time: "05:30 PM",
    amount: "₹65",
    status: "Completed",
  },
];

const slots = [
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
  "A7",
  "A8",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
];

export default function Admin() {
  const occupiedSlots = [
    "A1",
    "A3",
    "A5",
    "A7",
    "B2",
    "B4",
    "B5",
    "B8",
    "C1",
    "C4",
  ];

  return (
    <div className="admin-page">

      {/* HEADER */}

      <div className="admin-header">

        <div>
          <span className="admin-label">
            PARKNEX ADMIN
          </span>

          <h1>Parking Overview</h1>

          <p>
            Monitor and manage your parking facility.
          </p>
        </div>

        <button className="admin-settings-button">
          <Settings size={17} />
          Manage Parking
        </button>

      </div>


      {/* STAT CARDS */}

      <div className="admin-stats">

        <div className="admin-stat-card">

          <div className="admin-stat-icon blue">
            <ParkingSquare size={21} />
          </div>

          <div>
            <span>Total Slots</span>
            <strong>24</strong>
            <small>Parking capacity</small>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon red">
            <CarFront size={21} />
          </div>

          <div>
            <span>Occupied</span>
            <strong>10</strong>
            <small>41.7% occupancy</small>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon green">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Available</span>
            <strong>14</strong>
            <small>Ready for booking</small>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon purple">
            <IndianRupee size={21} />
          </div>

          <div>
            <span>Today's Revenue</span>
            <strong>₹2,480</strong>
            <small>32 bookings today</small>
          </div>

        </div>

      </div>


      {/* MAIN GRID */}

      <div className="admin-grid">

        {/* SLOT STATUS */}

        <div className="admin-card slot-status-card">

          <div className="admin-card-header">

            <div>
              <h2>Live Slot Status</h2>
              <p>
                Current parking occupancy
              </p>
            </div>

            <div className="live-indicator">
              <span />
              LIVE
            </div>

          </div>


          <div className="slot-legend">

            <span>
              <i className="legend available" />
              Available
            </span>

            <span>
              <i className="legend occupied" />
              Occupied
            </span>

          </div>


          <div className="admin-slot-grid">

            {slots.map((slot) => {
              const occupied =
                occupiedSlots.includes(slot);

              return (
                <div
                  key={slot}
                  className={
                    occupied
                      ? "admin-slot occupied"
                      : "admin-slot available"
                  }
                >
                  <ParkingSquare size={16} />
                  <span>{slot}</span>
                </div>
              );
            })}

          </div>

        </div>


        {/* OCCUPANCY */}

        <div className="admin-card occupancy-card">

          <div className="admin-card-header">

            <div>
              <h2>Occupancy</h2>
              <p>Current facility usage</p>
            </div>

            <Activity size={21} />

          </div>


          <div className="occupancy-circle">

            <div>
              <strong>42%</strong>
              <span>Occupied</span>
            </div>

          </div>


          <div className="occupancy-details">

            <div>
              <span>Occupied</span>
              <strong>10 slots</strong>
            </div>

            <div>
              <span>Available</span>
              <strong>14 slots</strong>
            </div>

          </div>


          <div className="occupancy-bar">

            <div style={{ width: "42%" }} />

          </div>

        </div>

      </div>


      {/* RECENT BOOKINGS */}

      <div className="admin-card recent-bookings">

        <div className="admin-card-header">

          <div>
            <h2>Recent Bookings</h2>
            <p>
              Latest activity from your parking facility
            </p>
          </div>

          <Users size={21} />

        </div>


        <div className="booking-table">

          <div className="booking-table-head">
            <span>Booking ID</span>
            <span>User</span>
            <span>Slot</span>
            <span>Time</span>
            <span>Amount</span>
            <span>Status</span>
          </div>


          {recentBookings.map((booking) => (

            <div
              className="booking-table-row"
              key={booking.id}
            >

              <strong>{booking.id}</strong>

              <span>{booking.user}</span>

              <span className="table-slot">
                {booking.slot}
              </span>

              <span>
                <Clock3 size={13} />
                {booking.time}
              </span>

              <strong>{booking.amount}</strong>

              <span
                className={
                  booking.status === "Active"
                    ? "table-status active"
                    : "table-status completed"
                }
              >
                {booking.status}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}
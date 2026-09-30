import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  MapPin,
  Star,
  Navigation,
  Zap,
  Car,
  ShieldCheck,
  SlidersHorizontal,
  ArrowUpDown,
  Clock3,
  X
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";


function FindParking() {

  // ==============================
  // BACKEND DATA
  // ==============================

  const [parkingData, setParkingData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==============================
  // SEARCH
  // ==============================

  const [search, setSearch] = useState("");


  // ==============================
  // FILTERS
  // ==============================

  const [filters, setFilters] = useState({
    ev: false,
    valet: false,
    covered: false
  });


  // ==============================
  // SORT
  // ==============================

  const [sort, setSort] = useState("distance");


  // ==============================
  // SHOW FILTERS
  // ==============================

  const [showFilters, setShowFilters] = useState(false);


  // ==================================================
  // GET PARKING DATA FROM BACKEND
  // ==================================================

  useEffect(() => {

    fetch(`${import.meta.env.VITE_API_URL}/parking`)

      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch parking data");
        }

        return response.json();

      })

      .then((result) => {

        console.log("Parking backend response:", result);

        /*
          Backend response:

          {
            success: true,
            count: 3,
            data: [...]
          }
        */

        const backendParking = result.data || [];


        // Convert backend fields to the format
        // already used by your old UI

        const formattedParking = backendParking.map((parking) => {

          const availableSlots =
            parking.slots?.filter(
              (slot) => slot.status === "available"
            ).length || 0;


          return {

            id: parking._id,

            name: parking.name,

            location: parking.address,

            distance: parking.distance || 0,

            price: parking.pricePerHour,

            rating: parking.rating || 0,

            available: availableSlots,

            total: parking.totalSlots || parking.slots?.length || 0,

            covered: parking.covered || false,

            ev: parking.evCharging || false,

            // Your backend currently does not have valet
            valet: false,

            lat: parking.latitude,

            lng: parking.longitude

          };

        });


        setParkingData(formattedParking);

        setLoading(false);

      })

      .catch((error) => {

        console.error("Parking API error:", error);

        setError("Unable to connect to parking server.");

        setLoading(false);

      });

  }, []);


  // ==================================================
  // FILTER + SEARCH + SORT
  // ==================================================

  const filteredParking = useMemo(() => {

    let result = parkingData.filter((parking) => {


      // SEARCH

      const searchText =
        `${parking.name} ${parking.location}`.toLowerCase();


      const matchesSearch =
        searchText.includes(search.toLowerCase());


      // EV FILTER

      const matchesEV =
        !filters.ev || parking.ev;


      // VALET FILTER

      const matchesValet =
        !filters.valet || parking.valet;


      // COVERED FILTER

      const matchesCovered =
        !filters.covered || parking.covered;


      return (
        matchesSearch &&
        matchesEV &&
        matchesValet &&
        matchesCovered
      );

    });


    // SORT

    result.sort((a, b) => {

      if (sort === "price") {
        return a.price - b.price;
      }


      if (sort === "rating") {
        return b.rating - a.rating;
      }


      return a.distance - b.distance;

    });


    return result;

  }, [parkingData, search, filters, sort]);


  // ==================================================
  // FILTER BUTTON
  // ==================================================

  const toggleFilter = (filterName) => {

    setFilters((previous) => ({

      ...previous,

      [filterName]: !previous[filterName]

    }));

  };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div className="find-parking-page">

        <div className="find-header">

          <div>

            <span className="section-label">
              PARKING LOCATOR
            </span>

            <h1>
              Find parking
              <span> near you.</span>
            </h1>

            <p>
              Loading parking locations...
            </p>

          </div>

        </div>

      </div>

    );

  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {

    return (

      <div className="find-parking-page">

        <div className="find-header">

          <div>

            <span className="section-label">
              PARKING LOCATOR
            </span>

            <h1>
              Find parking
              <span> near you.</span>
            </h1>

            <p>
              {error}
            </p>

            <button
              className="book-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>

          </div>

        </div>

      </div>

    );

  }


  // ==================================================
  // MAIN UI
  // ==================================================

  return (

    <div className="find-parking-page">


      {/* =================================
          HEADER
      ================================= */}

      <section className="find-header">

        <div>

          <span className="section-label">
            PARKING LOCATOR
          </span>

          <h1>
            Find parking
            <span> near you.</span>
          </h1>

          <p>
            Search, compare and reserve a parking space
            before you reach your destination.
          </p>

        </div>

      </section>


      {/* =================================
          SEARCH BAR
      ================================= */}

      <section className="parking-search-section">

        <div className="parking-search">

          <Search size={21} />

          <input
            type="text"
            placeholder="Search location, parking name or area..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />


          {search && (

            <button
              className="clear-search"
              onClick={() => setSearch("")}
            >

              <X size={17} />

            </button>

          )}


          <button
            className="filter-button"
            onClick={() =>
              setShowFilters(!showFilters)
            }
          >

            <SlidersHorizontal size={18} />

            Filters

          </button>

        </div>


        {/* FILTERS */}

        <div
          className={`parking-filters ${
            showFilters ? "show" : ""
          }`}
        >


          {/* EV */}

          <button
            className={`filter-chip ${
              filters.ev ? "active" : ""
            }`}
            onClick={() => toggleFilter("ev")}
          >

            <Zap size={16} />

            EV Charging

          </button>


          {/* COVERED */}

          <button
            className={`filter-chip ${
              filters.covered ? "active" : ""
            }`}
            onClick={() => toggleFilter("covered")}
          >

            <ShieldCheck size={16} />

            Covered

          </button>


          {/* VALET */}

          <button
            className={`filter-chip ${
              filters.valet ? "active" : ""
            }`}
            onClick={() => toggleFilter("valet")}
          >

            <Car size={16} />

            Valet

          </button>

        </div>

      </section>


      {/* =================================
          RESULTS HEADER
      ================================= */}

      <section className="results-header">

        <div>

          <strong>
            {filteredParking.length} parking locations
          </strong>

          <span>
            available for booking
          </span>

        </div>


        <div className="sort-control">

          <ArrowUpDown size={16} />

          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
          >

            <option value="distance">
              Nearest
            </option>

            <option value="price">
              Lowest price
            </option>

            <option value="rating">
              Highest rated
            </option>

          </select>

        </div>

      </section>


      {/* =================================
          MAIN CONTENT
      ================================= */}

      <section className="parking-results">


        {/* PARKING LIST */}

        <div className="parking-list">


          {filteredParking.length === 0 ? (

            <div className="no-results">

              <Search size={35} />

              <h3>
                No parking found
              </h3>

              <p>
                Try another location or remove some filters.
              </p>


              <button
                onClick={() => {

                  setSearch("");

                  setFilters({
                    ev: false,
                    valet: false,
                    covered: false
                  });

                }}
              >

                Clear filters

              </button>

            </div>

          ) : (

            filteredParking.map((parking) => (

              <div
                className="parking-result-card"
                key={parking.id}
              >


                {/* TOP */}

                <div className="parking-card-top">


                  <div className="parking-main-icon">

                    <MapPin size={23} />

                  </div>


                  <div className="parking-title">

                    <h3>
                      {parking.name}
                    </h3>

                    <p>

                      <MapPin size={13} />

                      {parking.location}

                    </p>

                  </div>


                  <div className="rating">

                    <Star
                      size={15}
                      fill="currentColor"
                    />

                    {parking.rating}

                  </div>

                </div>


                {/* INFO */}

                <div className="parking-info-row">

                  <div>

                    <Navigation size={15} />

                    {parking.distance} km

                  </div>


                  <div>

                    <Clock3 size={15} />

                    {parking.total} total slots

                  </div>


                  <div>

                    <Car size={15} />

                    {parking.available} available

                  </div>

                </div>


                {/* FEATURES */}

                <div className="parking-features">


                  {parking.covered && (

                    <span>
                      Covered
                    </span>

                  )}


                  {parking.ev && (

                    <span className="ev-feature">

                      <Zap size={12} />

                      EV

                    </span>

                  )}


                  {parking.available > 0 && (

                    <span>
                      Available
                    </span>

                  )}

                </div>


                {/* BOTTOM */}

                <div className="parking-card-bottom">


                  <div className="parking-price">

                    <strong>
                      ₹{parking.price}
                    </strong>

                    <span>
                      / hour
                    </span>

                  </div>


                  <Link
                    to={`/booking?parking=${parking.id}`}
                    className="book-button"
                  >

                    Book Now

                  </Link>

                </div>


              </div>

            ))

          )}

        </div>


        {/* =================================
            MAP
        ================================= */}

        <div className="parking-map">

          <MapContainer
            center={
              filteredParking.length > 0
                ? [
                    filteredParking[0].lat,
                    filteredParking[0].lng
                  ]
                : [13.0827, 80.2707]
            }
            zoom={12}
            scrollWheelZoom={true}
          >


            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />


            {filteredParking.map((parking) => (

              <Marker
                key={parking.id}
                position={[
                  parking.lat,
                  parking.lng
                ]}
              >

                <Popup>

                  <strong>
                    {parking.name}
                  </strong>

                  <br />

                  ₹{parking.price}/hour

                  <br />

                  {parking.available} spots available

                  <br />

                  <Link
                    to={`/booking?parking=${parking.id}`}
                  >
                    Book this parking
                  </Link>

                </Popup>

              </Marker>

            ))}

          </MapContainer>

        </div>

      </section>

    </div>

  );

}

export default FindParking;
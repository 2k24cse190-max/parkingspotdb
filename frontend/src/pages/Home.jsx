import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Search,
  MapPin,
  Car,
  Zap,
  KeyRound,
  ShieldCheck,
  Clock,
  Navigation,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!search.trim()) {
      navigate("/find-parking");
      return;
    }

    navigate(`/find-parking?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="home-page">

      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            <CheckCircle2 size={16} />
            Smart parking made simple
          </div>

          <h1>
            Find a parking spot
            <span> before you arrive.</span>
          </h1>

          <p className="hero-description">
            Discover nearby parking, check real-time availability,
            reserve your slot and reach your destination without
            wasting time searching for parking.
          </p>

          {/* Search Box */}

          <div className="hero-search">

            <div className="search-location">
              <MapPin size={21} />

              <div>
                <span>Where do you want to park?</span>
                <input
                  type="text"
                  placeholder="Search location, area or landmark"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>

            <button
              className="search-button"
              onClick={handleSearch}
            >
              <Search size={19} />
              Find Parking
            </button>

          </div>

          <div className="hero-quick-links">

            <Link to="/find-parking">
              <Navigation size={16} />
              Explore nearby parking
            </Link>

            <span>•</span>

            <Link to="/ev-parking">
              <Zap size={16} />
              Find EV charging
            </Link>

          </div>

        </div>


        {/* Hero Visual */}

        <div className="hero-visual">

          <div className="parking-illustration">

            <div className="floating-card available-card">
              <div className="floating-icon">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <strong>24 spots available</strong>
                <small>2 min away</small>
              </div>
            </div>


            <div className="parking-road">

              <div className="road-line line-one"></div>
              <div className="road-line line-two"></div>
              <div className="road-line line-three"></div>

              <div className="parking-building">

                <div className="building-sign">
                  <Car size={28} />
                  <strong>P</strong>
                </div>

                <div className="parking-floors">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>

              </div>

              <div className="car-icon">
                <Car size={52} />
              </div>

            </div>


            <div className="floating-card price-card">

              <div className="price-icon">
                ₹
              </div>

              <div>
                <strong>From ₹20/hr</strong>
                <small>Affordable parking</small>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= TRUST BAR ================= */}

      <section className="trust-section">

        <div className="trust-item">
          <ShieldCheck size={21} />
          <div>
            <strong>Verified Parking</strong>
            <span>Trusted locations</span>
          </div>
        </div>

        <div className="trust-item">
          <Clock size={21} />
          <div>
            <strong>Real-time Availability</strong>
            <span>Know before you go</span>
          </div>
        </div>

        <div className="trust-item">
          <Navigation size={21} />
          <div>
            <strong>Easy Navigation</strong>
            <span>Reach your spot easily</span>
          </div>
        </div>

        <div className="trust-item">
          <ShieldCheck size={21} />
          <div>
            <strong>Secure Booking</strong>
            <span>Simple & reliable</span>
          </div>
        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="features-section">

        <div className="section-heading">

          <div>
            <span className="section-label">PARKING MADE EASY</span>

            <h2>
              Everything you need
              <span> in one place.</span>
            </h2>
          </div>

          <p>
            Park smarter with tools designed to make your
            entire parking experience simple.
          </p>

        </div>


        <div className="feature-grid">

          <Link to="/find-parking" className="feature-card">

            <div className="feature-icon blue">
              <Search size={25} />
            </div>

            <h3>Find Parking</h3>

            <p>
              Search nearby parking spaces and check
              availability before you arrive.
            </p>

            <span className="feature-link">
              Explore parking
              <ArrowRight size={16} />
            </span>

          </Link>


          <Link to="/ev-parking" className="feature-card">

            <div className="feature-icon green">
              <Zap size={25} />
            </div>

            <h3>EV Parking</h3>

            <p>
              Find parking locations with EV charging
              facilities near your destination.
            </p>

            <span className="feature-link">
              Find EV parking
              <ArrowRight size={16} />
            </span>

          </Link>


          <Link to="/valet" className="feature-card">

            <div className="feature-icon purple">
              <KeyRound size={25} />
            </div>

            <h3>Valet Parking</h3>

            <p>
              Request valet service and enjoy a completely
              hassle-free parking experience.
            </p>

            <span className="feature-link">
              Explore valet
              <ArrowRight size={16} />
            </span>

          </Link>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section className="how-section">

        <div className="section-heading centered">

          <span className="section-label">
            SIMPLE PROCESS
          </span>

          <h2>
            Park in just <span>3 steps.</span>
          </h2>

          <p>
            No searching around. No unnecessary waiting.
          </p>

        </div>


        <div className="steps-container">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              <Search size={23} />
            </div>

            <h3>Find a spot</h3>

            <p>
              Search for parking near your destination
              and compare available options.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              <Car size={23} />
            </div>

            <h3>Reserve your slot</h3>

            <p>
              Choose an available slot and reserve it
              for your preferred time.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              <Navigation size={23} />
            </div>

            <h3>Park & go</h3>

            <p>
              Follow navigation to your parking location
              and enjoy a stress-free experience.
            </p>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="cta-section">

        <div>

          <span className="section-label">
            READY TO PARK?
          </span>

          <h2>
            Stop searching.
            <br />
            Start parking smarter.
          </h2>

          <p>
            Find your next parking spot in seconds.
          </p>

        </div>

        <Link to="/find-parking" className="cta-button">
          Find Parking
          <ArrowRight size={19} />
        </Link>

      </section>

    </div>
  );
}

export default Home;
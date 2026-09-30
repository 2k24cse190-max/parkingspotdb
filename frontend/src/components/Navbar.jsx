import { Link } from "react-router-dom";
import {
  MapPin,
  Search,
  History,
  User,
  Menu,
  X,
  BarChart3,
  Map,
  Car,
  Zap
} from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">
            <MapPin size={22} />
          </div>

          <div>
            <span className="logo-main">Parking</span>
            <span className="logo-sub">Spot</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">

          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link to="/find-parking" className="nav-link">
            <Search size={17} />
            Find Parking
          </Link>

          <Link to="/compare" className="nav-link">
            Compare
          </Link>

          <Link to="/history" className="nav-link">
            <History size={17} />
            History
          </Link>

          <Link to="/admin" className="nav-link">
            Admin
          </Link>

          <Link to="/analytics" className="nav-link">
            <BarChart3 size={17} />
            Analytics
          </Link>

          <Link to="/heatmap" className="nav-link">
            <Map size={17} />
            Heatmap
          </Link>

          <Link to="/valet" className="nav-link">
            <Car size={17} />
            Valet
          </Link>

          <Link to="/ev-parking" className="nav-link">
            <Zap size={17} />
            EV
          </Link>

        </div>

        {/* Right Side */}
        <div className="nav-actions">

          <Link to="/session" className="session-btn">
            Active Session
          </Link>

          <button className="profile-btn">
            <User size={18} />
          </button>

        </div>

        {/* Mobile Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>

      </div>

      {/* Mobile Navigation */}
      {mobileMenu && (
        <div className="mobile-menu">

          <Link
            to="/"
            onClick={() => setMobileMenu(false)}
          >
            Home
          </Link>

          <Link
            to="/find-parking"
            onClick={() => setMobileMenu(false)}
          >
            Find Parking
          </Link>

          <Link
            to="/compare"
            onClick={() => setMobileMenu(false)}
          >
            Compare
          </Link>

          <Link
            to="/history"
            onClick={() => setMobileMenu(false)}
          >
            History
          </Link>

          <Link
            to="/session"
            onClick={() => setMobileMenu(false)}
          >
            Active Session
          </Link>

          <Link
            to="/admin"
            onClick={() => setMobileMenu(false)}
          >
            Admin
          </Link>

          <Link
            to="/analytics"
            onClick={() => setMobileMenu(false)}
          >
            Analytics
          </Link>

          <Link
            to="/heatmap"
            onClick={() => setMobileMenu(false)}
          >
            Heatmap
          </Link>

          <Link
            to="/valet"
            onClick={() => setMobileMenu(false)}
          >
            Valet Parking
          </Link>

          <Link
            to="/ev-parking"
            onClick={() => setMobileMenu(false)}
          >
            EV Parking
          </Link>

        </div>
      )}
    </nav>
  );
}

export default Navbar;
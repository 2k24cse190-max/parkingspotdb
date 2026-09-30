import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import Home from "./pages/Home";
import FindParking from "./pages/FindParking";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import DigitalPass from "./pages/DigitalPass";
import NavigationPage from "./pages/Navigation";
import Session from "./pages/Session";
import History from "./pages/History";
import Admin from "./pages/admin";
import Analytics from "./pages/Analytics";
import Heatmap from "./pages/Heatmap";
import Valet from "./pages/Valet";
import EVParking from "./pages/EVParking";
import Compare from "./pages/Compare";

function Page({ title }) {
  return (
    <div className="page-placeholder">
      <h1>{title}</h1>
      <p>This page will be built next.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>

          {/* Main pages */}
          <Route path="/" element={<Home />} />
          <Route
  path="/find-parking"
  element={<FindParking />}
/>
          <Route path="/compare" element={<Compare />} />

          {/* Booking flow */}
          <Route
  path="/booking"
  element={<Booking />}
/>

         <Route
  path="/payment"
  element={<Payment />}
/>

          <Route
  path="/booking"
  element={<Booking />}
/>

<Route
  path="/payment"
  element={<Payment />}
/>

<Route
  path="/digital-pass"
  element={<DigitalPass />}
/>

          {/* Parking management */}
          <Route
  path="/navigation"
  element={<NavigationPage />}
/>

          <Route
  path="/session"
  element={<Session />}
/>

         <Route
  path="/history"
  element={<History />}
/>

          {/* Special features */}
          <Route path="/valet" element={<Valet />} />

          <Route path="/ev-parking" element={<EVParking />} />

          {/* Admin */}
          <Route
  path="/admin"
  element={<Admin />}
/>

          <Route
  path="/analytics"
  element={<Analytics />}
/>

          <Route path="/heatmap" element={<Heatmap />} />
          {/* 404 */}
          <Route
            path="*"
            element={<Page title="Page Not Found" />}
          />

        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  CarFront,
  Clock3,
  MapPin,
  Navigation2,
  Plus,
  SquareParking,
  Timer
} from "lucide-react";

import { Link, useSearchParams } from "react-router-dom";


export default function Session() {

  const [searchParams] = useSearchParams();


  // --------------------------------------------------
  // URL DETAILS
  // --------------------------------------------------

  const parking =
    searchParams.get("parking") || "Central Parking Hub";

  const slot =
    searchParams.get("slot") || "A-12";

  const sessionId =
    searchParams.get("sessionId") || "";


  // --------------------------------------------------
  // SESSION STATE
  // --------------------------------------------------

  const [seconds, setSeconds] = useState(42 * 60 + 18);

  const [showExtend, setShowExtend] = useState(false);

  const [ended, setEnded] = useState(false);

  const [extending, setExtending] = useState(false);

  const [ending, setEnding] = useState(false);


  // --------------------------------------------------
  // TIMER
  // --------------------------------------------------

  useEffect(() => {

    if (ended) {
      return;
    }


    const timer = setInterval(() => {

      setSeconds((previous) => {

        // Session expired
        if (previous <= 1) {

          clearInterval(timer);

          setEnded(true);

          return 0;
        }


        // Countdown
        return previous - 1;

      });

    }, 1000);


    return () => {
      clearInterval(timer);
    };

  }, [ended]);


  // --------------------------------------------------
  // TIME FORMAT
  // --------------------------------------------------

  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  const remainingSeconds = seconds % 60;


  const formatNumber = (number) => {

    return String(number).padStart(2, "0");

  };


  const formattedTime =
    `${formatNumber(hours)}:` +
    `${formatNumber(minutes)}:` +
    `${formatNumber(remainingSeconds)}`;


  // --------------------------------------------------
  // EXTEND SESSION
  // --------------------------------------------------

  const handleExtend = async (additionalMinutes) => {

    if (extending) {
      return;
    }


    if (!sessionId) {

      alert(
        "Session ID is missing. Please open the session from your active booking."
      );

      return;
    }


    try {

      setExtending(true);


      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/sessions/${sessionId}/extend`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            minutes: additionalMinutes
          })
        }
      );


      const result = await response.json();


      if (!response.ok) {

        alert(
          result.message ||
          "Unable to extend parking session."
        );

        return;
      }


      // ------------------------------------------------
      // IMPORTANT
      // Add time to the EXISTING remaining time.
      // ------------------------------------------------

      setSeconds((previous) => {

        return (
          previous +
          Number(additionalMinutes) * 60
        );

      });


      setShowExtend(false);


      alert(
        `Parking session extended by ${additionalMinutes} minutes.`
      );


    } catch (error) {

      console.error(
        "Extend session error:",
        error
      );


      alert(
        "Unable to connect to parking server."
      );


    } finally {

      setExtending(false);

    }

  };


  // --------------------------------------------------
  // END SESSION
  // --------------------------------------------------

  const handleEndSession = async () => {

    if (ending) {
      return;
    }


    // If session ID exists, update backend
    if (sessionId) {

      try {

        setEnding(true);


        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/sessions/${sessionId}/end`,
          {
            method: "PATCH",

            headers: {
              "Content-Type": "application/json"
            }
          }
        );


        const result = await response.json();


        if (!response.ok) {

          alert(
            result.message ||
            "Unable to end parking session."
          );

          return;
        }


      } catch (error) {

        console.error(
          "End session error:",
          error
        );


        alert(
          "Unable to connect to parking server."
        );

        return;


      } finally {

        setEnding(false);

      }

    }


    // Show completed screen
    setEnded(true);

  };


  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (

    <div className="session-page">


      {/* HEADER */}

      <div className="session-header">

        <button
          className="back-button"
          onClick={() => window.history.back()}
        >

          <ArrowLeft size={18} />

          Back

        </button>


        <div>

          <h1>
            Parking Session
          </h1>

          <p>
            Manage your active parking session
          </p>

        </div>

      </div>



      {!ended ? (

        <div className="session-container">


          {/* ACTIVE STATUS */}

          <div className="active-session-banner">

            <div className="active-indicator">

              <span></span>

            </div>


            <div>

              <strong>
                Parking Session Active
              </strong>

              <p>
                Your vehicle is currently parked.
              </p>

            </div>


            <div className="session-live">

              LIVE

            </div>

          </div>



          {/* MAIN SESSION CARD */}

          <div className="session-main-card">


            <div className="session-card-top">


              <div>

                <span className="session-label">

                  CURRENT PARKING TIME

                </span>


                <div className="session-timer">

                  <Timer size={28} />

                  {formattedTime}

                </div>


                <p className="timer-description">

                  Time remaining for your parking session

                </p>

              </div>



              <div className="parking-slot-large">

                <SquareParking size={25} />

                <span>
                  YOUR SLOT
                </span>

                <strong>
                  {slot}
                </strong>

              </div>


            </div>



            {/* DETAILS */}

            <div className="session-details">


              <div className="session-detail">

                <div className="detail-icon">

                  <MapPin size={19} />

                </div>


                <div>

                  <span>
                    Parking Location
                  </span>

                  <strong>
                    {parking}
                  </strong>

                </div>

              </div>



              <div className="session-detail">

                <div className="detail-icon">

                  <CarFront size={19} />

                </div>


                <div>

                  <span>
                    Vehicle
                  </span>

                  <strong>
                    My Vehicle
                  </strong>

                </div>

              </div>



              <div className="session-detail">

                <div className="detail-icon">

                  <Clock3 size={19} />

                </div>


                <div>

                  <span>
                    Session Status
                  </span>

                  <strong>
                    Active
                  </strong>

                </div>

              </div>


            </div>

          </div>



          {/* QUICK ACTIONS */}

          <div className="session-actions">


            <Link
              to={`/navigation?parking=${encodeURIComponent(parking)}`}
              className="session-action navigation-action"
            >

              <Navigation2 size={20} />


              <div>

                <strong>
                  Navigate
                </strong>

                <span>
                  View parking location
                </span>

              </div>

            </Link>



            <button
              className="session-action extend-action"
              onClick={() =>
                setShowExtend(!showExtend)
              }
            >

              <Plus size={21} />


              <div>

                <strong>
                  Extend Parking
                </strong>

                <span>
                  Add more parking time
                </span>

              </div>

            </button>


          </div>



          {/* EXTENSION OPTIONS */}

          {showExtend && (

            <div className="extension-card">


              <div>

                <span className="extension-title">

                  Extend your parking

                </span>


                <p>

                  Select additional parking duration

                </p>

              </div>



              <div className="extension-options">


                <button
                  onClick={() =>
                    handleExtend(30)
                  }
                  disabled={extending}
                >

                  {extending
                    ? "Updating..."
                    : "+30 min"}

                </button>



                <button
                  onClick={() =>
                    handleExtend(60)
                  }
                  disabled={extending}
                >

                  {extending
                    ? "Updating..."
                    : "+1 hour"}

                </button>



                <button
                  onClick={() =>
                    handleExtend(120)
                  }
                  disabled={extending}
                >

                  {extending
                    ? "Updating..."
                    : "+2 hours"}

                </button>


              </div>

            </div>

          )}



          {/* END SESSION */}

          <div className="end-session-card">


            <div>

              <strong>
                Finished parking?
              </strong>

              <p>

                End your session when you leave
                the parking area.

              </p>

            </div>


            <button
              className="end-session-button"
              onClick={handleEndSession}
              disabled={ending}
            >

              {ending
                ? "Ending..."
                : "End Session"}

            </button>


          </div>


        </div>


      ) : (


        /* SESSION ENDED */

        <div className="session-ended-card">


          <div className="ended-icon">

            ✓

          </div>


          <span className="session-label">

            SESSION COMPLETED

          </span>


          <h2>

            Parking Session Ended

          </h2>


          <p>

            Your parking session has been successfully
            completed.

          </p>



          <div className="ended-summary">


            <div>

              <span>
                Parking
              </span>

              <strong>
                {parking}
              </strong>

            </div>



            <div>

              <span>
                Slot
              </span>

              <strong>
                {slot}
              </strong>

            </div>



            <div>

              <span>
                Total Time
              </span>

              <strong>
                {formattedTime}
              </strong>

            </div>


          </div>



          <Link
            to="/"
            className="session-home-button"
          >

            Back to Home

          </Link>


        </div>

      )}

    </div>

  );

}
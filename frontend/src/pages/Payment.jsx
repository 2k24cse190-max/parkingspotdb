import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import paymentQR from "../assets/payment-qr.png.png";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  MapPin,
  Smartphone,
  WalletCards
} from "lucide-react";

function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const parkingId = searchParams.get("parking");
  const slot = searchParams.get("slot");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const reservationId = searchParams.get("reservationId");

  const duration = Number(
    searchParams.get("duration") || 1
  );

  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("upi");

  const [upiId, setUpiId] = useState("");

  const [cardNumber, setCardNumber] =
    useState("");

  const [expiry, setExpiry] =
    useState("");

  const [cvv, setCvv] =
    useState("");

  const [cardName, setCardName] =
    useState("");

  const [wallet, setWallet] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  /*
   * Get real parking details
   */
  useEffect(() => {
    if (!parkingId) {
      setError("Parking information is missing.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/parking/${parkingId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load parking details");
        }

        return response.json();
      })
      .then((result) => {
        setParking(result.data || result);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load parking details.");
        setLoading(false);
      });
  }, []);

  const pricePerHour = parking?.pricePerHour || 0;

  const parkingFee = pricePerHour * duration;

  /*
   * Keep the existing service fee in your UI.
   *
   * IMPORTANT:
   * Your backend Reservation amount contains
   * only the parking amount.
   */
  const serviceFee = 5;

  const totalAmount = parkingFee + serviceFee;

  /*
   * REAL BACKEND PAYMENT
   */
  const handlePayment = async () => {
    if (!reservationId) {
      alert("Reservation information is missing.");
      return;
    }

    if (paymentMethod === "upi" && !upiId) {
      alert("Please enter your UPI ID.");
      return;
    }

    if (
      paymentMethod === "card" &&
      (!cardNumber || !expiry || !cvv || !cardName)
    ) {
      alert("Please enter all card details.");
      return;
    }

    if (paymentMethod === "wallet" && !wallet) {
      alert("Please select a wallet.");
      return;
    }

    setProcessing(true);

    try {
      const backendMethod =
        paymentMethod === "upi"
          ? "UPI"
          : paymentMethod === "card"
          ? "Card"
          : "Wallet";

      const response = await fetch(
        "http://localhost:5000/api/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            reservationId: reservationId,
            method: backendMethod,
            extensionAmount: serviceFee,
            discount: 0
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Payment failed"
        );
      }

      const payment = result.data || result;

      /*
       * Payment successful.
       * Send the real transaction ID to Digital Pass.
       */
      navigate(
        `/digital-pass?parking=${parkingId}&slot=${slot}&date=${date}&time=${time}&duration=${duration}&amount=${payment.totalAmount}&reservationId=${reservationId}&transactionId=${payment.transactionId}`
      );

    } catch (err) {
      console.error(err);

      alert(
        err.message ||
        "Payment failed. Please try again."
      );

      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-loading">
          Loading payment details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-page">
        <div className="payment-error">
          <h2>Unable to load payment</h2>
          <p>{error}</p>

          <Link
            to={`/booking?parking=${parkingId}`}
            className="back-link"
          >
            <ArrowLeft size={17} />
            Back to booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">

      <Link
        to={`/booking?parking=${parkingId || 1}`}
        className="back-link"
      >
        <ArrowLeft size={17} />
        Back to booking
      </Link>

      <div className="payment-header">

        <div>

          <span className="section-label">
            SECURE CHECKOUT
          </span>

          <h1>
            Complete your payment
          </h1>

          <p>
            Secure your parking slot in just a few seconds.
          </p>

        </div>

        <div className="payment-security">

          <LockKeyhole size={17} />

          Secure payment

        </div>

      </div>

      <div className="payment-layout">

        <div className="payment-main">

          <div className="payment-card">

            <div className="payment-card-heading">

              <div>

                <h2>
                  Payment method
                </h2>

                <p>
                  Choose how you want to pay.
                </p>

              </div>

            </div>

            <div className="payment-methods">

              <button
                className={
                  paymentMethod === "upi"
                    ? "payment-method active"
                    : "payment-method"
                }
                onClick={() =>
                  setPaymentMethod("upi")
                }
              >

                <Smartphone size={19} />

                <span>
                  UPI
                </span>

              </button>

              <button
                className={
                  paymentMethod === "card"
                    ? "payment-method active"
                    : "payment-method"
                }
                onClick={() =>
                  setPaymentMethod("card")
                }
              >

                <CreditCard size={19} />

                <span>
                  Card
                </span>

              </button>

              <button
                className={
                  paymentMethod === "wallet"
                    ? "payment-method active"
                    : "payment-method"
                }
                onClick={() =>
                  setPaymentMethod("wallet")
                }
              >

                <WalletCards size={19} />

                <span>
                  Wallet
                </span>

              </button>

            </div>

            {paymentMethod === "upi" && (

              <div className="payment-form">

                <div className="payment-info-box">

                  <Smartphone size={20} />

                  <div>

                    <strong>
                      Pay using UPI
                    </strong>

                    <span>
                      Enter your UPI ID to continue.
                    </span>

                  </div>

                </div>

                <label>
                  UPI ID
                </label>

                <input
                  type="text"
                  placeholder="example@upi"
                  value={upiId}
                  onChange={(event) =>
                    setUpiId(event.target.value)
                  }
                />

                <div className="upi-examples">

                  <button
                    onClick={() =>
                      setUpiId("user@upi")
                    }
                  >
                    user@upi
                  </button>

                  <button
                    onClick={() =>
                      setUpiId("user@okaxis")
                    }
                  >
                    user@okaxis
                  </button>

                  <button
                    onClick={() =>
                      setUpiId("user@ybl")
                    }
                  >
                    user@ybl
                  </button>

                </div>

              </div>

            )}

            {paymentMethod === "card" && (

              <div className="payment-form">

                <div className="card-number-field">

                  <label>
                    Card number
                  </label>

                  <input
                    type="text"
                    maxLength="19"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(event) =>
                      setCardNumber(event.target.value)
                    }
                  />

                </div>

                <div className="payment-two-columns">

                  <div>

                    <label>
                      Card holder
                    </label>

                    <input
                      type="text"
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(event) =>
                        setCardName(event.target.value)
                      }
                    />

                  </div>

                  <div>

                    <label>
                      Expiry
                    </label>

                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={expiry}
                      onChange={(event) =>
                        setExpiry(event.target.value)
                      }
                    />

                  </div>

                </div>

                <div>

                  <label>
                    CVV
                  </label>

                  <input
                    type="password"
                    placeholder="•••"
                    maxLength="3"
                    value={cvv}
                    onChange={(event) =>
                      setCvv(event.target.value)
                    }
                  />

                </div>

              </div>

            )}

            {paymentMethod === "wallet" && (

              <div className="payment-form">

                <div className="payment-info-box">

                  <WalletCards size={20} />

                  <div>

                    <strong>
                      Choose your wallet
                    </strong>

                    <span>
                      Select a wallet to continue.
                    </span>

                  </div>

                </div>

                <div className="wallet-options">

                  <button
                    type="button"
                    className={
                      wallet === "Paytm"
                        ? "wallet-option active"
                        : "wallet-option"
                    }
                    onClick={() =>
                      setWallet("Paytm")
                    }
                  >

                    <WalletCards size={21} />

                    <span>
                      Paytm
                    </span>

                    {wallet === "Paytm" && (
                      <CheckCircle2 size={18} />
                    )}

                  </button>

                  <button
                    type="button"
                    className={
                      wallet === "PhonePe"
                        ? "wallet-option active"
                        : "wallet-option"
                    }
                    onClick={() =>
                      setWallet("PhonePe")
                    }
                  >

                    <WalletCards size={21} />

                    <span>
                      PhonePe
                    </span>

                    {wallet === "PhonePe" && (
                      <CheckCircle2 size={18} />
                    )}

                  </button>

                  <button
                    type="button"
                    className={
                      wallet === "Amazon Pay"
                        ? "wallet-option active"
                        : "wallet-option"
                    }
                    onClick={() =>
                      setWallet("Amazon Pay")
                    }
                  >

                    <WalletCards size={21} />

                    <span>
                      Amazon Pay
                    </span>

                    {wallet === "Amazon Pay" && (
                      <CheckCircle2 size={18} />
                    )}

                  </button>

                </div>

                {/* PHONEPE QR */}
                {wallet === "PhonePe" && (

                  <div className="wallet-qr-section">

                    <div className="payment-info-box">

                      <Smartphone size={20} />

                      <div>

                        <strong>
                          Scan to pay with PhonePe
                        </strong>

                        <span>
                          Open PhonePe and scan the QR code below.
                        </span>

                      </div>

                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "20px"
                      }}
                    >

                      <img
                        src={paymentQR}
                        alt="PhonePe payment QR"
                        style={{
                          width: "220px",
                          height: "220px",
                          objectFit: "contain",
                          borderRadius: "12px",
                          border: "1px solid #e5e7eb",
                          padding: "10px",
                          background: "#ffffff"
                        }}
                      />

                      <div
                        style={{
                          marginTop: "12px",
                          fontWeight: "700",
                          fontSize: "18px"
                        }}
                      >
                        Amount: ₹{totalAmount}
                      </div>

                      <p
                        style={{
                          marginTop: "6px",
                          color: "#64748b",
                          fontSize: "14px"
                        }}
                      >
                        Scan the QR code using your PhonePe app
                        to complete the payment.
                      </p>

                    </div>

                    <div className="payment-info-box">

                      <CheckCircle2 size={20} />

                      <div>

                        <strong>
                          After completing the payment
                        </strong>

                        <span>
                          Click the Pay button below to continue.
                        </span>

                      </div>

                    </div>

                  </div>

                )}

                {/* OTHER WALLET MESSAGE */}
                {wallet && wallet !== "PhonePe" && (

                  <div className="payment-info-box">

                    <CheckCircle2 size={20} />

                    <div>

                      <strong>
                        {wallet} selected
                      </strong>

                      <span>
                        Continue with the Pay button
                        to complete your parking payment.
                      </span>

                    </div>

                  </div>

                )}

              </div>

            )}

            <div className="payment-protection">

              <LockKeyhole size={16} />

              <span>
                Your payment information is protected
                with secure encryption.
              </span>

            </div>

          </div>

        </div>

        <aside className="payment-sidebar">

          <div className="payment-summary-card">

            <div className="payment-summary-title">

              <h3>
                Booking summary
              </h3>

              <CheckCircle2 size={18} />

            </div>

            <div className="payment-parking">

              <div className="payment-parking-icon">
                <MapPin size={19} />
              </div>

              <div>

                <strong>
                  {parking?.name || "Parking"}
                </strong>

                <span>
                  {parking?.address || "Parking location"}
                </span>

              </div>

            </div>

            <div className="payment-booking-details">

              <div>
                <span>
                  Date
                </span>

                <strong>
                  {date || "Not selected"}
                </strong>
              </div>

              <div>
                <span>
                  Start time
                </span>

                <strong>
                  {time || "Not selected"}
                </strong>
              </div>

              <div>
                <span>
                  Duration
                </span>

                <strong>
                  {duration} hour
                  {duration > 1 ? "s" : ""}
                </strong>
              </div>

              <div>
                <span>
                  Parking slot
                </span>

                <strong>
                  {slot || "Not selected"}
                </strong>
              </div>

            </div>

            <div className="payment-price-breakdown">

              <div>
                <span>
                  Parking fee
                </span>

                <strong>
                  ₹{parkingFee}
                </strong>
              </div>

              <div>
                <span>
                  Service fee
                </span>

                <strong>
                  ₹{serviceFee}
                </strong>
              </div>

            </div>

            <div className="payment-total">

              <span>
                Total
              </span>

              <strong>
                ₹{totalAmount}
              </strong>

            </div>

            <button
              className="pay-now-button"
              onClick={handlePayment}
              disabled={processing}
            >

              {processing ? (
                <>
                  Processing payment...
                </>
              ) : (
                <>
                  Pay ₹{totalAmount}
                  <ArrowRight size={18} />
                </>
              )}

            </button>

            <div className="payment-note">

              <LockKeyhole size={14} />

              <span>
                Secure checkout • No card details stored
              </span>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default Payment;
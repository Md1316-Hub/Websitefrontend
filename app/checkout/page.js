"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";

const initialAddress = {
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function CheckoutPage() {
  const { user, token } = useAuth();
  const { cart, clearCart, refreshCart } = useCart();
  const router = useRouter();

  const [address, setAddress] = useState(initialAddress);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);
  const [razorpayReady, setRazorpayReady] = useState(false);

  function updateField(field, value) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  if (!user) {
    return (
      <div className="container empty-state">
        <p>Log in to check out.</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container empty-state">
        <p>Your cart is empty — add something before checking out.</p>
      </div>
    );
  }

  async function handlePayNow(e) {
    e.preventDefault();
    setError(null);

    if (!razorpayReady || !window.Razorpay) {
      setError("Payment widget is still loading — please try again in a moment.");
      return;
    }

    setPlacing(true);
    try {
      // Step 1: create our order + a matching Razorpay order (backend re-validates stock)
      const checkoutRes = await api.checkout(address, token);

      const rzp = new window.Razorpay({
        key: checkoutRes.razorpay_key_id,
        amount: checkoutRes.amount,
        currency: checkoutRes.currency,
        name: "Tied & True",
        description: "Gift shop order",
        order_id: checkoutRes.razorpay_order_id,
        prefill: {
          name: address.full_name,
          contact: address.phone,
        },
        theme: { color: "#1b3b2f" },
        handler: async function (response) {
          // Step 2: server verifies signature + atomically decrements stock
          try {
            await api.verifyPayment(
              {
                order_id: checkoutRes.order_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              token
            );
            await refreshCart();
            router.push(`/orders/${checkoutRes.order_id}`);
          } catch (err) {
            setError(err.message || "Payment could not be verified.");
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPlacing(false);
          },
        },
      });

      rzp.on("payment.failed", function () {
        setError("Payment failed. No charge was made — please try again.");
        setPlacing(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.message || "Could not start checkout.");
      setPlacing(false);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setRazorpayReady(true)} />
      <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
        <h1>Checkout</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "3rem", alignItems: "start" }}>
          <form className="form-card" style={{ maxWidth: "none" }} onSubmit={handlePayNow}>
            <h3>Shipping address</h3>

            <div className="field">
              <label className="label">Full name</label>
              <input
                className="input"
                required
                value={address.full_name}
                onChange={(e) => updateField("full_name", e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label">Phone</label>
              <input
                className="input"
                required
                value={address.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label">Address line 1</label>
              <input
                className="input"
                required
                value={address.line1}
                onChange={(e) => updateField("line1", e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label">Address line 2 (optional)</label>
              <input
                className="input"
                value={address.line2}
                onChange={(e) => updateField("line2", e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label className="label">City</label>
                <input
                  className="input"
                  required
                  value={address.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </div>
              <div className="field">
                <label className="label">State</label>
                <input
                  className="input"
                  required
                  value={address.state}
                  onChange={(e) => updateField("state", e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Pincode</label>
              <input
                className="input"
                required
                value={address.pincode}
                onChange={(e) => updateField("pincode", e.target.value)}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="btn btn-gold btn-block" type="submit" disabled={placing}>
              {placing ? "Processing…" : `Pay ₹${cart.subtotal.toLocaleString("en-IN")} with Razorpay`}
            </button>
          </form>

          <div className="cart-summary">
            <h3>Order summary</h3>
            {cart.items.map((item) => (
              <div key={item.product_id} className="summary-row">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{cart.subtotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

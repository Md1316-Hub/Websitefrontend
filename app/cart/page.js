"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const { user, loading } = useAuth();
  const { cart, updateItem, removeItem } = useCart();
  const router = useRouter();

  if (loading) return <div className="container" style={{ paddingTop: "3rem" }}>Loading…</div>;

  if (!user) {
    return (
      <div className="container empty-state">
        <p>Log in to see what&apos;s in your cart.</p>
        <Link href="/login?next=/cart" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Log in
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container empty-state">
        <p>Your cart is empty.</p>
        <Link href="/shop" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
      <h1>Your cart</h1>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem", alignItems: "start" }}>
        <div>
          {cart.items.map((item) => (
            <div key={item.product_id} className="cart-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image || ""} alt={item.name} />
              <div>
                <p style={{ fontWeight: 600 }}>{item.name}</p>
                <p className="help-text">₹{item.price.toLocaleString("en-IN")} each</p>
              </div>
              <div className="qty-control">
                <button onClick={() => updateItem(item.product_id, Math.max(1, item.quantity - 1))}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateItem(item.product_id, item.quantity + 1)}>+</button>
              </div>
              <button className="btn btn-sm btn-outline" onClick={() => removeItem(item.product_id)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cart.subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{cart.subtotal.toLocaleString("en-IN")}</span>
          </div>
          <button
            className="btn btn-primary btn-block"
            style={{ marginTop: "1.25rem" }}
            onClick={() => router.push("/checkout")}
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
}

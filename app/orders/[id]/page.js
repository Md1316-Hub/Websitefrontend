"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (token) {
      api.getOrder(id, token).then(setOrder).catch(() => setNotFound(true));
    }
  }, [id, token]);

  if (notFound) {
    return (
      <div className="container empty-state">
        <p>Order not found.</p>
      </div>
    );
  }

  if (!order) return <div className="container" style={{ paddingTop: "3rem" }}>Loading…</div>;

  const isPaid = order.status === "paid";

  return (
    <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem", maxWidth: 640 }}>
      {isPaid && (
        <div style={{ marginBottom: "1.5rem" }}>
          <span className="hero-eyebrow">Order confirmed</span>
          <h1>Thank you — your gifts are on the way!</h1>
        </div>
      )}

      <div className="cart-summary">
        <div className="summary-row">
          <span>Order</span>
          <span>#{order.id.slice(-6)}</span>
        </div>
        <div className="summary-row">
          <span>Status</span>
          <span className={`badge badge-${order.status}`}>{order.status.replace("_", " ")}</span>
        </div>
        <hr className="foil-divider" style={{ margin: "1rem 0" }} />

        {order.items.map((item) => (
          <div key={item.product_id} className="summary-row">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
          </div>
        ))}

        <div className="summary-row total">
          <span>Total</span>
          <span>₹{order.total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3>Shipping to</h3>
        <p className="help-text">
          {order.shipping_address.full_name}
          <br />
          {order.shipping_address.line1}
          {order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ""}
          <br />
          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}
          <br />
          {order.shipping_address.phone}
        </p>
      </div>

      <Link href="/shop" className="btn btn-outline" style={{ marginTop: "1rem" }}>
        Continue shopping
      </Link>
    </div>
  );
}

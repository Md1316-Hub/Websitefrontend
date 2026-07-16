"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function OrdersPage() {
  const { user, token, loading } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (token) api.listMyOrders(token).then(setOrders).catch(() => setOrders([]));
  }, [token]);

  if (loading) return <div className="container" style={{ paddingTop: "3rem" }}>Loading…</div>;

  if (!user) {
    return (
      <div className="container empty-state">
        <p>Log in to see your orders.</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container empty-state">
        <p>No orders yet.</p>
        <Link href="/shop" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
      <h1>Your orders</h1>
      <table className="data-table" style={{ marginTop: "1.5rem" }}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <Link href={`/orders/${o.id}`}>#{o.id.slice(-6)}</Link>
              </td>
              <td>{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
              <td>{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
              <td>₹{o.total.toLocaleString("en-IN")}</td>
              <td>
                <span className={`badge badge-${o.status}`}>{o.status.replace("_", " ")}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

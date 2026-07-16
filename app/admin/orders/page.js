"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const STATUSES = ["pending_payment", "paid", "payment_failed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const { user, token, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === "admin") {
      api
        .listAllOrders(token, filter || undefined)
        .then(setOrders)
        .catch((e) => setError(e.message));
    }
  }, [user, token, filter]);

  async function handleStatusChange(orderId, newStatus) {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, token);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <div className="container" style={{ paddingTop: "3rem" }}>Loading…</div>;

  if (!user || user.role !== "admin") {
    return (
      <div className="container empty-state">
        <p>You need an admin account to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
      <div className="admin-tabs">
        <Link href="/admin" className="admin-tab">
          Products
        </Link>
        <span className="admin-tab active">Orders</span>
      </div>

      <div className="admin-toolbar">
        <h1 style={{ margin: 0 }}>Orders</h1>
        <select className="select" style={{ width: "auto" }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error-text">{error}</p>}

      {orders.length === 0 ? (
        <p className="help-text">No orders match this filter.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id.slice(-6)}</td>
                <td>{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                <td>{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                <td>₹{o.total.toLocaleString("en-IN")}</td>
                <td>
                  <span className={`badge badge-${o.status}`}>{o.status.replace("_", " ")}</span>
                </td>
                <td>
                  <select
                    className="select"
                    style={{ width: "auto" }}
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

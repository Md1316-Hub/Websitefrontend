"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function AdminDashboard() {
  const { user, token, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === "admin") {
      api
        .listProducts({ include_inactive: "true", limit: "100" })
        .then(setProducts)
        .catch((e) => setError(e.message));
    }
  }, [user]);

  async function handleDelete(id) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    try {
      await api.deleteProduct(id, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
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
        <span className="admin-tab active">Products</span>
        <Link href="/admin/orders" className="admin-tab">
          Orders
        </Link>
      </div>

      <div className="admin-toolbar">
        <h1 style={{ margin: 0 }}>Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          + Add product
        </Link>
      </div>

      {error && <p className="error-text">{error}</p>}

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>₹{p.price.toLocaleString("en-IN")}</td>
              <td>{p.stock}</td>
              <td>{p.is_active ? "Active" : "Hidden"}</td>
              <td style={{ display: "flex", gap: "0.5rem" }}>
                <Link href={`/admin/products/${p.id}/edit`} className="btn btn-sm btn-outline">
                  Edit
                </Link>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

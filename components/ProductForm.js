"use client";

import { useState } from "react";

const CATEGORIES = ["Birthday", "Festive", "Corporate", "Anniversary", "Home & Living"];

export default function ProductForm({ initial, onSubmit, submitLabel }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      slug: "",
      description: "",
      price: "",
      category: CATEGORIES[0],
      images: "",
      stock: "",
      sku: "",
      is_active: true,
    }
  );
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function slugify(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-card" style={{ maxWidth: 560 }} onSubmit={handleSubmit}>
      <div className="field">
        <label className="label">Product name</label>
        <input
          className="input"
          required
          value={form.name}
          onChange={(e) => {
            const name = e.target.value;
            update("name", name);
            if (!initial) update("slug", slugify(name));
          }}
        />
      </div>

      <div className="field">
        <label className="label">Slug (URL-friendly identifier)</label>
        <input className="input" required value={form.slug} onChange={(e) => update("slug", e.target.value)} />
      </div>

      <div className="field">
        <label className="label">Description</label>
        <textarea
          className="textarea"
          rows={4}
          required
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="field">
          <label className="label">Price (₹)</label>
          <input
            className="input"
            type="number"
            min="1"
            step="0.01"
            required
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
          />
        </div>
        <div className="field">
          <label className="label">Stock quantity</label>
          <input
            className="input"
            type="number"
            min="0"
            required
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Category</label>
        <select className="select" value={form.category} onChange={(e) => update("category", e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="label">Image URLs (comma-separated)</label>
        <input
          className="input"
          placeholder="https://res.cloudinary.com/.../mug.jpg"
          value={form.images}
          onChange={(e) => update("images", e.target.value)}
        />
        <p className="help-text">Upload images to Cloudinary (free tier) and paste the URLs here.</p>
      </div>

      <div className="field">
        <label className="label">SKU (optional)</label>
        <input className="input" value={form.sku || ""} onChange={(e) => update("sku", e.target.value)} />
      </div>

      <div className="field" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          id="is_active"
          checked={form.is_active}
          onChange={(e) => update("is_active", e.target.checked)}
        />
        <label htmlFor="is_active" style={{ fontWeight: 500 }}>
          Visible in shop
        </label>
      </div>

      {error && <p className="error-text">{error}</p>}

      <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

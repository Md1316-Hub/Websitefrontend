"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";

const CATEGORIES = ["Birthday", "Festive", "Corporate", "Anniversary", "Home & Living"];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api
      .listProducts({ limit: "8" })
      .then(setFeatured)
      .catch(() => setFeatured([]));
  }, []);

  return (
    <>
      <section className="hero">
        <span className="hero-eyebrow">Small batch · Ships across India</span>
        <h1>Gifts that feel like they were chosen, not bought.</h1>
        <p>
          Hand-picked pieces for birthdays, festivals, and the people who deserve more than a gift card.
        </p>
        <div className="hero-actions">
          <Link href="/shop" className="btn btn-primary">
            Browse the shop
          </Link>
          <Link href="/shop?category=Festive" className="btn btn-outline">
            Festive picks
          </Link>
        </div>
      </section>

      <div className="container">
        <hr className="foil-divider" />

        <div className="category-grid">
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/shop?category=${encodeURIComponent(c)}`} className="category-tile">
              {c}
            </Link>
          ))}
        </div>

        <hr className="foil-divider" />

        <div className="section-heading">
          <h2>Featured this week</h2>
          <Link href="/shop" className="help-text">
            View all →
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="empty-state">
            <p>No products yet — add some from the admin dashboard to see them here.</p>
          </div>
        ) : (
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    api
      .listProducts(params)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  function setCategory(next) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("category", next);
    else params.delete("category");
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
      <div className="section-heading">
        <h2>{category || "All gifts"}</h2>
      </div>

      <div className="field" style={{ maxWidth: 340 }}>
        <input
          className="input"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <button
          className={`btn btn-sm ${!category ? "btn-primary" : "btn-outline"}`}
          onClick={() => setCategory("")}
        >
          All
        </button>
        {["Birthday", "Festive", "Corporate", "Anniversary", "Home & Living"].map((c) => (
          <button
            key={c}
            className={`btn btn-sm ${category === c ? "btn-primary" : "btn-outline"}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="help-text">Loading…</p>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>No products found. Try a different category or search term.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container" style={{ paddingTop: "2.5rem" }}>Loading…</div>}>
      <ShopContent />
    </Suspense>
  );
}

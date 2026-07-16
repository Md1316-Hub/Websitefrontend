"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GiftTagPrice from "@/components/GiftTagPrice";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState(null); // "adding" | "added" | error string

  useEffect(() => {
    api
      .getProduct(id)
      .then(setProduct)
      .catch(() => setNotFound(true));
  }, [id]);

  async function handleAddToCart() {
    setStatus("adding");
    try {
      await addItem(id, qty);
      setStatus("added");
    } catch (e) {
      setStatus(e.message);
    }
  }

  if (notFound) {
    return (
      <div className="container empty-state">
        <p>This gift isn&apos;t available anymore.</p>
      </div>
    );
  }

  if (!product) {
    return <div className="container" style={{ paddingTop: "3rem" }}>Loading…</div>;
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
        <div className="product-thumb" style={{ borderRadius: "6px", border: "1px solid var(--line)" }}>
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} />
          ) : null}
        </div>

        <div>
          <span className="product-category">{product.category}</span>
          <h1 style={{ marginTop: "0.4rem" }}>{product.name}</h1>
          <div style={{ margin: "1rem 0" }}>
            <GiftTagPrice price={product.price} />
          </div>
          <p style={{ color: "var(--ink-soft)" }}>{product.description}</p>

          {outOfStock ? (
            <p className="stock-out" style={{ marginTop: "1.5rem" }}>
              This item is currently sold out.
            </p>
          ) : (
            <>
              {product.stock <= 5 && <p className="stock-low">Only {product.stock} left</p>}

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
                <div className="qty-control">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <button className="btn btn-primary" onClick={handleAddToCart} disabled={status === "adding"}>
                  {status === "adding" ? "Adding…" : "Add to cart"}
                </button>
              </div>

              {status === "added" && (
                <p className="help-text">
                  Added to your cart.{" "}
                  <button
                    className="btn btn-sm btn-outline"
                    style={{ marginLeft: "0.5rem" }}
                    onClick={() => router.push("/cart")}
                  >
                    View cart
                  </button>
                </p>
              )}
              {status && status !== "adding" && status !== "added" && (
                <p className="error-text">{status}</p>
              )}
              {!user && (
                <p className="help-text" style={{ marginTop: "0.5rem" }}>
                  You&apos;ll need to log in to add items to your cart.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

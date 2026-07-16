"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProductForm from "@/components/ProductForm";
import { api } from "@/lib/api";

export default function EditProductPage() {
  const { id } = useParams();
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.getProduct(id).then(setProduct).catch(() => setProduct(null));
  }, [id]);

  if (loading || (!product && user?.role === "admin")) {
    return <div className="container" style={{ paddingTop: "3rem" }}>Loading…</div>;
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="container empty-state">
        <p>You need an admin account to view this page.</p>
      </div>
    );
  }

  async function handleUpdate(payload) {
    // eslint-disable-next-line no-unused-vars
    const { slug, ...updatable } = payload; // slug isn't part of ProductUpdate on the backend
    await api.updateProduct(id, updatable, token);
    router.push("/admin");
  }

  const initial = product
    ? {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        category: product.category,
        images: (product.images || []).join(", "),
        stock: product.stock,
        sku: product.sku || "",
        is_active: product.is_active,
      }
    : null;

  return (
    <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
      <h1>Edit product</h1>
      {initial && <ProductForm initial={initial} onSubmit={handleUpdate} submitLabel="Save changes" />}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProductForm from "@/components/ProductForm";
import { api } from "@/lib/api";

export default function NewProductPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div className="container" style={{ paddingTop: "3rem" }}>Loading…</div>;

  if (!user || user.role !== "admin") {
    return (
      <div className="container empty-state">
        <p>You need an admin account to view this page.</p>
      </div>
    );
  }

  async function handleCreate(payload) {
    await api.createProduct(payload, token);
    router.push("/admin");
  }

  return (
    <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
      <h1>Add a product</h1>
      <ProductForm onSubmit={handleCreate} submitLabel="Create product" />
    </div>
  );
}

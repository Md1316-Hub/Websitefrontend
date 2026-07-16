"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">
          Tied &amp; True
        </Link>

        <nav className="nav-links">
          <Link href="/shop">Shop</Link>
          {user && <Link href="/orders">Your Orders</Link>}
          {user?.role === "admin" && <Link href="/admin">Admin</Link>}

          <Link href="/cart" className="cart-pill">
            Cart
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>

          {user ? (
            <button className="btn btn-outline btn-sm" onClick={logout}>
              Log out
            </button>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

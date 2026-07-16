"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem("gift_shop_token");
    if (stored) {
      setToken(stored);
      api
        .me(stored)
        .then(setUser)
        .catch(() => {
          window.localStorage.removeItem("gift_shop_token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    const { access_token } = await api.login(email, password);
    window.localStorage.setItem("gift_shop_token", access_token);
    setToken(access_token);
    const me = await api.me(access_token);
    setUser(me);
    return me;
  }

  async function register(payload) {
    await api.register(payload);
    return login(payload.email, payload.password);
  }

  function logout() {
    window.localStorage.removeItem("gift_shop_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

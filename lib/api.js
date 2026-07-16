const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, token, form } = {}) {
  const headers = {};
  if (!form) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: form ? body : body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message = (data && data.detail) || "Something went wrong. Please try again.";
    throw new ApiError(typeof message === "string" ? message : JSON.stringify(message), res.status);
  }

  return data;
}

export const api = {
  // ---- auth ----
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (email, password) => {
    const form = new URLSearchParams();
    form.set("username", email);
    form.set("password", password);
    return request("/auth/login", { method: "POST", body: form, form: true });
  },
  me: (token) => request("/auth/me", { token }),

  // ---- products ----
  listProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? `?${qs}` : ""}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (payload, token) => request("/products", { method: "POST", body: payload, token }),
  updateProduct: (id, payload, token) => request(`/products/${id}`, { method: "PATCH", body: payload, token }),
  deleteProduct: (id, token) => request(`/products/${id}`, { method: "DELETE", token }),

  // ---- cart (all require auth) ----
  getCart: (token) => request("/cart", { token }),
  addToCart: (productId, quantity, token) =>
    request("/cart/items", { method: "POST", body: { product_id: productId, quantity }, token }),
  updateCartItem: (productId, quantity, token) =>
    request(`/cart/items/${productId}`, { method: "PUT", body: { quantity }, token }),
  removeCartItem: (productId, token) => request(`/cart/items/${productId}`, { method: "DELETE", token }),
  clearCart: (token) => request("/cart", { method: "DELETE", token }),

  // ---- orders ----
  checkout: (shippingAddress, token) =>
    request("/orders/checkout", { method: "POST", body: { shipping_address: shippingAddress }, token }),
  verifyPayment: (payload, token) => request("/orders/verify-payment", { method: "POST", body: payload, token }),
  listMyOrders: (token) => request("/orders", { token }),
  getOrder: (id, token) => request(`/orders/${id}`, { token }),

  // ---- admin ----
  listAllOrders: (token, status) =>
    request(`/admin/orders${status ? `?status=${status}` : ""}`, { token }),
  updateOrderStatus: (id, status, token) =>
    request(`/admin/orders/${id}/status?new_status=${status}`, { method: "PATCH", token }),
};

export { ApiError };

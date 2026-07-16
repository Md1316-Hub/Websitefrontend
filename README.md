# Tied & True — Gift Shop Frontend (Next.js)

Talks to the FastAPI backend for products, cart, auth, and Razorpay checkout.

## Setup

```bash
npm install
cp .env.local.example .env.local     # point NEXT_PUBLIC_API_URL at your backend
npm run dev
```

Visit `http://localhost:3000`. Your FastAPI backend must be running (default `http://localhost:8000`) with CORS's `FRONTEND_URL` set to `http://localhost:3000`.

## Pages

| Route | What it does |
|---|---|
| `/` | Home — hero, categories, featured products |
| `/shop` | Browse/search/filter products |
| `/product/[id]` | Product detail, add to cart (requires login) |
| `/cart` | View/edit cart |
| `/checkout` | Shipping address + Razorpay payment |
| `/orders`, `/orders/[id]` | Order history and confirmation |
| `/login`, `/register` | Auth |
| `/admin` | Product management (admin only) |
| `/admin/orders` | Order management (admin only) |

## Design

Palette and type live in `app/globals.css` as CSS variables (bottle green `--forest`, antique gold `--gold`, ribbon maroon `--maroon`, warm paper background). The recurring signature element is the rotated gift-tag price badge (`components/GiftTagPrice.js`) and the gold-foil divider (`.foil-divider`) — reuse both instead of introducing new one-off styles if you extend the design.

// The site's one recurring "signature" visual: a rotated paper gift-tag
// used to show price on product cards, echoing the tags on a wrapped gift.
export default function GiftTagPrice({ price }) {
  return (
    <span className="gift-tag" aria-label={`Price: ₹${price}`}>
      <svg width="92" height="34" viewBox="0 0 92 34" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 4 H72 L88 17 L72 30 H4 A4 4 0 0 1 0 26 V8 A4 4 0 0 1 4 4 Z"
          fill="#fffdf8"
          stroke="#a97e2f"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="17" r="2.5" fill="none" stroke="#a97e2f" strokeWidth="1.5" />
      </svg>
      <span className="gift-tag-price">₹{Number(price).toLocaleString("en-IN")}</span>
    </span>
  );
}

import Link from "next/link";
import GiftTagPrice from "@/components/GiftTagPrice";

export default function ProductCard({ product }) {
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Link href={`/product/${product.id}`} className="product-card">
      <div className="product-thumb">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.name} />
        ) : null}
      </div>
      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <span className="product-name">{product.name}</span>
        <div className="product-footer">
          <GiftTagPrice price={product.price} />
          {outOfStock && <span className="stock-out">Sold out</span>}
          {lowStock && <span className="stock-low">Only {product.stock} left</span>}
        </div>
      </div>
    </Link>
  );
}

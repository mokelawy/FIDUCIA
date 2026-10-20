import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { formatPrice, type Product } from "@/data/products";
import { Button } from "@/components/ui/button";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [active, setActive] = useState(0);
  const visible = product.colors.slice(0, 3);
  const extra = product.colors.length - visible.length;
  const image = product.colors[active]?.image ?? product.image;

  return (
    <article
      className="group rise min-w-0 text-product-ink"
      style={{ animationDelay: `${Math.min(index, 6) * 80}ms` }}
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden border border-product-gold/30 bg-product-surface transition-colors duration-500 hover:border-product-gold focus-visible:outline focus-visible:outline-product-gold"
      >
        {product.isNew && (
          <span className="absolute right-2 top-2 z-10 bg-product-surface px-2 py-0.5 text-[9px] uppercase tracking-normal text-product-gold">
            New
          </span>
        )}
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={1008}
          className="aspect-[3/4.2] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </Link>

      <div className="pt-3">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="block min-h-8 break-words text-[11px] leading-4 font-normal uppercase tracking-normal text-product-ink transition-colors hover:text-product-gold sm:text-xs"
        >
          {product.name}
        </Link>
        <p className="mt-0.5 font-display text-base font-semibold text-product-gold sm:text-lg">{formatPrice(product.price)}</p>
        <div className="mt-2 flex items-center gap-1.5">
          {visible.map((c, i) => (
            <Button
              key={c.name}
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Preview ${c.name}`}
              aria-pressed={active === i}
              title={c.name}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`h-4 w-4 rounded-full border p-0 transition-transform hover:scale-110 ${
                active === i ? "border-product-gold ring-1 ring-product-gold/40 ring-offset-2 ring-offset-product-surface" : "border-product-ink/20"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
          {extra > 0 && (
            <span className="text-[10px] text-muted-foreground">+{extra}</span>
          )}
        </div>
      </div>
    </article>
  );
}

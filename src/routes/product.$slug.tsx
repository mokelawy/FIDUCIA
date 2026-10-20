import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Minus, Plus, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/data/products";
import { getProductDetail } from "@/lib/store.functions";
import { mapProduct, mapVariants, stockStatus, STOCK_LABEL, variantStock } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const detail = await getProductDetail({ data: { slug: params.slug } });
    if (!detail) throw notFound();
    return detail;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable | FIDUCIA" }, { name: "robots", content: "noindex" }],
      };
    }
    const product = loaderData.product;
    return {
      meta: [
        { title: `${product.name} | FIDUCIA` },
        { name: "description", content: product.description },
        { property: "og:title", content: `${product.name} | FIDUCIA` },
        { property: "og:description", content: product.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const data = Route.useLoaderData();
  const product = useMemo(() => mapProduct(data.product), [data.product]);
  const variants = useMemo(() => mapVariants(data.variants), [data.variants]);
  const related = useMemo(() => data.related.map(mapProduct), [data.related]);

  const { addItem } = useCart();
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const color = product.colors[colorIndex]!;
  const hasVariants = variants.length > 0;
  const selectedStock = size
    ? hasVariants
      ? variantStock(variants, color.name, size)
      : product.stock
    : 0;
  const colorStock = hasVariants
    ? variants.filter((v) => v.color === color.name).reduce((s, v) => s + v.stock, 0)
    : product.stock;
  const status = stockStatus(size ? selectedStock : colorStock);

  const sizeStock = (s: string) => (hasVariants ? variantStock(variants, color.name, s) : product.stock);

  return (
    <div className="brand-backdrop product-catalog">
      <div className="mx-auto max-w-[1400px] px-6 py-8 sm:px-10">
        <nav className="label-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link to="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <span className="px-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="overflow-hidden bg-secondary">
              <img
                src={color.image}
                alt={`${product.name} in ${color.name}`}
                width={900}
                height={1125}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  aria-label={`View ${c.name}`}
                  onClick={() => {
                    setColorIndex(i);
                    setSize(null);
                  }}
                  className={cn(
                    "overflow-hidden border bg-secondary transition-colors",
                    colorIndex === i ? "border-ink" : "border-transparent hover:border-border",
                  )}
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:pt-4">
            <p className="eyebrow text-muted-foreground">{product.collection}</p>
            <h1 className="serif-title mt-2 text-3xl sm:text-[2.5rem]">{product.name}</h1>
            <p className="arabic mt-1 text-sm text-muted-foreground">{product.nameAr}</p>
            <p className="mt-4 text-xl font-medium">{formatPrice(product.price)}</p>
            <p className="mt-5 max-w-prose text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="label-xs">
                Color: <span className="text-muted-foreground">{color.name}</span>
              </p>
              <div className="mt-3 flex items-center gap-3">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    aria-label={c.name}
                    onClick={() => {
                      setColorIndex(i);
                      setSize(null);
                    }}
                    className={cn(
                      "h-8 w-8 rounded-full border transition-transform hover:scale-105",
                      colorIndex === i ? "border-ink ring-1 ring-ink ring-offset-2" : "border-border",
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="label-xs">Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const stock = sizeStock(s);
                  const disabled = stock <= 0;
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={disabled}
                      title={disabled ? "Out of stock" : undefined}
                      onClick={() => {
                        setSize(s);
                        setQuantity(1);
                      }}
                      className={cn(
                        "label-xs h-10 min-w-[52px] border px-3 transition-colors",
                        size === s
                          ? "border-ink bg-ink text-ink-foreground"
                          : "border-border hover:border-ink",
                        disabled &&
                          "cursor-not-allowed border-border text-muted-foreground line-through opacity-50 hover:border-border",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7 flex items-center gap-4">
              <div className="flex items-center border border-border">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="px-3 py-2.5"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="px-3 py-2.5"
                  onClick={() =>
                    setQuantity((q) => Math.min(Math.max(1, size ? selectedStock : product.stock), q + 1))
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {STOCK_LABEL[status].en}
                <span className="arabic px-2">— {STOCK_LABEL[status].ar}</span>
              </p>
            </div>

            <button
              type="button"
              disabled={colorStock <= 0}
              onClick={() => {
                if (!size) {
                  toast.error("Please select a size");
                  return;
                }
                if (selectedStock <= 0) {
                  toast.error("This size is out of stock");
                  return;
                }
                addItem({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: color.image,
                  color: color.name,
                  size,
                  quantity: Math.min(quantity, selectedStock),
                });
                toast.success("Added to your bag");
              }}
              className="label-xs mt-8 flex h-12 w-full items-center justify-center bg-ink text-ink-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {colorStock > 0 ? "Add to Bag" : "Out of Stock"}
            </button>

            <ul className="mt-8 space-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
              {product.details.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="text-foreground">—</span>
                  {d}
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:grid-cols-3">
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4" /> Delivery across Egypt
              </p>
              <p className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" /> 14-day exchanges
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Cash on delivery
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="serif-title text-2xl">You may also like</h2>
            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

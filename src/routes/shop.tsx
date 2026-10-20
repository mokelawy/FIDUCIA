import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { listProducts } from "@/lib/store.functions";
import { mapProduct } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ShopSearch = { category?: string | undefined; q?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  loader: async () => ({ products: await listProducts() }),
  head: () => ({
    meta: [
      { title: "Shop All | FIDUCIA" },
      {
        name: "description",
        content:
          "Browse every FIDUCIA piece — heavyweight tees, oversized shirts and wide leg pants in refined neutral tones.",
      },
      { property: "og:title", content: "Shop All | FIDUCIA" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: "Every FIDUCIA piece, in refined neutral tones.",
      },
    ],
  }),
  component: Shop,
});

const CATEGORIES = ["All", "T-Shirts", "Shirts", "Pants", "Accessories"] as const;

function Shop() {
  const { category, q } = Route.useSearch();
  const products = Route.useLoaderData().products.map(mapProduct);
  const navigate = useNavigate({ from: "/shop" });
  const active = category ?? "All";

  const filtered = products.filter((p) => {
    const matchesCategory = active === "All" || p.category === active;
    const matchesQuery = !q || p.name.toLowerCase().includes(q.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section className="brand-backdrop product-catalog py-10 sm:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <div className="text-center">
          <p className="text-[10px] font-light uppercase text-product-ink/60">All Products</p>
          <h1 className="product-catalog-heading mt-2 text-4xl sm:text-[2.5rem]">Shop Fiducia</h1>
          <p className="arabic mt-1 text-lg text-product-gold">كل المنتجات</p>
        </div>

        <div className="product-filters mt-10 flex gap-2 overflow-x-auto px-1 pb-6 sm:justify-center">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              type="button"
              variant="ghost"
              aria-pressed={active === c}
              onClick={() =>
                navigate({ search: { category: c === "All" ? undefined : c, q } })
              }
              className={cn(
                "h-10 shrink-0 border px-5 text-[10px] font-normal uppercase tracking-normal transition-colors",
                active === c
                  ? "border-product-gold bg-product-gold/15 text-product-gold hover:bg-product-gold/20 hover:text-product-gold"
                  : "border-product-ink/10 text-product-ink hover:border-product-gold hover:bg-product-surface",
              )}
            >
              {c}
            </Button>
          ))}
        </div>

        {q && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Results for &ldquo;{q}&rdquo;
          </p>
        )}

        <div className="product-grid mt-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="label-xs py-20 text-center text-muted-foreground">
            No products found
          </p>
        )}
      </div>
    </section>
  );
}

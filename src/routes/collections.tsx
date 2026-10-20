import { createFileRoute, Link } from "@tanstack/react-router";
import { collections } from "@/data/products";
import { listProducts } from "@/lib/store.functions";
import { mapProduct } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/collections")({
  loader: async () => ({ products: await listProducts() }),
  head: () => ({
    meta: [
      { title: "Collections | FIDUCIA" },
      {
        name: "description",
        content:
          "Explore FIDUCIA collections — Essentials, Core Black and Neutrals. Considered pieces in heavyweight cotton.",
      },
      { property: "og:title", content: "Collections | FIDUCIA" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: "Essentials, Core Black and Neutrals by FIDUCIA.",
      },
    ],
  }),
  component: Collections,
});

function Collections() {
  const products = Route.useLoaderData().products.map(mapProduct);
  return (
    <section className="brand-backdrop product-catalog py-14 sm:py-16">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="text-center">
          <p className="eyebrow text-muted-foreground">Curated</p>
          <h1 className="serif-title mt-3 text-3xl sm:text-[2.5rem]">Collections</h1>
          <p className="arabic mt-1 text-sm text-muted-foreground">التشكيلات</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {collections.map((c) => (
            <article key={c.slug} className="group relative overflow-hidden bg-ink">
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                width={800}
                height={1008}
                className="aspect-[4/5] w-full object-cover opacity-80 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-ink-foreground">
                <h2 className="serif-title text-2xl">{c.name}</h2>
                <p className="arabic text-xs text-ink-foreground/70">{c.nameAr}</p>
                <p className="mt-2 max-w-xs text-xs text-ink-foreground/70">{c.description}</p>
              </div>
            </article>
          ))}
        </div>

        {collections.map((c) => {
          const items = products.filter((p) => p.collection === c.name);
          if (items.length === 0) return null;
          return (
            <div key={c.slug} className="mt-16">
              <div className="flex items-end justify-between border-b border-border pb-3">
                <h2 className="serif-title text-2xl">{c.name}</h2>
                <Link to="/shop" className="label-xs text-muted-foreground hover:text-foreground">
                  View all
                </Link>
              </div>
              <div className="product-grid mt-8">
                {items.map((product, i) => (
                  <ProductCard key={product.slug} product={product} index={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

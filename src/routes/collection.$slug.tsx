import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { collections } from "@/data/products";
import { mapProduct } from "@/lib/catalog";
import { listProducts } from "@/lib/store.functions";

export const Route = createFileRoute("/collection/$slug")({
  loader: async ({ params }) => {
    const collection = collections.find((item) => item.slug === params.slug);
    if (!collection) throw notFound();

    const rows = await listProducts();
    return {
      collection,
      products: rows.map(mapProduct).filter((product) => product.collection === collection.name),
    };
  },
  head: ({ loaderData }) => {
    const collection = loaderData?.collection;
    const title = collection ? `${collection.name} | FIDUCIA` : "Collection unavailable | FIDUCIA";
    const description = collection?.description ?? "Explore FIDUCIA collections.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { collection, products } = Route.useLoaderData();

  return (
    <main className="brand-backdrop product-catalog">
      <section className="relative isolate min-h-[330px] overflow-hidden bg-ink sm:min-h-[420px]">
        <img
          src={collection.image}
          alt={collection.name}
          width={1200}
          height={800}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
        <div className="relative mx-auto flex min-h-[330px] max-w-[1400px] flex-col justify-end px-6 py-12 text-ink-foreground sm:min-h-[420px] sm:px-10 sm:py-16">
          <nav className="label-xs mb-8 text-ink-foreground/70" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink-foreground">Home</Link>
            <span className="px-2">/</span>
            <Link to="/collections" className="hover:text-ink-foreground">Collections</Link>
            <span className="px-2">/</span>
            <span>{collection.name}</span>
          </nav>
          <p className="eyebrow text-ink-foreground/75">FIDUCIA Collection</p>
          <h1 className="serif-title mt-3 text-4xl sm:text-5xl">{collection.name}</h1>
          <p className="arabic mt-1 text-lg text-ink-foreground/80">{collection.nameAr}</p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-foreground/75">
            {collection.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-10 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="eyebrow text-muted-foreground">The edit</p>
            <h2 className="product-catalog-heading mt-2 text-2xl sm:text-3xl">
              {collection.name}
            </h2>
          </div>
          <p className="label-xs shrink-0 text-muted-foreground">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>
        ) : (
          <p className="label-xs py-20 text-center text-muted-foreground">
            No products in this collection yet.
          </p>
        )}
      </section>
    </main>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { listProducts } from "@/lib/store.functions";
import { mapProduct } from "@/lib/catalog";
import { LOOKS, LookCard } from "@/components/site/Lookbook";
import { StyleBuilder } from "@/components/site/StyleBuilder";

export const Route = createFileRoute("/lookbook")({
  loader: async () => ({ products: await listProducts() }),
  head: () => ({
    meta: [
      { title: "Lookbook | FIDUCIA" },
      { name: "description", content: "Curated FIDUCIA looks — complete outfits styled from our essentials." },
      { property: "og:title", content: "Lookbook | FIDUCIA" },
      { property: "og:description", content: "Curated FIDUCIA looks — complete outfits styled from our essentials." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LookbookPage,
});

function LookbookPage() {
  const products = Route.useLoaderData().products.map(mapProduct);
  return (
    <section className="bg-sand py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="text-center">
          <p className="eyebrow text-muted-foreground">Season Edit</p>
          <h1 className="serif-title mt-3 text-4xl sm:text-5xl">Lookbook</h1>
          <p className="arabic mt-1 text-sm text-muted-foreground">نسّق إطلالتك</p>
        </div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {LOOKS.map((look, i) => (
            <LookCard key={look.id} look={look} products={products} index={i} />
          ))}
        </div>

        {/* STYLE BUILDER */}
        <div className="mt-20 border-t border-border pt-16">
          <div className="text-center">
            <h2 className="arabic text-3xl font-bold sm:text-[2.5rem]">نسّق إطلالتك على ذوقك</h2>
            <p className="arabic mt-3 text-sm text-muted-foreground">
              كوّن إطلالتك بنفسك وشاهد كيف تبدو القطع معًا.
            </p>
          </div>
          <div className="mt-12">
            <StyleBuilder products={products} />
          </div>
        </div>
      </div>
    </section>
  );
}

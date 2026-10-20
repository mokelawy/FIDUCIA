import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Lock, PackageOpen, Truck } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import storyImage from "@/assets/story.jpg";
import { listProducts } from "@/lib/store.functions";
import { mapProduct } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { LOOKS, LookCard } from "@/components/site/Lookbook";

export const Route = createFileRoute("/")({
  loader: async () => ({ products: await listProducts() }),
  head: () => ({
    meta: [
      { title: "FIDUCIA | Premium Minimal Essentials" },
      {
        name: "description",
        content:
          "Minimal pieces, maximum impact. Shop FIDUCIA heavyweight tees and refined essentials — designed to stay with you, always.",
      },
      { property: "og:title", content: "FIDUCIA | Premium Minimal Essentials" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: "Minimal pieces, maximum impact. Designed to stay with you. Always.",
      },
    ],
  }),
  component: Home,
});

const FEATURES = [
  { icon: Truck, title: "Fast Delivery", ar: "توصيل سريع", sub: "Across Egypt" },
  { icon: BadgeCheck, title: "Premium Quality", ar: "جودة فاخرة", sub: "Made to last" },
  { icon: PackageOpen, title: "Easy Returns", ar: "إرجاع سهل", sub: "Within 14 days" },
  { icon: Lock, title: "Secure Payment", ar: "دفع آمن", sub: "100% Protected" },
];

function Home() {
  const { products } = Route.useLoaderData();
  const allProducts = products.map(mapProduct);
  const latest = allProducts.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate h-[560px] overflow-hidden bg-ink sm:h-[620px] lg:h-[660px]">
        <img
          src={heroImage}
          alt="Model wearing the FIDUCIA oversized black t-shirt against a concrete wall"
          width={1600}
          height={912}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
        <div className="absolute inset-x-0 top-0 h-px bg-ink-foreground/25" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-ink-foreground/25" />

        <div className="relative mx-auto flex h-full max-w-[1400px] items-center px-6 sm:px-10">
          <div className="max-w-xl text-ink-foreground">
            <p className="eyebrow rise text-ink-foreground/75">Timeless. Refined. Yours.</p>
            <h1
              className="serif-title rise mt-4 text-5xl leading-none sm:text-6xl lg:text-[5.25rem]"
              style={{ animationDelay: "120ms" }}
            >
              FIDUCIA
            </h1>
            <p
              className="arabic rise mt-2 text-2xl text-ink-foreground/90 sm:text-3xl"
              style={{ animationDelay: "220ms" }}
            >
              فيدوتشا
            </p>
            <p
              className="rise mt-6 max-w-sm text-sm leading-relaxed text-ink-foreground/75"
              style={{ animationDelay: "320ms" }}
            >
              Minimal pieces, maximum impact.
              <br />
              Designed to stay with you. Always.
            </p>
            <div
              className="rise mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "420ms" }}
            >
              <Link
                to="/shop"
                className="label-xs flex h-11 items-center justify-center bg-background px-9 text-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                Shop Now
              </Link>
              <Link
                to="/collections"
                className="label-xs flex h-11 items-center justify-center border border-ink-foreground/60 px-8 text-ink-foreground transition-colors duration-300 hover:bg-ink-foreground/10"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST DROPS */}
      <section className="brand-backdrop product-catalog py-16 sm:py-20">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <div className="text-center">
            <p className="eyebrow text-muted-foreground">New Arrivals</p>
            <h2 className="product-catalog-heading mt-3 text-4xl sm:text-[2.5rem]">Latest Drops</h2>
            <p className="arabic mt-1 text-lg text-product-gold">أحدث المنتجات</p>
          </div>

          <div className="product-grid mt-10">
            {latest.map((product, i) => (
              <ProductCard key={product.slug} product={product} index={i} />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              to="/shop"
              className="label-xs flex h-11 items-center justify-center bg-ink px-10 text-ink-foreground transition-opacity hover:opacity-90"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <div className="text-center">
            <p className="eyebrow text-muted-foreground">Season Edit</p>
            <h2 className="serif-title mt-3 text-3xl sm:text-[2.5rem]">The Lookbook</h2>
            <p className="arabic mt-1 text-sm text-muted-foreground">نسّق إطلالتك</p>
          </div>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {LOOKS.map((look, i) => (
              <LookCard key={look.id} look={look} products={allProducts} index={i} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              to="/lookbook"
              className="label-xs flex h-11 items-center justify-center border border-foreground px-10 transition-colors hover:bg-foreground hover:text-background"
            >
              View Lookbook
            </Link>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="bg-ink text-ink-foreground">
        <div className="grid lg:grid-cols-2">
          <div className="flex items-center px-6 py-16 sm:px-14 lg:justify-end lg:py-24">
            <div className="max-w-md">
              <p className="eyebrow text-ink-foreground/55">Our Story</p>
              <h2 className="serif-title mt-3 text-3xl sm:text-[2.25rem]">Behind FIDUCIA</h2>
              <p className="arabic mt-1 text-sm text-ink-foreground/60">خلف فيدوتشا</p>
              <p className="mt-6 text-sm leading-relaxed text-ink-foreground/70">
                FIDUCIA is more than just a brand.
                <br />
                It&apos;s a mindset. A commitment to quality, simplicity, and timeless style.
                <br />
                Every piece is crafted to elevate your everyday and reflect your true self.
              </p>
              <Link
                to="/about"
                className="label-xs mt-8 inline-flex h-11 items-center border border-ink-foreground/60 px-8 transition-colors hover:bg-ink-foreground/10"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative min-h-[280px] overflow-hidden lg:min-h-[440px]">
            <img
              src={storyImage}
              alt="FIDUCIA black hang tag resting on draped fabric"
              loading="lazy"
              width={1200}
              height={800}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-sand">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-8 px-6 py-10 sm:px-10 lg:grid-cols-4 lg:divide-x lg:divide-border">
          {FEATURES.map(({ icon: Icon, title, ar, sub }) => (
            <div key={title} className="flex items-center gap-4 px-2 lg:justify-center lg:px-6">
              <Icon className="h-7 w-7 shrink-0 stroke-[1.2]" aria-hidden />
              <div className="min-w-0">
                <p className="label-xs">{title}</p>
                <p className="arabic text-[11px] text-muted-foreground">{ar}</p>
                <p className="text-[11px] text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

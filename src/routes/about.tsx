import { createFileRoute, Link } from "@tanstack/react-router";
import story from "@/assets/story.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Our Story | FIDUCIA" },
      {
        name: "description",
        content:
          "FIDUCIA is an Egyptian essentials label built on trust — heavyweight cotton, quiet design and pieces made to last.",
      },
      { property: "og:title", content: "Our Story | FIDUCIA" },
      {
        property: "og:description",
        content: "An Egyptian essentials label built on trust and quiet design.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    title: "Considered Materials",
    body: "240 GSM combed cotton, enzyme washed and pre-shrunk so the fit you buy is the fit you keep.",
  },
  {
    title: "Quiet Design",
    body: "No loud graphics. Clean silhouettes in a neutral palette that works with everything you already own.",
  },
  {
    title: "Made in Egypt",
    body: "Cut and sewn locally in small runs, with delivery to every governorate.",
  },
];

function AboutPage() {
  return (
    <div className="bg-background">
      <section className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-14 sm:px-10 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="eyebrow text-muted-foreground">Our Story</p>
          <h1 className="serif-title mt-3 text-3xl sm:text-[2.75rem]">
            Fiducia means trust
          </h1>
          <p className="arabic mt-1 text-sm text-muted-foreground">فيدوتشا تعني الثقة</p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            We started FIDUCIA with a simple frustration: essentials that lose their shape after
            three washes. So we built the opposite — heavyweight, honest pieces designed to become
            the ones you reach for first.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Every piece is developed slowly, sampled repeatedly, and released only when the fit,
            weight and hand feel are right. Timeless. Refined. Yours.
          </p>
          <Link
            to="/shop"
            className="label-xs mt-8 inline-flex h-11 items-center bg-ink px-8 text-ink-foreground transition-opacity hover:opacity-90"
          >
            Shop the Collection
          </Link>
        </div>
        <img
          src={story}
          alt="FIDUCIA garment detail"
          width={900}
          height={1125}
          className="aspect-[4/5] w-full object-cover"
        />
      </section>

      <section className="border-t border-border bg-sand py-14">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-6 sm:px-10 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title}>
              <h2 className="label-xs">{v.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

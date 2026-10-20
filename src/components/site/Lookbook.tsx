import { Link } from "@tanstack/react-router";
import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";
import look3 from "@/assets/look-3.jpg";
import { formatPrice, type Product } from "@/data/products";

export const LOOKS = [
  { id: "01", title: "Monochrome Ease", ar: "بساطة بالأسود", image: look1, keys: ["tee-ink-black", "trousers"] },
  { id: "02", title: "Soft Layers", ar: "طبقات هادئة", image: look2, keys: ["oxford", "ecru", "trousers"] },
  { id: "03", title: "After Hours", ar: "إطلالة المساء", image: look3, keys: ["hoodie", "espresso"] },
];

function pieces(products: Product[], keys: string[]) {
  return keys
    .map((k) => products.find((p) => p.slug.includes(k)))
    .filter((p): p is Product => Boolean(p));
}

export function LookCard({ look, products, index }: { look: (typeof LOOKS)[number]; products: Product[]; index: number }) {
  const items = pieces(products, look.keys);
  const total = items.reduce((s, p) => s + p.price, 0);
  return (
    <article className="group rise" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="relative overflow-hidden bg-secondary">
        <img
          src={look.image}
          alt={`FIDUCIA look ${look.id} — ${look.title}`}
          loading="lazy"
          width={896}
          height={1152}
          className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        <span className="eyebrow absolute left-4 top-4 bg-ink px-2.5 py-1 text-ink-foreground">Look {look.id}</span>
      </div>
      <div className="pt-4">
        <h3 className="serif-title text-xl">{look.title}</h3>
        <p className="arabic text-sm text-muted-foreground">{look.ar}</p>
        <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
          {items.map((p) => (
            <li key={p.slug} className="flex justify-between gap-3 text-[12px]">
              <Link to="/product/$slug" params={{ slug: p.slug }} className="label-xs text-foreground/80 hover:text-foreground">
                {p.name}
              </Link>
              <span className="shrink-0">{formatPrice(p.price)}</span>
            </li>
          ))}
        </ul>
        {items.length > 0 && (
          <p className="label-xs mt-3 text-muted-foreground">Complete look · {formatPrice(total)}</p>
        )}
      </div>
    </article>
  );
}

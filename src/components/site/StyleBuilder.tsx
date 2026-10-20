import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Heart, Plus, ShoppingBag, Shirt, Watch, X } from "lucide-react";
import { formatPrice, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import mannequin from "@/assets/mannequin.jpg";

type SlotKey = "top" | "bottom" | "acc";

const TABS: { key: SlotKey; labelAr: string; categories: string[]; Icon: typeof Shirt }[] = [
  { key: "top", labelAr: "الجزء العلوي", categories: ["T-Shirts", "Shirts", "Hoodies", "Jackets", "Outerwear"], Icon: Shirt },
  { key: "bottom", labelAr: "الجزء السفلي", categories: ["Pants", "Shorts", "Jeans"], Icon: Shirt },
  { key: "acc", labelAr: "الإكسسوارات", categories: ["Accessories", "Caps", "Bags"], Icon: Watch },
];

type Pick = { product: Product; color: number; size: string };
type Selection = Record<SlotKey, Pick | null>;
const EMPTY: Selection = { top: null, bottom: null, acc: null };
const SAVE_KEY = "fiducia-saved-look";

function Mannequin({ sel }: { sel: Selection }) {
  const img = (p: Pick | null) => (p ? p.product.colors[p.color]?.image ?? p.product.image : null);
  const top = img(sel.top);
  const bottom = img(sel.bottom);
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden border border-border bg-ink">
      <img src={mannequin} alt="مجسم" width={768} height={1152} className="absolute inset-0 h-full w-full object-cover" />
      {bottom && (
        <img
          src={bottom}
          alt=""
          className="absolute left-1/2 top-[47%] z-10 h-[46%] w-[52%] -translate-x-1/2 object-cover object-[center_75%] transition-all duration-500 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,black_60%,transparent)]"
        />
      )}
      {top && (
        <img
          src={top}
          alt=""
          className="absolute left-1/2 top-[15%] z-20 h-[38%] w-[66%] -translate-x-1/2 object-cover object-[center_30%] transition-all duration-500 [mask-image:radial-gradient(ellipse_70%_75%_at_50%_50%,black_60%,transparent)]"
        />
      )}
      {!top && !bottom && (
        <p className="arabic absolute inset-x-0 bottom-6 z-30 px-6 text-center text-[12px] text-ink-foreground/70">
          اختار القطع وشوف الإطلالة على المجسم
        </p>
      )}
    </div>
  );
}

export function StyleBuilder({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  const [tab, setTab] = useState<SlotKey>("top");
  const [sel, setSel] = useState<Selection>(EMPTY);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw) as Record<SlotKey, { slug: string; color: number; size: string } | null>;
      const next: Selection = { ...EMPTY };
      (Object.keys(s) as SlotKey[]).forEach((k) => {
        const p = s[k] && products.find((x) => x.slug === s[k]!.slug);
        if (p && s[k]) next[k] = { product: p, color: s[k]!.color, size: s[k]!.size };
      });
      setSel(next);
    } catch {
      /* ignore */
    }
  }, [products]);

  const options = useMemo(() => {
    const t = TABS.find((x) => x.key === tab)!;
    return products.filter((p) => t.categories.includes(p.category));
  }, [products, tab]);

  const chosen = (Object.keys(sel) as SlotKey[]).filter((k) => sel[k]).map((k) => ({ key: k, ...sel[k]! }));
  const total = chosen.reduce((s, c) => s + c.product.price, 0);

  const update = (k: SlotKey, v: Pick | null) => {
    setAdded(false);
    setSaved(false);
    setSel((prev) => ({ ...prev, [k]: v }));
  };

  const defaultSize = (p: Product) => p.sizes[Math.floor(p.sizes.length / 2)] ?? p.sizes[0] ?? "M";

  const addLook = () => {
    for (const c of chosen) {
      const color = c.product.colors[c.color];
      addItem({
        slug: c.product.slug,
        name: c.product.name,
        price: c.product.price,
        image: color?.image ?? c.product.image,
        color: color?.name ?? "Default",
        size: c.size,
        quantity: 1,
      });
    }
    setAdded(true);
  };

  const saveLook = () => {
    const data: Record<string, unknown> = {};
    chosen.forEach((c) => (data[c.key] = { slug: c.product.slug, color: c.color, size: c.size }));
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    setSaved(true);
  };

  return (
    <div dir="rtl" className="arabic grid gap-6 lg:grid-cols-[1.15fr_1fr_0.9fr]">
      {/* Picker */}
      <div className="border border-border bg-background p-4">
        <div className="flex border-b border-border">
          {TABS.map(({ key, labelAr, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-[13px] transition-colors ${
                tab === key ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {labelAr}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {options.map((p) => {
            const cur = sel[tab];
            const active = cur?.product.slug === p.slug;
            const colorIdx = active ? cur!.color : 0;
            const size = active ? cur!.size : defaultSize(p);
            return (
              <div
                key={p.slug}
                className={`relative border p-2 transition-all ${active ? "border-foreground ring-1 ring-foreground" : "border-border hover:border-foreground/40"}`}
              >
                <button
                  type="button"
                  onClick={() => update(tab, active ? null : { product: p, color: 0, size: defaultSize(p) })}
                  className="block w-full text-right"
                  aria-pressed={active}
                >
                  <img
                    src={p.colors[colorIdx]?.image ?? p.image}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-square w-full bg-secondary object-cover"
                  />
                  {active && (
                    <span className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
                      <Check className="h-3 w-3" aria-hidden />
                    </span>
                  )}
                  <p dir="ltr" className="mt-2 truncate text-left text-[11px] text-foreground/85">{p.name}</p>
                  <p dir="ltr" className="text-left text-[11px] font-medium">{formatPrice(p.price)}</p>
                </button>
                {p.colors.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5" dir="ltr">
                    {p.colors.map((c, i) => (
                      <button
                        key={c.name}
                        type="button"
                        title={c.nameAr || c.name}
                        onClick={() => update(tab, { product: p, color: i, size })}
                        className={`h-3.5 w-3.5 rounded-full border ${active && colorIdx === i ? "ring-1 ring-foreground ring-offset-1 ring-offset-background" : "border-border"}`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-1" dir="ltr">
                  {p.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => update(tab, { product: p, color: colorIdx, size: s })}
                      className={`min-w-[22px] border px-1 py-0.5 text-[9px] ${active && size === s ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          <Link
            to="/shop"
            className="flex aspect-square flex-col items-center justify-center gap-2 border border-dashed border-border text-[11px] text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-5 w-5" aria-hidden />
            اختر قطعة أخرى
          </Link>
        </div>
        {options.length === 0 && (
          <p className="mt-3 text-[12px] text-muted-foreground">لا توجد قطع في هذا القسم حاليًا.</p>
        )}
      </div>

      {/* Mannequin */}
      <div className="lg:sticky lg:top-24 lg:h-fit">
        <Mannequin sel={sel} />
      </div>

      {/* Summary */}
      <aside className="h-fit border border-border bg-background p-5 lg:sticky lg:top-24">
        <h3 className="text-lg font-semibold">إطلالتك</h3>
        {chosen.length === 0 ? (
          <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
            اختار القطع اللي على ذوقك، وهتظهر هنا مع السعر الإجمالي.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {chosen.map((c) => {
              const color = c.product.colors[c.color];
              return (
                <li key={c.key} className="flex items-start gap-3 py-3">
                  <img src={color?.image ?? c.product.image} alt="" className="h-16 w-16 shrink-0 border border-border object-cover" />
                  <div className="min-w-0 flex-1 text-[11px] leading-5">
                    <Link to="/product/$slug" params={{ slug: c.product.slug }} dir="ltr" className="block truncate text-right text-foreground hover:underline">
                      {c.product.name}
                    </Link>
                    {color && <p className="text-muted-foreground">اللون: {color.nameAr || color.name}</p>}
                    <p className="text-muted-foreground">المقاس: {c.size}</p>
                    <p dir="ltr" className="text-right font-medium">{formatPrice(c.product.price)}</p>
                  </div>
                  <button type="button" onClick={() => update(c.key, null)} aria-label="إزالة" className="text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[13px]">السعر الإجمالي</span>
          <span dir="ltr" className="text-lg font-semibold">{formatPrice(total)}</span>
        </div>

        <button
          type="button"
          onClick={saveLook}
          disabled={chosen.length === 0}
          className="mt-4 flex h-10 w-full items-center justify-center gap-2 border border-foreground/40 text-[12px] transition-colors hover:border-foreground disabled:opacity-40"
        >
          <Heart className="h-4 w-4" aria-hidden />
          {saved ? "تم حفظ الإطلالة ✓" : "حفظ الإطلالة"}
        </button>
        <button
          type="button"
          onClick={addLook}
          disabled={chosen.length === 0}
          className="mt-2 flex h-11 w-full items-center justify-center gap-2 bg-foreground text-[12px] text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden />
          {added ? "تمت الإضافة للسلة ✓" : "أضف الإطلالة إلى السلة"}
        </button>
      </aside>
    </div>
  );
}

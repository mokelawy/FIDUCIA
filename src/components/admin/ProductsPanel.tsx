import { useMemo, useRef, useState } from "react";
import { Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, COLLECTION_NAMES, stockStatus, STOCK_LABEL } from "@/lib/catalog";
import type { ProductRow, VariantRow } from "@/lib/catalog";
import type { AdminProductInput, AdminVariantInput } from "@/lib/admin.functions";

const input =
  "h-11 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-ink";
const btn = "label-xs h-11 bg-ink px-6 text-ink-foreground transition-opacity hover:opacity-90";
const ghost = "label-xs h-11 border border-border px-5 transition-colors hover:border-ink";

type ColorInput = { name: string; nameAr: string; hex: string; image: string };

type FormState = {
  id?: string;
  slug: string;
  name: string;
  name_ar: string;
  description: string;
  details: string;
  price: string;
  images: string[];
  category: string;
  collection: string;
  colors: ColorInput[];
  sizes: string;
  featured: boolean;
  is_new: boolean;
  active: boolean;
  sort_order: string;
  variants: Record<string, string>;
};

const emptyForm = (): FormState => ({
  slug: "",
  name: "",
  name_ar: "",
  description: "",
  details: "",
  price: "",
  images: [],
  category: "T-Shirts",
  collection: "Essentials",
  colors: [{ name: "Black", nameAr: "أسود", hex: "#141414", image: "" }],
  sizes: "S, M, L, XL",
  featured: false,
  is_new: false,
  active: true,
  sort_order: "0",
  variants: {},
});

function toForm(p: ProductRow, variants: VariantRow[]): FormState {
  const rawColors = Array.isArray(p.colors) ? (p.colors as unknown[]) : [];
  const map: Record<string, string> = {};
  for (const v of variants) map[`${v.color}__${v.size}`] = String(v.stock);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    name_ar: p.name_ar,
    description: p.description,
    details: (p.details ?? []).join("\n"),
    price: String(p.price),
    images: p.images ?? [],
    category: p.category,
    collection: p.collection,
    colors: rawColors.map((c) => {
      const o = (c ?? {}) as Record<string, unknown>;
      return {
        name: String(o["name"] ?? ""),
        nameAr: String(o["nameAr"] ?? ""),
        hex: String(o["hex"] ?? "#141414"),
        image: String(o["image"] ?? ""),
      };
    }),
    sizes: (p.sizes ?? []).join(", "),
    featured: p.featured,
    is_new: p.is_new,
    active: p.active,
    sort_order: String(p.sort_order),
    variants: map,
  };
}

async function uploadImage(file: File) {
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/[^\w.-]/g, "")}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "31536000",
  });
  if (error) throw new Error(error.message);
  const { data } = await supabase.storage
    .from("product-images")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (!data?.signedUrl) throw new Error("تعذر إنشاء رابط الصورة");
  return data.signedUrl;
}

export function ProductsPanel({
  products,
  variants,
  onSave,
  onDelete,
  onToggleActive,
  busy,
}: {
  products: ProductRow[];
  variants: VariantRow[];
  onSave: (input: AdminProductInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (id: string, active: boolean) => Promise<void>;
  busy: boolean;
}) {
  const [form, setForm] = useState<FormState | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const variantsByProduct = useMemo(() => {
    const map: Record<string, VariantRow[]> = {};
    for (const v of variants) (map[v.product_id] ??= []).push(v);
    return map;
  }, [variants]);

  const sizeList = form
    ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  async function handleFiles(files: FileList | null) {
    if (!files || !form) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push(await uploadImage(file));
      setForm((f) => (f ? { ...f, images: [...f.images, ...urls] } : f));
      toast.success("تم رفع الصور");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل رفع الصورة");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function submit() {
    if (!form) return;
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("الاسم والمعرّف (slug) مطلوبان");
      return;
    }
    const colors = form.colors.filter((c) => c.name.trim());
    const variantInputs: AdminVariantInput[] = [];
    for (const c of colors) {
      for (const s of sizeList) {
        variantInputs.push({
          color: c.name.trim(),
          size: s,
          stock: Number(form.variants[`${c.name.trim()}__${s}`] ?? 0) || 0,
        });
      }
    }
    const payload: AdminProductInput = {
      ...(form.id ? { id: form.id } : {}),
      slug: form.slug,
      name: form.name,
      name_ar: form.name_ar,
      description: form.description,
      details: form.details.split("\n").map((d) => d.trim()).filter(Boolean),
      price: Number(form.price) || 0,
      images: form.images,
      category: form.category,
      collection: form.collection,
      colors: colors.map((c) => ({
        name: c.name.trim(),
        nameAr: c.nameAr,
        hex: c.hex,
        image: c.image || form.images[0] || "",
      })),
      sizes: sizeList,
      featured: form.featured,
      is_new: form.is_new,
      active: form.active,
      sort_order: Number(form.sort_order) || 0,
      variants: variantInputs,
    };
    await onSave(payload);
    setForm(null);
  }

  if (form) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="serif-title text-2xl">{form.id ? "تعديل منتج" : "إضافة منتج"}</h2>
          <button className={ghost} onClick={() => setForm(null)}>
            إلغاء
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name / الاسم">
            <input
              className={input}
              value={form.name}
              onChange={(e) => {
                const v = e.target.value;
                setForm((f) =>
                  f
                    ? {
                        ...f,
                        name: v,
                        slug: f.id ? f.slug : v.trim().toLowerCase().replace(/\s+/g, "-"),
                      }
                    : f,
                );
              }}
            />
          </Field>
          <Field label="Slug">
            <input className={input} value={form.slug} onChange={(e) => set("slug", e.target.value)} />
          </Field>
          <Field label="الاسم بالعربية">
            <input className={input} value={form.name_ar} onChange={(e) => set("name_ar", e.target.value)} />
          </Field>
          <Field label="Price / السعر (ج.م)">
            <input className={input} inputMode="decimal" value={form.price} onChange={(e) => set("price", e.target.value)} />
          </Field>
          <Field label="Category">
            <select className={input} value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Collection">
            <select className={input} value={form.collection} onChange={(e) => set("collection", e.target.value)}>
              {COLLECTION_NAMES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sizes (مفصولة بفاصلة)">
            <input className={input} value={form.sizes} onChange={(e) => set("sizes", e.target.value)} />
          </Field>
          <Field label="Sort order">
            <input className={input} value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
          </Field>
        </div>

        <Field label="Description / الوصف">
          <textarea
            rows={3}
            className="w-full border border-border bg-transparent p-4 text-sm outline-none focus:border-ink"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
        <Field label="Details (سطر لكل تفصيلة)">
          <textarea
            rows={4}
            className="w-full border border-border bg-transparent p-4 text-sm outline-none focus:border-ink"
            value={form.details}
            onChange={(e) => set("details", e.target.value)}
          />
        </Field>

        <div>
          <p className="label-xs">Images / الصور</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {form.images.map((src) => (
              <div key={src} className="relative h-24 w-20 overflow-hidden border border-border">
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  className="absolute right-1 top-1 bg-ink p-1 text-ink-foreground"
                  onClick={() => set("images", form.images.filter((i) => i !== src))}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              className="flex h-24 w-20 items-center justify-center border border-dashed border-border"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="label-xs">Colors / الألوان</p>
            <button
              className={ghost}
              onClick={() => set("colors", [...form.colors, { name: "", nameAr: "", hex: "#141414", image: "" }])}
            >
              <Plus className="mr-1 inline h-3 w-3" /> لون
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {form.colors.map((c, i) => (
              <div key={i} className="grid gap-3 border border-border p-3 sm:grid-cols-[1fr_1fr_90px_1fr_40px]">
                <input
                  className={input}
                  placeholder="Name"
                  value={c.name}
                  onChange={(e) =>
                    set("colors", form.colors.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                  }
                />
                <input
                  className={input}
                  placeholder="بالعربية"
                  value={c.nameAr}
                  onChange={(e) =>
                    set("colors", form.colors.map((x, j) => (j === i ? { ...x, nameAr: e.target.value } : x)))
                  }
                />
                <input
                  type="color"
                  className="h-11 w-full border border-border bg-transparent"
                  value={c.hex}
                  onChange={(e) =>
                    set("colors", form.colors.map((x, j) => (j === i ? { ...x, hex: e.target.value } : x)))
                  }
                />
                <select
                  className={input}
                  value={c.image}
                  onChange={(e) =>
                    set("colors", form.colors.map((x, j) => (j === i ? { ...x, image: e.target.value } : x)))
                  }
                >
                  <option value="">— صورة اللون —</option>
                  {form.images.map((src, k) => (
                    <option key={src} value={src}>
                      صورة {k + 1}
                    </option>
                  ))}
                </select>
                <button
                  className="flex h-11 items-center justify-center border border-border"
                  onClick={() => set("colors", form.colors.filter((_, j) => j !== i))}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {form.colors.some((c) => c.name.trim()) && sizeList.length > 0 && (
          <div>
            <p className="label-xs">Inventory / المخزون لكل لون ومقاس</p>
            <div className="mt-3 overflow-x-auto border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-3 text-start label-xs">Color</th>
                    {sizeList.map((s) => (
                      <th key={s} className="p-3 label-xs">
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {form.colors
                    .filter((c) => c.name.trim())
                    .map((c) => (
                      <tr key={c.name} className="border-b border-border last:border-0">
                        <td className="p-3">{c.name}</td>
                        {sizeList.map((s) => {
                          const key = `${c.name.trim()}__${s}`;
                          return (
                            <td key={s} className="p-2">
                              <input
                                className="h-9 w-16 border border-border bg-transparent px-2 text-center text-sm outline-none focus:border-ink"
                                inputMode="numeric"
                                value={form.variants[key] ?? "0"}
                                onChange={(e) =>
                                  set("variants", { ...form.variants, [key]: e.target.value })
                                }
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-6">
          <Toggle label="Featured" checked={form.featured} onChange={(v) => set("featured", v)} />
          <Toggle label="New arrival" checked={form.is_new} onChange={(v) => set("is_new", v)} />
          <Toggle label="Active / ظاهر" checked={form.active} onChange={(v) => set("active", v)} />
        </div>

        <button className={btn} onClick={submit} disabled={busy || uploading}>
          {busy ? "جاري الحفظ…" : "حفظ المنتج"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="serif-title text-2xl">المنتجات ({products.length})</h2>
        <button className={btn} onClick={() => setForm(emptyForm())}>
          <Plus className="mr-1 inline h-3 w-3" /> إضافة منتج
        </button>
      </div>

      <div className="space-y-3">
        {products.map((p) => {
          const pv = variantsByProduct[p.id] ?? [];
          const total = pv.reduce((s, v) => s + v.stock, 0);
          const st = stockStatus(total);
          return (
            <div key={p.id} className="flex flex-wrap items-center gap-4 border border-border p-4">
              <img
                src={(p.images ?? [])[0] ?? "/seed/tee-black.jpg"}
                alt={p.name}
                className="h-16 w-14 object-cover"
              />
              <div className="min-w-[160px] flex-1">
                <p className="text-sm">{p.name}</p>
                <p className="arabic text-xs text-muted-foreground">{p.name_ar}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {Number(p.price).toLocaleString("en-US")} ج.م · {p.category} · {STOCK_LABEL[st].ar} ({total})
                </p>
              </div>
              <button className={ghost} onClick={() => setForm(toForm(p, pv))}>
                تعديل
              </button>
              <button className={ghost} onClick={() => void onToggleActive(p.id, !p.active)}>
                {p.active ? "إخفاء" : "إظهار"}
              </button>
              <button
                className={ghost}
                onClick={() => {
                  if (confirm(`حذف "${p.name}" نهائياً؟`)) void onDelete(p.id);
                }}
              >
                حذف
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label-xs">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="label-xs flex cursor-pointer items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

import type { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type VariantRow = Database["public"]["Tables"]["product_variants"]["Row"];

export type ProductColor = {
  name: string;
  nameAr: string;
  hex: string;
  image: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  price: number;
  image: string;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  description: string;
  details: string[];
  category: string;
  collection: string;
  stock: number;
  isNew: boolean;
  featured: boolean;
  active: boolean;
};

export type Variant = { color: string; size: string; stock: number };

const FALLBACK_IMAGE = "/seed/tee-black.jpg";

export function mapProduct(row: ProductRow): Product {
  const images = (row.images ?? []).filter(Boolean);
  const rawColors = Array.isArray(row.colors) ? (row.colors as unknown[]) : [];
  const colors: ProductColor[] = rawColors
    .filter((c): c is Record<string, unknown> => typeof c === "object" && c !== null)
    .map((c, i) => ({
      name: String(c["name"] ?? `Color ${i + 1}`),
      nameAr: String(c["nameAr"] ?? ""),
      hex: String(c["hex"] ?? "#141414"),
      image: String(c["image"] ?? images[i] ?? images[0] ?? FALLBACK_IMAGE),
    }));

  const image = images[0] ?? colors[0]?.image ?? FALLBACK_IMAGE;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameAr: row.name_ar,
    price: Number(row.price),
    image,
    images: images.length > 0 ? images : [image],
    colors: colors.length > 0 ? colors : [{ name: "Default", nameAr: "", hex: "#141414", image }],
    sizes: row.sizes ?? [],
    description: row.description,
    details: row.details ?? [],
    category: row.category,
    collection: row.collection,
    stock: row.stock,
    isNew: row.is_new,
    featured: row.featured,
    active: row.active,
  };
}

export function mapVariants(rows: VariantRow[]): Variant[] {
  return rows.map((v) => ({ color: v.color, size: v.size, stock: v.stock }));
}

export function variantStock(variants: Variant[], color: string, size: string) {
  return variants.find((v) => v.color === color && v.size === size)?.stock ?? 0;
}

export type StockStatus = "in" | "low" | "out";

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out";
  if (stock <= 3) return "low";
  return "in";
}

export const STOCK_LABEL: Record<StockStatus, { en: string; ar: string }> = {
  in: { en: "In Stock", ar: "متوفر" },
  low: { en: "Low Stock", ar: "الكمية محدودة" },
  out: { en: "Out of Stock", ar: "غير متوفر" },
};

export const CATEGORIES = ["All", "T-Shirts", "Shirts", "Pants", "Hoodies", "Accessories"] as const;
export const COLLECTION_NAMES = ["Essentials", "Core Black", "Neutrals"] as const;

export const ORDER_STATUSES = [
  "new",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, { en: string; ar: string }> = {
  new: { en: "New", ar: "جديد" },
  confirmed: { en: "Confirmed", ar: "تم التأكيد" },
  preparing: { en: "Preparing", ar: "قيد التجهيز" },
  shipped: { en: "Shipped", ar: "تم الشحن" },
  delivered: { en: "Delivered", ar: "تم التوصيل" },
  cancelled: { en: "Cancelled", ar: "ملغي" },
};

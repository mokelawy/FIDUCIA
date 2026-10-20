import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AdminVariantInput = { color: string; size: string; stock: number };

export type AdminProductInput = {
  id?: string | undefined;
  slug: string;
  name: string;
  name_ar: string;
  description: string;
  details: string[];
  price: number;
  images: string[];
  category: string;
  collection: string;
  colors: { name: string; nameAr: string; hex: string; image: string }[];
  sizes: string[];
  featured: boolean;
  is_new: boolean;
  active: boolean;
  sort_order: number;
  variants: AdminVariantInput[];
};

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: Boolean(data) };
  });

export const claimAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("claim_admin");
    if (error) throw new Error(error.message);
    return { isAdmin: Boolean(data) };
  });

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: products, error }, { data: variants }] = await Promise.all([
      context.supabase.from("products").select("*").order("sort_order").order("created_at"),
      context.supabase.from("product_variants").select("*"),
    ]);
    if (error) throw new Error(error.message);
    return { products: products ?? [], variants: variants ?? [] };
  });

export const adminSaveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: AdminProductInput) => input)
  .handler(async ({ data, context }) => {
    const { variants, id, ...fields } = data;
    const payload = {
      ...fields,
      slug: fields.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      price: Number(fields.price) || 0,
      stock: variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0),
      colors: fields.colors,
    };

    let productId = id;
    if (productId) {
      const { error } = await context.supabase
        .from("products")
        .update(payload)
        .eq("id", productId);
      if (error) throw new Error(error.message);
    } else {
      const { data: created, error } = await context.supabase
        .from("products")
        .insert(payload)
        .select("id")
        .single();
      if (error || !created) throw new Error(error?.message ?? "Could not create product");
      productId = created.id;
    }

    await context.supabase.from("product_variants").delete().eq("product_id", productId);
    if (variants.length > 0) {
      const { error } = await context.supabase.from("product_variants").insert(
        variants.map((v) => ({
          product_id: productId!,
          color: v.color,
          size: v.size,
          stock: Math.max(0, Number(v.stock) || 0),
        })),
      );
      if (error) throw new Error(error.message);
    }
    return { id: productId };
  });

export const adminSetProductActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; active: boolean }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("products")
      .update({ active: data.active })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await context.supabase.from("product_variants").delete().eq("product_id", data.id);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: orders, error }, { data: items }] = await Promise.all([
      context.supabase.from("orders").select("*").order("created_at", { ascending: false }),
      context.supabase.from("order_items").select("*"),
    ]);
    if (error) throw new Error(error.message);
    return { orders: orders ?? [], items: items ?? [] };
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: string }) => input)
  .handler(async ({ data, context }) => {
    const patch: Record<string, unknown> = { status: data.status };
    const now = new Date().toISOString();
    if (data.status === "shipped") patch["shipped_at"] = now;
    if (data.status === "delivered") patch["delivered_at"] = now;
    const { error } = await context.supabase
      .from("orders")
      .update(patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminGetSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("store_settings").select("key, value");
    const map: Record<string, string> = {};
    for (const row of data ?? []) map[row.key] = row.value;
    return map;
  });

export const adminSaveSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { settings: Record<string, string> }) => input)
  .handler(async ({ data, context }) => {
    const rows = Object.entries(data.settings).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString(),
    }));
    const { error } = await context.supabase.from("store_settings").upsert(rows);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

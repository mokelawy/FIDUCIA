import { createServerFn } from "@tanstack/react-start";

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicSupabase } = await import("./supabase-public.server");
  const supabase = createPublicSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getProductDetail = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => ({ slug: String(input.slug) }))
  .handler(async ({ data }) => {
    const { createPublicSupabase } = await import("./supabase-public.server");
    const supabase = createPublicSupabase();
    const { data: product } = await supabase
      .from("products")
      .select("*")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (!product) return null;

    const [{ data: variants }, { data: related }] = await Promise.all([
      supabase.from("product_variants").select("*").eq("product_id", product.id),
      supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .neq("slug", data.slug)
        .order("sort_order", { ascending: true })
        .limit(4),
    ]);

    return { product, variants: variants ?? [], related: related ?? [] };
  });

export const getStoreSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicSupabase } = await import("./supabase-public.server");
  const supabase = createPublicSupabase();
  const { data } = await supabase.from("store_settings").select("key, value");
  const map: Record<string, string> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
});

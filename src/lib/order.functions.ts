import { createServerFn } from "@tanstack/react-start";

export type PlaceOrderItem = {
  productId?: string | undefined;
  slug: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
};

export type PlaceOrderInput = {
  items: PlaceOrderItem[];
  customer: {
    name: string;
    phone: string;
    governorate: string;
    city: string;
    address: string;
    notes: string;
  };
};

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((input: PlaceOrderInput) => {
    if (!Array.isArray(input.items) || input.items.length === 0) {
      throw new Error("Cart is empty");
    }
    const c = input.customer;
    if (!c || c.name.trim().length < 3) throw new Error("Invalid name");
    if (!/^01[0-9]{9}$/.test(c.phone.trim())) throw new Error("Invalid phone");
    if (!c.governorate.trim()) throw new Error("Governorate required");
    if (c.address.trim().length < 8) throw new Error("Invalid address");
    return {
      items: input.items.slice(0, 50).map((i) => ({
        productId: i.productId,
        slug: String(i.slug),
        name: String(i.name),
        color: String(i.color),
        size: String(i.size),
        quantity: Math.max(1, Math.min(20, Number(i.quantity) || 1)),
      })),
      customer: {
        name: c.name.trim().slice(0, 80),
        phone: c.phone.trim(),
        governorate: c.governorate.trim(),
        city: c.city.trim().slice(0, 80),
        address: c.address.trim().slice(0, 300),
        notes: (c.notes ?? "").trim().slice(0, 300),
      },
    } satisfies PlaceOrderInput;
  })
  .handler(async ({ data }) => {
    const { createPublicSupabase } = await import("./supabase-public.server");
    const supabase = createPublicSupabase();

    const slugs = [...new Set(data.items.map((i) => i.slug))];
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id, slug, name, price, active")
      .in("slug", slugs)
      .eq("active", true);
    if (productError) throw new Error(productError.message);

    const bySlug = new Map((products ?? []).map((p) => [p.slug, p]));
    const priced = data.items.map((item) => {
      const product = bySlug.get(item.slug);
      if (!product) throw new Error(`Product unavailable: ${item.name}`);
      return {
        product_id: product.id,
        product_name: product.name,
        slug: product.slug,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: Number(product.price),
      };
    });

    const { data: settingRows } = await supabase
      .from("store_settings")
      .select("key, value")
      .in("key", ["shipping_fee", "whatsapp_number"]);
    const settings: Record<string, string> = {};
    for (const row of settingRows ?? []) settings[row.key] = row.value;

    const subtotal = priced.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = Number(settings["shipping_fee"] ?? 70) || 0;
    const total = subtotal + shipping;

    const { data: seq, error: seqError } = await supabase.rpc("next_order_number");
    if (seqError) throw new Error(seqError.message);
    const orderNumber = `FD-${String(seq).padStart(5, "0")}`;

    const orderId = crypto.randomUUID();
    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      order_number: orderNumber,
      customer_name: data.customer.name,
      customer_phone: data.customer.phone,
      governorate: data.customer.governorate,
      city: data.customer.city,
      address: data.customer.address,
      notes: data.customer.notes,
      subtotal,
      shipping,
      total,
      status: "new",
    });
    if (orderError) throw new Error(orderError.message);

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(priced.map((i) => ({ ...i, order_id: orderId })));
    if (itemsError) throw new Error(itemsError.message);

    return {
      orderNumber,
      subtotal,
      shipping,
      total,
      whatsappNumber: settings["whatsapp_number"] ?? "",
      items: priced.map((i) => ({
        name: i.product_name,
        color: i.color,
        size: i.size,
        quantity: i.quantity,
        price: i.price,
      })),
    };
  });

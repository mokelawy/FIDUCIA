import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useCart, saveOrder } from "@/lib/cart";
import { formatPrice } from "@/data/products";
import { getStoreSettings } from "@/lib/store.functions";
import { placeOrder } from "@/lib/order.functions";
import { buildOrderMessage, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/checkout")({
  loader: async () => ({ settings: await getStoreSettings() }),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Checkout | FIDUCIA" },
      {
        name: "description",
        content: "Complete your FIDUCIA order with cash on delivery across Egypt.",
      },
      { property: "og:title", content: "Checkout | FIDUCIA" },
      { property: "og:description", content: "Cash on delivery across all Egyptian governorates." },
    ],
  }),
  component: CheckoutPage,
});

const GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Dakahlia",
  "Sharqia",
  "Gharbia",
  "Monufia",
  "Beheira",
  "Port Said",
  "Suez",
  "Ismailia",
  "Fayoum",
  "Beni Suef",
  "Minya",
  "Asyut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan",
  "Red Sea",
  "Matrouh",
  "North Sinai",
  "South Sinai",
  "New Valley",
  "Damietta",
  "Kafr El Sheikh",
];

const inputClass =
  "h-11 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-ink";

function CheckoutPage() {
  const { settings } = Route.useLoaderData();
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const submitOrder = useServerFn(placeOrder);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    governorate: "",
    city: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const shippingFee = Number(settings["shipping_fee"] ?? 70) || 0;
  const shipping = items.length > 0 ? shippingFee : 0;
  const total = subtotal + shipping;

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your bag is empty");
      return;
    }
    if (form.name.trim().length < 3) { toast.error("Please enter your full name"); return; }
    if (!/^01[0-2,5]{1}[0-9]{8}$/.test(form.phone.trim())) {
      toast.error("Please enter a valid Egyptian mobile number");
      return;
    }
    if (!form.governorate) { toast.error("Please select a governorate"); return; }
    if (form.city.trim().length < 2) { toast.error("Please enter your city or area"); return; }
    if (form.address.trim().length < 8) { toast.error("Please enter a full street address"); return; }

    setSubmitting(true);
    try {
      const result = await submitOrder({
        data: {
          items: items.map((i) => ({
            productId: i.productId,
            slug: i.slug,
            name: i.name,
            color: i.color,
            size: i.size,
            quantity: i.quantity,
          })),
          customer: { ...form },
        },
      });

      saveOrder({
        orderNumber: result.orderNumber,
        items,
        total: result.total,
        customer: { ...form },
        createdAt: new Date().toISOString(),
      });

      const message = buildOrderMessage({
        orderNumber: result.orderNumber,
        items,
        customer: { ...form },
        subtotal: result.subtotal,
        shipping: result.shipping,
        total: result.total,
      });

      const number = result.whatsappNumber || settings["whatsapp_number"] || "";
      if (number) window.open(whatsappLink(number, message), "_blank", "noopener");

      clear();
      navigate({ to: "/order-confirmed" });
    } catch (error) {
      console.error(error);
      toast.error("Could not place your order. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-background py-14">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
        <h1 className="serif-title text-3xl sm:text-[2.5rem]">Checkout</h1>
        <p className="arabic mt-1 text-sm text-muted-foreground">إتمام الطلب — الدفع عند الاستلام</p>

        <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <div>
              <label className="label-xs" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                value={form.name}
                maxLength={80}
                onChange={(e) => set("name")(e.target.value)}
                className={`${inputClass} mt-2`}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label-xs" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  inputMode="tel"
                  placeholder="01XXXXXXXXX"
                  value={form.phone}
                  maxLength={15}
                  onChange={(e) => set("phone")(e.target.value)}
                  className={`${inputClass} mt-2`}
                />
              </div>
              <div>
                <label className="label-xs" htmlFor="gov">
                  Governorate
                </label>
                <select
                  id="gov"
                  value={form.governorate}
                  onChange={(e) => set("governorate")(e.target.value)}
                  className={`${inputClass} mt-2`}
                >
                  <option value="">Select governorate</option>
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label-xs" htmlFor="city">
                City / Area
              </label>
              <input
                id="city"
                value={form.city}
                maxLength={80}
                onChange={(e) => set("city")(e.target.value)}
                className={`${inputClass} mt-2`}
              />
            </div>
            <div>
              <label className="label-xs" htmlFor="address">
                Street Address
              </label>
              <textarea
                id="address"
                rows={3}
                value={form.address}
                maxLength={300}
                onChange={(e) => set("address")(e.target.value)}
                className="mt-2 w-full border border-border bg-transparent p-4 text-sm outline-none transition-colors focus:border-ink"
              />
            </div>
            <div>
              <label className="label-xs" htmlFor="notes">
                Order Notes (optional)
              </label>
              <textarea
                id="notes"
                rows={2}
                value={form.notes}
                maxLength={300}
                onChange={(e) => set("notes")(e.target.value)}
                className="mt-2 w-full border border-border bg-transparent p-4 text-sm outline-none transition-colors focus:border-ink"
              />
            </div>

            <div className="border border-border p-5">
              <p className="label-xs">Payment</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Cash on delivery. Pay the courier when your order arrives.
              </p>
              <p className="arabic mt-1 text-sm text-muted-foreground">
                سيتم إرسال تفاصيل الطلب على واتساب لتأكيده.
              </p>
            </div>
          </div>

          <aside className="h-fit border border-border p-6">
            <h2 className="label-xs">Order Summary</h2>
            <ul className="mt-5 space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <img src={item.image} alt={item.name} loading="lazy" className="h-20 w-14 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs">{item.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {item.color} / {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs font-medium">{formatPrice(item.price * item.quantity)}</p>
                </li>
              ))}
              {items.length === 0 && (
                <li className="text-xs text-muted-foreground">
                  Your bag is empty.{" "}
                  <Link to="/shop" className="underline">
                    Shop now
                  </Link>
                </li>
              )}
            </ul>
            <dl className="mt-6 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{formatPrice(shipping)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="label-xs mt-6 flex h-11 w-full items-center justify-center bg-ink text-ink-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Placing Order…" : "Place Order via WhatsApp"}
            </button>
          </aside>
        </form>
      </div>
    </section>
  );
}

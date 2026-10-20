import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { loadOrder, type Order } from "@/lib/cart";
import { formatPrice } from "@/data/products";

export const Route = createFileRoute("/order-confirmed")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Order Confirmed | FIDUCIA" },
      { name: "description", content: "Your FIDUCIA order has been placed successfully." },
      { property: "og:title", content: "Order Confirmed | FIDUCIA" },
      { property: "og:description", content: "Thank you for shopping with FIDUCIA." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmed,
});

function OrderConfirmed() {
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => setOrder(loadOrder()), []);

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-[720px] px-6 text-center sm:px-10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ink text-ink-foreground">
          <Check className="h-6 w-6" />
        </div>
        <h1 className="serif-title mt-6 text-3xl sm:text-[2.5rem]">Thank you</h1>
        <p className="arabic mt-1 text-sm text-muted-foreground">تم استلام طلبك</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Your order has been placed. Our team will call you shortly to confirm delivery.
        </p>

        {order && (
          <div className="mt-10 border border-border p-6 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="label-xs">Order {order.orderNumber}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>
            <ul className="mt-5 divide-y divide-border border-y border-border">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
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
            </ul>
            <div className="mt-4 flex justify-between text-sm font-medium">
              <span>Total (cash on delivery)</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
              <p className="text-foreground">{order.customer.name}</p>
              <p className="mt-1">{order.customer.phone}</p>
              <p className="mt-1">
                {order.customer.address}, {order.customer.city}, {order.customer.governorate}
              </p>
            </div>
          </div>
        )}

        <Link
          to="/shop"
          className="label-xs mt-10 inline-flex h-11 items-center bg-ink px-8 text-ink-foreground"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

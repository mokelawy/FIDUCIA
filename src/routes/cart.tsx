import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/data/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Your Bag | FIDUCIA" },
      { name: "description", content: "Review the FIDUCIA pieces in your bag before checkout." },
      { property: "og:title", content: "Your Bag | FIDUCIA" },
      { property: "og:description", content: "Review your FIDUCIA selection before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <section className="bg-background py-14">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
        <h1 className="serif-title text-3xl sm:text-[2.5rem]">Your Bag</h1>
        <p className="arabic mt-1 text-sm text-muted-foreground">حقيبتك</p>

        {items.length === 0 ? (
          <div className="mt-12 border border-border py-20 text-center">
            <p className="label-xs text-muted-foreground">Your bag is empty</p>
            <Link
              to="/shop"
              className="label-xs mt-6 inline-flex h-11 items-center bg-ink px-8 text-ink-foreground"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
            <ul className="divide-y divide-border border-y border-border">
              {items.map((item) => (
                <li key={item.id} className="flex gap-5 py-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-36 w-28 object-cover"
                  />
                  <div className="flex-1">
                    <p className="label-xs">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.color} / {item.size}
                    </p>
                    <p className="mt-2 text-sm font-medium">{formatPrice(item.price)}</p>
                    <div className="mt-4 flex items-center gap-5">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="px-2.5 py-1.5"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="px-2.5 py-1.5"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <aside className="h-fit border border-border p-6">
              <h2 className="label-xs">Order Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="text-muted-foreground">Calculated at checkout</dd>
                </div>
              </dl>
              <div className="mt-5 flex justify-between border-t border-border pt-4 text-sm font-medium">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <Link
                to="/checkout"
                className="label-xs mt-6 flex h-11 items-center justify-center bg-ink text-ink-foreground transition-opacity hover:opacity-90"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/shop"
                className="label-xs mt-2 flex h-11 items-center justify-center border border-ink transition-colors hover:bg-ink hover:text-ink-foreground"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/data/products";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, setOpen, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-[70] bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        aria-hidden={!isOpen}
        className={cn(
          "fixed right-0 top-0 z-[80] flex h-full w-full max-w-[420px] flex-col bg-background transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="label-xs">Your Bag ({items.length})</h2>
          <button type="button" aria-label="Close cart" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <p className="label-xs py-16 text-center text-muted-foreground">
              Your bag is empty
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-28 w-20 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="label-xs truncate">{item.name}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {item.color} / {item.size}
                    </p>
                    <p className="mt-1 text-[13px] font-medium">{formatPrice(item.price)}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="px-2 py-1"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="px-2 py-1"
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
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="label-xs">Subtotal</span>
            <span className="text-sm font-medium">{formatPrice(subtotal)}</span>
          </div>
          <Link
            to="/checkout"
            onClick={() => setOpen(false)}
            className={cn(
              "label-xs mt-4 flex h-11 items-center justify-center bg-ink text-ink-foreground transition-opacity hover:opacity-90",
              items.length === 0 && "pointer-events-none opacity-40",
            )}
          >
            Checkout
          </Link>
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="label-xs mt-2 flex h-11 items-center justify-center border border-ink transition-colors hover:bg-ink hover:text-ink-foreground"
          >
            View Bag
          </Link>
        </div>
      </aside>
    </>
  );
}

import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { CartDrawer } from "./CartDrawer";
import { cn } from "@/lib/utils";
import wordmarkAsset from "@/assets/fiducia-wordmark.png";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "Lookbook", to: "/lookbook" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function Header() {
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="bg-ink text-ink-foreground/80">
        <div className="mx-auto flex h-8 max-w-[1400px] items-center justify-center gap-2 px-4">
          <ShoppingBag className="h-3 w-3" aria-hidden />
          <p className="eyebrow">Free shipping on orders over 3 items</p>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-ink-foreground/5 bg-ink text-ink-foreground">
        <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-4 px-5 sm:px-8">
          <Link to="/" aria-label="FIDUCIA home" className="block">
            <img
              src={wordmarkAsset}
              alt="FIDUCIA"
              className="h-6 w-auto object-contain sm:h-7"
            />
          </Link>

          <nav className="hidden items-center justify-center gap-9 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="label-xs relative py-1 text-ink-foreground/75 transition-colors hover:text-ink-foreground after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100 data-[status=active]:text-ink-foreground data-[status=active]:after:scale-x-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-4 sm:gap-5">
            <button
              type="button"
              aria-label="Search products"
              onClick={() => setSearchOpen((v) => !v)}
              className="transition-opacity hover:opacity-70"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Link
              to="/account"
              aria-label="Account"
              className="hidden transition-opacity hover:opacity-70 sm:block"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>
            <button
              type="button"
              aria-label="Open cart"
              onClick={() => setOpen(true)}
              className="relative transition-opacity hover:opacity-70"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-ink-foreground text-[9px] font-medium text-ink">
                {count}
              </span>
            </button>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t border-ink-foreground/5 transition-[max-height] duration-300",
            searchOpen ? "max-h-20" : "max-h-0",
          )}
        >
          <form
            className="mx-auto flex max-w-[1400px] items-center gap-3 px-5 py-4 sm:px-8"
            onSubmit={(e) => {
              e.preventDefault();
              setSearchOpen(false);
              navigate({ to: "/shop", search: { q: query || undefined } });
            }}
          >
            <Search className="h-4 w-4 opacity-60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search FIDUCIA"
              className="label-xs w-full bg-transparent py-1 text-ink-foreground outline-none placeholder:text-ink-foreground/40"
            />
          </form>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-ink text-ink-foreground transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <img
            src={wordmarkAsset}
            alt="FIDUCIA"
            className="h-6 w-auto object-contain"
          />
          <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-6 px-5 pt-10">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="serif-title text-3xl"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <CartDrawer />
    </>
  );
}

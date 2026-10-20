import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Music2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SOCIAL_LINKS } from "@/lib/social";
import { WHATSAPP_DISPLAY_NUMBER, whatsappInquiryLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-ink text-ink-foreground">
      {/* Newsletter */}
      <div className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:py-14">
          <div>
            <p className="eyebrow text-ink-foreground/60">Stay Updated</p>
            <h2 className="serif-title mt-2 text-2xl sm:text-3xl">Join the FIDUCIA Club</h2>
            <p className="arabic mt-1 text-sm text-ink-foreground/60">كن جزءًا من فيدوتشا</p>
          </div>
          <form
            className="flex w-full max-w-xl gap-0 lg:justify-self-end"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
                toast.error("Please enter a valid email address");
                return;
              }
              setEmail("");
              toast.success("You're on the list.");
            }}
          >
            <input
              type="email"
              value={email}
              maxLength={255}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address"
              className="h-11 w-full border border-ink-foreground/25 bg-transparent px-4 text-xs tracking-wide outline-none placeholder:text-ink-foreground/40 focus:border-ink-foreground/60"
            />
            <Button
              type="submit"
              variant="outline"
              className="label-xs h-11 shrink-0 border-ink-foreground/25 bg-ink px-6 text-ink-foreground transition-colors hover:border-ink-foreground hover:bg-ink hover:text-ink-foreground"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-14 sm:px-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="serif-title text-2xl tracking-[0.2em]">FIDUCIA</p>
          <p className="mt-3 text-xs text-ink-foreground/60">Timeless. Refined. Yours.</p>
          <p className="arabic mt-1 text-xs text-ink-foreground/60">أسلوبك. بطريقتك.</p>
        </div>

        <div>
          <p className="eyebrow text-ink-foreground/50">Shop</p>
          <ul className="mt-4 space-y-2 text-xs text-ink-foreground/70">
            <li>
              <Link to="/shop" className="hover:text-ink-foreground">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ category: "T-Shirts" }} className="hover:text-ink-foreground">
                T-Shirts
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ category: "Shirts" }} className="hover:text-ink-foreground">
                Shirts
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ category: "Pants" }} className="hover:text-ink-foreground">
                Pants
              </Link>
            </li>
            <li>
              <Link to="/collections" className="hover:text-ink-foreground">
                Collections
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ink-foreground/50">Customer Care</p>
          <ul className="mt-4 space-y-2 text-xs text-ink-foreground/70">
            <li>
              <Link to="/cart" className="hover:text-ink-foreground">
                My Bag
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-ink-foreground">
                Shipping &amp; Delivery
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-ink-foreground">
                Returns &amp; Exchanges
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-ink-foreground">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-ink-foreground">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ink-foreground/50">Connect</p>
          <div className="mt-4 flex gap-3">
            {SOCIAL_LINKS.map((item) => {
              const Icon =
                item.label === "Instagram"
                  ? Instagram
                  : item.label === "Facebook"
                    ? Facebook
                    : item.label === "TikTok"
                      ? Music2
                      : MessageCircle;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`FIDUCIA on ${item.label}`}
                  title={item.label}
                  className="grid h-8 w-8 place-items-center rounded-full border border-border bg-ink transition-colors hover:border-ink-foreground"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              );
            })}
          </div>
          <a
            href={whatsappInquiryLink()}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 block text-xs text-ink-foreground/70 hover:text-ink-foreground"
          >
            {WHATSAPP_DISPLAY_NUMBER}
          </a>
          <a
            href="mailto:fiduciabrand1@gmail.com"
            className="mt-1 block text-xs text-ink-foreground/70 hover:text-ink-foreground"
          >
            fiduciabrand1@gmail.com
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-5 text-[11px] text-ink-foreground/50 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>© 2026 FIDUCIA. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-ink-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-ink-foreground">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

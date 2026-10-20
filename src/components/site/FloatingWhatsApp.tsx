import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import {
  WHATSAPP_DEFAULT_MESSAGE,
  WHATSAPP_DISPLAY_NUMBER,
  whatsappInquiryLink,
} from "@/lib/whatsapp";
import wordmarkAsset from "@/assets/fiducia-wordmark.png";
import { Button } from "@/components/ui/button";

/**
 * Premium floating WhatsApp contact bar.
 * - Mobile/tablet: full-width fixed card near the bottom (safe-area aware).
 * - Desktop: compact pill widget anchored bottom-right.
 *
 * The WhatsApp number lives in one place: `SITE_WHATSAPP_NUMBER` in @/lib/whatsapp.
 * Replace that value there to update the number everywhere.
 */
export function FloatingWhatsApp() {
  const [mounted, setMounted] = useState(false);

  // Defer the entrance so it slides up shortly after first paint.
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  const href = whatsappInquiryLink();
  const enterClass = mounted ? "fiducia-wa-enter" : "opacity-0";

  return (
    <>
      {/* ---- Mobile / tablet card ---- */}
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-[45] px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] lg:hidden ${enterClass}`}
      >
        <div className="fiducia-wa-float pointer-events-auto mx-auto flex w-full max-w-[480px] items-center gap-3 rounded-2xl bg-ink p-2.5 text-ink-foreground shadow-[0_14px_44px_-14px_rgba(0,0,0,0.65)] ring-1 ring-ink-foreground/5">
          {/* Brand block */}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <img
              src={wordmarkAsset}
              alt="FIDUCIA"
              className="h-5 w-auto shrink-0 object-contain"
            />
            <span className="arabic min-w-0 truncate text-[11px] leading-none text-ink-foreground/70">
              فيدوتشا · <span dir="ltr" className="inline-block">{WHATSAPP_DISPLAY_NUMBER}</span>
            </span>
          </div>

          {/* WhatsApp button */}
          <Button asChild variant="outline" className="h-auto shrink-0 gap-2 rounded-xl border-ink-foreground/40 bg-ink px-4 py-2.5 text-ink-foreground transition-transform duration-200 ease-out hover:scale-[1.06] hover:bg-ink hover:text-ink-foreground active:scale-95">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`WhatsApp ${WHATSAPP_DISPLAY_NUMBER}`}
            title="تواصل معنا عبر واتساب"
          >
            <MessageCircle className="h-5 w-5" fill="currentColor" strokeWidth={0} />
            <span className="label-xs">WhatsApp</span>
          </a>
          </Button>
        </div>
      </div>

      {/* ---- Desktop compact widget ---- */}
      <div
        className={`pointer-events-none fixed bottom-6 right-6 z-[45] hidden lg:block ${enterClass}`}
      >
        <div className="fiducia-wa-float pointer-events-auto flex items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-ink-foreground shadow-[0_14px_44px_-16px_rgba(0,0,0,0.6)] ring-1 ring-ink-foreground/5">
          <span className="flex items-center gap-2.5">
            <img
              src={wordmarkAsset}
              alt="FIDUCIA"
              className="h-5 w-auto shrink-0 object-contain"
            />
            <span className="h-3 w-px bg-ink-foreground/20" />
            <span className="arabic text-[11px] text-ink-foreground/70">
              فيدوتشا
            </span>
          </span>
          <Button asChild variant="outline" className="h-auto gap-2 rounded-full border-ink-foreground/40 bg-ink px-4 py-2 text-ink-foreground transition-transform duration-200 ease-out hover:scale-[1.06] hover:bg-ink hover:text-ink-foreground active:scale-95">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`WhatsApp ${WHATSAPP_DISPLAY_NUMBER}`}
            title="تواصل معنا عبر واتساب"
          >
            <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
            <span className="label-xs">WhatsApp</span>
          </a>
          </Button>
        </div>
      </div>
    </>
  );
}

// Re-exported default message for consumers that want to customise the link text.
export { WHATSAPP_DEFAULT_MESSAGE };

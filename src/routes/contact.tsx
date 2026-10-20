import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Contact Us | FIDUCIA" },
      {
        name: "description",
        content: "Questions about sizing, orders or delivery? Reach the FIDUCIA team.",
      },
      { property: "og:title", content: "Contact Us | FIDUCIA" },
      { property: "og:description", content: "Reach the FIDUCIA team for orders and sizing help." },
    ],
  }),
  component: ContactPage,
});

const inputClass =
  "h-11 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-ink";

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <section className="bg-background py-14 sm:py-16">
      <div className="mx-auto grid max-w-275 gap-12 px-6 sm:px-10 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="eyebrow text-muted-foreground">Contact</p>
          <h1 className="serif-title mt-3 text-3xl sm:text-[2.5rem]">Get in touch</h1>
          <p className="arabic mt-1 text-sm text-muted-foreground">تواصل معنا</p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (form.name.trim().length < 2) { toast.error("Please enter your name"); return; }
              if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
                toast.error("Please enter a valid email");
                return;
              }
              if (form.message.trim().length < 10) {
                toast.error("Please write a little more detail");
                return;
              }
              setForm({ name: "", email: "", message: "" });
              toast.success("Thanks — we'll reply within 24 hours.");
            }}
          >
            <div>
              <label className="label-xs" htmlFor="c-name">
                Name
              </label>
              <input
                id="c-name"
                value={form.name}
                maxLength={80}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={`${inputClass} mt-2`}
              />
            </div>
            <div>
              <label className="label-xs" htmlFor="c-email">
                Email
              </label>
              <input
                id="c-email"
                type="email"
                value={form.email}
                maxLength={255}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={`${inputClass} mt-2`}
              />
            </div>
            <div>
              <label className="label-xs" htmlFor="c-message">
                Message
              </label>
              <textarea
                id="c-message"
                rows={5}
                value={form.message}
                maxLength={1000}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="mt-2 w-full border border-border bg-transparent p-4 text-sm outline-none transition-colors focus:border-ink"
              />
            </div>
            <button
              type="submit"
              className="label-xs h-11 bg-ink px-8 text-ink-foreground transition-opacity hover:opacity-90"
            >
              Send Message
            </button>
          </form>
        </div>

        <aside className="h-fit border border-border p-6 text-sm text-muted-foreground">
          <h2 className="label-xs text-foreground">Customer Care</h2>
          <p className="mt-4 flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4" /> fiduciabrand1@gmail.com
          </p>
          <p className="mt-3 flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4" /> 01142679416
          </p>
          <p className="mt-3 flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4" />  Assiut,Egypt
          </p>
          <p className="mt-6 border-t border-border pt-4 text-xs">
            Sunday – Thursday, 10:00 – 18:00 (EET)
          </p>
        </aside>
      </div>
    </section>
  );
}

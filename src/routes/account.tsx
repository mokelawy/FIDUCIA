import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Account | FIDUCIA" },
      {
        name: "description",
        content: "Track your FIDUCIA order or reach customer care for help with a purchase.",
      },
      { property: "og:title", content: "Account | FIDUCIA" },
      { property: "og:description", content: "Order help and customer care for FIDUCIA shoppers." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  return (
    <InfoPage eyebrow="Account" title="Your Account" titleAr="حسابك">
      <p>
        FIDUCIA orders are placed as a guest with cash on delivery — no account needed. Keep your
        order number handy and our team will help with anything you need.
      </p>
      <p>
        To check an order status, email{" "}
        <span className="text-foreground">care@fiducia.eg</span> with your order number, or reach us
        from the{" "}
        <Link to="/contact" className="text-foreground underline underline-offset-4">
          contact page
        </Link>
        .
      </p>
      <p>
        Saved accounts with order history and faster checkout are coming soon to FIDUCIA.
      </p>
    </InfoPage>
  );
}

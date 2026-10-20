import { createFileRoute } from "@tanstack/react-router";
import { InfoBlock, InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Shipping & Delivery | FIDUCIA" },
      {
        name: "description",
        content:
          "FIDUCIA delivery times, shipping rates and cash on delivery details for every Egyptian governorate.",
      },
      { property: "og:title", content: "Shipping & Delivery | FIDUCIA" },
      {
        property: "og:description",
        content: "Delivery times and rates across every Egyptian governorate.",
      },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <InfoPage eyebrow="Customer Care" title="Shipping & Delivery" titleAr="الشحن والتوصيل">
      <InfoBlock heading="Delivery Times">
        <p>Cairo &amp; Giza: 1–3 business days.</p>
        <p>Delta &amp; Alexandria: 2–4 business days.</p>
        <p>Upper Egypt, Sinai, Red Sea &amp; New Valley: 3–6 business days.</p>
      </InfoBlock>
      <InfoBlock heading="Shipping Rates">
        <p>Flat 70 EGP nationwide, added at checkout.</p>
        <p>Free shipping on orders of 3 items or more.</p>
      </InfoBlock>
      <InfoBlock heading="Payment">
        <p>Cash on delivery only — pay the courier when your order arrives.</p>
      </InfoBlock>
      <InfoBlock heading="Order Tracking">
        <p>
          You'll receive a confirmation call within 24 hours of placing your order, and the courier
          will contact you before delivery.
        </p>
      </InfoBlock>
    </InfoPage>
  );
}

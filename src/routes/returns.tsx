import { createFileRoute } from "@tanstack/react-router";
import { InfoBlock, InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Returns & Exchanges | FIDUCIA" },
      {
        name: "description",
        content: "How to exchange or return a FIDUCIA piece within 14 days of delivery.",
      },
      { property: "og:title", content: "Returns & Exchanges | FIDUCIA" },
      { property: "og:description", content: "14-day exchanges and returns on unworn FIDUCIA pieces." },
    ],
  }),
  component: ReturnsPage,
});

function ReturnsPage() {
  return (
    <InfoPage eyebrow="Customer Care" title="Returns & Exchanges" titleAr="الاستبدال والاسترجاع">
      <InfoBlock heading="14-Day Window">
        <p>
          Exchange or return any unworn, unwashed piece within 14 days of delivery, with original
          tags attached.
        </p>
      </InfoBlock>
      <InfoBlock heading="How It Works">
        <p>1. Email care@fiducia.eg with your order number and the reason.</p>
        <p>2. We arrange a pickup with our courier at a time that suits you.</p>
        <p>3. Once inspected, we ship your exchange or refund the amount paid.</p>
      </InfoBlock>
      <InfoBlock heading="Costs">
        <p>Size exchanges are free once per order. Return pickups cost 70 EGP.</p>
      </InfoBlock>
      <InfoBlock heading="Not Eligible">
        <p>Worn, washed, altered or damaged items, and pieces without original tags.</p>
      </InfoBlock>
    </InfoPage>
  );
}

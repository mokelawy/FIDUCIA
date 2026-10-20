import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoBlock } from "@/components/site/InfoPage";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "FAQ | FIDUCIA" },
      {
        name: "description",
        content:
          "Answers about FIDUCIA sizing, fabrics, cash on delivery, shipping times and exchanges in Egypt.",
      },
      { property: "og:title", content: "FAQ | FIDUCIA" },
      {
        property: "og:description",
        content: "Common questions about ordering, sizing and delivery at FIDUCIA.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <InfoPage eyebrow="Help Centre" title="Frequently Asked Questions" titleAr="الأسئلة الشائعة">
      <p>
        Everything you need to know before placing your order. If your question isn't answered here,
        our care team replies within one business day.
      </p>

      <InfoBlock heading="How do I choose my size?">
        <p>
          Our tees are cut oversized and drop one size larger than standard fits. If you prefer a
          closer fit, order one size down. Each product page lists chest and length measurements.
        </p>
      </InfoBlock>

      <InfoBlock heading="What payment methods do you accept?">
        <p>
          All orders are currently cash on delivery across Egypt. You pay the courier when your
          parcel arrives — no card details required.
        </p>
      </InfoBlock>

      <InfoBlock heading="How long does delivery take?">
        <p>
          Cairo and Giza: 1–3 business days. Other governorates: 3–5 business days. You receive a
          call from the courier before arrival.
        </p>
      </InfoBlock>

      <InfoBlock heading="Can I exchange an item?">
        <p>
          Yes — unworn pieces with tags attached can be exchanged within 14 days of delivery. See
          our returns policy for the full details.
        </p>
      </InfoBlock>

      <InfoBlock heading="How should I care for my pieces?">
        <p>
          Machine wash cold, inside out, with similar colours. Do not tumble dry or bleach. Iron on
          low heat and avoid printed areas.
        </p>
      </InfoBlock>

      <InfoBlock heading="Do you restock sold-out pieces?">
        <p>
          Drops are produced in limited runs. Selected core colourways return each season — join the
          FIDUCIA Club to hear first.
        </p>
      </InfoBlock>
    </InfoPage>
  );
}

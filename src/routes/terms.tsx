import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoBlock } from "@/components/site/InfoPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Terms & Conditions | FIDUCIA" },
      {
        name: "description",
        content:
          "The terms that apply when you browse FIDUCIA and place a cash-on-delivery order in Egypt.",
      },
      { property: "og:title", content: "Terms & Conditions | FIDUCIA" },
      {
        property: "og:description",
        content: "Ordering, pricing, delivery and liability terms for FIDUCIA customers.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <InfoPage eyebrow="Legal" title="Terms & Conditions" titleAr="الشروط والأحكام">
      <p>
        By browsing FIDUCIA or placing an order, you agree to the terms below. Please read them
        before completing a purchase.
      </p>

      <InfoBlock heading="Orders">
        <p>
          An order is confirmed once our team verifies it by phone or email. We may cancel an order
          if a piece is unavailable or the delivery details cannot be verified.
        </p>
      </InfoBlock>

      <InfoBlock heading="Pricing and payment">
        <p>
          Prices are listed in Egyptian Pounds and include applicable taxes. Payment is cash on
          delivery, settled with the courier on arrival.
        </p>
      </InfoBlock>

      <InfoBlock heading="Delivery">
        <p>
          Delivery windows are estimates. Failed delivery attempts caused by incorrect details or
          unavailability may result in the order being returned to us.
        </p>
      </InfoBlock>

      <InfoBlock heading="Products">
        <p>
          Garment colours may vary slightly from screen to screen. Measurements are approximate due
          to the nature of cut-and-sew production.
        </p>
      </InfoBlock>

      <InfoBlock heading="Intellectual property">
        <p>
          All FIDUCIA branding, imagery and copy on this site belong to FIDUCIA and may not be
          reproduced without written permission.
        </p>
      </InfoBlock>

      <InfoBlock heading="Contact">
        <p>Questions about these terms: fiducia.store@gmail.com.</p>
      </InfoBlock>
    </InfoPage>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoBlock } from "@/components/site/InfoPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Privacy Policy | FIDUCIA" },
      {
        name: "description",
        content:
          "How FIDUCIA collects, uses and protects the personal information you share when ordering.",
      },
      { property: "og:title", content: "Privacy Policy | FIDUCIA" },
      {
        property: "og:description",
        content: "Our commitments on data collection, use and protection at FIDUCIA.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <InfoPage eyebrow="Legal" title="Privacy Policy" titleAr="سياسة الخصوصية">
      <p>
        FIDUCIA respects your privacy. This policy explains what we collect, why we collect it, and
        the choices you have.
      </p>

      <InfoBlock heading="Information we collect">
        <p>
          Name, phone number, delivery address and email address provided at checkout, plus basic
          browsing data used to improve the store experience.
        </p>
      </InfoBlock>

      <InfoBlock heading="How we use it">
        <p>
          To process and deliver your order, contact you about your order status, handle exchanges,
          and — only with your consent — send occasional drop announcements.
        </p>
      </InfoBlock>

      <InfoBlock heading="Sharing">
        <p>
          We share delivery details with our courier partners solely to fulfil your order. We never
          sell your personal information.
        </p>
      </InfoBlock>

      <InfoBlock heading="Storage and security">
        <p>
          Order data is retained only as long as needed for service and record keeping, and is
          protected with reasonable technical and organisational measures.
        </p>
      </InfoBlock>

      <InfoBlock heading="Your choices">
        <p>
          You can unsubscribe from marketing at any time, and request access to or deletion of your
          data by emailing fiducia.store@gmail.com.
        </p>
      </InfoBlock>
    </InfoPage>
  );
}

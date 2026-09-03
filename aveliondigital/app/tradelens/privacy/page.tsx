import type { Metadata } from "next";

import {
  AddressBlock,
  BulletList,
  DocSection,
  ThirdPartyBox,
  TradeLensLegalChrome,
} from "@/components/tradelens/tradelens-legal";

export const metadata: Metadata = {
  title: "Privacy Policy | TradeLens",
  description:
    "Privacy Policy of the TradeLens App — the iOS AI chart analysis app by Daverion Digital.",
  alternates: { canonical: "/tradelens/privacy" },
};

export default function TradeLensPrivacyPage() {
  return (
    <TradeLensLegalChrome
      breadcrumb="Privacy Policy"
      eyebrow="Legal"
      pageTitle="Privacy Policy"
      provider="Provided by Daverion Digital"
      date="Last updated: September 2, 2026"
    >
      <DocSection heading="1. Data Controller">
        The data controller within the meaning of the Swiss Federal Act on Data
        Protection (FADP) is:
        <AddressBlock
          lines={[
            "Daverion Digital KLG",
            "Stockenstrasse 1",
            "8802 Kilchberg ZH",
            "Switzerland",
          ]}
          email="contact@daverion.digital"
        />
      </DocSection>

      <DocSection heading="2. Collection and Processing of Personal Data">
        We process personal data only to the extent necessary. This includes:
        <BulletList
          items={[
            "Data collected directly (e.g. email address when submitting a support request or creating an account)",
            "Contractual and payment data in connection with paid subscriptions",
            "Automatically collected data such as IP address (anonymised), operating system, device information, usage behaviour, app version and crash reports",
            "Image data used for the analysis of trading charts",
          ]}
        />
        This data is used to provide, improve and secure our services.
        <br />
        <br />
        Data is stored both:
        <BulletList
          items={[
            "on end-user devices (e.g. locally stored analysis images or settings), and",
            "on our servers (e.g. analysis parameters, error logs) to ensure functionality and improve the service.",
          ]}
        />
      </DocSection>

      <DocSection heading="3. Analytics and Tracking">
        For usage analytics, we may use services such as Google Analytics or
        Firebase Analytics. Information about your usage behaviour is stored in
        pseudonymised form.
        <br />
        <br />
        Processing takes place only with your explicit consent. This consent may
        be withdrawn at any time with effect for the future.
        <br />
        <br />
        Further information: Google Ireland Ltd., Gordon House, Barrow Street,
        Dublin 4, Ireland
        <br />
        Privacy Policy:{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#3B82F6", textDecoration: "none" }}
        >
          policies.google.com/privacy
        </a>
      </DocSection>

      <DocSection heading="4. Purposes of Processing">
        We use your data for the following purposes:
        <BulletList
          items={[
            "To provide and improve our App",
            "To carry out the analysis functions",
            "To communicate with you (support, product information)",
            "To process subscriptions",
            "To analyse usage patterns (with consent only)",
          ]}
        />
      </DocSection>

      <DocSection heading="5. Data Disclosure">
        Data is only shared:
        <BulletList
          items={[
            "with hosting and payment service providers",
            "with analytics and tracking providers (with consent only)",
            "when required by law",
            "with external service providers for service delivery, including:",
          ]}
        />
        <ThirdPartyBox
          name="OpenAI"
          rows={[
            {
              label: "Purpose",
              value:
                "Analysis of chart images and improvement of AI models (with consent only)",
            },
            {
              label: "Data type",
              value:
                "Screenshots/photos of charts (no direct identification possible)",
            },
            {
              label: "Note",
              value:
                "Please upload only chart images. If personal content is included accidentally, it may also be transmitted to OpenAI.",
            },
            {
              label: "Processing location",
              value:
                "USA. Transfer takes place on the basis of appropriate safeguards (Standard Contractual Clauses).",
            },
          ]}
        />
        Additional service providers:
        <BulletList
          items={[
            "RevenueCat (subscription management)",
            "TikTok (marketing optimisation)",
            "Meta (marketing optimisation)",
          ]}
        />
        Some of these providers are located outside Switzerland or the EU. Data
        transfers take place only where an adequate level of data protection is
        ensured.
      </DocSection>

      <DocSection heading="6. Cookies and Similar Technologies">
        Our App and website use cookies or similar technologies for
        functionality, analytics and, where applicable, marketing purposes. You
        may change your cookie settings or withdraw your consent at any time.
      </DocSection>

      <DocSection heading="7. Retention Period">
        Personal data is retained only for as long as necessary for the purposes
        of processing, or as required by statutory retention obligations.
      </DocSection>

      <DocSection heading="8. Data Subject Rights">
        Under the applicable Swiss Federal Act on Data Protection, you have the
        following rights:
        <BulletList
          items={[
            "Access to stored data",
            "Rectification of inaccurate data",
            "Erasure of data",
            "Restriction of processing",
            "Portability of your data",
            "Withdrawal of granted consents",
          ]}
        />
        You also have the right to lodge a complaint with the Federal Data
        Protection and Information Commissioner (FDPIC).
      </DocSection>

      <DocSection heading="9. Child Protection">
        Our services are not directed at children under the age of 13. We do not
        knowingly collect data from children without parental or guardian
        consent.
      </DocSection>

      <DocSection heading="10. Marketing and Communication">
        If you consent to receiving information, we may send you updates or
        offers. You may unsubscribe at any time, e.g. via the unsubscribe link
        in emails or by contacting us directly.
      </DocSection>

      <DocSection heading="11. Updates to this Privacy Policy">
        This Privacy Policy may be updated. The current version is available via
        our App or website. Any changes will be communicated accordingly.
      </DocSection>

      <div style={{ paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <h2
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            marginBottom: 14,
          }}
        >
          12. Contact
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "#b6b6b6",
            lineHeight: 1.75,
            marginBottom: 16,
          }}
        >
          For questions or to exercise your rights, please contact us at:
        </p>
        <p style={{ fontSize: 15, color: "#b6b6b6", lineHeight: 1.55, margin: 0 }}>
          Daverion Digital KLG
          <br />
          Stockenstrasse 1
          <br />
          8802 Kilchberg ZH
          <br />
          Switzerland
          <br />
          <a
            href="mailto:contact@daverion.digital"
            style={{ color: "#3B82F6", textDecoration: "none" }}
          >
            contact@daverion.digital
          </a>
        </p>
      </div>
    </TradeLensLegalChrome>
  );
}

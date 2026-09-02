import type { Metadata } from "next";
import Link from "next/link";

import {
  AddressBlock,
  Callout,
  DocSection,
  TradeLensLegalChrome,
} from "@/components/tradelens/tradelens-legal";

export const metadata: Metadata = {
  title: "Terms of Use | TradeLens",
  description: "Terms and Conditions of the TradeLens iOS App by Daverion Digital.",
};

export default function TradeLensTermsPage() {
  return (
    <TradeLensLegalChrome
      breadcrumb="Terms of Use"
      eyebrow="Legal"
      pageTitle="Terms and Conditions"
      provider="Provided by Daverion Digital"
      date="Last updated: September 2, 2026"
    >
      <DocSection heading="1. Scope and Subject Matter">
        These Terms and Conditions govern the use of the mobile application
        &quot;TradeLens&quot;, provided by Daverion Digital (hereinafter referred to as
        &quot;I&quot;, &quot;we&quot;, &quot;us&quot; or &quot;Provider&quot;). TradeLens offers automated analyses of
        trading charts based on photographed or uploaded images (hereinafter
        &quot;Analysis&quot;). By using our services, you agree to these Terms and
        Conditions as well as our Privacy Policy.
      </DocSection>

      <DocSection heading="2. Usage Rights and License">
        You are granted a limited, non-transferable, non-exclusive and revocable
        license to use the App for private, non-commercial purposes. Use of the
        App is subject to the applicable App Store guidelines (e.g. Apple App
        Store or Google Play Store).
      </DocSection>

      <DocSection heading="3. No Financial or Investment Advice">
        <Callout variant="warning" badge="Important Notice">
          The analyses and information provided by TradeLens do not constitute
          financial, investment or trading recommendations. The results are based
          on AI-powered algorithms and are intended for informational purposes
          only. Any financial decisions require independent research and, where
          appropriate, consultation with a licensed financial professional.
        </Callout>
      </DocSection>

      <DocSection heading="4. Disclaimer and Limitation of Liability">
        Use of the App is at your own risk. The content provided is offered
        without warranty as to its completeness, accuracy or correctness. We
        accept no liability for losses or damages arising from the use of the
        App. The App is provided &quot;as is&quot;, without express or implied warranties
        of any kind.
      </DocSection>

      <DocSection heading="5. User Responsibility">
        You are responsible for all activities that occur through your user
        account. It is your responsibility to keep your login credentials secure
        and to notify us immediately of any unauthorized access.
      </DocSection>

      <DocSection heading="6. Age Requirements and Legal Eligibility">
        Use of the App is permitted from the age of 13. Users under the age of
        18 may only use the App with the consent of a parent or legal guardian.
        By using the App, you confirm that you meet the legal requirements
        applicable in your country.
      </DocSection>

      <DocSection heading="7. Subscriptions, Payments and Cancellation">
        The App offers automatic weekly and 6-month subscription plans. Billing
        is handled through the respective App Store. Subscriptions may be
        cancelled at any time up to 24 hours before the end of the current
        billing period. Upon cancellation, access to premium features will
        continue until the end of the paid period. Refunds are processed
        exclusively through the App Store provider.
      </DocSection>

      <DocSection heading="8. Privacy">
        We process personal data in accordance with applicable data protection
        laws. Further details can be found in our Privacy Policy.{" "}
        <Link
          href="/tradelens/privacy"
          style={{ color: "#3B82F6", textDecoration: "none", fontWeight: 500 }}
        >
          TradeLens Privacy Policy →
        </Link>
      </DocSection>

      <DocSection heading="9. Third-Party Rights and Intellectual Property">
        All content, trademarks, logos and software components within the App
        are protected by copyright or other intellectual property rights. Use of
        this content is permitted solely within the scope of the App. If you
        become aware of any potential infringement of rights through content or
        analyses provided by the App, please contact us immediately.
      </DocSection>

      <DocSection heading="10. Usage Restrictions">
        <Callout variant="info" badge="Fair Use Policy">
          To ensure fair use of the service, we reserve the right to limit the
          number of chart analyses a user may perform per month to a maximum of
          150 analyses. If this limit is exceeded, access to further analyses may
          be temporarily restricted.
        </Callout>
      </DocSection>

      <DocSection heading="11. Breach of Terms and Account Suspension">
        We reserve the right to temporarily or permanently suspend access to the
        App in the event of a violation of these Terms, in particular in cases
        of abusive use.
      </DocSection>

      <DocSection heading="12. Third-Party Terms and App Store Notices">
        Use of the App may be subject to the terms of third parties (e.g. your
        mobile network operator, the AI infrastructure provider or the App Store
        operator). These are the responsibility of the user to observe. Apple
        and Google are not parties to this agreement but may act as third-party
        beneficiaries under their respective policies.
      </DocSection>

      <DocSection heading="13. Changes to These Terms">
        We reserve the right to amend these Terms at any time. Changes will be
        communicated via the App or by notice. Continued use of the App
        following any such changes constitutes your acceptance of the updated
        Terms.
      </DocSection>

      <DocSection heading="14. Severability">
        If any provision of these Terms is found to be wholly or partially
        invalid or unenforceable, the validity of the remaining provisions shall
        not be affected.
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
          15. Contact
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "#b6b6b6",
            lineHeight: 1.75,
            marginBottom: 16,
          }}
        >
          For any questions regarding these Terms, please contact us at:
        </p>
        <AddressBlock
          lines={[
            "Daverion Digital KLG",
            "Stockenstrasse 1",
            "8802 Kilchberg ZH",
            "Switzerland",
          ]}
          email="contact@daverion.digital"
        />
      </div>
    </TradeLensLegalChrome>
  );
}

import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Imprint | Daverion Digital",
  description:
    "Legal notice of Daverion Digital KLG, Kilchberg, Switzerland. Address, authorised representatives, commercial register details and liability information.",
};

const headingClass =
  "font-playfair text-[1.35rem] leading-snug tracking-[-0.02em] text-white sm:text-[1.5rem]";
const bodyClass = "font-dm-sans-hero mt-4 text-[15px] leading-[1.85] text-white/55";
const sectionClass = "border-t border-white/10 pt-10";

export default function ImprintPage() {
  return (
    <LegalPage title="Imprint">
      <div className="flex flex-col gap-10">
        <section className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-12">
          <div>
            <h2 className={headingClass}>Address</h2>
            <address className={`${bodyClass} not-italic`}>
              Daverion Digital KLG
              <br />
              Stockenstrasse 1
              <br />
              8802 Kilchberg ZH
              <br />
              Switzerland
            </address>
          </div>
          <div>
            <h2 className={headingClass}>Email</h2>
            <p className={bodyClass}>
              <a
                href="mailto:contact@daverion.digital"
                className="text-white/70 transition-colors duration-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
              >
                contact@daverion.digital
              </a>
            </p>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>
            Authorised representatives
            <span className="mt-1 block font-dm-sans-hero text-[13px] font-normal tracking-normal text-white/38">
              Joint signature of two
            </span>
          </h2>
          <p className={bodyClass}>
            Daniele Citran, Partner
            <br />
            Erik Buser, Partner
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Commercial Register</h2>
          <p className={bodyClass}>
            Registered company name: Daverion Digital KLG
            <br />
            UID: CHE-223.160.667
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>General disclaimer</h2>
          <div className={`${bodyClass} space-y-4`}>
            <p>
              Daverion Digital KLG assumes no liability whatsoever with regard to the
              correctness, accuracy, up-to-dateness, reliability or completeness of
              the information provided.
            </p>
            <p>
              Liability claims against Daverion Digital KLG for material or immaterial
              damage arising from access to, use or non-use of the published
              information, from misuse of the connection or from technical faults are
              excluded.
            </p>
            <p>
              All offers are non-binding. Daverion Digital KLG expressly reserves the
              right to change, supplement or delete parts of the pages or the entire
              offering without prior notice, or to discontinue publication temporarily
              or permanently.
            </p>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Disclaimer for links</h2>
          <p className={bodyClass}>
            References and links to third-party websites lie outside our area of
            responsibility. Any responsibility for such websites is declined. Access
            to and use of such websites is at the user&apos;s own risk.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Copyright</h2>
          <p className={bodyClass}>
            The copyright and all other rights to content, images, photographs or
            other files on this website belong exclusively to Daverion Digital KLG or
            the specifically named rights holders. For the reproduction of any
            elements, the written consent of the copyright holder must be obtained in
            advance.
          </p>
        </section>
      </div>
    </LegalPage>
  );
}

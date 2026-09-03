import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "General terms and conditions of Daverion Digital KLG for strategy, design, software and digital projects under Swiss law.",
  alternates: { canonical: "/terms" },
};

const headingClass =
  "font-playfair text-[1.35rem] leading-snug tracking-[-0.02em] text-white sm:text-[1.5rem]";
const bodyClass = "font-dm-sans-hero mt-4 text-[15px] leading-[1.85] text-white/55";
const sectionClass = "border-t border-white/10 pt-10";

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions">
      <div className="flex flex-col gap-10">
        <section>
          <h2 className={headingClass}>Scope</h2>
          <p className={bodyClass}>
            These General Terms and Conditions govern the collaboration between
            Daverion Digital KLG (hereinafter “Daverion Digital”) and its clients.
            They form an integral part of any assignment.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Services of Daverion Digital</h2>
          <p className={bodyClass}>
            Daverion Digital provides the following services in the field of
            digital products and technology: strategy and consulting, concept and
            design, software and web development, implementation and technical
            delivery, copywriting, project management, marketing, and e-commerce.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Duty of care and confidentiality</h2>
          <p className={bodyClass}>
            Daverion Digital undertakes to perform the tasks assigned to it with
            due professional care. It undertakes to treat as confidential any
            information entrusted to it or developed for the client.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Fees</h2>
          <p className={bodyClass}>
            Services provided by Daverion Digital are as a rule compensated on
            the basis of actual time spent. The quotation is the basis for
            invoicing. It is binding for the agreed scope of services in the
            sense of a cost ceiling. If, in the course of the project, it becomes
            apparent that actual expenditure will exceed the amounts stated in
            the quotation, Daverion Digital is obliged to notify the client as
            early as possible. Additional work resulting from content changes or
            additions not listed in the quotation will be charged separately. All
            amounts stated in quotations are always exclusive of value added tax.
            The agreed fee is not adjusted for inflation.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Third-party costs</h2>
          <p className={bodyClass}>
            In the course of the assignment and at the client’s expense, Daverion
            Digital may commission third-party services, such as hosting,
            licences, advertising platforms, specialist contractors or similar.
            These costs must be submitted to the client for approval before the
            corresponding order is placed. Third-party costs are as a rule
            invoiced directly.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Invoicing and payment</h2>
          <p className={bodyClass}>
            Accrued costs are as a rule invoiced to the client once a month. The
            client shall pay amounts due within 30 days net.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Cancellation or reduction of the assignment</h2>
          <p className={bodyClass}>
            In any event, the client shall fully compensate Daverion Digital for
            services already performed on the basis of actual work. Advance
            services by third parties will also be charged. The same applies in
            the event of a reduction of the assignment to work already performed
            by Daverion Digital and by third parties up to that point.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Ownership</h2>
          <p className={bodyClass}>
            Title and intellectual property in source code, designs, user
            interfaces, texts, documentation, prototypes, digital assets, working
            files and other work results created in whole or in part by Daverion
            Digital for the client remain with Daverion Digital. Daverion Digital
            may dispose of the copyrights in accordance with the provisions of
            the Federal Act on Copyright and Related Rights of 9 October 1992.
            It follows from this principle, among other things, that the client
            is not entitled to make changes to the works concerned without the
            consent of Daverion Digital.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Rights of use</h2>
          <p className={bodyClass}>
            The scope of permitted use of works created by Daverion Digital
            follows from the purpose of the assignment agreed with the client. In
            particular, works, project materials or parts thereof created by
            Daverion Digital and handed over to the client may be used
            exclusively within the scope of the agreed assignment. Unless
            otherwise agreed, the client’s use in terms of content, time and
            territory is limited to a single use of the works created by
            Daverion Digital. For any use outside the contractual purpose, the
            client must obtain permission from Daverion Digital and compensate
            it accordingly. Unless otherwise agreed, rights of use of third
            parties (in particular software, licences, fonts, libraries, APIs,
            content and similar) are subject to the same provisions.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Warranty</h2>
          <p className={bodyClass}>
            When editing, adapting or transforming works of third parties (for
            example existing software, websites, brands, content, data or other
            digital materials), Daverion Digital may, in the absence of an
            express notice from the client, assume that the client is entitled to
            such use and that no third-party rights are infringed.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Documentation</h2>
          <p className={bodyClass}>
            Important project decisions are as a rule recorded in writing by
            Daverion Digital.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Credit as author</h2>
          <p className={bodyClass}>
            Daverion Digital and third parties engaged by it may as a rule appear
            as authors in their own communication. Timing and scope do not need
            to be coordinated with the client. As a rule, only publicly
            accessible information may be used in Daverion Digital’s own
            communication.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Non-compete</h2>
          <p className={bodyClass}>
            Before the start of the collaboration, Daverion Digital informs the
            client of existing contracts with competing companies or for competing
            products or services. For the duration of the assignment, Daverion
            Digital undertakes not to provide services for competing companies or
            for competing products or services without the client’s consent.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Retention</h2>
          <p className={bodyClass}>
            Work results are retained by Daverion Digital for two years from the
            date of the last invoice.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Reference material</h2>
          <p className={bodyClass}>
            For all delivered work, the client shall provide Daverion Digital
            with reasonable reference material, such as links to publicly
            available products, screenshots or recordings. Daverion Digital is
            entitled to use this material as evidence of performance and to
            publish it.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Written form</h2>
          <p className={bodyClass}>
            Deviations from these General Terms and Conditions require written
            form.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Place of jurisdiction</h2>
          <p className={bodyClass}>
            The place of jurisdiction for all disputes arising from the project
            relationship is Zurich, Switzerland.
          </p>
        </section>
      </div>
    </LegalPage>
  );
}

import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy of Daverion Digital KLG. How we collect, process and protect personal data under Swiss data protection law.",
  alternates: { canonical: "/privacy" },
};

const headingClass =
  "font-playfair text-[1.35rem] leading-snug tracking-[-0.02em] text-white sm:text-[1.5rem]";
const bodyClass = "font-dm-sans-hero mt-4 text-[15px] leading-[1.85] text-white/55";
const sectionClass = "border-t border-white/10 pt-10";
const listClass = `${bodyClass} list-disc space-y-2 pl-5`;
const linkClass =
  "text-white/70 underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <div className="flex flex-col gap-10">
        <section>
          <h2 className={headingClass}>1. Data protection principles</h2>
          <p className={bodyClass}>
            Data protection is important to us. In this privacy policy we, Daverion
            Digital KLG, explain how we collect and otherwise process personal data.
            We treat your personal data as confidential and in accordance with the
            applicable data protection laws and this privacy policy. Personal data
            means any information relating to an identified or identifiable person.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>
            2. Collection and processing of personal data
          </h2>
          <div className={`${bodyClass} space-y-4`}>
            <p>
              We primarily process the personal data that we receive from our
              customers and other business partners, and from other persons involved,
              in the course of our business relationships, or that we collect from
              users when operating our website and other applications.
            </p>
            <p>
              Where permitted, we also obtain certain data from publicly accessible
              sources (in particular the internet and social media) or receive data
              from authorities and other third parties. In addition to the data you
              provide to us directly, the categories of personal data we receive
              about you from third parties include in particular information relating
              to your professional functions and activities or to you personally
              (where relevant in the specific case, for example in the context of an
              application or marketing) as well as data relating to the use of the
              website (for example IP address, cookies, date and time of the visit,
              pages and content accessed, and location data).
            </p>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>3. Purposes of data processing</h2>
          <p className={bodyClass}>
            We process your data for the following purposes (in addition to any
            purposes we communicate to you separately):
          </p>
          <ul className={listClass}>
            <li>
              in connection with entering into, administering and performing our
              contractual relationships with our customers and business partners;
            </li>
            <li>
              to operate our business, in particular our IT systems and our website;
            </li>
            <li>
              in connection with communicating with you, in particular to answer
              enquiries, to enable you to exercise your rights and to contact you
              with follow-up questions;
            </li>
            <li>
              for marketing and relationship management, for example to send our
              customers and other contractual partners personalised advertising about
              our products and services. This may also take the form of newsletters
              or invitations to events;
            </li>
            <li>
              for market research, to improve our services and operations, and for
              product development;
            </li>
            <li>
              to comply with laws, official instructions and recommendations, and
              internal rules (“compliance”);
            </li>
            <li>
              to assert legal claims and to defend ourselves in connection with legal
              disputes and official proceedings;
            </li>
            <li>
              for our risk management and as part of prudent corporate governance,
              including operational organisation and corporate development;
            </li>
            <li>
              for further purposes, for example in connection with our internal
              processes and administration or for training and quality assurance.
            </li>
          </ul>
          <p className={bodyClass}>
            If you have given us consent to process your personal data for specific
            purposes, we process your personal data within the scope of and based on
            this consent, unless we have another legal basis and we need one.
            Consent may be withdrawn at any time. Withdrawal does not affect
            processing that has already taken place.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>4. Data security</h2>
          <div className={`${bodyClass} space-y-4`}>
            <p>
              We take appropriate security measures to maintain the confidentiality,
              integrity and availability of your personal data, to protect it against
              unauthorised or unlawful processing, and to counteract the risks of
              loss, unintentional alteration, unwanted disclosure or unauthorised
              access.
            </p>
            <p>
              For security reasons and to protect the transmission of confidential
              content, such as enquiries you send to us as the website operator, this
              site uses SSL encryption. You can recognise an encrypted connection by
              the fact that the browser address bar changes from “http://” to
              “https://” and by the lock icon in your browser. When SSL encryption is
              active, data you transmit to us cannot be read by third parties.
            </p>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>
            5. Disclosure of personal data and transfers abroad
          </h2>
          <p className={bodyClass}>
            We also disclose your personal data to third parties, in particular to
            the following categories of recipients:
          </p>
          <ul className={listClass}>
            <li>
              Service providers: We work with service providers in Switzerland and
              abroad that process data about you on our behalf or under joint
              responsibility with us, or that receive data about you from us under
              their own responsibility (for example IT providers);
            </li>
            <li>
              Business partners such as suppliers, customers, marketing and project
              partners, in each case to the extent necessary in the individual case
              in the context of client projects;
            </li>
            <li>
              Authorities in Switzerland and, where applicable, abroad: We may
              disclose personal data to offices, courts and other authorities in
              Switzerland and abroad if we are legally obliged or entitled to do so,
              or if this appears necessary to protect our interests;
            </li>
            <li>
              Other persons: This covers other cases where the involvement of third
              parties follows from the purposes set out in section 3.
            </li>
          </ul>
          <div className={`${bodyClass} space-y-4`}>
            <p>
              These recipients are not located only in Switzerland. Your data may
              also be processed in Europe and, in exceptional cases, in the United
              States or in any other country in the world.
            </p>
            <p>
              If a recipient is located in a country without adequate statutory data
              protection, we contractually require the recipient to comply with the
              applicable data protection (we use the revised Standard Contractual
              Clauses of the European Commission, available{" "}
              <a
                href="https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                here
              </a>
              ), unless the recipient is already subject to a legally recognised
              framework for ensuring data protection or we can rely on an exemption.
              An exemption may apply in particular to legal proceedings abroad, but
              also in cases of overriding public interests, if the performance of a
              contract requires such disclosure, if you have consented, or if the
              data are data you have made generally accessible and you have not
              objected to their processing.
            </p>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>6. Retention period</h2>
          <p className={bodyClass}>
            We process your data for as long as our processing purposes, statutory
            retention periods and our legitimate interests in processing for
            documentation and evidence purposes require, or for as long as storage is
            technically necessary. Unless legal or contractual obligations prevent
            it, we delete or anonymise your data after the storage or processing
            period has expired, as part of our usual processes.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>7. Third-party offerings</h2>
          <p className={bodyClass}>
            We may also embed further third-party offerings on our website, in
            particular plug-ins from social media providers. These offerings are
            deactivated by default. As soon as you activate them (for example by
            clicking a switch), the relevant providers can determine that you are on
            our website. If you have an account with the social media provider, it
            may associate this information with you and thereby track your use of
            online offerings. These social media providers process this data under
            their own responsibility.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>8. Social networks</h2>
          <div className={`${bodyClass} space-y-4`}>
            <p>
              We may operate pages and other online presences (“fan pages”,
              “channels”, “profiles”, etc.) on social networks and other platforms
              operated by third parties and collect the data about you described in
              section 2 and below. We currently operate profiles on the following
              platforms: LinkedIn, Instagram, Facebook and Vimeo.
            </p>
            <p>
              We receive this data from you and from the platforms when you interact
              with us via our online presence (for example when you communicate with
              us, comment on our content or visit our presence). At the same time,
              the platforms analyse your use of our online presences and combine this
              data with other data they hold about you (for example about your
              behaviour and preferences). They also process this data for their own
              purposes under their own responsibility, in particular for marketing
              and market research (for example to personalise advertising) and to
              operate their platforms (for example to decide which content to show
              you).
            </p>
            <p>
              For further information on the processing by the platform operators,
              please refer to the privacy notices of the platforms. There you will
              also find in which countries they process data, which rights of access,
              deletion and other data subject rights you have, and how you can
              exercise them or obtain further information.
            </p>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>9. Controller</h2>
          <p className={bodyClass}>
            The controller for the purposes of data protection law is:
          </p>
          <address className={`${bodyClass} not-italic`}>
            Daverion Digital KLG
            <br />
            Stockenstrasse 1
            <br />
            8802 Kilchberg ZH
            <br />
            Switzerland
            <br />
            Email:{" "}
            <a href="mailto:contact@daverion.digital" className={linkClass}>
              contact@daverion.digital
            </a>
            <br />
            Website:{" "}
            <a
              href="https://daverion.digital"
              className={linkClass}
            >
              daverion.digital
            </a>
          </address>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>10. Your rights</h2>
          <p className={bodyClass}>
            You have the following rights in connection with the processing of your
            personal data:
          </p>
          <ul className={listClass}>
            <li>
              the right to request information from us as to whether and which data
              we process about you;
            </li>
            <li>the right to have us correct data if they are inaccurate;</li>
            <li>
              the right to request that we provide certain personal data in a
              commonly used electronic format or transfer them to another controller;
            </li>
            <li>
              the right to withdraw consent, to the extent our processing is based on
              your consent;
            </li>
            <li>the right to object to the processing of your data.</li>
          </ul>
          <p className={bodyClass}>
            Please note that these rights are subject to conditions, exceptions or
            restrictions (for example to protect third parties or business secrets).
            We will inform you accordingly where applicable.
          </p>
        </section>
      </div>
    </LegalPage>
  );
}

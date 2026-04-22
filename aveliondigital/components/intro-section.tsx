import { IntroCircularMark } from "@/components/intro-circular-mark";
import { cn } from "@/lib/utils";

const bodyClass = cn(
  "font-dm-sans-hero text-[15px] leading-[1.72] text-neutral-600 sm:text-base sm:leading-[1.75]",
);

/**
 * Drei-Spalten-Intro (Morpheon-artig): rundlaufender Markenring, Claim, Detailspalte.
 */
export function IntroSection() {
  return (
    <section
      className={cn(
        "relative z-10 w-full bg-white text-neutral-950",
        "-mt-12 rounded-t-[2.25rem] sm:-mt-16 sm:rounded-t-[2.75rem] md:-mt-20 md:rounded-t-[3.25rem] lg:-mt-28 lg:rounded-t-[4rem]",
        "px-6 pb-20 pt-14 sm:px-10 sm:pt-16 md:px-14 md:pb-28 md:pt-20 lg:px-16 lg:pt-24",
      )}
      aria-labelledby="intro-heading"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:gap-y-0 xl:max-w-7xl xl:gap-x-16">
        <div className="flex justify-center lg:col-span-4 lg:justify-start">
          <IntroCircularMark />
        </div>

        <div className="lg:col-span-4">
          <h2
            id="intro-heading"
            className={cn(
              "sr-only",
            )}
          >
            Avelion Digital
          </h2>
          <p className={cn(bodyClass, "text-pretty text-neutral-700")}>
            Avelion Digital is a creative and technology company building apps,
            websites, brands and digital products for businesses and individuals
            who are ready to grow and stand out.
          </p>
        </div>

        <div className={cn(bodyClass, "space-y-6 text-pretty lg:col-span-4")}>
          <p>
            We deliver{" "}
            <strong className="font-semibold text-neutral-900">
              high-performance apps, conversion-driven websites and AI-powered
              marketing systems
            </strong>{" "}
            where quality, speed and measurable results are non-negotiable.
          </p>
          <p>
            Our work spans{" "}
            <strong className="font-semibold text-neutral-900">
              product development, e-commerce and brand building
            </strong>
            , engineered to scale from day one and built to outperform.
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/site-footer";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xzebgrkd";

type FormFields = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  project: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

const INITIAL: FormFields = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  project: "",
  consent: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Digits, spaces, and a leading + for country codes. */
function sanitizePhone(raw: string) {
  let out = "";
  for (const ch of raw) {
    if (ch >= "0" && ch <= "9") {
      out += ch;
    } else if (ch === "+" && out.length === 0) {
      out += ch;
    } else if (ch === " " && out.length > 0) {
      out += ch;
    }
  }
  return out;
}

function validate(values: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName = "Please enter your first name.";
  }
  if (!values.lastName.trim()) {
    errors.lastName = "Please enter your last name.";
  }
  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.project.trim()) {
    errors.project = "Please describe your project.";
  } else if (values.project.trim().length < 20) {
    errors.project = "Please add a bit more detail (at least 20 characters).";
  }
  if (!values.consent) {
    errors.consent = "You must agree before we can process your request.";
  }

  return errors;
}

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2.5 block font-playfair text-[15px] font-medium tracking-[-0.01em] text-neutral-800"
    >
      {children}
      {required ? (
        <span className="ml-1 font-dm-sans-hero text-[13px] font-normal text-[#3B82F6]" aria-hidden>
          *
        </span>
      ) : (
        <span className="ml-1.5 font-dm-sans-hero text-[12px] font-normal text-neutral-400">
          optional
        </span>
      )}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="font-dm-sans-hero mt-2 text-[13px] text-red-600">
      {message}
    </p>
  );
}

function inputState(hasError: boolean, multiline = false) {
  return cn(
    "font-dm-sans-hero w-full border-0 border-b bg-transparent px-0 py-2.5 text-[16px] text-neutral-900",
    "placeholder:text-neutral-400",
    "transition-[border-color] duration-200",
    "outline-none focus:border-[#3B82F6]",
    multiline ? "resize-none overflow-hidden" : "",
    hasError ? "border-red-400" : "border-neutral-300",
  );
}

function SubmitButton({
  ready,
  submitting,
  success,
}: {
  ready: boolean;
  submitting: boolean;
  success: boolean;
}) {
  const enabled = ready && !submitting && !success;
  const barRef = React.useRef<HTMLSpanElement>(null);
  const checkWrapRef = React.useRef<HTMLSpanElement>(null);
  const checkPathRef = React.useRef<SVGPathElement>(null);

  React.useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    if (submitting) {
      gsap.set(bar, { opacity: 1 });
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.15, ease: "power2.inOut", transformOrigin: "left center" },
      );
      return;
    }

    if (success) {
      gsap.to(bar, { opacity: 0, duration: 0.25, ease: "power2.out" });
      return;
    }

    gsap.set(bar, { scaleX: 0, opacity: 1 });
  }, [submitting, success]);

  React.useLayoutEffect(() => {
    const wrap = checkWrapRef.current;
    const path = checkPathRef.current;
    if (!wrap || !path) return;

    if (!success) {
      gsap.to(wrap, { opacity: 0, scale: 0.82, duration: 0.28, ease: "power2.in" });
      return;
    }

    const length = path.getTotalLength();
    gsap.set(wrap, { scale: 0.35, opacity: 0 });
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    const tl = gsap.timeline();
    tl.to(wrap, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.9)" }, 0);
    tl.to(path, { strokeDashoffset: 0, duration: 0.42, ease: "power2.out" }, 0.08);

    return () => {
      tl.kill();
    };
  }, [success]);

  return (
    <button
      type="submit"
      disabled={!enabled}
      aria-busy={submitting}
      aria-label={submitting ? "Sending" : success ? "Request sent" : "Submit request"}
      className={cn(
        "relative flex h-14 w-full shrink-0 items-center justify-center overflow-hidden rounded-full",
        "font-dm-sans-hero text-[15px] font-medium",
        "transition-[color,transform] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B82F6]",
        enabled && "cursor-pointer text-white hover:brightness-110 active:scale-[0.99]",
        !ready && !submitting && !success && "cursor-not-allowed text-neutral-600",
        (submitting || success) && "cursor-default text-white",
      )}
      style={{
        backgroundColor: enabled || submitting || success ? "#3B82F6" : "#d6d3cd",
      }}
    >
      <span
        ref={barRef}
        className="pointer-events-none absolute inset-0 origin-left bg-white/30"
        style={{ transform: "scaleX(0)" }}
        aria-hidden
      />

      <span
        className={cn(
          "relative z-[1] transition-opacity duration-300",
          submitting || success ? "opacity-0" : "opacity-100",
        )}
      >
        Submit request
      </span>

      <span
        ref={checkWrapRef}
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
        style={{ opacity: success ? undefined : 0 }}
        aria-hidden
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            ref={checkPathRef}
            d="M5.5 12.5 L10 17 L18.5 7.5"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

export function ContactSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const projectRef = React.useRef<HTMLTextAreaElement>(null);

  const [values, setValues] = React.useState<FormFields>(INITIAL);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [serverError, setServerError] = React.useState(false);

  const formReady = Object.keys(validate(values)).length === 0;

  React.useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
        opacity: 0,
        y: 28,
        duration: 0.85,
        ease: "power3.out",
      });
      gsap.from(formRef.current, {
        scrollTrigger: { trigger: section, start: "top 74%", once: true },
        opacity: 0,
        y: 32,
        duration: 0.95,
        ease: "power3.out",
        delay: 0.08,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  React.useLayoutEffect(() => {
    const el = projectRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [values.project, success]);

  const showError = (field: keyof FormFields) =>
    Boolean(errors[field] && (touched[field] || submitted));

  const updateField =
    (field: Exclude<keyof FormFields, "consent">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = field === "phone" ? sanitizePhone(e.target.value) : e.target.value;
      if (success) setSuccess(false);
      setValues((prev) => {
        const draft = { ...prev, [field]: next };
        if (submitted || touched[field]) {
          setErrors((errs) => {
            const nextErrors = validate(draft);
            return { ...errs, [field]: nextErrors[field] };
          });
        }
        return draft;
      });
    };

  const updateConsent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    if (success) setSuccess(false);
    setValues((prev) => {
      const draft = { ...prev, consent: next };
      if (submitted || touched.consent) {
        setErrors((errs) => {
          const nextErrors = validate(draft);
          return { ...errs, consent: nextErrors.consent };
        });
      }
      return draft;
    });
  };

  const onBlur = (field: keyof FormFields) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => {
      const nextErrors = validate(values);
      return { ...prev, [field]: nextErrors[field] };
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError(false);

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstKey = Object.keys(nextErrors)[0] as keyof FormFields;
      document.getElementById(String(firstKey))?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const started = Date.now();
      const body = new FormData(e.currentTarget);
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      });

      const wait = 1100 - (Date.now() - started);
      if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait));
      }

      if (!response.ok) {
        setServerError(true);
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      setSuccess(true);
      setSubmitted(false);
      window.setTimeout(() => {
        setValues(INITIAL);
        setTouched({});
        setErrors({});
        setSuccess(false);
      }, 1300);
    } catch {
      setServerError(true);
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-title"
      className={cn(
        "relative z-30 w-full scroll-mt-[5.5rem] bg-[#f4f1ea] text-neutral-950",
        "-mt-6 rounded-t-[2.25rem] sm:-mt-8 sm:rounded-t-[2.75rem] md:-mt-10 md:rounded-t-[3.25rem] lg:-mt-14 lg:rounded-t-[4rem]",
      )}
    >
      <div className="relative mx-auto w-full max-w-[720px] px-6 pb-4 pt-16 sm:px-10 sm:pb-6 sm:pt-20 lg:pt-24">
        <div ref={headerRef} className="text-center">
          <h2
            id="contact-title"
            className="font-playfair font-medium leading-[0.95] tracking-[-0.03em] text-neutral-950"
            style={{ fontSize: "clamp(2.35rem, 5vw, 4.5rem)" }}
          >
            Just one form away
          </h2>
        </div>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          className="mt-14 sm:mt-16 lg:mt-20"
        >
          <div className="space-y-9">
              <input type="hidden" name="_subject" value="New project request | Daverion Digital" />
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
              />
              <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <FieldLabel htmlFor="firstName" required>
                    First name
                  </FieldLabel>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={values.firstName}
                    onChange={updateField("firstName")}
                    onBlur={onBlur("firstName")}
                    aria-invalid={showError("firstName")}
                    aria-describedby={showError("firstName") ? "firstName-error" : undefined}
                    className={inputState(showError("firstName"))}
                  />
                  <FieldError id="firstName-error" message={showError("firstName") ? errors.firstName : undefined} />
                </div>
                <div>
                  <FieldLabel htmlFor="lastName" required>
                    Last name
                  </FieldLabel>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={values.lastName}
                    onChange={updateField("lastName")}
                    onBlur={onBlur("lastName")}
                    aria-invalid={showError("lastName")}
                    aria-describedby={showError("lastName") ? "lastName-error" : undefined}
                    className={inputState(showError("lastName"))}
                  />
                  <FieldError id="lastName-error" message={showError("lastName") ? errors.lastName : undefined} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <FieldLabel htmlFor="company">Company</FieldLabel>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={values.company}
                    onChange={updateField("company")}
                    className={inputState(false)}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="phone">Phone</FieldLabel>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={updateField("phone")}
                    onKeyDown={(e) => {
                      if (e.metaKey || e.ctrlKey || e.altKey) return;
                      if (e.key.length !== 1) return;
                      if (e.key >= "0" && e.key <= "9") return;
                      if (e.key === "+" && values.phone.length === 0) return;
                      if (e.key === " " && values.phone.length > 0) return;
                      e.preventDefault();
                    }}
                    className={inputState(false)}
                  />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="email" required>
                  Email address
                </FieldLabel>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={values.email}
                  onChange={updateField("email")}
                  onBlur={onBlur("email")}
                  aria-invalid={showError("email")}
                  aria-describedby={showError("email") ? "email-error" : undefined}
                  className={inputState(showError("email"))}
                />
                <FieldError id="email-error" message={showError("email") ? errors.email : undefined} />
              </div>

              <div>
                <FieldLabel htmlFor="project" required>
                  Describe your project
                </FieldLabel>
                <textarea
                  ref={projectRef}
                  id="project"
                  name="project"
                  rows={1}
                  placeholder="Objectives, features, constraints, budget..."
                  value={values.project}
                  onChange={updateField("project")}
                  onBlur={onBlur("project")}
                  aria-invalid={showError("project")}
                  aria-describedby={showError("project") ? "project-error" : undefined}
                  className={inputState(showError("project"), true)}
                />
                <FieldError id="project-error" message={showError("project") ? errors.project : undefined} />
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    value="accepted"
                    checked={values.consent}
                    onChange={updateConsent}
                    onBlur={onBlur("consent")}
                    aria-invalid={showError("consent")}
                    aria-describedby="consent-info consent-error"
                    className="mt-1 size-4 shrink-0 cursor-pointer rounded-[3px] border-neutral-400 accent-[#3B82F6]"
                  />
                  <span
                    id="consent-info"
                    className="font-dm-sans-hero text-[13px] leading-[1.7] text-neutral-600"
                  >
                    I agree to storage and processing of my personal data and to being
                    contacted by Daverion Digital. Data is stored only as long as necessary
                    to handle my request.
                    <span className="ml-1 text-[#3B82F6]" aria-hidden>
                      *
                    </span>
                  </span>
                </label>
                <FieldError id="consent-error" message={showError("consent") ? errors.consent : undefined} />
              </div>

              <div className="pt-2">
                <SubmitButton ready={formReady} submitting={submitting} success={success} />
                {serverError ? (
                  <p role="alert" className="font-dm-sans-hero mt-3 text-center text-[13px] text-red-600">
                    Something went wrong. Please try again in a moment.
                  </p>
                ) : null}
              </div>
            </div>
        </form>
      </div>
      <SiteFooter />
    </section>
  );
}

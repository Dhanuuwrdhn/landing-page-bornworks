"use client";

import { FormEvent, startTransition, useMemo, useState } from "react";
import { ArrowRight, ArrowUp, CheckCircle2, LoaderCircle, Mail, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { useLang } from "@/contexts/LanguageContext";

type Lang = "en" | "id";

type FormState = {
  name: string;
  email: string;
  needs: string;
  website: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type SubmitStatus =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  needs: "",
  website: "",
};

const COPY = {
  heading: {
    en: "Ready to Build Something Great?",
    id: "Siap Membangun Sesuatu yang Besar?",
  },
  sub: {
    en: "Tell us what you are building. We will reply with the clearest next step.",
    id: "Ceritakan apa yang ingin Anda bangun. Kami akan membalas dengan langkah berikutnya yang paling jelas.",
  },
  labels: {
    name: { en: "Your Name", id: "Nama Anda" },
    email: { en: "Email Address", id: "Alamat Email" },
    needs: { en: "What do you need built?", id: "Apa yang ingin Anda bangun?" },
  },
  placeholders: {
    name: { en: "Jane / John", id: "Nama Anda" },
    email: { en: "you@company.com", id: "email@perusahaan.com" },
    needs: {
      en: "Example: company profile website, internal dashboard, mobile app MVP, SaaS product...",
      id: "Contoh: website company profile, dashboard internal, MVP mobile app, produk SaaS...",
    },
  },
  helper: {
    en: "Usually we reply within 1 business day. Prefer email? Reach us at hello@bornworks.id.",
    id: "Biasanya kami membalas dalam 1 hari kerja. Lebih suka email langsung? Hubungi hello@bornworks.id.",
  },
  cta: {
    idle: { en: "Send Brief", id: "Kirim Brief" },
    pending: { en: "Sending...", id: "Mengirim..." },
  },
  privacy: {
    en: "By sending this form, you agree that we may contact you about your project inquiry.",
    id: "Dengan mengirim form ini, Anda setuju kami dapat menghubungi Anda terkait kebutuhan project Anda.",
  },
  success: {
    en: "Thanks. Your brief has been sent. We will get back to you soon.",
    id: "Terima kasih. Brief Anda sudah terkirim. Kami akan segera menghubungi Anda.",
  },
  fallback: {
    en: "Email delivery is not configured yet. Please contact hello@bornworks.id directly for now.",
    id: "Pengiriman email belum dikonfigurasi. Untuk sementara, silakan hubungi hello@bornworks.id langsung.",
  },
  errors: {
    nameRequired: { en: "Please enter your name.", id: "Silakan isi nama Anda." },
    emailRequired: { en: "Please enter your email.", id: "Silakan isi email Anda." },
    emailInvalid: { en: "Please use a valid email address.", id: "Gunakan alamat email yang valid." },
    needsRequired: { en: "Please tell us what you need built.", id: "Silakan jelaskan kebutuhan project Anda." },
    generic: { en: "Something went wrong. Please try again.", id: "Terjadi kendala. Silakan coba lagi." },
  },
} as const;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateForm(form: FormState, lang: Lang): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = COPY.errors.nameRequired[lang];
  }

  if (!form.email.trim()) {
    errors.email = COPY.errors.emailRequired[lang];
  } else if (!isValidEmail(form.email.trim())) {
    errors.email = COPY.errors.emailInvalid[lang];
  }

  if (!form.needs.trim()) {
    errors.needs = COPY.errors.needsRequired[lang];
  }

  return errors;
}

export default function CTA() {
  const { lang } = useLang();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>({ type: "idle" });
  const [isPending, setIsPending] = useState(false);

  const copy = useMemo(
    () => ({
      heading: COPY.heading[lang],
      sub: COPY.sub[lang],
      labels: {
        name: COPY.labels.name[lang],
        email: COPY.labels.email[lang],
        needs: COPY.labels.needs[lang],
      },
      placeholders: {
        name: COPY.placeholders.name[lang],
        email: COPY.placeholders.email[lang],
        needs: COPY.placeholders.needs[lang],
      },
      helper: COPY.helper[lang],
      ctaIdle: COPY.cta.idle[lang],
      ctaPending: COPY.cta.pending[lang],
      privacy: COPY.privacy[lang],
      success: COPY.success[lang],
      fallback: COPY.fallback[lang],
      genericError: COPY.errors.generic[lang],
    }),
    [lang]
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(form, lang);
    setErrors(nextErrors);
    setStatus({ type: "idle" });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsPending(true);

    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            needs: form.needs.trim(),
            website: form.website.trim(),
            lang,
          }),
        });

        const result = (await response.json().catch(() => null)) as
          | { ok?: boolean; code?: string; message?: string }
          | null;

        if (!response.ok || !result?.ok) {
          const message =
            result?.code === "delivery_unavailable" ? copy.fallback : result?.message || copy.genericError;
          setStatus({ type: "error", message });
          return;
        }

        setForm(INITIAL_FORM);
        setErrors({});
        setStatus({ type: "success", message: copy.success });
      } catch {
        setStatus({ type: "error", message: copy.genericError });
      } finally {
        setIsPending(false);
      }
    });
  }

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-white dark:bg-[#0a0e1a]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-amber/8 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="glass rounded-[2rem] p-8 md:p-12 lg:p-16 relative overflow-hidden amber-glow">
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-8 hidden md:block"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-amber/10 flex items-center justify-center">
                <ArrowUp className="w-6 h-6 text-brand-amber/40" strokeWidth={2} />
              </div>
            </motion.div>

            <div className="absolute -top-8 -left-8 w-32 h-32 bg-brand-amber/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-brand-amber/8 rounded-full blur-2xl" />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-amber/10 px-4 py-1.5 text-sm font-medium text-brand-amber-dark dark:text-brand-amber">
                  <Mail className="h-4 w-4" />
                  hello@bornworks.id
                </span>
                <h2 className="mt-6 text-3xl font-bold text-brand-dark dark:text-white sm:text-4xl lg:text-5xl">
                  {copy.heading}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-brand-muted dark:text-white/50">{copy.sub}</p>
                <p className="mt-6 text-sm leading-6 text-brand-muted dark:text-white/45">{copy.helper}</p>
              </div>

              <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-brand-dark dark:text-white">{copy.labels.name}</span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder={copy.placeholders.name}
                      autoComplete="name"
                      className="w-full rounded-2xl border border-brand-dark/10 bg-white/80 px-4 py-3.5 text-brand-dark outline-none transition focus:border-brand-amber focus:ring-4 focus:ring-brand-amber/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                    />
                    {errors.name ? (
                      <span id="contact-name-error" className="text-sm text-red-500">
                        {errors.name}
                      </span>
                    ) : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-brand-dark dark:text-white">{copy.labels.email}</span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder={copy.placeholders.email}
                      autoComplete="email"
                      className="w-full rounded-2xl border border-brand-dark/10 bg-white/80 px-4 py-3.5 text-brand-dark outline-none transition focus:border-brand-amber focus:ring-4 focus:ring-brand-amber/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                    />
                    {errors.email ? (
                      <span id="contact-email-error" className="text-sm text-red-500">
                        {errors.email}
                      </span>
                    ) : null}
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-brand-dark dark:text-white">{copy.labels.needs}</span>
                  <textarea
                    name="needs"
                    value={form.needs}
                    onChange={(event) => updateField("needs", event.target.value)}
                    placeholder={copy.placeholders.needs}
                    rows={6}
                    className="w-full rounded-[1.5rem] border border-brand-dark/10 bg-white/80 px-4 py-4 text-brand-dark outline-none transition focus:border-brand-amber focus:ring-4 focus:ring-brand-amber/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    aria-invalid={Boolean(errors.needs)}
                    aria-describedby={errors.needs ? "contact-needs-error" : undefined}
                  />
                  {errors.needs ? (
                    <span id="contact-needs-error" className="text-sm text-red-500">
                      {errors.needs}
                    </span>
                  ) : null}
                </label>

                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={(event) => updateField("website", event.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    id="cta-submit-form"
                    disabled={isPending}
                    className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-brand-amber px-8 py-4 text-base font-semibold text-white shadow-xl shadow-brand-amber/30 transition-all duration-300 hover:bg-brand-amber-dark hover:shadow-brand-amber/50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? (
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                    ) : (
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    )}
                    {isPending ? copy.ctaPending : copy.ctaIdle}
                  </button>

                  <p className="max-w-md text-sm leading-6 text-brand-muted dark:text-white/45">{copy.privacy}</p>
                </div>

                {status.type !== "idle" ? (
                  <div
                    className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
                      status.type === "success"
                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300"
                    }`}
                    role="status"
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    ) : (
                      <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                    )}
                    <span>{status.message}</span>
                  </div>
                ) : null}
              </form>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

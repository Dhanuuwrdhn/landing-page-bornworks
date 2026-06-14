"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

/* ── Translations ─────────────────────────────────────── */
const t = {
  title:    { en: "Tell us about your project", id: "Ceritakan project Anda" },
  subtitle: {
    en: "Fill this in and we'll get back to you — usually within 1 business day.",
    id: "Isi form ini dan kami akan menghubungi Anda — biasanya dalam 1 hari kerja.",
  },
  name:        { en: "Your name",            id: "Nama Anda"               },
  namePh:      { en: "John Doe",             id: "Budi Santoso"            },
  email:       { en: "Email",                id: "Email"                   },
  emailPh:     { en: "you@company.com",      id: "anda@perusahaan.com"     },
  needs:       { en: "What do you need?",    id: "Apa yang Anda butuhkan?" },
  needsPh: {
    en: "Briefly describe your project, goals, and timeline…",
    id: "Jelaskan singkat project, tujuan, dan timeline Anda…",
  },
  submit:      { en: "Send message",         id: "Kirim pesan"             },
  sending:     { en: "Sending…",             id: "Mengirim…"               },
  successTitle:{ en: "Message sent!",        id: "Pesan terkirim!"         },
  successBody: {
    en: "Thanks for reaching out. We'll reply to your email soon.",
    id: "Terima kasih. Kami akan membalas ke email Anda secepatnya.",
  },
  errorTitle:  { en: "Something went wrong", id: "Terjadi kesalahan"       },
  errorBody: {
    en: "Couldn't send your message. Please try again or chat with us on WhatsApp.",
    id: "Pesan gagal terkirim. Coba lagi atau hubungi kami via WhatsApp.",
  },
  retry:       { en: "Try again",            id: "Coba lagi"               },
  close:       { en: "Close",                id: "Tutup"                   },
};

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY = { name: "", email: "", needs: "", website: "" };

export default function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState(EMPTY);

  /* Escape to close + lock background scroll while open */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  /* Reset state a moment after the modal closes */
  useEffect(() => {
    if (open) return;
    const id = setTimeout(() => {
      setStatus("idle");
      setForm(EMPTY);
    }, 250);
    return () => clearTimeout(id);
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !data.ok) throw new Error("failed");
      setStatus("success");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  const update =
    (field: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-amber/60 focus:bg-white/[0.06] transition-colors";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.title[lang]}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0d1322] shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            {/* Amber glow accent */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-brand-amber/20 blur-3xl" />

            {/* Close */}
            <button
              onClick={onClose}
              aria-label={t.close[lang]}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative p-6 sm:p-8">
              {status === "success" ? (
                /* ── Success ── */
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{t.successTitle[lang]}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/50">
                    {t.successBody[lang]}
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 rounded-xl bg-brand-amber px-6 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-amber-dark transition-colors"
                  >
                    {t.close[lang]}
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white sm:text-2xl">{t.title[lang]}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/45">
                      {t.subtitle[lang]}
                    </p>
                  </div>

                  {/* Honeypot — hidden from humans, bots fill it */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={update("website")}
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                    aria-hidden
                  />

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-white/60">
                      {t.name[lang]}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      value={form.name}
                      onChange={update("name")}
                      placeholder={t.namePh[lang]}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-white/60">
                      {t.email[lang]}
                    </label>
                    <input
                      type="email"
                      required
                      maxLength={160}
                      value={form.email}
                      onChange={update("email")}
                      placeholder={t.emailPh[lang]}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-white/60">
                      {t.needs[lang]}
                    </label>
                    <textarea
                      required
                      rows={4}
                      maxLength={2000}
                      value={form.needs}
                      onChange={update("needs")}
                      placeholder={t.needsPh[lang]}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <div>
                        <p className="font-semibold">{t.errorTitle[lang]}</p>
                        <p className="text-red-300/70">{t.errorBody[lang]}</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-amber px-6 py-3.5 text-sm font-bold text-brand-dark shadow-lg shadow-brand-amber/20 hover:bg-brand-amber-dark transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.sending[lang]}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {status === "error" ? t.retry[lang] : t.submit[lang]}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

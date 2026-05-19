@AGENTS.md

# Born2Works Landing Page

Landing page untuk software house **Born2Works** (bornworks.id). Dibangun dengan Next.js App Router, React 19, TypeScript, Tailwind CSS v4, dan Framer Motion.

## Tech Stack

- **Framework**: Next.js 16.x (App Router) — baca `node_modules/next/dist/docs/` sebelum menggunakan API Next.js karena versi ini punya breaking changes
- **UI**: React 19, Tailwind CSS v4, Framer Motion, Lucide React
- **Email**: Nodemailer (SMTP Gmail) atau webhook
- **Language**: TypeScript strict

## Run Commands

```bash
npm run dev      # development server (localhost:3000)
npm run build    # production build
npm run start    # jalankan production build
npm run lint     # ESLint check
```

## Struktur Proyek

```
src/
  app/
    page.tsx              # Root page — merakit semua section
    layout.tsx            # Root layout (font, metadata)
    globals.css           # CSS variables, glass utilities, gradients, animasi
    api/contact/          # API route form kontak
  components/             # Satu file per section
    Navbar.tsx            # Fixed navbar + scroll-aware active section
    ScrollProgress.tsx    # Progress bar di atas halaman
    Hero.tsx              # Hero section (typewriter + animated counter + stats)
    Services.tsx          # 3 layanan utama
    Process.tsx           # Alur kerja/proses
    Portfolio.tsx         # Daftar proyek portfolio
    TechStack.tsx         # Tech stack yang digunakan
    Testimonials.tsx      # Testimoni klien
    WhyUs.tsx             # Keunggulan Born2Works
    CTA.tsx               # Call-to-action + form kontak
    Footer.tsx            # Footer
    FloatingWhatsApp.tsx  # Tombol WhatsApp floating (kanan bawah)
    FloatingControls.tsx  # Kontrol music + language toggle (kiri bawah)
    ThemeToggle.tsx       # Toggle dark/light mode
    AnimatedSection.tsx   # Wrapper Framer Motion untuk scroll animation
  contexts/
    LanguageContext.tsx   # i18n state (EN/ID) via localStorage
public/
  music/background-music.mp3  # Background music
```

## Sistem i18n (EN/ID)

Setiap komponen mendefinisikan translasi inline sebagai object `t`:

```tsx
const t = {
  heading: { en: "What We Build", id: "Yang Kami Bangun" },
  sub: { en: "...", id: "..." },
};

export default function Services() {
  const { lang } = useLang(); // "en" | "id"
  return <h2>{t.heading[lang]}</h2>;
}
```

- State bahasa disimpan di `localStorage` dengan key `"lang"`
- Toggle bahasa lewat `toggleLang()` dari `useLang()`
- Saat menambah teks baru, **selalu sediakan versi EN dan ID**
- Gunakan `useT(translations)` helper untuk pattern yang lebih ringkas

## Sistem Tema (Dark/Light)

- Dark mode diaktifkan via class `.dark` di `<html>`
- Semua warna menggunakan CSS variables atau Tailwind dark variants: `dark:text-white`, `dark:bg-[#0a0e1a]`
- Jangan gunakan warna hardcoded tanpa pasangan dark mode

## Color Palette & CSS Utilities

```css
/* Brand colors — gunakan ini, jangan hardcode hex */
brand-amber       #F59E0B   /* warna utama/aksen */
brand-amber-dark  #D97706
brand-amber-light #FEF3C7
brand-dark        #111827
brand-light       #F9FAFB
brand-muted       #6B7280
```

**Glass utilities** (definisi di `globals.css`):
- `.glass` — glassmorphism standar
- `.glass-strong` — lebih opaque, untuk navbar scrolled
- `.glass-card` — card dengan hover lift effect

**Gradient utilities**:
- `.gradient-hero` — background section hero
- `.gradient-bg` — background umum
- `.amber-glow` — box shadow amber

## Menambah/Edit Section

1. Buat file baru di `src/components/NamaSection.tsx`
2. Sertakan `"use client"` di baris pertama jika menggunakan hooks/interaksi
3. Gunakan `AnimatedSection` wrapper untuk scroll animation
4. Import dan tambahkan ke `src/app/page.tsx`
5. Beri `id` pada `<section>` yang sesuai nama anchor di navbar

## API Contact Form (`/api/contact`)

**Endpoint**: `POST /api/contact`

**Payload**:
```json
{
  "name": "string (max 80 chars)",
  "email": "string valid email",
  "needs": "string project brief (max 2000 chars)",
  "lang": "en | id",
  "website": ""   // honeypot — harus kosong, isi = bot = diabaikan
}
```

**Prioritas pengiriman**:
1. Jika `CONTACT_FORM_WEBHOOK_URL` diset → kirim via webhook POST
2. Jika tidak → kirim via SMTP (Nodemailer)

**Environment variables** (lihat `.env.example`):
```
CONTACT_FORM_WEBHOOK_URL=   # optional: webhook URL alternatif
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=                  # Gmail address
SMTP_PASS=                  # Gmail App Password (bukan password biasa)
SMTP_FROM_EMAIL=            # alamat pengirim
CONTACT_FROM_EMAIL=         # override from address
CONTACT_TO_EMAIL=           # penerima, bisa multiple dipisah koma
```

> Gmail butuh **App Password** (bukan password akun). Buat di Google Account → Security → 2-Step Verification → App Passwords.

## Floating Controls

- **Kiri bawah**: music toggle + language toggle (`FloatingControls.tsx`)
- **Kanan bawah**: WhatsApp floating button (`FloatingWhatsApp.tsx`)
- Keduanya muncul dengan Framer Motion spring animation saat halaman load

## Aturan Pengembangan

- Semua komponen baru harus `"use client"` jika ada state/effect/event handler
- Animasi masuk via `AnimatedSection` — jangan buat custom framer motion wrapper baru
- Teks baru wajib bilingual (EN + ID) dalam format `{ en: "...", id: "..." }`
- Jangan hapus `id` attribute pada `<section>` — digunakan untuk navbar active state dan anchor scroll
- Untuk konten yang sering berubah (portfolio, testimoni), data ada sebagai array di dalam komponen masing-masing — cukup edit array tersebut

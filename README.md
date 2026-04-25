<p align="center">
  <strong>↑ born</strong><span style="color:#F59E0B"><strong>works</strong></span>
</p>

<h3 align="center">Where Products Are Born</h3>

<p align="center">
  A modern, glassmorphism landing page for <strong>bornworks</strong> — a software house that builds digital products that matter.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## Features

- **Glassmorphism Design** — Frosted glass cards with `backdrop-blur`, subtle borders, and layered transparency
- **Dark / Light Mode** — Toggle with animated Sun/Moon icon, persisted to `localStorage`, respects system preference
- **Background Music** — Optional ambient music toggle with animated volume indicator
- **Validated Contact Form** — Bilingual project inquiry form with client/server validation and SMTP or webhook delivery
- **Scroll Animations** — Framer Motion-powered fade-up reveals on every section
- **Fully Responsive** — Mobile-first with animated hamburger menu
- **Zero Emoji** — All visual indicators use [Lucide React](https://lucide.dev) icons
- **SEO Ready** — Proper meta tags, semantic HTML, heading hierarchy

## Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | **Navbar** | Sticky glass nav with brand wordmark, music/theme toggles, CTA |
| 2 | **Hero** | Bold headline, tagline badge, dual CTA buttons, floating stats card |
| 3 | **Services** | 3 glass cards — Web App, Mobile, SaaS |
| 4 | **Process** | 4-step timeline (Discovery → Design → Build → Ship) |
| 5 | **Portfolio** | Project showcase cards with tech tags |
| 6 | **Why Us** | Value propositions — Startup Mindset, Full Ownership, Honest Communication |
| 7 | **CTA** | Full-width glass panel with amber glow |
| 8 | **Footer** | Dark navy footer with navigation and contact info |

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | React meta-framework (App Router) |
| [TypeScript](https://typescriptlang.org) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling (CSS-based config) |
| [Framer Motion](https://motion.dev) | 12 | Scroll-triggered animations |
| [Lucide React](https://lucide.dev) | 1.11 | Icon system |

## Getting Started

### Prerequisites

- Node.js **18+** (recommended: 20+)
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/danusprout/landing-page-bornworks.git
cd landing-page-bornworks

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a local env file before using the contact form in development or production:

```bash
cp .env.example .env.local
```

Available variables:

- `CONTACT_FORM_WEBHOOK_URL` — Optional. If set, contact form submissions are sent to this webhook.
- `SMTP_HOST` — SMTP host. For Gmail use `smtp.gmail.com`.
- `SMTP_PORT` — SMTP port. For Gmail SSL use `465`.
- `SMTP_SECURE` — `true` for SSL SMTP.
- `SMTP_USER` — Your Gmail address used to authenticate SMTP.
- `SMTP_PASS` — Gmail App Password, not your normal Gmail password.
- `SMTP_FROM_EMAIL` — Optional sender email override. Defaults to `SMTP_USER`.
- `CONTACT_FROM_EMAIL` — Optional sender identity shown in the email. Example: `Bornworks <yourgmail@gmail.com>`.
- `CONTACT_TO_EMAIL` — Optional destination inbox. Use commas for multiple recipients. Defaults to `jasmine.adlina@gmail.com`.

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Tailwind v4 theme, glass utilities, dark mode
│   ├── layout.tsx           # Root layout with Inter font + SEO metadata
│   └── page.tsx             # Landing page assembly
├── components/
│   ├── AnimatedSection.tsx   # Reusable fade-up scroll wrapper
│   ├── Navbar.tsx            # Sticky glass navbar
│   ├── Hero.tsx              # Hero section with stats
│   ├── Services.tsx          # Service cards
│   ├── Process.tsx           # Process timeline
│   ├── Portfolio.tsx         # Project showcase
│   ├── WhyUs.tsx             # Value propositions
│   ├── CTA.tsx               # Call-to-action panel
│   ├── Footer.tsx            # Footer
│   ├── ThemeToggle.tsx       # Dark/light mode toggle
│   └── MusicToggle.tsx       # Background music toggle
public/
└── music/
    └── background-music.mp3  # Ambient background music
```

## Brand

| Token | Value |
|---|---|
| Primary | `#F59E0B` (Amber) |
| Dark | `#111827` (Navy) |
| Light | `#F9FAFB` |
| Muted | `#6B7280` |
| Font | [Inter](https://fonts.google.com/specimen/Inter) |

## Deployment

This project is optimized for [Vercel](https://vercel.com):

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Next.js** (auto-detected)
4. Deploy

## License

© 2026 bornworks. PT Lahir Karya Semesta. All rights reserved.

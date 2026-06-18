/**
 * cms.ts — typed CMS data layer with server-side fetch + hardcoded fallbacks.
 *
 * All functions are async (ready for ISR/caching) and always return data —
 * even if the CMS is unreachable, we fall back to the hardcoded defaults so
 * the page never breaks.
 *
 * Env vars (prefix NEXT_PUBLIC_ for client-side access):
 *   CMS_ENABLED       — "true" (default) to use CMS, "false" to skip to fallbacks
 *   CMS_API_URL       — base URL of the CMS API  (default: http://127.0.0.1:3010)
 */

import { HeroSection } from '@/types/cms';

const CMS_URL  = process.env.CMS_API_URL  || 'http://127.0.0.1:3010';
const ENABLED  = process.env.CMS_ENABLED !== 'false';

/* ─── Fetch helper ─────────────────────────────────────── */
async function cmsFetch<T>(path: string): Promise<T | null> {
  if (!ENABLED) return null;
  try {
    const r = await fetch(`${CMS_URL}${path}`, {
      next: { revalidate: 60 },  // ISR: revalidate every 60 s
      signal: AbortSignal.timeout(3000),
    });
    if (!r.ok) return null;
    return r.json() as Promise<T>;
  } catch {
    return null;
  }
}

/* ─── Typed local data (fallbacks) ─────────────────────── */

export const fallbackHero = {
  eyebrow:         { en: 'Where Products Are Born', id: 'Tempat Produk Dilahirkan' },
  titleLines:      [{ en: 'We Build Digital Products', id: 'Kami Membangun Produk Digital' }],
  typewriterPhrases: {
    en: ['That Matter', 'People Love', 'That Scale'],
    id: ['Yang Bermakna', 'Yang Disukai', 'Yang Berkembang'],
  },
  subtitle: {
    en: 'From idea to launch — we craft web apps, mobile apps, and SaaS platforms.',
    id: 'Dari ide hingga peluncuran — kami membangun web app, mobile app, dan platform SaaS.',
  },
  primaryCta:   { label: { en: 'Start a Project', id: 'Mulai Project' },   href: '#contact'  },
  secondaryCta: { label: { en: 'See Our Work',   id: 'Lihat Karya Kami' }, href: '#portfolio' },
};

export const fallbackAbout = {
  label:   { en: 'About us', id: 'Tentang kami' },
  heading: { en: 'A small team of builders who care deeply about the craft',
             id: 'Tim kecil yang sangat peduli dengan kualitas hasil kerja' },
  sub: {
    en: 'Born2Works was founded on a simple belief: great software changes how people live and work. Based in Indonesia, we partner with founders and businesses who want digital products done right — fast, clean, and built to last.',
    id: 'Born2Works didirikan atas satu keyakinan: software yang bagus mengubah cara orang hidup dan bekerja. Berbasis di Indonesia, kami bermitra dengan founder dan bisnis yang menginginkan produk digital yang benar — cepat, bersih, dan tahan lama.',
  },
  badge: { en: 'Based in Indonesia \u00b7 Est. 2024', id: 'Berbasis di Indonesia \u00b7 Berdiri 2024' },
  values: {
    en: [
      { icon: 'Zap',    title: 'Move fast',   desc: 'We ship early and iterate quickly. No over-engineering, no endless planning.' },
      { icon: 'Shield', title: 'Build right', desc: 'Quality code, tested features, and clean architecture \u2014 every time.' },
      { icon: 'Eye',    title: 'Stay honest', desc: 'Regular updates, transparent timelines, no surprises.' },
    ],
    id: [
      { icon: 'Zap',    title: 'Bergerak cepat',     desc: 'Kami ship lebih awal dan iterasi cepat. Tanpa over-engineering.' },
      { icon: 'Shield', title: 'Bangun dengan benar', desc: 'Kode berkualitas, fitur teruji, dan arsitektur bersih.' },
      { icon: 'Eye',    title: 'Tetap jujur',        desc: 'Update rutin, timeline transparan, tanpa kejutan.' },
    ],
  },
};

export const fallbackServices = [
  {
    icon: 'Monitor',
    title:       { en: 'Web App Development',   id: 'Pengembangan Web App' },
    description: { en: 'Modern, responsive web applications built with cutting-edge frameworks. From dashboards to complex platforms, we deliver performant and scalable solutions.',
                  id: 'Aplikasi web modern dan responsif dengan framework terbaru.' },
    features:    { en: ['Next.js & React', 'Performance-first', 'Responsive & accessible'],
                   id: ['Next.js & React', 'Prioritas performa', 'Responsif & aksesibel'] },
    order: 0,
  },
  {
    icon: 'Smartphone',
    title:       { en: 'Mobile App (Android)', id: 'Mobile App (Android)' },
    description: { en: 'Native-quality Android applications using Flutter.',
                  id: 'Aplikasi Android berkualitas native menggunakan Flutter.' },
    features:    { en: ['Flutter (Android)', 'Native-quality UX', 'Offline-capable'],
                   id: ['Flutter (Android)', 'UX berkualitas native', 'Dukungan offline'] },
    order: 1,
  },
  {
    icon: 'Layers',
    title:       { en: 'SaaS Product', id: 'Produk SaaS' },
    description: { en: 'End-to-end SaaS development from architecture to deployment.',
                  id: 'Pengembangan SaaS dari arsitektur hingga deployment.' },
    features:    { en: ['Multi-tenant architecture', 'Subscription billing', 'Analytics & reporting'],
                   id: ['Arsitektur multi-tenant', 'Billing langganan', 'Analytics & pelaporan'] },
    order: 2,
  },
];

export const fallbackProcess = [
  { number: '01', title: { en: 'Discovery', id: 'Riset'   }, description: { en: 'We dive deep into your vision, market, and users.', id: 'Kami mendalami visi, pasar, dan pengguna Anda.' }, order: 0 },
  { number: '02', title: { en: 'Design',    id: 'Desain'  }, description: { en: 'Wireframes, prototypes, and polished UI/UX.',        id: 'Wireframe, prototipe, dan UI/UX yang matang.'  }, order: 1 },
  { number: '03', title: { en: 'Build',     id: 'Bangun'  }, description: { en: 'Clean, scalable code with modern frameworks.',        id: 'Kode bersih dan scalable dengan framework modern.' }, order: 2 },
  { number: '04', title: { en: 'Ship',      id: 'Rilis'   }, description: { en: 'Deployment, monitoring, and continuous iteration.',  id: 'Deployment, monitoring, dan iterasi berkelanjutan.' }, order: 3 },
];

export const fallbackPortfolio = [
  { title: { en: 'SPEKTRA \u2014 Transmission Risk Monitoring', id: 'SPEKTRA \u2014 Pemantauan Kerawanan Transmisi' }, description: { en: "Monitoring system for PLN's power transmission tower vulnerabilities \u2014 real-time risk mapping, field inspection, and a reporting dashboard.", id: 'Sistem pemantauan kerawanan tower transmisi listrik PLN.' }, tags: { en: ['Next.js','NestJS'], id: ['Next.js','NestJS'] }, accentClass: 'from-sky-400 to-cyan-500',    bgClass: 'from-sky-100 to-cyan-100 dark:from-sky-900/40 dark:to-cyan-900/40', url: 'https://spektra.biz.id/login', imageUrl: '/porto/spektra-login.webp', order: 0 },
  { title: { en: 'Financial Planning App',     id: 'Aplikasi Perencanaan Keuangan' }, description: { en: 'Personal finance management with budgeting, expense tracking, and investment portfolio insights.', id: 'Manajemen keuangan pribadi dengan budgeting dan pelacakan pengeluaran.' }, tags: { en: ['Android','Flutter'], id: ['Android','Flutter'] }, accentClass: 'from-amber-400 to-orange-500', bgClass: 'from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40', url: '', imageUrl: '', order: 1 },
  { title: { en: 'Company Profile + CMS',       id: 'Company Profile + CMS'       }, description: { en: 'SEO-optimised company website with headless CMS, blazing-fast page loads.', id: 'Website company profile dengan headless CMS.' }, tags: { en: ['Next.js','TypeScript'], id: ['Next.js','TypeScript'] }, accentClass: 'from-blue-400 to-indigo-500',  bgClass: 'from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40', url: '', imageUrl: '', order: 2 },
  { title: { en: 'Restaurant Ordering System',  id: 'Sistem Pemesanan Restoran'   }, description: { en: 'QR-based ordering with real-time kitchen display and table management.', id: 'Pemesanan berbasis QR dengan tampilan dapur real-time.' }, tags: { en: ['Vue.js','Express'], id: ['Vue.js','Express'] }, accentClass: 'from-emerald-400 to-teal-500', bgClass: 'from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40', url: '', imageUrl: '', order: 3 },
  { title: { en: 'SaaS Analytics Dashboard',    id: 'Dashboard Analitik SaaS'     }, description: { en: 'Real-time analytics with role-based access, custom charts, and webhook integrations.', id: 'Analitik real-time dengan akses berbasis peran dan integrasi webhook.' }, tags: { en: ['React','Node.js'], id: ['React','Node.js'] }, accentClass: 'from-violet-400 to-purple-500', bgClass: 'from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40', url: '', imageUrl: '', order: 4 },
];

export const fallbackCta = {
  badge:     { en: "Let's Work Together", id: 'Ayo Berkolaborasi' },
  line1:     { en: 'Ready to Build',    id: 'Siap Membangun' },
  line2:     { en: 'Something Great?',  id: 'Sesuatu yang Besar?' },
  sub:       { en: 'Tell us about your project \u2014 we reply fast.', id: 'Ceritakan project Anda \u2014 kami balas cepat.' },
  waCta:     { en: 'Chat on WhatsApp', id: 'Chat di WhatsApp' },
  emailLabel:{ en: 'Or send us an email', id: 'Atau kirim email' },
  note:      { en: 'Usually replies within 1 business day \u00b7 Free consultation', id: 'Biasanya balas dalam 1 hari kerja \u00b7 Konsultasi gratis' },
  whatsappNumber: process.env.WHATSAPP_NO || '6281298172410',
  waMessage: { en: "Hi Born2Works! I'd like to discuss my project.", id: 'Halo Born2Works! Saya ingin diskusi tentang project saya.' },
};

export const fallbackFooter = {
  desc:          { en: 'Where Products Are Born.', id: 'Tempat Produk Dilahirkan.' },
  email:          'hello@bornworks.id',
  location:       'Indonesia',
  copyrightName:  'bornworks. PT Lahir Karya Semesta.',
  rights:         { en: 'All rights reserved.', id: 'Hak cipta dilindungi.' },
  backTop:        { en: 'Back to top', id: 'Kembali ke atas' },
  linkGroups: {
    en: [
      { title: 'Company', links: [{ label: 'About', href: '#about' }, { label: 'Services', href: '#services' }, { label: 'Portfolio', href: '#portfolio' }, { label: 'Contact', href: '#contact' }] },
      { title: 'Services', links: [{ label: 'Web App Development', href: '#services' }, { label: 'Mobile App (Android)', href: '#services' }, { label: 'SaaS Product', href: '#services' }] },
    ],
    id: [
      { title: 'Perusahaan', links: [{ label: 'Tentang', href: '#about' }, { label: 'Layanan', href: '#services' }, { label: 'Portofolio', href: '#portfolio' }, { label: 'Kontak', href: '#contact' }] },
      { title: 'Layanan', links: [{ label: 'Pengembangan Web App', href: '#services' }, { label: 'Mobile App (Android)', href: '#services' }, { label: 'Produk SaaS', href: '#services' }] },
    ],
  },
};

/* ─── API fetch functions ──────────────────────────────── */

export async function getHero() {
  const data = await cmsFetch<HeroSection>('/hero');
  return data ?? fallbackHero;
}

export async function getAbout() {
  const data = await cmsFetch<typeof fallbackAbout>('/about');
  return data ?? fallbackAbout;
}

export async function getServices() {
  const data = await cmsFetch<typeof fallbackServices>('/services');
  return (data ?? fallbackServices) as typeof fallbackServices;
}

export async function getProcessSteps() {
  const data = await cmsFetch<typeof fallbackProcess>('/process-steps');
  return (data ?? fallbackProcess) as typeof fallbackProcess;
}

export async function getPortfolio() {
  const data = await cmsFetch<typeof fallbackPortfolio>('/portfolio');
  return (data ?? fallbackPortfolio) as typeof fallbackPortfolio;
}

export async function getCta() {
  const data = await cmsFetch<typeof fallbackCta>('/cta');
  const siteSettings = await cmsFetch<{ whatsappNumber: string }>('/site-settings');
  return {
    ...(data ?? fallbackCta),
    whatsappNumber: siteSettings?.whatsappNumber ?? fallbackCta.whatsappNumber,
  } as typeof fallbackCta;
}

export async function getFooter() {
  const data = await cmsFetch<typeof fallbackFooter>('/footer');
  return data ?? fallbackFooter;
}

/* ─── Page-level fetch (parallel, for server components) ─── */
export async function getCmsPageData() {
  const [hero, about, services, process, portfolio, cta, footer] = await Promise.all([
    getHero(),
    getAbout(),
    getServices(),
    getProcessSteps(),
    getPortfolio(),
    getCta(),
    getFooter(),
  ]);
  return { hero, about, services, process, portfolio, cta, footer };
}

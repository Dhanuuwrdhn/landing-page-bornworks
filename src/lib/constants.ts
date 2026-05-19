/**
 * Base URL situs — dipakai untuk metadata, sitemap, robots, dan JSON-LD.
 *
 * Cara set:
 *   - Development  : otomatis pakai Vercel URL
 *   - Vercel deploy: set NEXT_PUBLIC_SITE_URL di Vercel Dashboard → Settings → Environment Variables
 *   - Setelah dapat domain: isi NEXT_PUBLIC_SITE_URL=https://bornworks.id
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://landing-page-bornworks.vercel.app";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "bornworks | Software House Indonesia — Web App, Mobile App & SaaS",
    template: "%s | bornworks",
  },
  description:
    "Software house terpercaya di Indonesia. Kami bangun web app, mobile app Android, dan produk SaaS — dari ide sampai launch. Konsultasi gratis, proses transparan.",
  keywords: [
    "software house Indonesia",
    "jasa pembuatan web app",
    "jasa pembuatan mobile app Android",
    "pengembangan SaaS Indonesia",
    "bornworks",
    "digital product Indonesia",
    "jasa software house",
    "web development Indonesia",
    "Flutter developer Indonesia",
    "Next.js developer Indonesia",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "bornworks | Software House Indonesia — Web App, Mobile App & SaaS",
    description:
      "Software house terpercaya di Indonesia. Web app, mobile app Android, dan produk SaaS — dari ide sampai launch.",
    type: "website",
    siteName: "bornworks",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: SITE_URL,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "bornworks | Software House Indonesia — Web App, Mobile App & SaaS",
    description:
      "Software house terpercaya di Indonesia. Web app, mobile app Android, dan produk SaaS — dari ide sampai launch.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} h-full antialiased scroll-smooth`}>
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0e1a] text-brand-light font-sans">
        {children}
      </body>
    </html>
  );
}

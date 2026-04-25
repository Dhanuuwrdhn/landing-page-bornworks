import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "bornworks — Where Products Are Born",
  description:
    "bornworks is a software house that builds digital products — web apps, mobile apps, and SaaS platforms — from idea to launch.",
  keywords: [
    "software house",
    "web development",
    "mobile app development",
    "SaaS",
    "bornworks",
    "digital product",
    "Indonesia",
  ],
  openGraph: {
    title: "bornworks — Where Products Are Born",
    description:
      "From idea to launch — we craft web apps, mobile apps, and SaaS platforms.",
    type: "website",
    siteName: "bornworks",
    locale: "en_US",
    url: "https://bornworks.id",
  },
  twitter: {
    card: "summary_large_image",
    title: "bornworks — Where Products Are Born",
    description:
      "From idea to launch — we craft web apps, mobile apps, and SaaS platforms.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://bornworks.id"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-white text-brand-dark font-sans">
        {children}
      </body>
    </html>
  );
}

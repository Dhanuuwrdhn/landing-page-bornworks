import type { Metadata } from "next";
import "./globals.css";

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
  ],
  openGraph: {
    title: "bornworks — Where Products Are Born",
    description:
      "From idea to launch — we craft web apps, mobile apps, and SaaS platforms.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-brand-dark font-sans">
        {children}
      </body>
    </html>
  );
}

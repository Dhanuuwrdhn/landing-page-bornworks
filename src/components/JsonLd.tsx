/**
 * JSON-LD structured data for bornworks
 * Informs Google about: Organization, WebSite, and services offered.
 */
import { SITE_URL } from "@/lib/constants";

export default function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "bornworks",
    legalName: "PT Lahir Karya Semesta",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    image: `${SITE_URL}/opengraph-image`,
    description:
      "Software house terpercaya di Indonesia. Kami membangun web app, mobile app Android, dan produk SaaS dari ide sampai launch.",
    email: "hello@bornworks.id",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ID",
    },
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    foundingDate: "2024",
    knowsAbout: [
      "Web Application Development",
      "Mobile App Development",
      "SaaS Development",
      "Flutter",
      "Next.js",
      "TypeScript",
      "Laravel",
    ],
    sameAs: [],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "bornworks",
    description:
      "Software house Indonesia — web app, mobile app, dan SaaS dari ide sampai launch.",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: ["id-ID", "en-US"],
  };

  const services = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Layanan bornworks",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Service",
          name: "Web App Development",
          description:
            "Pengembangan web application modern dan responsif dengan framework terbaru seperti Next.js dan React.",
          provider: { "@id": `${SITE_URL}/#organization` },
          areaServed: { "@type": "Country", name: "Indonesia" },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Service",
          name: "Mobile App Development (Android)",
          description:
            "Pengembangan aplikasi Android berkualitas native menggunakan Flutter.",
          provider: { "@id": `${SITE_URL}/#organization` },
          areaServed: { "@type": "Country", name: "Indonesia" },
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Service",
          name: "SaaS Product Development",
          description:
            "Pengembangan produk SaaS end-to-end, dari arsitektur hingga deployment. Platform multi-tenant yang scalable.",
          provider: { "@id": `${SITE_URL}/#organization` },
          areaServed: { "@type": "Country", name: "Indonesia" },
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(services) }}
      />
    </>
  );
}

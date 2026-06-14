import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "bornworks — Software House Indonesia",
    short_name: "bornworks",
    description:
      "Software house terpercaya di Indonesia. Web app, mobile app Android, dan produk SaaS — dari ide sampai launch.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e1a",
    theme_color: "#0a0e1a",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}

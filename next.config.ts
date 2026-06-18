import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted Docker target: emit a minimal standalone server (.next/standalone/server.js).
  output: "standalone",
};

export default nextConfig;

// Cloudflare Workers (OpenNext) — enables wrangler bindings during `next dev` only.
// Guarded so self-hosted/Docker production builds never invoke CF tooling.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Simple landing page — no ISR/incremental cache needed, so no R2 binding required.
export default defineCloudflareConfig();

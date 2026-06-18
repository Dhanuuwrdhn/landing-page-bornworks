"use client";

import { LazyMotion, MotionConfig } from "framer-motion";

// Lazy-load the full DOM feature set (includes layout animations needed for
// `layoutId`) so the initial bundle only ships the thin `m` component and the
// heavy feature pack streams in after hydration.
const loadFeatures = () =>
  import("framer-motion").then((mod) => mod.domMax);

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LazyMotion features={loadFeatures}>
      {/* Honour the OS "reduce motion" setting — lighter + no jank on low-end devices. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

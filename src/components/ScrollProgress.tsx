"use client";

import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      id="scroll-progress"
      className="fixed top-0 left-0 right-0 h-[3px] bg-brand-amber origin-left z-[60]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

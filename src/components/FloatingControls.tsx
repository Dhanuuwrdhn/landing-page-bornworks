"use client";

import { useRef, useEffect, useCallback, useState, useSyncExternalStore } from "react";
import { Volume2, VolumeX, Languages } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";

function subscribe() {
  return () => {};
}

export default function FloatingControls() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { lang, toggleLang } = useLang();

  useEffect(() => {
    const audio = new Audio("/music/background-music.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying((prev) => !prev);
  }, [playing]);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2.5">
      {/* Music Toggle */}
      <motion.button
        onClick={toggleMusic}
        id="floating-music"
        aria-label={playing ? "Mute music" : "Play music"}
        className="relative flex h-11 w-11 items-center justify-center rounded-full glass-strong shadow-lg hover:shadow-xl transition-all"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {playing && (
          <motion.span
            className="absolute inset-0 rounded-full border border-brand-amber/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {playing ? (
            <motion.div
              key="on"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Volume2 className="w-[18px] h-[18px] text-brand-amber" />
            </motion.div>
          ) : (
            <motion.div
              key="off"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <VolumeX className="w-[18px] h-[18px] text-brand-dark/50 dark:text-white/50" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Language Toggle */}
      <motion.button
        onClick={toggleLang}
        id="floating-language"
        aria-label="Toggle language"
        className="flex h-11 w-11 items-center justify-center rounded-full glass-strong shadow-lg hover:shadow-xl transition-all"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.8, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-1">
          <Languages className="w-3.5 h-3.5 text-brand-dark/50 dark:text-white/50" />
          <span className="text-[11px] font-bold text-brand-dark dark:text-white uppercase">
            {lang}
          </span>
        </div>
      </motion.button>
    </div>
  );
}

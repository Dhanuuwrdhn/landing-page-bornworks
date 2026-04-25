"use client";

import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function subscribe() {
  return () => {};
}

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

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

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Autoplay blocked — user needs to interact first
      });
    }
    setPlaying((prev) => !prev);
  }, [playing]);

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      id="music-toggle"
      aria-label={playing ? "Mute background music" : "Play background music"}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-dark/5 hover:bg-brand-dark/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
    >
      {/* Animated sound waves ring when playing */}
      {playing && (
        <motion.span
          className="absolute inset-0 rounded-xl border-2 border-brand-amber/40"
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <AnimatePresence mode="wait" initial={false}>
        {playing ? (
          <motion.div
            key="volume-on"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Volume2 className="w-[18px] h-[18px] text-brand-amber" />
          </motion.div>
        ) : (
          <motion.div
            key="volume-off"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <VolumeX className="w-[18px] h-[18px] text-brand-dark dark:text-white/60" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-jbi-navy via-jbi-blue to-jbi-electric"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <ToothMorph />
            </motion.div>
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center"
            >
              <p className="font-display text-2xl font-semibold tracking-wide text-white">
                JBI <span className="text-jbi-champagne">Smile Design</span>
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.32em] text-white/60">
                Chișinău
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ToothMorph() {
  return (
    <svg viewBox="0 0 120 140" className="h-24 w-24 drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
      <defs>
        <linearGradient id="toothFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EAF4FF" />
        </linearGradient>
      </defs>
      <motion.path
        d="M60 12 C 30 12, 14 32, 18 62 C 22 90, 30 120, 42 130 C 50 134, 54 118, 60 100 C 66 118, 70 134, 78 130 C 90 120, 98 90, 102 62 C 106 32, 90 12, 60 12 Z"
        fill="url(#toothFill)"
        stroke="#005BBB"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />
      {/* Mouth: starts as a flat line (neutral), morphs into a smile */}
      <motion.path
        fill="none"
        stroke="#005BBB"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ d: "M44 70 Q60 70 76 70" }}
        animate={{ d: "M44 66 Q60 86 76 66" }}
        transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
      />
    </svg>
  );
}

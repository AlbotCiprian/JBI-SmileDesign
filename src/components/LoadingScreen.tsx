"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-jbi-navy"
          aria-hidden="true"
        >
          {/* Animated gradient orbs */}
          <motion.div
            className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-jbi-blue/40 blur-3xl"
            animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-jbi-electric/30 blur-3xl"
            animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-jbi-champagne/10 blur-3xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Rotating ring */}
              <motion.div
                className="absolute inset-0 -m-8 rounded-full border border-white/15"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-jbi-champagne" />
                <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-jbi-electric" />
              </motion.div>

              {/* Glow halo */}
              <motion.div
                className="absolute inset-0 -m-4 rounded-full bg-gradient-to-br from-jbi-electric/40 to-jbi-champagne/30 blur-2xl"
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />

              <ToothMark />

              {/* Sparkles */}
              <motion.span
                className="absolute -right-3 -top-2 text-jbi-champagne"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0] }}
                transition={{ duration: 1.4, delay: 1.0, repeat: Infinity, repeatDelay: 0.4 }}
              >
                <Sparkle />
              </motion.span>
              <motion.span
                className="absolute -left-4 top-8 text-jbi-electric"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 0.8, 0] }}
                transition={{ duration: 1.4, delay: 1.3, repeat: Infinity, repeatDelay: 0.6 }}
              >
                <Sparkle small />
              </motion.span>
              <motion.span
                className="absolute -right-6 bottom-4 text-white/80"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 0.8, 0] }}
                transition={{ duration: 1.4, delay: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
              >
                <Sparkle small />
              </motion.span>
            </motion.div>

            {/* Wordmark */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              <p className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                JBI{" "}
                <span className="bg-gradient-to-r from-jbi-champagne to-white bg-clip-text text-transparent">
                  Smile Design
                </span>
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.4em] text-white/50 sm:text-xs">
                Stomatologie premium · Chișinău
              </p>
            </motion.div>

            {/* Progress dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-white/40"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ToothMark() {
  return (
    <svg
      viewBox="0 0 140 160"
      className="h-28 w-28 sm:h-32 sm:w-32"
      fill="none"
    >
      <defs>
        <linearGradient id="toothFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#EAF4FF" />
          <stop offset="100%" stopColor="#D8C3A5" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="toothStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1687FF" />
          <stop offset="100%" stopColor="#005BBB" />
        </linearGradient>
      </defs>

      {/* Tooth body — anatomically refined */}
      <motion.path
        d="M70 14
           C 44 14, 24 28, 22 56
           C 20 80, 26 102, 34 126
           C 38 138, 44 148, 52 148
           C 58 148, 60 138, 64 122
           C 66 116, 68 112, 70 112
           C 72 112, 74 116, 76 122
           C 80 138, 82 148, 88 148
           C 96 148, 102 138, 106 126
           C 114 102, 120 80, 118 56
           C 116 28, 96 14, 70 14 Z"
        fill="url(#toothFill)"
        stroke="url(#toothStroke)"
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* Highlight */}
      <motion.path
        d="M48 44 Q 54 32, 68 30"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      />

      {/* Smile mouth — morphs from neutral line into smile */}
      <motion.path
        fill="none"
        stroke="#005BBB"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ d: "M50 78 Q70 78 90 78" }}
        animate={{ d: "M50 76 Q70 102 90 76" }}
        transition={{ delay: 1.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

function Sparkle({ small = false }: { small?: boolean }) {
  const size = small ? 14 : 20;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z" />
    </svg>
  );
}

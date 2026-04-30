"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { ReviewMessage } from "@/i18n/messages";

export function GoogleReviewsSection() {
  const t = useTranslations("reviews");
  const reviews = t.raw("items") as ReviewMessage[];
  const [index, setIndex] = useState(0);
  const total = reviews.length;
  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const current = reviews[index];

  return (
    <section id="recenzii" className="relative bg-white py-16 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 className="section-title mt-4">{t("title")}</h2>
          <p className="mt-4 text-base text-jbi-navy/65 sm:text-lg">{t("description")}</p>

          {/* Rating summary — instant trust */}
          <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-full border border-jbi-navy/5 bg-white px-4 py-2 shadow-soft">
            <div className="flex items-center gap-1 text-jbi-champagne">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-semibold text-jbi-navy">5.0</span>
            <span className="text-xs text-jbi-navy/50">·</span>
            <span className="text-xs font-medium text-jbi-navy/70">
              {t("ratingSummary", { count: reviews.length })}
            </span>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-jbi-navy/5 bg-gradient-to-br from-white to-jbi-soft/40 p-8 shadow-soft sm:p-12">
            <Quote className="absolute right-8 top-8 h-12 w-12 text-jbi-blue/10" />

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-1 text-jbi-champagne">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="mt-6 font-display text-xl leading-relaxed text-jbi-navy sm:text-2xl">
                  &ldquo;{current.text}&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-jbi-blue font-semibold text-white">
                    {current.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-jbi-navy">{current.name}</p>
                    <p className="text-xs text-jbi-navy/50">{t("googleReview")}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={t("reviewLabel", { index: i + 1 })}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-8 bg-jbi-blue" : "w-2 bg-jbi-navy/15"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  aria-label={t("previous")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-jbi-navy/10 bg-white text-jbi-navy transition-colors hover:bg-jbi-soft"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  aria-label={t("next")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-jbi-navy/10 bg-white text-jbi-navy transition-colors hover:bg-jbi-soft"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://www.google.com/maps/search/?api=1&query=JBI+Smile+Design+Chisinau"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              {t("leaveReview")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

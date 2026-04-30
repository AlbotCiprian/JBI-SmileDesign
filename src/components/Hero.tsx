"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MapPin, Languages, Clock, Stethoscope, Star, MessageCircle } from "lucide-react";
import { clinic } from "@/lib/data";
import { localizedHref, type Locale } from "@/i18n/routing";

const badgeIcons = [MapPin, Languages, Clock, Stethoscope];

export function Hero() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const trustBadges = t.raw("hero.trustBadges") as string[];
  const whatsappLink =
    "https://wa.me/" + clinic.phone.whatsapp + "?text=" + encodeURIComponent(t("clinic.whatsappText"));

  return (
    <section className="relative overflow-hidden bg-hero-radial pt-24 sm:pt-32 lg:pt-36">
      <div className="pointer-events-none absolute -left-20 top-32 h-72 w-72 rounded-full bg-jbi-soft blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-jbi-electric/10 blur-3xl" />

      <div className="container-x relative grid items-center gap-10 pb-20 sm:gap-12 sm:pb-24 lg:grid-cols-12 lg:gap-10 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <span className="eyebrow">{t("hero.eyebrow")}</span>

          <h1 className="mt-4 font-display text-[2.25rem] font-semibold leading-[1.1] tracking-tight text-jbi-navy sm:text-5xl lg:text-[3.75rem]">
            <span className="block">{t("clinic.name")} —</span>
            <span className="block bg-gradient-to-r from-jbi-blue to-jbi-electric bg-clip-text text-transparent">
              {t("clinic.tagline")}
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-jbi-navy/70 sm:mt-6 sm:text-lg">
            {t("clinic.shortDescription")}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link href={localizedHref(locale, "#programare")} className="btn-primary">
              {t("nav.bookConsultation")}
            </Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <MessageCircle className="h-4 w-4" />
              {t("nav.whatsapp")}
            </a>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-4">
            {trustBadges.map((label, i) => {
              const Icon = badgeIcons[i] ?? MapPin;
              return (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-2xl border border-jbi-navy/5 bg-white/70 px-3 py-2 backdrop-blur"
                >
                  <Icon className="h-4 w-4 shrink-0 text-jbi-blue" />
                  <span className="text-xs font-medium text-jbi-navy/80 sm:text-sm">{label}</span>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.8, ease: "easeOut" }}
          className="relative lg:col-span-5"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-jbi-navy/5">
            <Image
              src="/images/lobby-reception.jpg"
              alt={t("hero.imageAlt")}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jbi-navy/30 via-transparent to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="absolute -left-4 bottom-8 hidden w-[260px] rounded-2xl border border-jbi-navy/5 bg-white p-4 shadow-soft sm:block"
          >
            <div className="flex items-center gap-1 text-jbi-champagne">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-2 text-sm font-medium text-jbi-navy">{t("hero.rating")}</p>
            <p className="mt-1 text-xs text-jbi-navy/50">{t("hero.reviews")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="absolute -right-2 top-6 hidden rounded-2xl bg-jbi-navy p-4 text-white shadow-soft sm:block"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-jbi-champagne">
              {t("hero.quickContact")}
            </p>
            <p className="mt-1 text-base font-semibold">{clinic.phone.international}</p>
            <p className="text-xs text-white/60">{t("clinic.addressStreet")}, {t("clinic.addressCity")}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

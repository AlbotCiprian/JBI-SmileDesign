"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ServiceIconBySlug } from "./ServiceIcons";
import { localizedHref, type Locale } from "@/i18n/routing";
import type { ServiceMessage } from "@/i18n/messages";

export function Services() {
  const t = useTranslations("services");
  const locale = useLocale() as Locale;
  const services = t.raw("items") as ServiceMessage[];

  return (
    <section id="servicii" className="relative bg-white py-16 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 className="section-title mt-4">{t("title")}</h2>
          <p className="mt-4 text-base text-jbi-navy/65 sm:text-lg">{t("description")}</p>
        </div>

        <div className="mt-12 grid gap-3 sm:mt-14 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = ServiceIconBySlug[s.slug];
            return (
              <motion.article
                key={s.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-jbi-navy/5 bg-white p-5 shadow-[0_2px_20px_-12px_rgba(11,31,58,0.12)] transition-shadow hover:shadow-soft sm:p-6"
              >
                {/* Subtle gradient overlay on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-jbi-soft/0 via-transparent to-jbi-soft/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:from-jbi-soft/40 group-hover:to-jbi-electric/5"
                />
                <div className="relative h-20 w-20 transition-transform duration-500 group-hover:scale-105 sm:h-24 sm:w-24">
                  {Icon ? <Icon className="h-full w-full" /> : null}
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-jbi-navy">{s.title}</h3>
                <p className="mt-1 text-sm font-medium text-jbi-blue">{s.short}</p>
                <p className="mt-3 text-sm leading-relaxed text-jbi-navy/65">{s.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-jbi-navy/5 pt-4">
                  <Link
                    href={localizedHref(locale, "#programare")}
                    className="text-sm font-semibold text-jbi-blue transition-colors hover:text-jbi-electric"
                  >
                    {t("schedule")}
                  </Link>
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-jbi-soft text-jbi-blue transition-all group-hover:bg-jbi-blue group-hover:text-white"
                    aria-hidden="true"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

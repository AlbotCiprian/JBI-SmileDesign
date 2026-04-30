"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MessageSquare, HeartHandshake, ClipboardList, Baby } from "lucide-react";
import type { PointMessage } from "@/i18n/messages";

const icons = [MessageSquare, HeartHandshake, ClipboardList, Baby];

export function TeamTrust() {
  const t = useTranslations("team");
  const trustPoints = t.raw("points") as PointMessage[];

  return (
    <section id="echipa" className="relative bg-white py-16 sm:py-28">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <span className="eyebrow">{t("eyebrow")}</span>
            <h2 className="section-title mt-4">{t("title")}</h2>
            <p className="mt-5 text-base leading-relaxed text-jbi-navy/70 sm:text-lg">{t("text")}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {trustPoints.map(({ title, text }, i) => {
                const Icon = icons[i] ?? MessageSquare;
                return (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-2xl border border-jbi-navy/5 p-5 transition-shadow hover:shadow-soft"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-jbi-blue to-jbi-electric text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-4 font-semibold text-jbi-navy">{title}</p>
                    <p className="mt-1 text-sm text-jbi-navy/60">{text}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative lg:col-span-6"
          >
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-jbi-navy/5">
              <Image
                src="/images/lobby-reception.jpg"
                alt={t("imageAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-jbi-navy/20 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

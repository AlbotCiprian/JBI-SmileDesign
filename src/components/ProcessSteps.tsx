"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { Messages } from "@/i18n/messages";

type ProcessStep = Messages["process"]["steps"][number];

export function ProcessSteps() {
  const t = useTranslations("process");
  const processSteps = t.raw("steps") as ProcessStep[];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-jbi-soft/30 to-white py-16 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 className="section-title mt-4">{t("title")}</h2>
          <p className="mt-4 text-base text-jbi-navy/65 sm:text-lg">{t("description")}</p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-jbi-blue/30 to-transparent lg:block" />

          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
            {processSteps.map((step, i) => (
              <motion.li
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="relative flex flex-col items-start lg:items-center lg:text-center"
              >
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-soft ring-2 ring-jbi-blue">
                  <span className="font-display text-lg font-semibold text-jbi-blue">{step.n}</span>
                </div>
                <h3 className="mt-4 font-semibold text-jbi-navy">{step.title}</h3>
                <p className="mt-2 text-sm text-jbi-navy/60">{step.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { services } from "@/lib/data";
import { ServiceIconBySlug } from "./ServiceIcons";

export function Services() {
  return (
    <section id="servicii" className="relative bg-white py-20 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Servicii</span>
          <h2 className="section-title mt-4">
            Tratamente complete pentru întreaga familie
          </h2>
          <p className="mt-4 text-base text-jbi-navy/65 sm:text-lg">
            De la prevenție și tratamente de bază, până la implantologie și estetică
            dentară — totul într-un singur loc, cu plan personalizat pentru fiecare
            pacient.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-jbi-navy/5 bg-white p-6 shadow-[0_2px_20px_-12px_rgba(11,31,58,0.12)] transition-shadow hover:shadow-soft"
              >
                <div className="relative h-24 w-24 transition-transform duration-500 group-hover:scale-105">
                  {Icon ? <Icon className="h-full w-full" /> : null}
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold text-jbi-navy">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-jbi-blue">{s.short}</p>
                <p className="mt-3 text-sm leading-relaxed text-jbi-navy/65">
                  {s.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-jbi-navy/5 pt-4">
                  <Link
                    href={`#programare`}
                    className="text-sm font-semibold text-jbi-blue transition-colors hover:text-jbi-electric"
                  >
                    Programează-te
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

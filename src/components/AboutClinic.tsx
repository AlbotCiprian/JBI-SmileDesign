"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Languages, Users } from "lucide-react";

const features = [
  { Icon: Sparkles, title: "Abordare personalizată", text: "Plan adaptat fiecărui pacient." },
  { Icon: ShieldCheck, title: "Mediu modern și curat", text: "Standarde înalte de igienă." },
  { Icon: Languages, title: "Comunicare RO / EN / RU", text: "Vorbim limba ta." },
  { Icon: Users, title: "Soluții pentru familie", text: "De la copii la adulți." },
];

export function AboutClinic() {
  return (
    <section id="despre" className="relative overflow-hidden bg-jbi-soft/40 py-20 sm:py-28">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative lg:col-span-5"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-jbi-navy/5">
              <Image
                src="/images/clinic-interior.jpg"
                alt="Interior clinică JBI Smile Design"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-jbi-navy p-5 text-white shadow-soft sm:block">
              <p className="font-display text-3xl font-semibold">100%</p>
              <p className="text-xs uppercase tracking-[0.2em] text-jbi-champagne">
                Focus pe pacient
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <span className="eyebrow">Despre clinică</span>
            <h2 className="section-title mt-4">
              Stomatologie modernă, gândită în jurul pacientului
            </h2>
            <p className="mt-5 text-base leading-relaxed text-jbi-navy/70 sm:text-lg">
              JBI Smile Design este o clinică stomatologică din Chișinău, creată
              pentru pacienții care caută tratamente moderne, comunicare clară și
              o experiență medicală confortabilă. Punem accent pe diagnostic
              corect, tratamente personalizate și relație de încredere cu fiecare
              pacient.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {features.map(({ Icon, title, text }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 rounded-2xl border border-jbi-navy/5 bg-white p-4 shadow-[0_2px_12px_-8px_rgba(11,31,58,0.1)]"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-jbi-soft text-jbi-blue">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-jbi-navy">{title}</p>
                    <p className="text-xs text-jbi-navy/60">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

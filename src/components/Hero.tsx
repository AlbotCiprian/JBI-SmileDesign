"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Languages, Clock, Stethoscope, Star, MessageCircle } from "lucide-react";
import { clinic, trustBadges } from "@/lib/data";

const badgeIcons = [MapPin, Languages, Clock, Stethoscope];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-radial pt-24 sm:pt-32 lg:pt-36">
      {/* Soft background blobs */}
      <div className="pointer-events-none absolute -left-20 top-32 h-72 w-72 rounded-full bg-jbi-soft blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-jbi-electric/10 blur-3xl" />

      <div className="container-x relative grid items-center gap-10 pb-20 sm:gap-12 sm:pb-24 lg:grid-cols-12 lg:gap-10 lg:pb-32">
        {/* Text column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <span className="eyebrow">Clinică stomatologică · Chișinău</span>

          <h1 className="mt-4 font-display text-[2.25rem] font-semibold leading-[1.1] tracking-tight text-jbi-navy sm:text-5xl lg:text-[3.75rem]">
            <span className="block">{clinic.name} —</span>
            <span className="block bg-gradient-to-r from-jbi-blue to-jbi-electric bg-clip-text text-transparent">
              zâmbetul tău, creat cu grijă și precizie
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-jbi-navy/70 sm:mt-6 sm:text-lg">
            {clinic.shortDescription}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link href="#programare" className="btn-primary">
              Programează o consultație
            </Link>
            <a
              href={clinic.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <MessageCircle className="h-4 w-4" />
              Scrie pe WhatsApp
            </a>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-4">
            {trustBadges.map((b, i) => {
              const Icon = badgeIcons[i] ?? MapPin;
              return (
                <li
                  key={b.label}
                  className="flex items-center gap-2 rounded-2xl border border-jbi-navy/5 bg-white/70 px-3 py-2 backdrop-blur"
                >
                  <Icon className="h-4 w-4 shrink-0 text-jbi-blue" />
                  <span className="text-xs font-medium text-jbi-navy/80 sm:text-sm">
                    {b.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* Image column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.8, ease: "easeOut" }}
          className="relative lg:col-span-5"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-jbi-navy/5">
            <Image
              src="/images/lobby-reception.jpg"
              alt="Recepția clinicii JBI Smile Design"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jbi-navy/30 via-transparent to-transparent" />
          </div>

          {/* Floating rating card */}
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
            <p className="mt-2 text-sm font-medium text-jbi-navy">
              Pacienți mulțumiți, comunicare clară și confort la fiecare vizită.
            </p>
            <p className="mt-1 text-xs text-jbi-navy/50">Recenzii Google · JBI Smile Design</p>
          </motion.div>

          {/* Floating contact card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="absolute -right-2 top-6 hidden rounded-2xl bg-jbi-navy p-4 text-white shadow-soft sm:block"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-jbi-champagne">
              Contact rapid
            </p>
            <p className="mt-1 text-base font-semibold">{clinic.phone.international}</p>
            <p className="text-xs text-white/60">{clinic.address.street}, {clinic.address.city}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

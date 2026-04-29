"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Languages } from "lucide-react";
import { clinic } from "@/lib/data";
import { AppointmentForm } from "./AppointmentForm";

export function ContactSection() {
  return (
    <section id="contact" className="relative bg-jbi-soft/30 py-16 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Contact</span>
          <h2 className="section-title mt-4">Vino în clinică sau scrie-ne</h2>
          <p className="mt-4 text-base text-jbi-navy/65 sm:text-lg">
            Suntem la doar un mesaj distanță. Echipa noastră răspunde rapid și te
            ajută să găsești cel mai potrivit moment pentru programare.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <ContactCard
              Icon={MapPin}
              title="Adresă"
              value={clinic.address.full}
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                clinic.address.mapsQuery,
              )}`}
              cta="Vezi pe hartă"
            />
            <ContactCard
              Icon={Phone}
              title="Telefon"
              value={clinic.phone.international}
              href={`tel:${clinic.phone.tel}`}
              cta="Sună acum"
            />
            <ContactCard
              Icon={MessageCircle}
              title="WhatsApp"
              value={clinic.phone.international}
              href={clinic.whatsappLink}
              cta="Scrie pe WhatsApp"
              external
            />
            <ContactCard
              Icon={Mail}
              title="Email"
              value={clinic.email}
              href={`mailto:${clinic.email}`}
              cta="Trimite email"
            />
            <div className="flex items-start gap-4 rounded-2xl border border-jbi-navy/5 bg-white p-5">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-jbi-soft text-jbi-blue">
                <Languages className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-jbi-navy">Limbi vorbite</p>
                <p className="text-sm text-jbi-navy/60">
                  {clinic.languages.join(" · ")}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl border border-jbi-navy/5 bg-white shadow-soft"
          >
            <div className="aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-auto lg:h-full">
              <iframe
                title="Hartă JBI Smile Design"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  clinic.address.mapsQuery,
                )}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 420 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>

        {/* Formular real de programare */}
        <div id="programare" className="mt-16 grid items-start gap-8 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <span className="eyebrow">Programări</span>
            <h3 className="section-title mt-4">Programează o consultație</h3>
            <p className="mt-4 text-base text-jbi-navy/65 sm:text-lg">
              Completează formularul și echipa noastră te va contacta în cel mai
              scurt timp pentru a confirma ora exactă. Preferi prin telefon?
              Suntem disponibili pe WhatsApp și telefon.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={clinic.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a href={`tel:${clinic.phone.tel}`} className="btn-secondary">
                <Phone className="h-4 w-4" /> {clinic.phone.international}
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-jbi-navy/5 bg-white p-5">
              <p className="text-sm font-semibold text-jbi-navy">Program clinică</p>
              <p className="mt-2 text-sm text-jbi-navy/60">
                Programările se confirmă în zilele lucrătoare. În weekend răspundem
                de luni dimineață.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <AppointmentForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  Icon,
  title,
  value,
  href,
  cta,
  external,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  href: string;
  cta: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-4 rounded-2xl border border-jbi-navy/5 bg-white p-5 transition-shadow hover:shadow-soft"
    >
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-jbi-soft text-jbi-blue transition-colors group-hover:bg-jbi-blue group-hover:text-white">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jbi-navy/50">
          {title}
        </p>
        <p className="truncate text-sm font-semibold text-jbi-navy">{value}</p>
      </div>
      <span className="hidden text-sm font-semibold text-jbi-blue sm:inline">
        {cta} →
      </span>
    </a>
  );
}

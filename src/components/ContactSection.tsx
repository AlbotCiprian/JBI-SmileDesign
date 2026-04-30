"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Languages } from "lucide-react";
import { clinic } from "@/lib/data";
import { AppointmentForm } from "./AppointmentForm";

export function ContactSection() {
  const t = useTranslations();
  const whatsappLink =
    "https://wa.me/" + clinic.phone.whatsapp + "?text=" + encodeURIComponent(t("clinic.whatsappText"));

  return (
    <section id="contact" className="relative bg-jbi-soft/30 py-16 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t("contact.eyebrow")}</span>
          <h2 className="section-title mt-4">{t("contact.title")}</h2>
          <p className="mt-4 text-base text-jbi-navy/65 sm:text-lg">{t("contact.description")}</p>
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
              title={t("contact.address")}
              value={t("clinic.addressFull")}
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                clinic.address.mapsQuery,
              )}`}
              cta={t("contact.viewMap")}
            />
            <ContactCard
              Icon={Phone}
              title={t("contact.phone")}
              value={clinic.phone.international}
              href={`tel:${clinic.phone.tel}`}
              cta={t("nav.callNow")}
            />
            <ContactCard
              Icon={MessageCircle}
              title={t("contact.whatsapp")}
              value={clinic.phone.international}
              href={whatsappLink}
              cta={t("nav.whatsapp")}
              external
            />
            <ContactCard
              Icon={Mail}
              title={t("contact.email")}
              value={clinic.email}
              href={`mailto:${clinic.email}`}
              cta={t("contact.sendEmail")}
            />
            <div className="flex items-start gap-4 rounded-2xl border border-jbi-navy/5 bg-white p-5">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-jbi-soft text-jbi-blue">
                <Languages className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-jbi-navy">{t("contact.spokenLanguages")}</p>
                <p className="text-sm text-jbi-navy/60">{t("clinic.languages")}</p>
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
                title={t("contact.mapTitle")}
                src={`https://www.google.com/maps?q=${encodeURIComponent(clinic.address.mapsQuery)}&output=embed`}
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

        <div id="programare" className="mt-16 grid items-start gap-8 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <span className="eyebrow">{t("contact.appointmentsEyebrow")}</span>
            <h3 className="section-title mt-4">{t("contact.appointmentsTitle")}</h3>
            <p className="mt-4 text-base text-jbi-navy/65 sm:text-lg">
              {t("contact.appointmentsText")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a href={`tel:${clinic.phone.tel}`} className="btn-secondary">
                <Phone className="h-4 w-4" /> {clinic.phone.international}
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-jbi-navy/5 bg-white p-5">
              <p className="text-sm font-semibold text-jbi-navy">{t("contact.scheduleTitle")}</p>
              <p className="mt-2 text-sm text-jbi-navy/60">{t("contact.scheduleText")}</p>
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
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jbi-navy/50">{title}</p>
        <p className="truncate text-sm font-semibold text-jbi-navy">{value}</p>
      </div>
      <span className="hidden text-sm font-semibold text-jbi-blue sm:inline">{cta} →</span>
    </a>
  );
}

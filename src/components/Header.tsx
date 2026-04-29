"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { clinic, navItems } from "@/lib/data";
import { cn } from "@/lib/cn";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-jbi-navy/5 bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_-12px_rgba(11,31,58,0.08)]"
            : "bg-transparent"
        )}
      >
        <div className="container-x flex h-16 items-center justify-between sm:h-20">
          <Link href="#acasa" className="flex items-center gap-3">
            <Image
              src="/images/jbi-logo.png"
              alt={clinic.name}
              width={44}
              height={44}
              priority
              className="h-10 w-10 rounded-md object-contain sm:h-11 sm:w-11"
            />
            <span
              className={cn(
                "font-display text-lg font-semibold leading-tight transition-colors sm:text-xl",
                scrolled ? "text-jbi-navy" : "text-jbi-navy"
              )}
            >
              JBI <span className="text-jbi-blue">Smile Design</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="btn-ghost">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href={clinic.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-jbi-blue/15 bg-white text-jbi-blue transition-colors hover:bg-jbi-soft"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <Link href="#programare" className="btn-primary">
              Programează-te
            </Link>
          </div>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-jbi-navy lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Deschide meniul"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-jbi-navy/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-jbi-navy">
                  Meniu
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md text-jbi-navy"
                  aria-label="Închide meniul"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="mt-6 flex flex-col">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-jbi-navy transition-colors hover:bg-jbi-soft"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3 pt-6">
                <a href={`tel:${clinic.phone.tel}`} className="btn-secondary w-full">
                  <Phone className="h-4 w-4" /> Sună acum
                </a>
                <Link
                  href="#programare"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full"
                >
                  Programează-te
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sticky bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-jbi-navy/5 bg-white/95 backdrop-blur-md p-3 lg:hidden">
        <div className="container-x flex items-center gap-2">
          <a
            href={`tel:${clinic.phone.tel}`}
            className="btn-secondary flex-1"
          >
            <Phone className="h-4 w-4" /> Sună
          </a>
          <Link href="#programare" className="btn-primary flex-1">
            Programează-te
          </Link>
        </div>
      </div>
    </>
  );
}

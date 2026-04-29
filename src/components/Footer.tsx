import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, Lock } from "lucide-react";
import { clinic, navItems } from "@/lib/data";

const socials = [
  { Icon: Facebook, href: clinic.socials.facebook, label: "Facebook" },
  { Icon: Instagram, href: clinic.socials.instagram, label: "Instagram" },
  { Icon: Youtube, href: clinic.socials.youtube, label: "YouTube" },
  { Icon: Linkedin, href: clinic.socials.linkedin, label: "LinkedIn" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-jbi-navy text-white">
      <div className="container-x py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="#acasa" className="flex items-center gap-3">
              <Image
                src="/images/jbi-logo.png"
                alt={clinic.name}
                width={48}
                height={48}
                className="h-11 w-11 rounded-md bg-white p-1 object-contain"
              />
              <span className="font-display text-xl font-semibold">
                JBI <span className="text-jbi-champagne">Smile Design</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              Clinică stomatologică modernă în Chișinău. Tratamente complete,
              comunicare clară și o experiență confortabilă pentru fiecare
              pacient.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-jbi-blue"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-jbi-champagne">
              Navigare
            </p>
            <ul className="mt-5 space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-jbi-champagne">
              Contact
            </p>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-jbi-electric" />
                {clinic.address.full}
              </li>
              <li className="flex items-start gap-3 text-sm text-white/80">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-jbi-electric" />
                <a href={`tel:${clinic.phone.tel}`} className="hover:text-white">
                  {clinic.phone.international}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/80">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-jbi-electric" />
                <a href={`mailto:${clinic.email}`} className="hover:text-white">
                  {clinic.email}
                </a>
              </li>
            </ul>

            <Link
              href="/admin/login"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur transition-all hover:border-jbi-champagne/40 hover:bg-white/10 hover:text-white"
            >
              <Lock className="h-3.5 w-3.5 text-jbi-champagne" />
              Admin login
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>© {year} JBI Smile Design. Toate drepturile rezervate.</p>
          <p>
            Developed by{" "}
            <a
              href="https://xelaktech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-jbi-champagne transition-colors hover:text-white"
            >
              Xelak Technology
            </a>
          </p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Cookie Policy</Link>
            <Link href="#" className="hover:text-white">Termeni și condiții</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

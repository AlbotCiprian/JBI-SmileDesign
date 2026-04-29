"use client";

import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

/**
 * Video reels section. Componenta acceptă o listă de URL-uri de iframe-uri
 * Facebook ca să poată crește în viitor (deocamdată un singur reel).
 */
const reels: { src: string; alt: string }[] = [
  {
    src: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2202953823788455%2F&show_text=false&width=267&t=0",
    alt: "Reel JBI Smile Design",
  },
];

export function VideoSection() {
  return (
    <section id="video" className="relative bg-jbi-navy py-16 text-white sm:py-28">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-jbi-champagne">
              <PlayCircle className="h-3.5 w-3.5" /> Video
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Vezi atmosfera din JBI Smile Design
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              O privire scurtă în clinică — recepție, cabinete moderne și echipa
              care îți va fi alături pe tot parcursul tratamentului.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61572011122070"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Vezi pagina noastră Facebook
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <div className="mx-auto flex w-full max-w-md justify-center">
              {reels.map((reel) => (
                <div
                  key={reel.src}
                  className="relative rounded-[2.5rem] border-[10px] border-jbi-navy bg-jbi-navy p-1 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
                >
                  <div className="overflow-hidden rounded-[2rem] bg-black">
                    <iframe
                      src={reel.src}
                      width={267}
                      height={476}
                      title={reel.alt}
                      style={{ border: "none", overflow: "hidden" }}
                      scrolling="no"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                      className="block"
                    />
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

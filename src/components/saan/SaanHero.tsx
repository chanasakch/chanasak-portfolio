"use client";

import { motion, useReducedMotion } from "motion/react";
import { Photo } from "@/components/shared/Photo";
import { photos } from "@/data/images";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The product name is set huge and the photo slides up over it, the way the
 * brand's own posters overlap type and furniture. This is the one orchestrated
 * motion on the page.
 */
export function SaanHero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { y: "105%" },
          animate: { y: "0%" },
          transition: { duration: 1.1, ease, delay },
        };

  return (
    <section id="top" className="relative mx-auto max-w-[1440px] px-4 pb-16 sm:px-8 sm:pb-24">
      <h1 className="relative z-0 font-display uppercase leading-[0.82] tracking-[-0.01em]">
        <span className="block overflow-hidden pb-[0.04em]">
          <motion.span className="block text-[clamp(4.2rem,17vw,16.5rem)]" {...rise(0.05)}>
            Malai
          </motion.span>
        </span>
        <span className="block overflow-hidden pb-[0.04em]">
          <motion.span className="block text-[clamp(2.3rem,9.2vw,9rem)] text-muted" {...rise(0.18)}>
            Lounge chair
          </motion.span>
        </span>
      </h1>

      <div className="relative grid gap-8 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:items-start">
        <motion.div
          className="order-2 max-w-[36ch] md:order-1 md:pt-12"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <p className="text-[17px] leading-[1.6]">
            Rattan peel woven tight over a curved cane shell, on a solid teak base. One weaver, three days, one chair.
          </p>
          <p className="mt-3 text-[14px] text-muted">Designed by Pim Asavarat, 2026</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#collections"
              className="rounded-full bg-ink px-6 py-3 text-[15px] text-bg transition-colors hover:bg-accent"
            >
              See the collections
            </a>
            <a
              href="#showroom"
              className="rounded-full border border-ink/30 px-6 py-3 text-[15px] transition-colors hover:border-ink"
            >
              Sit in one at the showroom
            </a>
          </div>
        </motion.div>

        <motion.div
          className="relative z-10 order-1 mt-4 md:order-2 md:-mt-[3.4vw]"
          initial={reduce ? false : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.3, ease, delay: 0.35 }}
        >
          <Photo
            photo={photos.bambooChairStudio}
            alt="Malai lounge chair on a concrete floor"
            priority
            className="aspect-[5/4] w-full rounded-[2px]"
            sizes="(min-width: 768px) 60vw, 100vw"
          />
        </motion.div>
      </div>
    </section>
  );
}

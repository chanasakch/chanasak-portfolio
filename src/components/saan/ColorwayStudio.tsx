"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ColorwayPreview } from "@/components/shared/ColorwayPreview";
import { colorways } from "@/data/products";

const options = [colorways.lacquer, colorways.cobalt, colorways.ink, colorways.moss];

/** Backdrop tint for each colourway, kept light so the drawing reads clearly. */
const backdrops: Record<string, string> = {
  lacquer: "#e9dcd8",
  cobalt: "#dcdfe9",
  ink: "#dedbd4",
  moss: "#dfe1d6",
};

export function ColorwayStudio() {
  const [active, setActive] = useState(options[0]);

  return (
    <section className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-8 md:grid-cols-2 md:items-center md:py-28">
      <motion.div
        className="relative flex aspect-square items-center justify-center rounded-[2px]"
        animate={{ backgroundColor: backdrops[active.id] }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-[62%]"
          >
            <ColorwayPreview
              kind="stool"
              frame={active.frame}
              weaveA={active.weaveA}
              weaveB={active.weaveB}
              title={`Prang bar stool in ${active.name.en}`}
              className="w-full"
            />
          </motion.div>
        </AnimatePresence>
        <p className="absolute bottom-4 left-5 text-[13px] text-muted">Prang bar stool, {active.name.en}</p>
      </motion.div>

      <div className="max-w-[44ch]">
        <h2 className="font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.02]">A frame in your colour</h2>
        <p className="mt-6 text-[17px] leading-[1.65]">
          Every Prang stool is powder-coated and woven to order in Bangkok. Hotels match the frame to their bar, the rope to
          their cushions, and we weave the first one as a sample before the full run.
        </p>
        <fieldset className="mt-9">
          <legend className="text-[14px] text-muted">Choose a colourway</legend>
          <div className="mt-4 flex flex-wrap gap-3">
            {options.map((o) => {
              const selected = o.id === active.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(o)}
                  className={`flex items-center gap-3 rounded-full border py-2 pl-2 pr-5 text-[14px] transition-colors ${
                    selected ? "border-ink bg-ink text-bg" : "border-line hover:border-ink/50"
                  }`}
                >
                  <span className="relative inline-block size-7 overflow-hidden rounded-full" aria-hidden>
                    <span className="absolute inset-0" style={{ background: o.frame }} />
                    <span className="absolute inset-y-0 right-0 w-1/2" style={{ background: o.weaveA }} />
                  </span>
                  {o.name.en}
                </button>
              );
            })}
          </div>
        </fieldset>
        <Link href="/trade/prang-bar-stool" className="mt-9 inline-block text-[15px] underline underline-offset-[6px]">
          Specs and lead time for trade buyers
        </Link>
      </div>
    </section>
  );
}

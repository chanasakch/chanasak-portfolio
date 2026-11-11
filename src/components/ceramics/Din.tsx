"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Photo } from "@/components/shared/Photo";
import { CloseButton, Drawer, Modal, Rail, useScrolled } from "@/components/shared/ui";
import { photos } from "@/data/images";
import { pieces, type Piece } from "@/data/ceramics";

const fmt = new Intl.NumberFormat("en-US");
const ease = [0.22, 1, 0.36, 1] as const;

type Line = { name: string; qty: number };
type Bag = { lines: Line[]; add: (name: string, qty: number) => void; setQty: (name: string, qty: number) => void; open: boolean; setOpen: (v: boolean) => void };
const BagCtx = createContext<Bag | null>(null);
const useBag = () => useContext(BagCtx)!;

export function DinProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const value = useMemo<Bag>(
    () => ({
      lines,
      open,
      setOpen,
      add: (name, qty) => {
        setLines((prev) => (prev.some((l) => l.name === name) ? prev.map((l) => (l.name === name ? { ...l, qty: l.qty + qty } : l)) : [...prev, { name, qty }]));
        setOpen(true);
      },
      setQty: (name, qty) => setLines((prev) => (qty < 1 ? prev.filter((l) => l.name !== name) : prev.map((l) => (l.name === name ? { ...l, qty } : l)))),
    }),
    [lines, open],
  );
  return (
    <BagCtx.Provider value={value}>
      {children}
      <BagDrawer />
    </BagCtx.Provider>
  );
}

const menu = [
  { href: "#pieces", label: "Pieces", photo: photos.fernPitcher },
  { href: "#glazes", label: "Glazes", photo: photos.glazedShelves },
  { href: "#process", label: "Making", photo: photos.throwing },
  { href: "#restaurants", label: "For restaurants", photo: photos.placeSetting },
  { href: "#workshops", label: "Workshops", photo: photos.twoHandsWheel },
  { href: "#visit", label: "Visit", photo: photos.vesselsShelf },
];

export function DinHeader() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(0);
  const scrolled = useScrolled(80);
  const { lines, setOpen: openBag } = useBag();
  const count = lines.reduce((n, l) => n + l.qty, 0);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${scrolled ? "bg-bg/85 backdrop-blur-md" : ""}`}>
        <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-3 items-center px-4 sm:px-8">
          <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-3 justify-self-start text-[14px]" aria-expanded={open}>
            <span className="grid gap-[5px]" aria-hidden>
              <span className="block h-px w-6 bg-current" />
              <span className="block h-px w-4 bg-current" />
            </span>
            Menu
          </button>
          <a href="#top" className="justify-self-center font-display text-[28px] leading-none tracking-[0.22em]" aria-label="DIN Studio home">
            DIN
          </a>
          <button type="button" onClick={() => openBag(true)} className="justify-self-end text-[14px]">
            Order <span className="tabular">({count})</span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] grid bg-[#1f1d19] text-[#f1f2ee] md:grid-cols-[1.1fr_1fr]"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex flex-col px-6 py-5 sm:px-10">
              <div className="flex items-center justify-between">
                <span className="font-display text-[28px] tracking-[0.22em]">DIN</span>
                <CloseButton onClick={() => setOpen(false)} light />
              </div>
              <nav className="my-auto py-10" aria-label="Main">
                <ul>
                  {menu.map((m, i) => (
                    <motion.li key={m.href} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease }}>
                      <a
                        href={m.href}
                        onClick={() => setOpen(false)}
                        onMouseEnter={() => setHover(i)}
                        onFocus={() => setHover(i)}
                        className={`block py-1 font-display text-[clamp(2.4rem,6vw,5rem)] leading-[1.05] transition-opacity duration-300 ${hover === i ? "opacity-100" : "opacity-40"}`}
                      >
                        {m.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <p className="text-[14px] opacity-60">212 Ban Pong Road, Lampang. Thursday to Sunday, 10:00 to 17:00</p>
            </div>
            <div className="relative hidden overflow-hidden md:block">
              <AnimatePresence initial={false}>
                <motion.div key={hover} className="absolute inset-0" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease }}>
                  <Photo photo={menu[hover].photo} className="h-full w-full" sizes="45vw" />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Wordmark hero with three photos drifting at different speeds as the page scrolls. */
export function DinHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const yC = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const yT = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] overflow-hidden pt-16">
      <motion.div style={{ y: yT }} className="pointer-events-none absolute inset-x-0 top-[18vh] z-10 px-4 text-center sm:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease }}
          className="mx-auto max-w-[12ch] font-display text-[clamp(3.4rem,10vw,10rem)] leading-[0.9]"
        >
          Stoneware from Lampang
        </motion.h1>
      </motion.div>

      <div className="relative mx-auto h-[calc(100svh-4rem)] min-h-[560px] max-w-[1600px] px-4 sm:px-8">
        <motion.div style={{ y: yA }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }} className="absolute left-[4%] top-[44vh] w-[40%] sm:top-[36vh] sm:w-[20%]">
          <Photo photo={photos.budVases} priority className="aspect-[3/4] w-full" position="50% 45%" sizes="30vw" />
          <p className="mt-2 text-[13px] text-muted">Bud vases, ฿1,450 the pair</p>
        </motion.div>
        <motion.div style={{ y: yB }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.5 }} className="absolute right-[4%] top-[52vh] w-[44%] sm:right-[6%] sm:top-[44vh] sm:w-[24%]">
          <Photo photo={photos.throwing} className="aspect-[4/5] w-full" sizes="34vw" />
        </motion.div>
        <motion.div style={{ y: yC }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.7 }} className="absolute left-[40%] top-[58vh] hidden w-[15%] sm:block">
          <Photo photo={photos.fernPitcher} className="aspect-[3/4] w-full" position="30% 50%" sizes="20vw" />
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-10 mx-auto flex max-w-[1600px] items-end justify-between gap-6 px-4 sm:px-8">
        <p className="max-w-[36ch] bg-bg/80 py-1 text-[15px] leading-[1.6] backdrop-blur-sm sm:bg-transparent">Vases and tableware thrown, glazed and wood-fired by four potters. Each glaze is mixed from local ash and earth.</p>
      </div>
    </section>
  );
}

export function PiecesRail() {
  const [open, setOpen] = useState<Piece | null>(null);
  const [qty, setQty] = useState(1);
  const { add } = useBag();

  return (
    <>
      <Rail label="Pieces">
        {pieces.map((p, i) => (
          <button
            key={p.name}
            type="button"
            onClick={() => {
              setQty(1);
              setOpen(p);
            }}
            className={`group w-[70vw] shrink-0 snap-start text-left sm:w-[38vw] lg:w-[24vw] ${i % 2 ? "lg:mt-20" : ""}`}
          >
            <div className="overflow-hidden">
              <Photo photo={p.photo} position={p.focus} className="aspect-[3/4] w-full" imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]" sizes="(min-width:1024px) 24vw, 70vw" />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <h3 className="font-display text-[1.6rem] leading-none">{p.name}</h3>
              <span className="tabular shrink-0 text-[14px]">
                {p.note ? `${p.note} ` : ""}฿{fmt.format(p.priceThb)}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-muted">{p.glaze}</p>
          </button>
        ))}
      </Rail>

      <Modal open={!!open} onClose={() => setOpen(null)} label={open?.name ?? "Piece"}>
        {open && (
          <div className="grid md:grid-cols-2">
            <Photo photo={open.photo} position={open.focus} className="aspect-[4/5] w-full md:aspect-auto md:h-[620px]" sizes="(min-width:768px) 50vw, 100vw" />
            <div className="flex flex-col p-6 sm:p-10">
              <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none">{open.name}</h2>
              <p className="tabular mt-3 text-[18px]">
                {open.note ? `${open.note} ` : ""}฿{fmt.format(open.priceThb)}
              </p>
              <dl className="mt-8 grid gap-3 border-t border-line pt-6 text-[15px]">
                <div className="flex justify-between gap-6">
                  <dt className="text-muted">Glaze</dt>
                  <dd className="text-right">{open.glaze}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-muted">Size</dt>
                  <dd className="text-right">{open.detail}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-muted">Ships</dt>
                  <dd className="text-right">Within a week from Lampang</dd>
                </div>
              </dl>
              <p className="mt-6 text-[14px] leading-relaxed text-muted">Each piece is fired in a wood kiln, so the glaze on yours will pool and break a little differently from the one in the photo.</p>
              <div className="mt-auto flex items-center gap-3 pt-8">
                <div className="flex items-center border border-line text-[15px]">
                  <button type="button" className="size-11" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Fewer">
                    −
                  </button>
                  <span className="tabular w-8 text-center">{qty}</span>
                  <button type="button" className="size-11" onClick={() => setQty(qty + 1)} aria-label="More">
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    add(open.name, qty);
                    setOpen(null);
                  }}
                  className="flex-1 bg-ink py-3 text-[15px] text-bg hover:opacity-90"
                >
                  Add to order
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function BagDrawer() {
  const { lines, open, setOpen, setQty } = useBag();
  const [sent, setSent] = useState(false);
  const total = lines.reduce((n, l) => n + l.qty * (pieces.find((p) => p.name === l.name)?.priceThb ?? 0), 0);

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        setSent(false);
      }}
      title="Your order"
      footer={
        lines.length > 0 && !sent ? (
          <div className="grid gap-3">
            <div className="flex justify-between text-[15px]">
              <span>Subtotal</span>
              <span className="tabular">฿{fmt.format(total)}</span>
            </div>
            <p className="text-[13px] text-muted">Shipping in Thailand is free over ฿3,000. We confirm stock by email before taking payment.</p>
            <button type="button" onClick={() => setSent(true)} className="bg-ink py-3.5 text-[15px] text-bg hover:opacity-90">
              Send order request
            </button>
          </div>
        ) : undefined
      }
    >
      {sent ? (
        <div className="py-10">
          <p className="font-display text-[2.2rem] leading-none">Thank you</p>
          <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-muted">We will check each piece against your order and email you within a day with photos of the exact ones we are sending.</p>
        </div>
      ) : lines.length === 0 ? (
        <p className="py-10 text-[15px] text-muted">Your order is empty. Open any piece to add it.</p>
      ) : (
        <ul className="divide-y divide-line">
          {lines.map((l) => {
            const p = pieces.find((x) => x.name === l.name)!;
            return (
              <li key={l.name} className="flex gap-4 py-4 first:pt-0">
                <Photo photo={p.photo} position={p.focus} className="aspect-[3/4] w-20 shrink-0" sizes="80px" />
                <div className="flex flex-1 flex-col">
                  <span className="font-display text-[1.3rem] leading-tight">{p.name}</span>
                  <span className="text-[13px] text-muted">{p.glaze}</span>
                  <div className="mt-auto flex items-center justify-between pt-2 text-[14px]">
                    <div className="flex items-center border border-line">
                      <button type="button" className="size-8" onClick={() => setQty(l.name, l.qty - 1)} aria-label="Fewer">
                        −
                      </button>
                      <span className="tabular w-7 text-center">{l.qty}</span>
                      <button type="button" className="size-8" onClick={() => setQty(l.name, l.qty + 1)} aria-label="More">
                        +
                      </button>
                    </div>
                    <span className="tabular">฿{fmt.format(p.priceThb * l.qty)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Drawer>
  );
}

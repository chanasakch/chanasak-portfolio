"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Photo } from "@/components/shared/Photo";
import { Drawer } from "@/components/shared/ui";
import { bySlug, thb } from "@/data/loom";
import { unitPrice, useQuote } from "./store";

export const base = "/furniture";

const nav = [
  { href: `${base}/shop`, label: "Shop all" },
  { href: `${base}/seating`, label: "Seating" },
  { href: `${base}/lighting`, label: "Lighting" },
  { href: `${base}/outdoor`, label: "Outdoor" },
  { href: `${base}/projects`, label: "Projects" },
  { href: `${base}/about`, label: "About" },
];

export function Header({ path }: { path: string }) {
  const { count, setOpen } = useQuote();
  const [menu, setMenu] = useState(false);
  const [bump, setBump] = useState(0);
  const [prevCount, setPrevCount] = useState(count);
  if (count !== prevCount) {
    setPrevCount(count);
    if (count > prevCount) setBump((b) => b + 1);
  }

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    if (menu) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [menu]);

  return (
    <>
      <p className="bg-ink px-[var(--gutter)] py-2 text-center text-[12.5px] text-bg/85">
        Free delivery in Bangkok on orders over ฿40,000. Showroom on Charoen Krung open Tuesday to Sunday.
      </p>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/[0.97]">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-[var(--gutter)]">
          <button type="button" className="-ml-2 p-2 lg:hidden" aria-label="Menu" onClick={() => setMenu(true)}>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
              <path d="M2 6h16M2 14h16" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
          <Link href={base} className="text-[19px] font-semibold tracking-[-0.02em]">
            Loom &amp; Tide
          </Link>
          <nav className="ml-6 hidden gap-6 text-[14px] lg:flex" aria-label="Main">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`py-1 transition-colors hover:text-ink ${path === n.href || path.startsWith(n.href + "/") ? "text-ink underline underline-offset-[6px]" : "text-muted"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-5 text-[14px]">
            <Link href={`${base}/trade`} className="hidden text-muted hover:text-ink sm:block">
              Trade
            </Link>
            <Link href={`${base}/contact`} className="hidden text-muted hover:text-ink sm:block">
              Contact
            </Link>
            <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-2" aria-label={`Quote list, ${count} items`}>
              <span>Quote</span>
              <motion.span
                key={bump}
                initial={{ scale: bump ? 1.35 : 1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.35 }}
                className={`tabular flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] ${count ? "bg-ink text-bg" : "border border-line text-muted"}`}
              >
                {count}
              </motion.span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            role="dialog"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col bg-bg lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-[var(--gutter)]">
              <span className="text-[19px] font-semibold tracking-[-0.02em]">Loom &amp; Tide</span>
              <button type="button" className="p-2" aria-label="Close menu" onClick={() => setMenu(false)}>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                  <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col px-[var(--gutter)] py-4" onClick={() => setMenu(false)}>
              {[...nav, { href: `${base}/trade`, label: "Trade programme" }, { href: `${base}/contact`, label: "Contact and showroom" }].map((n) => (
                <Link key={n.href} href={n.href} className="border-b border-line py-4 text-[22px] tracking-[-0.01em]">
                  {n.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <QuoteDrawer />
    </>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex h-9 items-center rounded-full border border-line text-[14px]">
      <button type="button" className="h-full w-9 disabled:opacity-30" aria-label="One fewer" disabled={value <= 1} onClick={() => onChange(value - 1)}>
        −
      </button>
      <span className="tabular w-6 text-center">{value}</span>
      <button type="button" className="h-full w-9" aria-label="One more" onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}
export { Stepper };

function QuoteDrawer() {
  const { lines, open, setOpen, setQty, remove, clear } = useQuote();
  const [step, setStep] = useState<"list" | "details" | "sent">("list");
  const [ref, setRef] = useState("");
  const total = lines.reduce((n, l) => n + unitPrice(l) * l.qty, 0);

  const close = () => {
    setOpen(false);
    if (step === "sent") setTimeout(() => setStep("list"), 400);
  };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRef(`LT-${String(26110 + lines.length * 37 + (total % 997)).padStart(5, "0")}`);
    setStep("sent");
    clear();
  };

  const field = "w-full rounded-md border border-line bg-transparent px-3 py-2.5 text-[15px] outline-none focus:border-ink";

  return (
    <Drawer
      open={open}
      onClose={close}
      title={step === "sent" ? "Request sent" : step === "details" ? "Your details" : "Quote list"}
      footer={
        step === "list" && lines.length > 0 ? (
          <div className="space-y-3">
            <div className="flex justify-between text-[15px]">
              <span>List price total</span>
              <span className="tabular">{thb(total)}</span>
            </div>
            <p className="text-[13px] text-muted">Prices include VAT. Delivery and trade discounts are added to your quote.</p>
            <button type="button" onClick={() => setStep("details")} className="w-full rounded-full bg-ink py-3.5 text-[15px] text-bg hover:opacity-90">
              Continue
            </button>
          </div>
        ) : null
      }
    >
      {step === "sent" ? (
        <div className="space-y-4 text-[15px] leading-relaxed">
          <p>Thank you. Your reference is <strong className="tabular">{ref}</strong>.</p>
          <p className="text-muted">
            We reply within one working day with a quote, lead times and a delivery date. If you need samples of cane or finishes, mention it when we call.
          </p>
          <button type="button" onClick={close} className="rounded-full border border-ink px-6 py-3 text-[14px]">
            Back to the shop
          </button>
        </div>
      ) : step === "details" ? (
        <form onSubmit={submit} className="space-y-4 text-[14px]">
          <label className="block space-y-1.5">
            <span>Name</span>
            <input required className={field} autoComplete="name" />
          </label>
          <label className="block space-y-1.5">
            <span>Email</span>
            <input required type="email" className={field} autoComplete="email" />
          </label>
          <label className="block space-y-1.5">
            <span>Phone</span>
            <input type="tel" className={field} autoComplete="tel" />
          </label>
          <label className="block space-y-1.5">
            <span>Company, if this is for a project</span>
            <input className={field} autoComplete="organization" />
          </label>
          <label className="block space-y-1.5">
            <span>Delivery city</span>
            <input required className={field} placeholder="Bangkok" />
          </label>
          <label className="block space-y-1.5">
            <span>Anything we should know</span>
            <textarea rows={3} className={field} placeholder="Deadlines, custom sizes, fabric" />
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setStep("list")} className="rounded-full border border-line px-5 py-3">
              Back
            </button>
            <button type="submit" className="flex-1 rounded-full bg-ink py-3 text-bg hover:opacity-90">
              Send request
            </button>
          </div>
        </form>
      ) : lines.length === 0 ? (
        <div className="space-y-4 text-[15px]">
          <p className="text-muted">Your quote list is empty. Add pieces from any product page and we will price them together, with delivery.</p>
          <Link href={`${base}/shop`} onClick={() => setOpen(false)} className="inline-block rounded-full bg-ink px-6 py-3 text-[14px] text-bg">
            Browse the collection
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {lines.map((l, i) => {
            const p = bySlug(l.slug)!;
            return (
              <li key={`${l.slug}-${l.finish}-${l.size}`} className="flex gap-4 py-4 first:pt-0">
                <Photo photo={p.photos[0]} className="aspect-[4/5] w-20 shrink-0" sizes="80px" />
                <div className="flex min-w-0 flex-1 flex-col gap-1 text-[14px]">
                  <div className="flex justify-between gap-3">
                    <span className="font-medium">
                      {p.name} {p.type.toLowerCase()}
                    </span>
                    <span className="tabular">{thb(unitPrice(l) * l.qty)}</span>
                  </div>
                  <span className="text-muted">
                    {l.finish}
                    {l.size ? `, ${l.size}` : ""}
                  </span>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <Stepper value={l.qty} onChange={(n) => setQty(i, n)} />
                    <button type="button" onClick={() => remove(i)} className="text-[13px] text-muted underline underline-offset-4 hover:text-ink">
                      Remove
                    </button>
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

export function Footer() {
  const [joined, setJoined] = useState(false);
  return (
    <footer className="mt-24 border-t border-line bg-soft">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-[var(--gutter)] py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm space-y-4">
          <p className="text-[19px] font-semibold tracking-[-0.02em]">Loom &amp; Tide</p>
          <p className="text-[14px] leading-relaxed text-muted">
            Rattan furniture and lighting, woven in our workshop in Bang Pa-in, Ayutthaya, since 2009. A letter every two months with new pieces and finished projects.
          </p>
          {joined ? (
            <p className="text-[14px]">Thanks, you are on the list.</p>
          ) : (
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setJoined(true);
              }}
            >
              <input required type="email" placeholder="Email address" aria-label="Email address" className="min-w-0 flex-1 rounded-full border border-line bg-bg px-4 py-2.5 text-[14px] outline-none focus:border-ink" />
              <button className="rounded-full bg-ink px-5 text-[14px] text-bg">Sign up</button>
            </form>
          )}
        </div>
        <FooterCol title="Shop" links={[["Seating", "seating"], ["Tables", "tables"], ["Lighting", "lighting"], ["Outdoor", "outdoor"]]} />
        <FooterCol title="Company" links={[["About the workshop", "about"], ["Projects", "projects"], ["Trade programme", "trade"], ["Contact", "contact"]]} />
        <div className="space-y-3 text-[14px]">
          <p className="font-medium">Showroom</p>
          <p className="leading-relaxed text-muted">
            1218 Charoen Krung Road
            <br />
            Bang Rak, Bangkok 10500
            <br />
            Tuesday to Sunday, 10:00 to 19:00
            <br />
            +66 2 234 4310
          </p>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-3 border-t border-line px-[var(--gutter)] py-5 pb-20 text-[12.5px] text-muted sm:pb-5">
        <span>© 2026 Loom &amp; Tide Co., Ltd.</span>
        <span>Instagram @loomandtide</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="space-y-3 text-[14px]">
      <p className="font-medium">{title}</p>
      <ul className="space-y-2 text-muted">
        {links.map(([label, slug]) => (
          <li key={slug}>
            <Link href={`${base}/${slug}`} className="hover:text-ink">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

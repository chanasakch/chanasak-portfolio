"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useInView, useScroll, useTransform } from "motion/react";
import { resetScroll } from "@/components/shared/motion";
import { btn } from "@/components/kit/panels";
import { addDays, isEmail, isPhone, longDay, makeRef, useNow } from "@/components/kit/persist";
import { Choice, Field, Icon, Img, Sheet } from "@/components/kit/ui";

// HATTHA Works, a concept for a rattan furniture factory that makes for brands,
// hotels and retailers. Photos from Pexels (Pexels license).

const R = "/hattha";
const ease = [0.22, 1, 0.36, 1] as const;

export function HatthaSite({ segs = [] }: { segs?: string[] }) {
  const [a] = segs;
  useEffect(resetScroll, [segs.join("/")]);
  const [menu, setMenu] = useState(false);
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-5 sm:px-8">
          <Link href={R} className="font-display text-[19px] font-extrabold uppercase tracking-[0.04em]" style={{ fontStretch: "118%" }}>
            Hattha<span className="text-accent">.</span>Works
          </Link>
          <nav className="ml-auto hidden items-center gap-7 text-[14px] md:flex">
            {[
              ["Capabilities", `${R}#capabilities`],
              ["Process", `${R}#process`],
              ["Factory", `${R}#factory`],
            ].map(([t, h]) => (
              <Link key={h} href={h} className="text-muted hover:text-ink">
                {t}
              </Link>
            ))}
            <Link href={`${R}/rfq`} className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-accent px-4 text-accent-ink">
              Request a quote
            </Link>
          </nav>
          <button className="ml-auto grid size-10 place-items-center rounded-[10px] border border-line md:hidden" aria-label="Menu" onClick={() => setMenu(true)}>
            {Icon.menu}
          </button>
        </div>
      </header>
      <Sheet open={menu} onClose={() => setMenu(false)} title="Hattha Works">
        <nav className="grid">
          {[
            ["Capabilities", `${R}#capabilities`],
            ["Process", `${R}#process`],
            ["Factory", `${R}#factory`],
            ["Request a quote", `${R}/rfq`],
          ].map(([t, h]) => (
            <Link key={h} href={h} onClick={() => setMenu(false)} className="border-b border-line py-4 text-[22px] font-semibold">
              {t}
            </Link>
          ))}
        </nav>
      </Sheet>
      <main>{a === "rfq" ? <Rfq /> : <Home />}</main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-6 px-5 py-10 text-[14px] text-muted sm:px-8">
          <p>Hattha Works, Sam Khok, Pathum Thani. Factory visits by appointment.</p>
          <p>A concept site by Chanasak Choonuch. Hattha Works is a fictional company.</p>
        </div>
      </footer>
    </>
  );
}

/* ---------------- home ---------------- */

function Home() {
  return (
    <>
      <Hero />
      <Numbers />
      <Capabilities />
      <Process />
      <Factory />
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const clip = useTransform(scrollYProgress, [0, 0.7], ["inset(0% 4% 0% 4% round 18px)", "inset(0% 0% 0% 0% round 0px)"]);
  return (
    <section ref={ref} className="pt-16">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 pb-10 pt-12 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:pt-20">
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }} className="font-display text-[clamp(40px,6.6vw,104px)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em]" style={{ fontStretch: "112%" }}>
          Rattan furniture, made for your brand
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease }} className="grid gap-5 lg:pb-2">
          <p className="max-w-md text-[17px] leading-relaxed text-muted">We weave and build for furniture brands, hotel groups and retailers in 18 countries. Your design or ours, from one sample to full containers.</p>
          <div className="flex flex-wrap gap-2">
            <Link href={`${R}/rfq`} className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-accent px-6 text-[15px] text-accent-ink">
              Request a quote {Icon.arrow}
            </Link>
            <Link href={`${R}#process`} className="inline-flex h-12 items-center rounded-[12px] border border-line px-6 text-[15px] hover:border-ink">
              How we work
            </Link>
          </div>
        </motion.div>
      </div>
      <motion.div className="relative h-[72svh] min-h-[420px] will-change-[clip-path]" style={{ clipPath: clip }}>
        <Img src="hattha/weaver" alt="A weaver splitting rattan on the workshop floor" className="absolute inset-0" priority sizes="100vw" />
      </motion.div>
    </section>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20% 0px" });
  useEffect(() => {
    if (!seen || !ref.current) return;
    const el = ref.current;
    const c = animate(0, to, { duration: 1.6, ease, onUpdate: (v) => (el.textContent = Math.round(v).toLocaleString("en-US") + suffix) });
    return () => c.stop();
  }, [seen, to, suffix]);
  return (
    <span ref={ref} className="tabular-nums">
      {to.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

function Numbers() {
  return (
    <section className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-line px-0 sm:px-8 lg:grid-cols-4">
      {[
        [120, "", "craftspeople on the floor"],
        [6000, " m²", "of workshop and finishing lines"],
        [1200, "", "pieces leave the factory each month"],
        [18, "", "countries we ship to"],
      ].map(([n, s, t]) => (
        <div key={t as string} className="grid gap-2 bg-bg px-5 py-10 sm:px-8">
          <span className="font-display text-[clamp(34px,4.4vw,64px)] font-extrabold leading-none tracking-[-0.03em]" style={{ fontStretch: "112%" }}>
            <Counter to={n as number} suffix={s as string} />
          </span>
          <span className="text-[14px] text-muted">{t}</span>
        </div>
      ))}
    </section>
  );
}

const materials = [
  { id: "natural", name: "Natural rattan", note: "Indoor. Manau and peeled cane, steam bent.", img: "hattha/hands" },
  { id: "synthetic", name: "Synthetic rattan", note: "Outdoor. HDPE fibre on powder coated aluminium.", img: "hattha/colour" },
  { id: "teak", name: "Teak and hardwood", note: "Frames, tops and legs, FSC timber on request.", img: "hattha/carving" },
  { id: "upholstery", name: "Upholstery", note: "Cushions and covers in indoor or outdoor fabric.", img: "hattha/sanding" },
];

function Capabilities() {
  const [on, setOn] = useState(0);
  return (
    <section id="capabilities" className="mx-auto max-w-[1440px] scroll-mt-16 px-5 py-24 sm:px-8 lg:py-32">
      <h2 className="font-display max-w-[16ch] text-[clamp(30px,4vw,60px)] font-extrabold uppercase leading-[0.95]" style={{ fontStretch: "112%" }}>
        Four materials under one roof
      </h2>
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <ul className="grid content-start">
          {materials.map((m, i) => (
            <li key={m.id}>
              <button onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onClick={() => setOn(i)} aria-pressed={on === i} className="group grid w-full grid-cols-[48px_1fr] gap-4 border-t border-line py-6 text-left">
                <span className={`text-[14px] tabular-nums transition-colors ${on === i ? "text-accent" : "text-muted"}`}>0{i + 1}</span>
                <span>
                  <span className={`block text-[22px] font-semibold transition-colors sm:text-[26px] ${on === i ? "text-ink" : "text-ink/45 group-hover:text-ink/80"}`}>{m.name}</span>
                  <span className={`block overflow-hidden text-[15px] text-muted transition-[max-height,opacity] duration-500 ${on === i ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}>{m.note}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-soft">
          {materials.map((m, i) => (
            <div key={m.id} className="absolute inset-0 transition-[opacity,transform] duration-700" style={{ opacity: on === i ? 1 : 0, transform: `scale(${on === i ? 1 : 1.05})` }}>
              <Img src={m.img} alt={m.name} className="absolute inset-0" widths={[800, 1600]} sizes="(min-width:1024px) 55vw, 100vw" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { t: "Brief and drawings", d: "Send a sketch, a photo or a full tech pack. Our engineers return working drawings and a price within five days.", img: "hattha/showroom", w: "Week 1" },
  { t: "Prototype", d: "One sample is built by hand, photographed and shipped to you, or reviewed with you on a video call.", img: "hattha/hands", w: "Weeks 2 to 4" },
  { t: "Production", d: "Frames, weaving and finishing run in batches, with a photo report every Friday.", img: "hattha/hall", w: "Weeks 5 to 10" },
  { t: "Quality check and packing", d: "Every piece is checked against the approved sample, wrapped and packed to your carton spec.", img: "hattha/sanding", w: "Week 11" },
  { t: "Shipping", d: "FOB Laem Chabang or delivered to your door, with all export papers handled.", img: "hattha/loom", w: "Week 12" },
];

/** Sticky process: the photo changes as each step scrolls into the middle of the screen. */
function Process() {
  const [on, setOn] = useState(0);
  return (
    <section id="process" className="scroll-mt-16 bg-ink text-bg">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-32">
        <div className="lg:sticky lg:top-24 lg:h-[calc(100svh-8rem)] lg:self-start">
          <h2 className="font-display text-[clamp(30px,4vw,60px)] font-extrabold uppercase leading-[0.95]" style={{ fontStretch: "112%" }}>
            From drawing to container in twelve weeks
          </h2>
          <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[18px] lg:block">
            {steps.map((s, i) => (
              <div key={s.t} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: on === i ? 1 : 0 }}>
                <Img src={s.img} alt={s.t} className="absolute inset-0" widths={[800, 1600]} sizes="45vw" />
              </div>
            ))}
          </div>
        </div>
        <ol className="grid gap-4 lg:gap-0">
          {steps.map((s, i) => (
            <Step key={s.t} i={i} s={s} on={on === i} onSeen={() => setOn(i)} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({ i, s, on, onSeen }: { i: number; s: (typeof steps)[number]; on: boolean; onSeen: () => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (seen) onSeen();
  }, [seen, onSeen]);
  return (
    <li ref={ref} className="grid gap-4 border-t border-bg/15 py-8 lg:min-h-[46svh] lg:content-center">
      <div className="overflow-hidden rounded-[14px] lg:hidden">
        <Img src={s.img} alt={s.t} ratio={1.5} widths={[800]} sizes="100vw" />
      </div>
      <span className={`text-[14px] transition-colors ${on ? "text-accent" : "text-bg/50"}`}>
        {String(i + 1).padStart(2, "0")} / {s.w}
      </span>
      <span className={`text-[clamp(24px,2.6vw,36px)] font-semibold transition-colors duration-500 ${on ? "text-bg" : "text-bg/45"}`}>{s.t}</span>
      <span className="max-w-md text-[16px] leading-relaxed text-bg/65">{s.d}</span>
    </li>
  );
}

function Factory() {
  return (
    <section id="factory" className="mx-auto max-w-[1440px] scroll-mt-16 px-5 py-24 sm:px-8 lg:py-32">
      <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
        <Img src="hattha/loom" alt="Weaving in progress" ratio={0.75} widths={[800, 1600]} sizes="(min-width:768px) 40vw, 100vw" className="rounded-[18px]" />
        <div className="grid gap-4">
          <Img src="hattha/hall" alt="The finishing hall" ratio={1.6} widths={[800, 1600]} sizes="(min-width:768px) 60vw, 100vw" className="rounded-[18px]" position="50% 60%" />
          <div className="grid content-between gap-8 rounded-[18px] bg-soft p-7 sm:p-10">
            <p className="font-display text-[clamp(26px,3vw,42px)] font-extrabold uppercase leading-[0.95]" style={{ fontStretch: "112%" }}>
              Visit the factory, or let us bring it to you on video
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`${R}/rfq`} className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-accent px-6 text-[15px] text-accent-ink">
                Start a project {Icon.arrow}
              </Link>
              <a href="mailto:projects@hattha.example" className="inline-flex h-12 items-center rounded-[12px] border border-line px-6 text-[15px]">
                projects@hattha.example
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- request for quote ---------------- */

const kinds = ["Lounge chair", "Dining chair", "Sofa", "Sunbed", "Table", "Pendant light"];
const finishes = [
  { id: "natural", name: "Natural", hex: "#c99b62" },
  { id: "honey", name: "Honey", hex: "#a8703a" },
  { id: "white", name: "Washed white", hex: "#e7e1d6" },
  { id: "black", name: "Black", hex: "#2b2a28" },
];

/**
 * Three step quote request. The lead time and the MOQ check update as the
 * order changes, so a buyer knows what to expect before sending.
 */
function Rfq() {
  const now = useNow();
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState(kinds[0]);
  const [mat, setMat] = useState(materials[0].id);
  const [fin, setFin] = useState(finishes[0].id);
  const [qty, setQty] = useState(200);
  const [design, setDesign] = useState<"ours" | "yours">("yours");
  const [f, setF] = useState({ name: "", company: "", email: "", phone: "", country: "Thailand", note: "" });
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const moq = mat === "synthetic" ? 100 : 50;
  const weeks = useMemo(() => 4 + (design === "yours" ? 3 : 0) + Math.ceil(qty / 300), [qty, design]);
  const e = {
    name: f.name.trim().length < 2 && "Enter your name",
    company: f.company.trim().length < 2 && "Enter your company",
    email: !isEmail(f.email) && "Enter a valid work email",
    phone: f.country === "Thailand" ? !isPhone(f.phone) && "Enter a Thai phone number" : f.phone.replace(/\D/g, "").length < 7 && "Enter a phone number with country code",
  };
  const top = () => {
    window.scrollTo({ top: 0 });
    window.__lenis?.scrollTo(0, { immediate: true });
  };
  if (done)
    return (
      <div className="mx-auto grid max-w-[640px] gap-5 px-5 pb-24 pt-36">
        <span className="grid size-12 place-items-center rounded-[12px] bg-accent text-accent-ink">{Icon.check}</span>
        <h1 className="font-display text-[44px] font-extrabold uppercase leading-[0.95]" style={{ fontStretch: "112%" }}>
          Request received
        </h1>
        <p className="text-muted">
          Reference {done}. A project manager emails {f.email} within one working day with questions or a first price for {qty.toLocaleString("en-US")} x {kind.toLowerCase()}.
        </p>
        <Link href={R} className={`${btn.ghost} w-auto justify-self-start`}>
          Back to the home page
        </Link>
      </div>
    );
  return (
    <div className="mx-auto grid max-w-[1200px] gap-10 px-5 pb-24 pt-28 sm:px-8 lg:grid-cols-[1fr_340px] lg:pt-36">
      <div className="grid min-w-0 content-start gap-8">
        <div className="grid gap-4">
          <h1 className="font-display text-[clamp(40px,5.4vw,76px)] font-extrabold uppercase leading-[0.92]" style={{ fontStretch: "112%" }}>
            Request a quote
          </h1>
          <ol className="flex gap-2 text-[13px]">
            {["The piece", "Quantity", "Your details"].map((t, i) => (
              <li key={t} className="flex-1">
                <span className={`block h-1 rounded-full transition-colors ${i <= step ? "bg-accent" : "bg-line"}`} />
                <span className={`mt-2 block ${i === step ? "" : "text-muted"}`}>{t}</span>
              </li>
            ))}
          </ol>
        </div>

        {step === 0 && (
          <div className="grid gap-8">
            <section className="grid gap-3">
              <h2 className="text-[17px] font-semibold">What should we make?</h2>
              <div className="flex flex-wrap gap-2">
                {kinds.map((k) => (
                  <button key={k} aria-pressed={kind === k} onClick={() => setKind(k)} className={`rounded-[10px] px-4 py-2.5 text-[14px] ${kind === k ? "bg-ink text-bg" : "border border-line hover:border-ink/40"}`}>
                    {k}
                  </button>
                ))}
              </div>
            </section>
            <section className="grid gap-3" role="radiogroup" aria-label="Design">
              <h2 className="text-[17px] font-semibold">Whose design?</h2>
              <Choice checked={design === "yours"} onSelect={() => setDesign("yours")} title="Your design" detail="We build to your drawings or a reference photo" />
              <Choice checked={design === "ours"} onSelect={() => setDesign("ours")} title="From our catalogue" detail="Choose a model and change the size, weave or finish" />
            </section>
            <section className="grid gap-3">
              <h2 className="text-[17px] font-semibold">Material</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {materials.map((m) => (
                  <Choice key={m.id} checked={mat === m.id} onSelect={() => setMat(m.id)} title={m.name} detail={m.note} />
                ))}
              </div>
            </section>
            <section className="grid gap-3">
              <h2 className="text-[17px] font-semibold">Finish</h2>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Finish">
                {finishes.map((x) => (
                  <button key={x.id} role="radio" aria-checked={fin === x.id} onClick={() => setFin(x.id)} className={`flex items-center gap-2 rounded-full border-2 py-1.5 pl-1.5 pr-4 text-[14px] ${fin === x.id ? "border-ink" : "border-line"}`}>
                    <span className="size-7 rounded-full border border-black/10" style={{ background: x.hex }} />
                    {x.name}
                  </button>
                ))}
              </div>
            </section>
            <button className={`${btn.primary} sm:max-w-xs`} onClick={() => (setStep(1), top())}>
              Next: quantity
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-8">
            <section className="grid gap-4">
              <h2 className="text-[17px] font-semibold">How many pieces?</h2>
              <div className="flex items-center gap-4">
                <input type="range" min={10} max={2000} step={10} value={qty} onChange={(e) => setQty(+e.target.value)} className="hattha-range flex-1" aria-label="Quantity" />
                <input type="number" min={1} max={20000} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(20000, +e.target.value || 1)))} className="h-12 w-28 rounded-[10px] border border-line bg-transparent px-3 text-right text-[16px] tabular-nums outline-none focus:border-ink" aria-label="Quantity in numbers" />
              </div>
              <p className={`rounded-[12px] px-4 py-3 text-[14px] ${qty >= moq ? "bg-soft" : "bg-[#fde8dc] text-[#7a2e12]"}`}>
                {qty >= moq
                  ? `Above our minimum of ${moq} pieces for ${materials.find((m) => m.id === mat)!.name.toLowerCase()}.`
                  : `Our minimum is ${moq} pieces for ${materials.find((m) => m.id === mat)!.name.toLowerCase()}. Smaller orders are possible with a set up fee, so send it anyway.`}
              </p>
            </section>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button className={`${btn.ghost} sm:w-auto`} onClick={() => setStep(0)}>
                Back
              </button>
              <button className={`${btn.primary} sm:max-w-xs`} onClick={() => (setStep(2), top())}>
                Next: your details
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" autoComplete="name" value={f.name} onValue={(v) => setF({ ...f, name: v })} error={tried && e.name} />
              <Field label="Company" autoComplete="organization" value={f.company} onValue={(v) => setF({ ...f, company: v })} error={tried && e.company} />
              <Field label="Work email" type="email" autoComplete="email" value={f.email} onValue={(v) => setF({ ...f, email: v })} error={tried && e.email} />
              <Field label="Country" as="select" value={f.country} onValue={(v) => setF({ ...f, country: v })} options={["Thailand", "Singapore", "Australia", "Japan", "United Arab Emirates", "United Kingdom", "United States", "Other"].map((x) => ({ value: x, label: x }))} />
              <Field label="Phone" type="tel" inputMode="tel" value={f.phone} onValue={(v) => setF({ ...f, phone: v })} error={tried && e.phone} />
              <Field label="Anything else (optional)" as="textarea" value={f.note} onValue={(v) => setF({ ...f, note: v })} className="sm:col-span-2" />
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button className={`${btn.ghost} sm:w-auto`} onClick={() => setStep(1)}>
                Back
              </button>
              <button
                className={`${btn.primary} sm:max-w-xs`}
                onClick={() => {
                  setTried(true);
                  if (Object.values(e).some(Boolean)) return;
                  setDone(makeRef("HTW"));
                  top();
                }}
              >
                Send request
              </button>
            </div>
          </div>
        )}
      </div>

      <aside className="order-first lg:order-none">
        <div className="grid gap-4 rounded-[18px] border border-line p-5 lg:sticky lg:top-24">
          <p className="text-[13px] text-muted">Your request</p>
          <dl className="grid gap-2 text-[14px]">
            {[
              ["Piece", kind],
              ["Design", design === "yours" ? "Your design" : "Our catalogue"],
              ["Material", materials.find((m) => m.id === mat)!.name],
              ["Finish", finishes.find((x) => x.id === fin)!.name],
              ["Quantity", qty.toLocaleString("en-US")],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="grid gap-1 rounded-[12px] bg-soft p-4">
            <span className="text-[13px] text-muted">Estimated lead time</span>
            <span className="font-display text-[30px] font-extrabold leading-none" style={{ fontStretch: "112%" }}>
              {weeks} weeks
            </span>
            {now && <span className="text-[13px] text-muted">Ready to ship around {longDay(addDays(now, weeks * 7))}</span>}
          </div>
        </div>
      </aside>
    </div>
  );
}

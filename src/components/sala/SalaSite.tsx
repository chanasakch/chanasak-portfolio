"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ease } from "@/components/shared/motion";
import { Drawer } from "@/components/shared/ui";
import { Showroom } from "./Showroom";
import { pieces, thb, type Piece } from "./data";

type Line = { key: string; id: string; finish: number; qty: number; sample?: boolean };
const rooms = ["All", "Seating", "Objects"] as const;
type Room = (typeof rooms)[number];

const thumb = (id: string, f: number) => `/images/sala/${id}-${pieces.find((p) => p.id === id)!.finishes.length > 1 ? f : 0}.webp`;

export function SalaSite() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const room = useRef<Showroom | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<Room>("All");
  const [index, setIndex] = useState(1);
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [finish, setFinish] = useState<Record<string, number>>({});
  const [qty, setQty] = useState(1);
  const [bag, setBag] = useState<Line[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [moved, setMoved] = useState(false);
  const [added, setAdded] = useState<string | null>(null);

  const shown = useMemo(() => pieces.filter((p) => filter === "All" || p.kind === filter), [filter]);
  const current = open ? pieces.find((p) => p.id === open)! : shown[Math.min(index, shown.length - 1)];
  const count = bag.reduce((s, l) => s + l.qty, 0);

  useEffect(() => {
    if (!canvas.current) return;
    let alive = true;
    const s = new Showroom(canvas.current, "#ecebe7");
    room.current = s;
    s.onIndex = setIndex;
    s.onHover = (id) => {
      setHover(id);
      if (wrap.current) wrap.current.dataset.cursor = id ? "View" : "Drag";
    };
    s.onFrame = () => {
      const el = tag.current;
      const id = el?.dataset.id;
      if (!el || !id) return;
      const p = s.screenOf(id);
      if (p) el.style.transform = `translate(${p.x}px, ${p.y + 18}px) translateX(-50%)`;
    };
    s.load(pieces, (n) => alive && setProgress(n))
      .then(() => {
        if (!alive) return;
        s.goTo(1);
        setReady(true);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
      s.dispose();
    };
  }, []);

  const choose = useCallback((id: string) => {
    room.current?.open(id);
    setOpen(id);
    setQty(1);
    setMoved(true);
  }, []);

  const back = useCallback(() => {
    room.current?.close();
    setOpen(null);
  }, []);

  const step = useCallback(
    (d: number) => {
      const s = room.current;
      if (!s) return;
      setMoved(true);
      if (open) {
        const i = shown.findIndex((p) => p.id === open);
        const next = shown[(i + d + shown.length) % shown.length];
        choose(next.id);
      } else s.goTo(s.current() + d);
    },
    [open, shown, choose],
  );

  // keyboard: arrows walk the row, Enter opens, Escape goes back
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (bagOpen || visitOpen) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select")) return;
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Escape" && open) back();
      else if (e.key === "Enter" && !open && t === document.body) choose(current.id);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [step, back, choose, open, current, bagOpen, visitOpen]);

  // pointer: drag to walk or turn, click to open
  useEffect(() => {
    const el = wrap.current;
    const s = room.current;
    if (!el || !s) return;
    let down: { x: number; y: number; lx: number; ly: number; t: number } | null = null;
    let dist = 0;
    const pd = (e: PointerEvent) => {
      if (e.button !== 0) return;
      down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, t: performance.now() };
      dist = 0;
      el.setPointerCapture(e.pointerId);
    };
    const pm = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (!down) return s.setPointer(e.clientX - r.left, e.clientY - r.top);
      const dx = e.clientX - down.lx;
      const dy = e.clientY - down.ly;
      down.lx = e.clientX;
      down.ly = e.clientY;
      dist += Math.abs(dx) + Math.abs(dy);
      if (dist < 6) return;
      setMoved(true);
      if (s.focus >= 0) s.turnBy(dx * 0.008);
      else s.pan(-(Math.abs(dx) >= Math.abs(dy) ? dx : dy * 0.6) * s.metresPerPixel() * 1.2);
    };
    const pu = (e: PointerEvent) => {
      if (!down) return;
      const tap = dist < 6 && performance.now() - down.t < 600;
      down = null;
      if (!tap || s.focus >= 0) return;
      const r = el.getBoundingClientRect();
      const id = s.pick(e.clientX - r.left, e.clientY - r.top);
      if (id) choose(id);
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      setMoved(true);
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (s.focus >= 0) s.turnBy(-d * 0.003);
      else s.pan(d * s.metresPerPixel() * 0.9);
    };
    const leave = () => s.clearPointer();
    el.addEventListener("pointerdown", pd);
    el.addEventListener("pointermove", pm);
    el.addEventListener("pointerup", pu);
    el.addEventListener("pointercancel", pu);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", pd);
      el.removeEventListener("pointermove", pm);
      el.removeEventListener("pointerup", pu);
      el.removeEventListener("pointercancel", pu);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("wheel", wheel);
    };
  }, [ready, choose]);

  const pickRoom = (r: Room) => {
    setFilter(r);
    back();
    room.current?.filter(r === "All" ? null : pieces.filter((p) => p.kind === r).map((p) => p.id));
  };

  const pickFinish = (id: string, f: number) => {
    setFinish((m) => ({ ...m, [id]: f }));
    room.current?.setVariant(id, f);
  };

  const add = (p: Piece, sample = false) => {
    const f = finish[p.id] ?? 0;
    const key = `${p.id}-${f}${sample ? "-s" : ""}`;
    setBag((b) => {
      const hit = b.find((l) => l.key === key);
      if (hit) return b.map((l) => (l.key === key ? { ...l, qty: sample ? 1 : l.qty + qty } : l));
      return [...b, { key, id: p.id, finish: f, qty: sample ? 1 : qty, sample }];
    });
    setAdded(key);
    window.setTimeout(() => setAdded((k) => (k === key ? null : k)), 1800);
  };

  const hovered = hover ? pieces.find((p) => p.id === hover) : null;

  return (
    <div className="fixed inset-0 overflow-hidden bg-bg text-ink">
      {/* the room */}
      <div ref={wrap} data-cursor="Drag" className="absolute inset-0 touch-none select-none" aria-hidden>
        <canvas ref={canvas} className="block size-full" />
      </div>

      {/* hover tag under the piece */}
      <div
        ref={tag}
        data-id={hovered && !open ? hovered.id : ""}
        className={`pointer-events-none absolute left-0 top-0 whitespace-nowrap text-center transition-opacity duration-300 ${hovered && !open ? "opacity-100" : "opacity-0"}`}
      >
        <p className="text-[13px] font-medium">{hovered?.name}</p>
        <p className="text-[12px] text-muted">{hovered ? thb(hovered.price) : ""}</p>
      </div>

      {/* header */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-6">
        <a href="/sala" className="font-display text-[19px] font-semibold tracking-[0.32em]" onClick={(e) => (e.preventDefault(), back())}>
          SALA
        </a>
        <nav aria-label="Rooms" className="absolute left-1/2 hidden -translate-x-1/2 gap-1 rounded-full bg-white/70 p-1 text-[13px] md:flex">
          {rooms.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => pickRoom(r)}
              aria-pressed={filter === r}
              className={`rounded-full px-4 py-1.5 transition-colors ${filter === r ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
            >
              {r}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-5 text-[13px]">
          <button type="button" onClick={() => setVisitOpen(true)} className="hidden hover:opacity-60 sm:block">
            Visit the showroom
          </button>
          <button type="button" onClick={() => setBagOpen(true)} className="flex items-center gap-2 hover:opacity-60">
            Bag
            <span className={`flex size-6 items-center justify-center rounded-full text-[11px] transition-colors ${count ? "bg-ink text-bg" : "border border-line"}`}>{count}</span>
          </button>
        </div>
      </header>

      {/* mobile room switch */}
      <nav aria-label="Rooms" className={`absolute inset-x-0 top-[60px] z-20 flex justify-center gap-1 text-[12px] transition-opacity duration-300 md:hidden ${open ? "pointer-events-none opacity-0" : ""}`}>
        {rooms.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => pickRoom(r)}
            aria-pressed={filter === r}
            className={`rounded-full px-3.5 py-1.5 ${filter === r ? "bg-ink text-bg" : "bg-white/70 text-muted"}`}
          >
            {r}
          </button>
        ))}
      </nav>

      {/* title of the piece in front of you */}
      <AnimatePresence mode="wait">
        {!open && ready && (
          <motion.div
            key={current.id}
            className="pointer-events-none absolute left-5 top-[104px] z-10 sm:left-8 md:top-[96px]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease }}
          >
            <p className="text-[12px] text-muted">{current.kind}</p>
            <h1 className="mt-1 font-display text-[clamp(34px,5.4vw,76px)] font-medium leading-[0.95] tracking-[-0.02em]">{current.name}</h1>
            <p className="mt-3 text-[14px]">
              {thb(current.price)}
              <span className="ml-3 text-muted">{current.finishes.length > 1 ? `${current.finishes.length} fabrics` : current.finishes[0].name}</span>
            </p>
            <button type="button" onClick={() => choose(current.id)} className="pointer-events-auto mt-5 rounded-full bg-ink px-5 py-2.5 text-[13px] text-bg transition-opacity hover:opacity-85">
              View piece
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* row index */}
      <AnimatePresence>
        {!open && ready && (
          <motion.div
            className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 px-5 pb-[max(68px,calc(env(safe-area-inset-bottom)+56px))] sm:pb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className={`text-[12px] text-muted transition-opacity duration-700 ${moved ? "opacity-0" : "opacity-100"}`}>
              <span className="pointer-coarse:hidden">Scroll or drag to walk the room</span>
              <span className="hidden pointer-coarse:inline">Swipe to walk the room</span>
            </p>
            <div className="flex items-center gap-4">
              <RoundArrow dir={-1} onClick={() => step(-1)} label="Previous piece" />
              <div className="flex items-center gap-1.5">
                {shown.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-label={p.name}
                    aria-current={i === index}
                    onClick={() => room.current?.goTo(i)}
                    className="group flex h-6 items-center"
                  >
                    <span className={`block h-[3px] rounded-full transition-all duration-500 ${i === index ? "w-8 bg-ink" : "w-3 bg-ink/20 group-hover:bg-ink/45"}`} />
                  </button>
                ))}
              </div>
              <RoundArrow dir={1} onClick={() => step(1)} label="Next piece" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* the piece up close */}
      <AnimatePresence>
        {open && (
          <Detail
            key="detail"
            piece={current}
            finish={finish[current.id] ?? 0}
            onFinish={(f) => pickFinish(current.id, f)}
            qty={qty}
            setQty={setQty}
            onAdd={() => add(current)}
            onSample={() => add(current, true)}
            added={added}
            onBack={back}
            onStep={step}
          />
        )}
      </AnimatePresence>

      {/* loading */}
      <AnimatePresence>
        {!ready && (
          <motion.div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-bg" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-display text-[19px] font-semibold tracking-[0.32em]">SALA</p>
            {failed ? (
              <p className="max-w-[300px] text-center text-[13px] text-muted">The showroom needs WebGL to load. Try a recent version of Chrome, Safari or Firefox.</p>
            ) : (
              <div className="h-px w-40 bg-line">
                <div className="h-px bg-ink transition-[width] duration-300" style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* screen readers get the collection as a plain list */}
      <ul className="sr-only">
        {pieces.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => choose(p.id)}>
              {p.name}, {thb(p.price)}
            </button>
          </li>
        ))}
      </ul>

      <Bag open={bagOpen} onClose={() => setBagOpen(false)} lines={bag} setLines={setBag} />
      <Visit open={visitOpen} onClose={() => setVisitOpen(false)} />
    </div>
  );
}

function RoundArrow({ dir, onClick, label }: { dir: 1 | -1; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="flex size-10 items-center justify-center rounded-full border border-line bg-white/60 transition-colors hover:border-ink">
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden style={{ transform: dir < 0 ? "scaleX(-1)" : undefined }}>
        <path d="M2 7h10M8 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    </button>
  );
}

function Detail({
  piece: p,
  finish,
  onFinish,
  qty,
  setQty,
  onAdd,
  onSample,
  added,
  onBack,
  onStep,
}: {
  piece: Piece;
  finish: number;
  onFinish: (f: number) => void;
  qty: number;
  setQty: (n: number) => void;
  onAdd: () => void;
  onSample: () => void;
  added: string | null;
  onBack: () => void;
  onStep: (d: number) => void;
}) {
  const f = p.finishes[finish] ?? p.finishes[0];
  const justAdded = added === `${p.id}-${finish}`;
  const fabric = p.kind === "Seating" && p.finishes.length > 1;
  const [more, setMore] = useState(false);
  return (
    <>
      <motion.div
        className="absolute left-5 top-[64px] z-20 flex items-center gap-3 sm:left-8 md:top-[88px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button type="button" onClick={onBack} className="flex items-center gap-2 rounded-full border border-line bg-white/70 py-2 pl-3 pr-4 text-[13px] transition-colors hover:border-ink">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M12 7H2M6 3L2 7l4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          Back to the room
        </button>
        <p className="hidden text-[12px] text-muted lg:block">Drag the piece to turn it</p>
      </motion.div>

      <motion.aside
        aria-label={p.name}
        data-sheet
        className="absolute inset-x-0 bottom-0 z-20 rounded-t-[22px] bg-[#f7f6f3] px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-5 shadow-[0_-12px_40px_rgb(0_0_0/0.08)] md:inset-y-0 md:left-auto md:right-0 md:w-[min(440px,40vw)] md:overflow-y-auto md:rounded-none md:px-9 md:pb-10 md:pt-[104px] md:shadow-[-24px_0_60px_rgb(0_0_0/0.06)]"
        initial={{ y: "100%", x: 0 }}
        animate={{ y: 0, x: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.6, ease }}
        data-lenis-prevent
      >
        
        <AnimatePresence mode="wait">
          <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] text-muted">{p.kind}</p>
                <h2 className="mt-1 font-display text-[clamp(28px,3vw,40px)] font-medium leading-[1.02] tracking-[-0.015em]">{p.name}</h2>
              </div>
              <div className="flex shrink-0 gap-1.5 pt-1">
                <RoundArrow dir={-1} onClick={() => onStep(-1)} label="Previous piece" />
                <RoundArrow dir={1} onClick={() => onStep(1)} label="Next piece" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-4 md:mt-3 md:block">
              <p className="text-[17px]">{thb(p.price)}</p>
              <button type="button" onClick={() => setMore(!more)} aria-expanded={more} className="text-[13px] text-muted underline underline-offset-4 md:hidden">
                {more ? "Less" : "About this piece"}
              </button>
            </div>
            <div className={`${more ? "block" : "hidden"} md:block`}>
              <p className="mt-3 max-w-[46ch] text-[14px] leading-relaxed text-muted md:mt-4">{p.blurb}</p>
              <p className="mt-3 text-[13px] text-muted md:hidden">{p.made}</p>
              <p className="mt-1 text-[13px] md:hidden">{p.lead}</p>
            </div>

            <div className="mt-4 md:mt-6">
              <p className="text-[13px]">
                {fabric ? "Fabric" : "Finish"} <span className="text-muted">{f.name}{f.note ? `, ${f.note}` : ""}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {p.finishes.map((x, i) => (
                  <button
                    key={x.name}
                    type="button"
                    onClick={() => onFinish(i)}
                    aria-label={x.name}
                    aria-pressed={i === finish}
                    className={`relative size-9 rounded-full ring-offset-2 ring-offset-[#f7f6f3] transition-shadow ${i === finish ? "ring-1 ring-ink" : "hover:ring-1 hover:ring-ink/30"}`}
                    style={{ background: x.color, boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.08)" }}
                  />
                ))}
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-3 border-y border-line py-3 text-[13px] md:mt-6 md:py-4">
              {(["Width", "Depth", "Height"] as const).map((k, i) => (
                <div key={k}>
                  <dt className="text-muted">{k}</dt>
                  <dd className="mt-0.5 tabular-nums">{p.dims[i]} cm</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 hidden text-[13px] text-muted md:block">{p.made}</p>
            <p className="mt-1 hidden text-[13px] md:block">{p.lead}</p>

            <div className="mt-4 flex gap-2.5 md:mt-6">
              <div className="flex items-center rounded-full border border-line">
                <button type="button" aria-label="One fewer" onClick={() => setQty(Math.max(1, qty - 1))} className="size-11 text-[18px] text-muted hover:text-ink">
                  −
                </button>
                <span className="w-5 text-center text-[14px] tabular-nums" aria-live="polite">
                  {qty}
                </span>
                <button type="button" aria-label="One more" onClick={() => setQty(Math.min(9, qty + 1))} className="size-11 text-[18px] text-muted hover:text-ink">
                  +
                </button>
              </div>
              <button type="button" onClick={onAdd} className="relative h-11 flex-1 overflow-hidden rounded-full bg-ink text-[14px] text-bg transition-opacity hover:opacity-90">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={justAdded ? "a" : "b"} className="block" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.25 }}>
                    {justAdded ? "Added to your bag" : `Add to bag, ${thb(p.price * qty)}`}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
            {fabric && (
              <button type="button" onClick={onSample} className="mt-3 w-full rounded-full border border-line py-2.5 text-[13px] transition-colors hover:border-ink">
                {added === `${p.id}-${finish}-s` ? "Sample added" : `Order a free ${f.name.toLowerCase()} swatch`}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.aside>
    </>
  );
}

function Bag({ open, onClose, lines, setLines }: { open: boolean; onClose: () => void; lines: Line[]; setLines: (f: (l: Line[]) => Line[]) => void }) {
  const [stage, setStage] = useState<"bag" | "form" | "sent">("bag");
  const [ref, setRef] = useState("");
  const total = lines.reduce((s, l) => s + (l.sample ? 0 : pieces.find((p) => p.id === l.id)!.price * l.qty), 0);
  const close = () => {
    onClose();
    if (stage === "sent") window.setTimeout(() => setStage("bag"), 500);
  };
  const delivery = total >= 20000 || total === 0 ? 0 : 450;
  return (
    <Drawer
      open={open}
      onClose={close}
      title={stage === "form" ? "Delivery details" : "Your bag"}
      footer={
        lines.length > 0 && stage === "bag" ? (
          <div>
            <div className="flex justify-between text-[14px]">
              <span className="text-muted">Subtotal</span>
              <span className="tabular-nums">{thb(total)}</span>
            </div>
            <div className="mt-1 flex justify-between text-[13px] text-muted">
              <span>Delivery in Bangkok</span>
              <span>{delivery ? thb(delivery) : "Free"}</span>
            </div>
            <button type="button" onClick={() => setStage("form")} className="mt-4 h-12 w-full rounded-full bg-ink text-[14px] text-bg hover:opacity-90">
              Continue, {thb(total + delivery)}
            </button>
          </div>
        ) : null
      }
    >
      {stage === "sent" ? (
        <div className="pt-6">
          <p className="font-display text-[26px] leading-tight">Thank you, we have your order.</p>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            Reference {ref}. Someone from the showroom will call within one working day to confirm stock and book a delivery slot. Nothing is charged until then.
          </p>
          <button type="button" onClick={close} className="mt-6 rounded-full border border-line px-5 py-2.5 text-[13px] hover:border-ink">
            Back to the room
          </button>
        </div>
      ) : stage === "form" ? (
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setRef("SL-" + Math.floor(100000 + Math.random() * 899999));
            setLines(() => []);
            setStage("sent");
          }}
        >
          <Field label="Name" name="name" autoComplete="name" />
          <Field label="Phone" name="tel" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9 +\-]{9,}" />
          <Field label="Delivery address" name="address" autoComplete="street-address" />
          <label className="grid gap-1.5 text-[13px]">
            <span className="text-muted">Preferred day</span>
            <select name="day" className="h-11 rounded-xl border border-line bg-transparent px-3">
              <option>Weekday</option>
              <option>Saturday</option>
              <option>Sunday</option>
            </select>
          </label>
          <p className="text-[12px] leading-relaxed text-muted">We confirm stock and the delivery fee by phone before anything is charged.</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStage("bag")} className="h-12 rounded-full border border-line px-5 text-[14px] hover:border-ink">
              Back
            </button>
            <button type="submit" className="h-12 flex-1 rounded-full bg-ink text-[14px] text-bg hover:opacity-90">
              Place order
            </button>
          </div>
        </form>
      ) : lines.length === 0 ? (
        <p className="pt-4 text-[14px] text-muted">Your bag is empty. Pick a piece in the room and add it here.</p>
      ) : (
        <ul className="grid gap-5">
          {lines.map((l) => {
            const p = pieces.find((x) => x.id === l.id)!;
            const f = p.finishes[l.finish];
            return (
              <li key={l.key} className="flex gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-[#ecebe7]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {l.sample ? <span className="size-10 rounded-full" style={{ background: f.color }} /> : <img src={thumb(p.id, l.finish)} alt="" className="size-full object-contain p-1.5" />}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3 text-[14px]">
                    <span>{l.sample ? `${f.name} swatch` : p.name}</span>
                    <span className="tabular-nums">{l.sample ? "Free" : thb(p.price * l.qty)}</span>
                  </div>
                  <p className="text-[12px] text-muted">{l.sample ? `For the ${p.name}` : f.name}</p>
                  <div className="mt-auto flex items-center gap-3 pt-2 text-[13px]">
                    {!l.sample && (
                      <div className="flex items-center rounded-full border border-line">
                        <button type="button" aria-label="One fewer" className="size-8 text-muted hover:text-ink" onClick={() => setLines((ls) => ls.map((x) => (x.key === l.key ? { ...x, qty: Math.max(1, x.qty - 1) } : x)))}>
                          −
                        </button>
                        <span className="w-4 text-center tabular-nums">{l.qty}</span>
                        <button type="button" aria-label="One more" className="size-8 text-muted hover:text-ink" onClick={() => setLines((ls) => ls.map((x) => (x.key === l.key ? { ...x, qty: Math.min(9, x.qty + 1) } : x)))}>
                          +
                        </button>
                      </div>
                    )}
                    <button type="button" className="text-muted underline-offset-4 hover:text-ink hover:underline" onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))}>
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

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1.5 text-[13px]">
      <span className="text-muted">{label}</span>
      <input required {...rest} className="h-11 rounded-xl border border-line bg-transparent px-3 text-[14px] outline-none focus:border-ink" />
    </label>
  );
}

const days = (() => {
  const out: { key: string; label: string; day: string }[] = [];
  const d = new Date();
  while (out.length < 6) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 1) continue; // closed Mondays
    out.push({ key: d.toDateString(), label: d.toLocaleDateString("en-GB", { weekday: "short" }), day: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) });
  }
  return out;
})();

function Visit({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  return (
    <Drawer open={open} onClose={onClose} title="Visit the showroom">
      <p className="text-[14px] leading-relaxed">
        Charoen Krung 30, Bang Rak, Bangkok
        <br />
        <span className="text-muted">Tuesday to Sunday, 10:00 to 19:00. Closed Mondays.</span>
      </p>
      <p className="mt-4 text-[14px] leading-relaxed text-muted">Every piece online is on the floor. Book a time and we will have the fabrics you want to see out on the table.</p>
      {sent ? (
        <p className="mt-8 font-display text-[22px] leading-snug">
          See you on {days.find((d) => d.key === day)?.label} {days.find((d) => d.key === day)?.day} at {time}.
        </p>
      ) : (
        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (day && time) setSent(true);
          }}
        >
          <p className="text-[13px]">Day</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {days.map((d) => (
              <button
                key={d.key}
                type="button"
                aria-pressed={day === d.key}
                onClick={() => setDay(d.key)}
                className={`rounded-xl border py-2.5 text-[13px] transition-colors ${day === d.key ? "border-ink bg-ink text-bg" : "border-line hover:border-ink"}`}
              >
                {d.label}
                <span className="block text-[12px] opacity-70">{d.day}</span>
              </button>
            ))}
          </div>
          <p className="mt-5 text-[13px]">Time</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {["11:00", "13:00", "15:00", "17:00"].map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={time === t}
                onClick={() => setTime(t)}
                className={`rounded-xl border py-2.5 text-[13px] tabular-nums transition-colors ${time === t ? "border-ink bg-ink text-bg" : "border-line hover:border-ink"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-4">
            <Field label="Name" name="name" autoComplete="name" />
            <Field label="Phone" name="tel" type="tel" autoComplete="tel" inputMode="tel" />
          </div>
          <button type="submit" disabled={!day || !time} className="mt-6 h-12 w-full rounded-full bg-ink text-[14px] text-bg transition-opacity hover:opacity-90 disabled:opacity-30">
            Book the visit
          </button>
        </form>
      )}
      <p className="mt-10 border-t border-line pt-4 text-[11px] leading-relaxed text-muted">
        3D models from the Khronos glTF sample library: furniture and lamp by Eric Chadwick (CC BY 4.0), plant pot and vases with Rico Cilliers (CC0), cup by Poly Haven and Eric Chadwick (CC0).
      </p>
    </Drawer>
  );
}

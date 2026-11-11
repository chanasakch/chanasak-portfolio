"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { AnimatePresence, motion } from "motion/react";
import { Stage3D } from "@/components/shared/Stage3D";
import { useDrag3D } from "@/components/shared/useDrag3D";
import { Drawer } from "@/components/shared/ui";
import { FadeUp, SplitLines } from "@/components/shared/motion";

const metals = [
  { id: "yellow", name: "Yellow gold", color: "#e3bd74", base: 38000 },
  { id: "rose", name: "Rose gold", color: "#e2a58a", base: 38000 },
  { id: "platinum", name: "Platinum", color: "#d6dade", base: 52000 },
];
const stones = [
  { id: "sapphire", name: "Sapphire", from: "Chanthaburi", color: "#2552c4", perCt: 45000, story: "Cornflower blue from the gem market in Chanthaburi, heated only by the earth that made it." },
  { id: "ruby", name: "Ruby", from: "Bo Rai, Trat", color: "#b0102c", perCt: 62000, story: "The deep red the old Siam trade was named for. We buy rough at the Bo Rai market and cut in Bangkok." },
  { id: "emerald", name: "Emerald", from: "Cut in Bangkok", color: "#1d8a56", perCt: 40000, story: "Green with a garden inside it. Each stone keeps its inclusions, so no two look alike." },
  { id: "diamond", name: "Diamond", from: "Recycled stones", color: "#ffffff", perCt: 95000, story: "Recut from old jewellery. All the fire, none of the new mining." },
];
const cuts = [
  { id: "round", name: "Round", k: 1, sx: 1, sz: 1, seg: 16 },
  { id: "oval", name: "Oval", k: 1.05, sx: 1.35, sz: 0.95, seg: 16 },
  { id: "cushion", name: "Cushion", k: 1.1, sx: 1.12, sz: 1.12, seg: 8 },
];
const carats = [0.5, 1, 1.5];
const fmt = new Intl.NumberFormat("en-US");

export function PhloiSite() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<Stage3D | null>(null);
  const drag = useDrag3D(stage);
  const ring = useRef<{ band: THREE.MeshPhysicalMaterial; gem?: THREE.Mesh; gemMat: THREE.MeshPhysicalMaterial; group: THREE.Group; prongs: THREE.Group } | null>(null);
  const [metal, setMetal] = useState(metals[0]);
  const [stone, setStone] = useState(stones[0]);
  const [cut, setCut] = useState(cuts[0]);
  const [ct, setCt] = useState(1);
  const [size, setSize] = useState(52);
  const [engrave, setEngrave] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [sent, setSent] = useState(false);
  const price = Math.round((metal.base + stone.perCt * ct * cut.k) / 100) * 100;

  useEffect(() => {
    if (!canvas.current) return;
    const s = new Stage3D(canvas.current, "#eceef0", 0.03);
    s.renderer.toneMappingExposure = 1.15;
    s.dist = 6.4;
    s.tilt = 0.32;
    s.autoSpin = 0.004;
    const group = new THREE.Group();
    const band = new THREE.MeshPhysicalMaterial({ color: metals[0].color, metalness: 1, roughness: 0.14, clearcoat: 0.3, envMapIntensity: 1.6 });
    const torus = new THREE.Mesh(new THREE.TorusGeometry(1, 0.1, 48, 220), band);
    torus.scale.set(1, 1, 1.9);
    const prongs = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.55, 12), band);
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      p.position.set(Math.cos(a) * 0.3, 1.25, Math.sin(a) * 0.3);
      p.rotation.set(Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25);
      prongs.add(p);
    }
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.14, 0.22, 32), band);
    seat.position.y = 1.08;
    const gemMat = new THREE.MeshPhysicalMaterial({ color: stones[0].color, transmission: 1, ior: 1.9, thickness: 0.7, roughness: 0, dispersion: 4, specularIntensity: 1, envMapIntensity: 3.5, flatShading: true, attenuationColor: new THREE.Color(stones[0].color), attenuationDistance: 0.6 });
    group.add(torus, seat, prongs);
    group.position.y = -0.1;
    s.turn.add(group);
    const key = new THREE.DirectionalLight("#ffffff", 2.4);
    key.position.set(2, 4, 3);
    s.scene.add(key, new THREE.AmbientLight("#ffffff", 0.4));
    stage.current = s;
    ring.current = { band, gemMat, group, prongs };
    return () => s.dispose();
  }, []);

  // Rebuild the stone when cut or carat changes
  useEffect(() => {
    const r = ring.current;
    if (!r) return;
    if (r.gem) {
      r.group.remove(r.gem);
      r.gem.geometry.dispose();
    }
    const prof = [[0.001, -0.42], [0.36, -0.04], [0.4, 0], [0.38, 0.07], [0.24, 0.15], [0.001, 0.15]].map(([x, y]) => new THREE.Vector2(x, y));
    const g = new THREE.LatheGeometry(prof, cut.seg);
    const gem = new THREE.Mesh(g, r.gemMat);
    const sc = 0.62 + ct * 0.38;
    gem.scale.set(sc * cut.sx, sc, sc * cut.sz);
    gem.position.y = 1.36 + 0.06 * ct;
    r.group.add(gem);
    r.gem = gem;
    r.prongs.scale.set(sc * cut.sx, 1 + (ct - 1) * 0.15, sc * cut.sz);
  }, [cut, ct]);

  useEffect(() => {
    const r = ring.current;
    if (!r) return;
    r.band.color.set(metal.color);
    r.gemMat.color.set(stone.color);
    r.gemMat.attenuationColor.set(stone.color);
    r.gemMat.attenuationDistance = stone.id === "diamond" ? 10 : 0.6;
    r.gemMat.ior = stone.id === "diamond" ? 2.4 : 1.77;
  }, [metal, stone]);

  useEffect(() => {
    const s = stage.current;
    if (!s) return;
    const place = () => {
      const wide = window.innerWidth >= 1024;
      s.shiftTarget = wide ? -1.15 : 0;
      s.dist = wide ? 8.4 : 8.8;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  const opt = (sel: boolean) => `border px-4 py-2.5 text-[14px] tracking-[0.02em] transition-colors ${sel ? "border-ink bg-ink text-bg" : "border-ink/15 hover:border-ink/50"}`;

  return (
    <div>
      <header className="fixed inset-x-0 top-0 z-30 grid h-16 grid-cols-[1fr_auto_1fr] items-center px-[var(--gutter)] text-[13px] tracking-[0.04em]">
        <nav className="hidden gap-7 md:flex" aria-label="Main">
          <a href="#ring" className="opacity-70 hover:opacity-100">The ring</a>
          <a href="#stones" className="opacity-70 hover:opacity-100">Stones</a>
          <a href="#visit" className="opacity-70 hover:opacity-100">Visit</a>
        </nav>
        <span className="col-start-2 font-display text-[30px] tracking-[0.5em] [margin-right:-0.5em]">PHLOI</span>
        <button type="button" onClick={() => setDrawer(true)} className="justify-self-end whitespace-nowrap border border-ink/20 px-3 py-2 hover:border-ink sm:px-4">
          <span className="sm:hidden">Book</span>
          <span className="hidden sm:inline">Book a viewing</span>
        </button>
      </header>

      <section id="ring" className="relative grid lg:h-[100svh] lg:grid-cols-[1.4fr_1fr]">
        <div className="relative h-[60svh] touch-pan-y lg:h-auto" data-cursor="Turn" {...drag}>
          <canvas ref={canvas} className="absolute inset-0 h-full w-full lg:fixed lg:inset-auto lg:left-0 lg:top-0 lg:h-[100svh] lg:w-full" role="img" aria-label={`${stone.name} ring in ${metal.name.toLowerCase()}`} />
          <div className="pointer-events-none absolute bottom-6 left-[var(--gutter)] hidden lg:block">
            <SplitLines lines={["Thai stones,", "set by hand"]} delay={0.2} className="font-display text-[clamp(3rem,5.5vw,5.6rem)] leading-[0.95]" />
            <p className="mt-4 text-[13px] text-muted">Drag the ring to turn it. Every choice changes it live.</p>
          </div>
        </div>
        <aside className="relative z-10 flex flex-col justify-center bg-bg/70 px-[var(--gutter)] py-12 backdrop-blur-sm lg:bg-transparent lg:py-20 lg:pr-[5vw] lg:backdrop-blur-none">
          <AnimatePresence mode="wait">
            <motion.div key={stone.id + metal.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <p className="text-[12px] uppercase tracking-[0.2em] text-muted">{stone.from}</p>
              <h1 className="mt-3 font-display text-[clamp(2.6rem,4.4vw,4.2rem)] leading-none">
                {stone.name} solitaire
              </h1>
              <p className="mt-2 text-[15px] text-muted">in {metal.name.toLowerCase()}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 grid gap-6">
            <Group label="Stone">
              {stones.map((x) => (
                <button key={x.id} type="button" onClick={() => setStone(x)} aria-pressed={stone.id === x.id} className={`${opt(stone.id === x.id)} flex items-center gap-2`}>
                  <span className="size-3 rotate-45" style={{ background: x.color, boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.15)" }} />
                  {x.name}
                </button>
              ))}
            </Group>
            <Group label="Metal">
              {metals.map((m) => (
                <button key={m.id} type="button" onClick={() => setMetal(m)} aria-pressed={metal.id === m.id} className={`${opt(metal.id === m.id)} flex items-center gap-2`}>
                  <span className="size-3 rounded-full" style={{ background: m.color }} />
                  {m.name}
                </button>
              ))}
            </Group>
            <Group label="Cut">
              {cuts.map((c) => (
                <button key={c.id} type="button" onClick={() => setCut(c)} aria-pressed={cut.id === c.id} className={opt(cut.id === c.id)}>
                  {c.name}
                </button>
              ))}
            </Group>
            <Group label="Carat">
              {carats.map((c) => (
                <button key={c} type="button" onClick={() => setCt(c)} aria-pressed={ct === c} className={`${opt(ct === c)} tabular`}>
                  {c.toFixed(1)} ct
                </button>
              ))}
            </Group>
            <div className="grid grid-cols-[auto_1fr] items-end gap-6">
              <label className="grid gap-2 text-[12px] uppercase tracking-[0.16em] text-muted">
                Size
                <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="border border-ink/15 bg-transparent px-3 py-2.5 text-[14px] normal-case tracking-normal text-ink">
                  {Array.from({ length: 13 }, (_, i) => 46 + i).map((n) => (
                    <option key={n} value={n}>
                      Thai {n}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-[12px] uppercase tracking-[0.16em] text-muted">
                Engraving inside
                <input value={engrave} onChange={(e) => setEngrave(e.target.value.slice(0, 18))} placeholder="Up to 18 characters" className="border-b border-ink/20 bg-transparent py-2.5 font-display text-[18px] normal-case tracking-[0.06em] text-ink outline-none placeholder:font-body placeholder:text-[14px] placeholder:tracking-normal placeholder:text-muted focus:border-ink" />
              </label>
            </div>
            {engrave && (
              <svg viewBox="0 0 200 110" className="h-24 w-auto self-start text-ink" aria-label={`Engraving preview: ${engrave}`}>
                <defs>
                  <path id="arc" d="M30 95 A70 70 0 0 1 170 95" />
                </defs>
                <path d="M22 100 A78 78 0 0 1 178 100" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="14" />
                <text fontFamily="Italiana, serif" fontSize="15" letterSpacing="2" fill="currentColor">
                  <textPath href="#arc" startOffset="50%" textAnchor="middle">
                    {engrave}
                  </textPath>
                </text>
              </svg>
            )}
          </div>
          <div className="mt-8 flex items-center gap-5 border-t border-ink/10 pt-6">
            <motion.p key={price} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} className="tabular text-[1.6rem] font-light tracking-[0.02em]">
              ฿{fmt.format(price)}
            </motion.p>
            <button type="button" onClick={() => setDrawer(true)} className="flex-1 bg-ink py-4 text-[13px] uppercase tracking-[0.2em] text-bg transition-opacity hover:opacity-85">
              Reserve to try on
            </button>
          </div>
        </aside>
      </section>

      <section id="stones" className="relative z-10 bg-bg px-[var(--gutter)] py-[16vh]">
        <SplitLines as="h2" inView lines={["Four stones,", "where they come from"]} className="font-display text-[clamp(2.6rem,5.4vw,5.4rem)] leading-[0.95]" />
        <div className="mt-16 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {stones.map((x, i) => (
            <FadeUp key={x.id} delay={i * 0.08} className="bg-bg">
              <button type="button" onClick={() => { setStone(x); window.__lenis?.scrollTo(0); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="group flex h-full w-full flex-col p-6 text-left sm:p-8">
                <span className="relative block size-16">
                  <span className="absolute inset-0 rotate-45 transition-transform duration-700 group-hover:rotate-[135deg]" style={{ background: `linear-gradient(135deg, ${x.color}, #ffffff66 50%, ${x.color})` }} />
                </span>
                <span className="mt-10 font-display text-[2.4rem] leading-none">{x.name}</span>
                <span className="mt-2 text-[12px] uppercase tracking-[0.18em] text-muted">{x.from}</span>
                <span className="mt-5 text-[15px] leading-relaxed text-muted">{x.story}</span>
                <span className="mt-auto pt-8 text-[13px] underline underline-offset-4">See it on the ring</span>
              </button>
            </FadeUp>
          ))}
        </div>
      </section>

      <section id="visit" className="relative z-10 grid gap-10 bg-ink px-[var(--gutter)] py-[14vh] text-bg lg:grid-cols-2">
        <h2 className="font-display text-[clamp(2.6rem,5vw,5rem)] leading-[0.95]">A private room on Silom Road</h2>
        <div className="self-end">
          <p className="max-w-[44ch] text-[16px] leading-relaxed opacity-75">Try the ring you built with a stone from our safe, loose, before it is set. Forty-five minutes, by appointment, tea included.</p>
          <button type="button" onClick={() => setDrawer(true)} className="mt-8 border border-bg/40 px-6 py-3.5 text-[13px] uppercase tracking-[0.2em] hover:border-bg">
            Book a viewing
          </button>
        </div>
      </section>
      <footer className="relative z-10 flex flex-col justify-between gap-3 bg-ink px-[var(--gutter)] pb-24 pt-6 text-[12px] text-bg/50 sm:flex-row sm:pb-8">
        <span>PHLOI, 9 Silom Road, Bang Rak</span>
        <span>Concept site. The brand is fictional. Ring rendered live in WebGL.</span>
      </footer>

      <Drawer open={drawer} onClose={() => { setDrawer(false); setSent(false); }} title="Book a private viewing">
        {sent ? (
          <p className="py-8 font-display text-[2rem] leading-tight">We will call you to confirm the time. Your design is saved with the booking.</p>
        ) : (
          <form className="grid gap-5" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="bg-soft p-4 text-[14px]">
              <p className="font-display text-[1.5rem]">{stone.name} solitaire</p>
              <p className="text-muted">{metal.name}, {cut.name.toLowerCase()} {ct.toFixed(1)} ct, Thai size {size}{engrave && `, engraved "${engrave}"`}</p>
              <p className="tabular mt-2">฿{fmt.format(price)}</p>
            </div>
            {[["Name", "text"], ["Phone", "tel"], ["Preferred date", "date"]].map(([l, t]) => (
              <label key={l} className="grid gap-1.5 text-[13px] text-muted">
                {l}
                <input required type={t} className="border-b border-line bg-transparent py-2 text-[16px] text-ink outline-none focus:border-ink" />
              </label>
            ))}
            <button className="mt-2 bg-ink py-4 text-[13px] uppercase tracking-[0.2em] text-bg">Request appointment</button>
          </form>
        )}
      </Drawer>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-[12px] uppercase tracking-[0.16em] text-muted">{label}</legend>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </fieldset>
  );
}

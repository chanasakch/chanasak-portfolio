"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "motion/react";
import { Stage3D } from "@/components/shared/Stage3D";
import { useDrag3D } from "@/components/shared/useDrag3D";
import { Drawer, Rail } from "@/components/shared/ui";
import { FadeUp, SplitLines, useSmartHeader } from "@/components/shared/motion";
import { Photo } from "@/components/shared/Photo";
import { photos } from "@/data/images";

type Shape = "bell" | "dome" | "globe" | "lantern";
const shapes: { id: Shape; name: string; from: number; pts: [number, number][] }[] = [
  { id: "bell", name: "Rakang", from: 7800, pts: [[0.08, 0.95], [0.32, 0.88], [0.52, 0.6], [0.66, 0.15], [0.86, -0.4], [1.02, -0.62]] },
  { id: "dome", name: "Lom", from: 6900, pts: [[0.08, 0.55], [0.48, 0.5], [0.82, 0.28], [1.04, -0.08], [1.14, -0.32]] },
  { id: "globe", name: "Duen", from: 8400, pts: [[0.1, 0.92], [0.55, 0.78], [0.86, 0.42], [0.95, 0], [0.86, -0.42], [0.55, -0.78], [0.22, -0.9]] },
  { id: "lantern", name: "Khom", from: 7200, pts: [[0.1, 1.05], [0.42, 0.95], [0.56, 0.6], [0.6, 0], [0.56, -0.6], [0.42, -0.95], [0.12, -1.05]] },
];
const finishes = [
  { id: "natural", name: "Natural", color: "#d9b98a" },
  { id: "honey", name: "Honey", color: "#b9803f" },
  { id: "smoked", name: "Smoked", color: "#6e4a2c" },
  { id: "black", name: "Black", color: "#2b2622" },
];
const sizes = [
  { id: "S", label: "40 cm", scale: 0.78, add: 0 },
  { id: "M", label: "55 cm", scale: 1, add: 2400 },
  { id: "L", label: "70 cm", scale: 1.22, add: 5200 },
];
const fmt = new Intl.NumberFormat("en-US");

function weaveTexture(open: boolean) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, 256, 256);
  const w = open ? 16 : 30;
  for (let i = -256; i < 512; i += 64) {
    for (const dir of [1, -1]) {
      const grad = g.createLinearGradient(i, 0, i + w, 0);
      grad.addColorStop(0, "#9a9a9a");
      grad.addColorStop(0.5, "#ffffff");
      grad.addColorStop(1, "#9a9a9a");
      g.strokeStyle = grad;
      g.lineWidth = w;
      g.beginPath();
      g.moveTo(i, dir > 0 ? 0 : 256);
      g.lineTo(i + 256, dir > 0 ? 256 : 0);
      g.stroke();
    }
  }
  g.fillStyle = "#e6e6e6";
  g.fillRect(0, 0, 256, open ? 8 : 14);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(open ? 14 : 22, open ? 4 : 6);
  t.anisotropy = 8;
  return t;
}

export function LampSite() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<Stage3D | null>(null);
  const drag = useDrag3D(stage);
  const parts = useRef<{ group: THREE.Group; shade?: THREE.Mesh; light: THREE.PointLight; bulb: THREE.MeshBasicMaterial; hemi: THREE.HemisphereLight; wall: THREE.MeshStandardMaterial } | null>(null);
  const [shape, setShape] = useState(shapes[0]);
  const [open, setOpen] = useState(true);
  const [finish, setFinish] = useState(finishes[0]);
  const [size, setSize] = useState(sizes[1]);
  const [on, setOn] = useState(true);
  const [warmth, setWarmth] = useState(2400);
  const [list, setList] = useState<{ name: string; detail: string; price: number }[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [sent, setSent] = useState(false);
  const { hidden, top } = useSmartHeader();
  const price = shape.from + size.add;
  const warm = useMemo(() => new THREE.Color().setHSL(0.08, 1, 0.5 + (warmth - 2200) / 2400), [warmth]);

  useEffect(() => {
    if (!canvas.current) return;
    const s = new Stage3D(canvas.current, "#d8d4cc", 0.02);
    s.renderer.shadowMap.enabled = true;
    s.dist = 7.5;
    s.tilt = 0.05;
    s.autoSpin = 0.0015;
    const group = new THREE.Group();
    s.turn.add(group);
    const hemi = new THREE.HemisphereLight("#ffffff", "#8a7f70", 1.2);
    const light = new THREE.PointLight("#ffb46b", 0, 30, 1.4);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.bias = -0.002;
    const wallMat = new THREE.MeshStandardMaterial({ color: "#d8d4cc", roughness: 1 });
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), wallMat);
    wall.position.set(0, 0, -3.2);
    wall.receiveShadow = true;
    const bulbMat = new THREE.MeshBasicMaterial({ color: "#ffe2b8" });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 16), bulbMat);
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 8, 8), new THREE.MeshStandardMaterial({ color: "#1b1917", roughness: 0.6 }));
    cord.position.y = 4.6;
    s.scene.add(hemi, wall);
    group.add(light, bulb, cord);
    s.onFrame = (t) => {
      group.rotation.z = Math.sin(t * 0.7) * 0.015;
    };
    stage.current = s;
    parts.current = { group, light, bulb: bulbMat, hemi, wall: wallMat };
    return () => s.dispose();
  }, []);

  // Rebuild the shade when its shape, weave or finish changes
  useEffect(() => {
    const p = parts.current;
    if (!p) return;
    if (p.shade) {
      p.group.remove(p.shade);
      p.shade.geometry.dispose();
    }
    const curve = new THREE.CatmullRomCurve3(shape.pts.map(([r, y]) => new THREE.Vector3(r, y, 0)));
    const geo = new THREE.LatheGeometry(curve.getPoints(60).map((v) => new THREE.Vector2(v.x, v.y)), 120);
    const tex = weaveTexture(open);
    const mat = new THREE.MeshStandardMaterial({ color: finish.color, map: tex, alphaMap: tex, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.85, emissive: new THREE.Color("#000") });
    const shade = new THREE.Mesh(geo, mat);
    shade.castShadow = true;
    shade.customDistanceMaterial = new THREE.MeshDistanceMaterial({ alphaMap: tex, alphaTest: 0.45 });
    p.group.add(shade);
    p.shade = shade;
    p.group.children.find((c) => c instanceof THREE.Mesh && c.geometry instanceof THREE.CylinderGeometry)!.position.y = shape.pts[0][1] + 4;
  }, [shape, open, finish]);

  // Day and night, light colour and size
  useEffect(() => {
    const p = parts.current;
    const s = stage.current;
    if (!p || !s) return;
    s.setBackground(on ? "#141210" : "#d8d4cc");
    p.wall.color.set(on ? "#2a2520" : "#d8d4cc");
    p.hemi.intensity = on ? 0.12 : 1.2;
    p.light.intensity = on ? 26 : 0;
    p.light.color.copy(warm);
    p.bulb.color.copy(on ? warm.clone().lerp(new THREE.Color("#fff"), 0.5) : new THREE.Color("#bdb7ad"));
    if (p.shade) (p.shade.material as THREE.MeshStandardMaterial).emissive.copy(on ? warm.clone().multiplyScalar(0.35) : new THREE.Color("#000"));
    p.group.scale.setScalar(size.scale);
  }, [on, warm, size, shape, open, finish]);

  useEffect(() => {
    const s = stage.current;
    if (!s) return;
    const place = () => {
      const wide = window.innerWidth >= 1024;
      s.shiftTarget = wide ? -1.3 : 0;
      s.lookTarget.set(0, wide ? 0 : 0.9, 0);
      s.dist = wide ? 7.5 : 9.5;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  const night = on;
  const theme = night ? "bg-[#141210] text-[#ece6db]" : "bg-[#d8d4cc] text-[#1c1a17]";
  const pill = (sel: boolean) => `rounded-full border px-4 py-2 text-[14px] transition-colors ${sel ? (night ? "border-[#ece6db] bg-[#ece6db] text-[#141210]" : "border-[#1c1a17] bg-[#1c1a17] text-[#d8d4cc]") : "border-current/20 hover:border-current/60"}`;

  return (
    <div className={`transition-colors duration-700 ${theme}`}>
      <header className={`fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between px-[var(--gutter)] text-[14px] transition-[transform,background-color] duration-500 ${top ? "" : night ? "bg-[#141210]/80 backdrop-blur-xl" : "bg-[#d8d4cc]/80 backdrop-blur-xl"} ${hidden ? "-translate-y-full" : ""}`}>
        <a href="#top" className="font-display text-[24px] leading-none">
          Loom &amp; Tide
        </a>
        <nav className="hidden gap-8 md:flex" aria-label="Main">
          <a href="#shades" className="opacity-70 hover:opacity-100">Shades</a>
          <a href="#rooms" className="opacity-70 hover:opacity-100">In rooms</a>
          <a href="#trade" className="opacity-70 hover:opacity-100">Trade</a>
        </nav>
        <div className="flex items-center gap-4">
          <button type="button" role="switch" aria-checked={on} onClick={() => setOn(!on)} className="flex items-center gap-2.5">
            <span className="hidden sm:inline">{on ? "Lights on" : "Lights off"}</span>
            <span className={`relative h-6 w-11 rounded-full border border-current/30 transition-colors ${on ? "bg-[#ffb46b]" : ""}`}>
              <span className={`absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-current transition-[left] duration-300 ${on ? "left-[22px]" : "left-[3px]"}`} />
            </span>
          </button>
          <button type="button" onClick={() => setDrawer(true)}>
            List <span className="tabular">({list.length})</span>
          </button>
        </div>
      </header>

      <section id="top" className="relative grid lg:h-[100svh] lg:grid-cols-[1.35fr_1fr]">
        <div className="relative h-[66svh] lg:absolute lg:inset-0 lg:h-auto" data-cursor="Drag" {...drag}>
          <canvas ref={canvas} className="h-full w-full touch-pan-y" aria-label={`${shape.name} pendant in ${finish.name.toLowerCase()} rattan`} role="img" />
          <div className="pointer-events-none absolute left-[var(--gutter)] top-20 sm:top-24">
            <SplitLines lines={["Woven light,", "made in Bangkok"]} className="whitespace-nowrap font-display text-[clamp(2.4rem,4.4vw,4.6rem)] leading-[0.95]" />
          </div>
          <p className="pointer-events-none absolute bottom-5 left-[var(--gutter)] text-[13px] opacity-60">Drag to turn. Switch the lights to see the weave on the wall.</p>
        </div>

        <aside id="shades" className="relative z-10 flex flex-col justify-center px-[var(--gutter)] py-12 lg:col-start-2 lg:py-20">
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }}>
            <p className="text-[13px] opacity-60">Pendant, hand-woven rattan peel</p>
            <h2 className="mt-2 font-display text-[clamp(3rem,5vw,4.8rem)] leading-none">{shape.name}</h2>
            <div className="mt-8 grid gap-6">
              <Field label="Shape">
                {shapes.map((s) => (
                  <button key={s.id} type="button" onClick={() => setShape(s)} aria-pressed={shape.id === s.id} className={pill(shape.id === s.id)}>
                    {s.name}
                  </button>
                ))}
              </Field>
              <Field label="Weave">
                {[true, false].map((o) => (
                  <button key={String(o)} type="button" onClick={() => setOpen(o)} aria-pressed={open === o} className={pill(open === o)}>
                    {o ? "Open lattice" : "Close weave"}
                  </button>
                ))}
              </Field>
              <Field label={`Finish, ${finish.name.toLowerCase()}`}>
                {finishes.map((f) => (
                  <button key={f.id} type="button" onClick={() => setFinish(f)} aria-label={f.name} aria-pressed={finish.id === f.id} className={`size-10 rounded-full ring-offset-2 transition ${night ? "ring-offset-[#141210]" : "ring-offset-[#d8d4cc]"} ${finish.id === f.id ? "ring-1 ring-current" : ""}`} style={{ background: f.color }} />
                ))}
              </Field>
              <Field label="Diameter">
                {sizes.map((z) => (
                  <button key={z.id} type="button" onClick={() => setSize(z)} aria-pressed={size.id === z.id} className={pill(size.id === z.id)}>
                    {z.label}
                  </button>
                ))}
              </Field>
              <label className={`grid gap-2 text-[13px] transition-opacity ${on ? "" : "pointer-events-none opacity-40"}`}>
                <span className="flex justify-between opacity-60">
                  Bulb colour <span className="tabular">{warmth} K</span>
                </span>
                <input type="range" min={2200} max={3000} step={100} value={warmth} onChange={(e) => setWarmth(Number(e.target.value))} className="w-full max-w-[320px] accent-[#ffb46b]" />
              </label>
            </div>
            <div className="mt-10 flex items-center gap-5 border-t border-current/15 pt-6">
              <p className="tabular font-display text-[2rem] leading-none">฿{fmt.format(price)}</p>
              <button
                type="button"
                onClick={() => {
                  setList((l) => [...l, { name: shape.name, detail: `${size.label}, ${finish.name.toLowerCase()}, ${open ? "open lattice" : "close weave"}`, price }]);
                  setDrawer(true);
                }}
                className={`flex-1 rounded-full py-3.5 text-[15px] font-medium transition-transform hover:scale-[1.02] ${night ? "bg-[#ece6db] text-[#141210]" : "bg-[#1c1a17] text-[#d8d4cc]"}`}
              >
                Add to project list
              </button>
            </div>
          </motion.div>
        </aside>
      </section>

      <section id="rooms" className="overflow-hidden px-[var(--gutter)] py-[16vh]">
        <div className="mb-12 grid gap-6 lg:grid-cols-12">
          <SplitLines as="h2" inView lines={["In rooms we", "have lit"]} className="font-display text-[clamp(2.6rem,5.4vw,5.4rem)] leading-[0.95] lg:col-span-7" />
          <p className="max-w-[40ch] self-end text-[15px] leading-relaxed opacity-70 lg:col-span-4 lg:col-start-9">Hotels, kitchens and long dining tables from Phuket to Chiang Mai. Drag to look along the row.</p>
        </div>
        <Rail label="Rooms" tone="dark">
          {[
            [photos.wovenPendantLit, "Rakang, close weave, at dusk"],
            [photos.bellPendantsKitchen, "Rakang in a row over a kitchen island"],
            [photos.domePendant, "Lom over a breakfast table"],
            [photos.trioPendants, "Three Duen at staggered heights"],
            [photos.bellPendantsLiving, "Rakang, natural, in a double-height room"],
            [photos.globePendant, "Duen, smoked"],
          ].map(([ph, cap]) => (
            <figure key={cap as string} className="group w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[30vw]">
              <div className="overflow-hidden">
                <Photo photo={ph as typeof photos.domePendant} className="aspect-[4/5] w-full" imgClassName="transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" sizes="(min-width:1024px) 30vw, 78vw" />
              </div>
              <figcaption className="mt-3 text-[14px] opacity-70">{cap as string}</figcaption>
            </figure>
          ))}
        </Rail>
      </section>

      <section className="grid gap-10 border-t border-current/10 px-[var(--gutter)] py-[14vh] sm:grid-cols-3">
        {[
          ["14 hours", "to weave one 55 cm shade by hand"],
          ["40", "weavers in our Bang Bua Thong workshop"],
          ["5 years", "guarantee on the frame and the weave"],
        ].map(([big, small], i) => (
          <FadeUp key={big} delay={i * 0.1}>
            <p className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-none">{big}</p>
            <p className="mt-3 max-w-[24ch] text-[15px] opacity-70">{small}</p>
          </FadeUp>
        ))}
      </section>

      <section id="trade" className="px-[var(--gutter)] pb-[14vh]">
        <div className={`grid gap-8 rounded-[2px] p-8 sm:p-14 lg:grid-cols-[1.4fr_1fr] lg:items-end ${night ? "bg-[#ece6db] text-[#141210]" : "bg-[#1c1a17] text-[#d8d4cc]"}`}>
          <h2 className="max-w-[16ch] font-display text-[clamp(2.4rem,4.4vw,4.2rem)] leading-[0.98]">For hotels, restaurants and designers</h2>
          <div>
            <p className="max-w-[44ch] text-[16px] leading-relaxed opacity-80">Custom diameters and finishes from six pieces, CAD and IES files, export packing from Bangkok. Add shades to your list and send it as one request.</p>
            <button type="button" onClick={() => setDrawer(true)} className="mt-6 rounded-full border border-current/40 px-6 py-3 text-[15px] hover:border-current">
              Open project list
            </button>
          </div>
        </div>
      </section>

      <footer className="flex flex-col justify-between gap-3 border-t border-current/10 px-[var(--gutter)] pb-24 pt-8 text-[13px] opacity-60 sm:flex-row sm:pb-8">
        <span>Loom &amp; Tide, 88 Bang Bua Thong, Nonthaburi</span>
        <span>Concept site. Brand and products are fictional. Shade rendered live in WebGL, room photos from Pexels.</span>
      </footer>

      <Drawer
        open={drawer}
        onClose={() => {
          setDrawer(false);
          setSent(false);
        }}
        title={`Project list (${list.length})`}
        footer={
          list.length && !sent ? (
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <input required type="email" placeholder="Work email" className="border-b border-line bg-transparent py-2.5 text-[15px] outline-none focus:border-ink" />
              <button className="rounded-full bg-ink py-3.5 text-[15px] text-bg">Send for a quote</button>
            </form>
          ) : undefined
        }
      >
        {sent ? (
          <p className="py-8 text-[16px] leading-relaxed">Sent. A trade manager replies within two working days with prices, lead times and CAD files.</p>
        ) : list.length === 0 ? (
          <p className="py-8 text-[15px] text-muted">Nothing here yet. Configure a shade and add it.</p>
        ) : (
          <ul className="divide-y divide-line">
            {list.map((l, i) => (
              <li key={i} className="flex items-baseline justify-between gap-4 py-4">
                <span>
                  <span className="block font-display text-[1.5rem] leading-tight">{l.name}</span>
                  <span className="text-[13px] text-muted">{l.detail}</span>
                </span>
                <span className="flex items-center gap-4">
                  <span className="tabular">฿{fmt.format(l.price)}</span>
                  <button type="button" onClick={() => setList((x) => x.filter((_, j) => j !== i))} className="text-[13px] text-muted underline">
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Drawer>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-[13px] opacity-60">{label}</legend>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </fieldset>
  );
}

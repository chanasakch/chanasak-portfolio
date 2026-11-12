"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { animate, AnimatePresence, motion } from "motion/react";
import { Stage3D } from "@/components/shared/Stage3D";
import { useDrag3D } from "@/components/shared/useDrag3D";
import { Drawer } from "@/components/shared/ui";
import { ease, FadeUp, SplitLines } from "@/components/shared/motion";

const metals = [
  { id: "yellow", name: "Yellow gold", color: "#e8c27a", base: 38000, engrave: "rgba(255,238,200,0.95)" },
  { id: "rose", name: "Rose gold", color: "#e8a98c", base: 38000, engrave: "rgba(255,226,210,0.95)" },
  { id: "platinum", name: "Platinum", color: "#dfe3e8", base: 52000, engrave: "rgba(245,248,252,0.95)" },
];
const stones = [
  { id: "sapphire", name: "Sapphire", from: "Chanthaburi", color: "#2a5be0", perCt: 45000, story: "Cornflower blue from the gem market in Chanthaburi, heated only by the earth that made it." },
  { id: "ruby", name: "Ruby", from: "Bo Rai, Trat", color: "#c4122f", perCt: 62000, story: "The deep red the old Siam trade was named for. We buy rough at the Bo Rai market and cut in Bangkok." },
  { id: "emerald", name: "Emerald", from: "Cut in Bangkok", color: "#169a5d", perCt: 40000, story: "Green with a garden inside it. Each stone keeps its inclusions, so no two look alike." },
  { id: "diamond", name: "Diamond", from: "Recycled stones", color: "#ffffff", perCt: 95000, story: "Recut from old jewellery. All the fire, none of the new mining." },
];
const cuts = [
  { id: "round", name: "Round", k: 1, sx: 1, sz: 1, seg: 16 },
  { id: "oval", name: "Oval", k: 1.05, sx: 1.35, sz: 0.95, seg: 16 },
  { id: "cushion", name: "Cushion", k: 1.1, sx: 1.12, sz: 1.12, seg: 8 },
];
const carats = [0.5, 1, 1.5];
const fmt = new Intl.NumberFormat("en-US");

/** Dark studio with bright softboxes: what makes metal and facets flash. */
function studio(renderer: THREE.WebGLRenderer) {
  const sc = new THREE.Scene();
  sc.add(new THREE.Mesh(new THREE.BoxGeometry(12, 12, 12), new THREE.MeshBasicMaterial({ color: 0x07080a, side: THREE.BackSide })));
  const box = (w: number, h: number, pos: [number, number, number], i: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(i, i * 0.97, i * 0.92), side: THREE.DoubleSide }));
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    sc.add(m);
  };
  box(5, 1.4, [0, 5, 0.5], 7);
  box(1.2, 4, [-5, 0.6, 1.5], 5);
  box(1.2, 4, [5, 0.4, -1], 4);
  box(2.4, 2.4, [0.5, 1.5, 5], 3);
  box(4, 0.35, [-1.5, -1.2, -5], 6);
  box(0.4, 3, [2.5, -2, 4], 5);
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(sc, 0.02).texture;
  pm.dispose();
  return tex;
}

function glintTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 30);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = "rgba(255,255,255,0.9)";
  for (const [w, len, rot] of [[2, 62, 0], [2, 62, Math.PI / 2], [1, 30, Math.PI / 4], [1, 30, -Math.PI / 4]] as const) {
    g.save();
    g.translate(64, 64);
    g.rotate(rot);
    const lg = g.createLinearGradient(-len, 0, len, 0);
    lg.addColorStop(0, "rgba(255,255,255,0)");
    lg.addColorStop(0.5, "rgba(255,255,255,1)");
    lg.addColorStop(1, "rgba(255,255,255,0)");
    g.strokeStyle = lg;
    g.lineWidth = w;
    g.beginPath();
    g.moveTo(-len, 0);
    g.lineTo(len, 0);
    g.stroke();
    g.restore();
  }
  return new THREE.CanvasTexture(c);
}

function radial(inner: string, size = 256) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  r.addColorStop(0, inner);
  r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

type Ring = {
  band: THREE.MeshPhysicalMaterial;
  gemMat: THREE.MeshPhysicalMaterial;
  gem?: THREE.Mesh;
  gemScale: THREE.Vector3;
  group: THREE.Group;
  prongs: THREE.Group;
  glints: THREE.Sprite[];
  engraving: { ctx: CanvasRenderingContext2D; tex: THREE.CanvasTexture };
  popAt: number;
};

type View = "spin" | "close" | "inside";

export function PhloiSite() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<Stage3D | null>(null);
  const drag = useDrag3D(stage);
  const ring = useRef<Ring | null>(null);
  const priceEl = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);
  /** carat for the frame loop */
  const ctNow = useRef(1);
  const [metal, setMetal] = useState(metals[0]);
  const [stone, setStone] = useState(stones[0]);
  const [cut, setCut] = useState(cuts[0]);
  const [ct, setCt] = useState(1);
  const [size, setSize] = useState(52);
  const [engrave, setEngrave] = useState("");
  const [view, setView] = useState<View>("spin");
  const [drawer, setDrawer] = useState(false);
  const [sent, setSent] = useState(false);
  const price = Math.round((metal.base + stone.perCt * ct * cut.k) / 100) * 100;

  useEffect(() => {
    if (!canvas.current) return;
    const s = new Stage3D(canvas.current, "#0b0d11", 0.02);
    // the canvas is fixed on large screens, so stop drawing once the ring section has scrolled away
    const section = canvas.current.closest("section");
    if (section) s.watch(section);
    s.scene.environment = studio(s.renderer);
    s.renderer.toneMappingExposure = 1.05;
    s.tilt = 0.32;
    s.autoSpin = 0.0035;
    s.zoom = 1.8;

    // soft spotlight behind the ring and a pool of light under it
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: radial("rgba(120,104,82,0.55)"), transparent: true, depthWrite: false }));
    halo.position.set(0, 0.4, -3.5);
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial({ map: radial("rgba(150,130,100,0.35)"), transparent: true, depthWrite: false }));
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = -1.45;
    s.scene.add(halo, pool);

    const group = new THREE.Group();
    const band = new THREE.MeshPhysicalMaterial({ color: metals[0].color, metalness: 1, roughness: 0.12, clearcoat: 0.4, clearcoatRoughness: 0.08, envMapIntensity: 1.4 });
    const torus = new THREE.Mesh(new THREE.TorusGeometry(1, 0.1, 64, 260), band);
    torus.scale.set(1, 1, 1.9);
    const prongs = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.05, 0.55, 16), band);
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      p.position.set(Math.cos(a) * 0.3, 1.25, Math.sin(a) * 0.3);
      p.rotation.set(Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25);
      prongs.add(p);
    }
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.14, 0.22, 48), band);
    seat.position.y = 1.08;
    const gemMat = new THREE.MeshPhysicalMaterial({ color: stones[0].color, transmission: 1, ior: 1.77, thickness: 0.8, roughness: 0, dispersion: window.matchMedia("(pointer: coarse)").matches ? 2 : 5, specularIntensity: 1, envMapIntensity: 4, flatShading: true, attenuationColor: new THREE.Color(stones[0].color), attenuationDistance: 1.4, emissive: new THREE.Color(stones[0].color), emissiveIntensity: 0.28 });

    // engraving on the inside of the band
    const ec = document.createElement("canvas");
    ec.width = 2048;
    ec.height = 128;
    const tex = new THREE.CanvasTexture(ec);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const inner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.897, 0.897, 0.17, 200, 1, true),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.BackSide, depthWrite: false }),
    );
    inner.rotation.x = Math.PI / 2;
    const innerWrap = new THREE.Group();
    innerWrap.add(inner);
    innerWrap.rotation.z = Math.PI;

    // little star glints that flash on the stone
    const gt = glintTexture();
    const glints = Array.from({ length: 7 }, (_, i) => {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: gt, blending: THREE.AdditiveBlending, transparent: true, depthTest: false, opacity: 0 }));
      sp.userData = { phase: i * 1.7, speed: 0.9 + (i % 3) * 0.35, a: (i / 7) * Math.PI * 2, r: 0.12 + (i % 3) * 0.1, y: 1.5 + (i % 2) * 0.05 };
      return sp;
    });

    group.add(torus, seat, prongs, innerWrap, ...glints);
    s.turn.add(group);
    s.scene.add(new THREE.AmbientLight("#ffffff", 0.15));

    const start = performance.now() / 1000;
    const r: Ring = { band, gemMat, group, prongs, glints, gemScale: new THREE.Vector3(1, 1, 1), engraving: { ctx: ec.getContext("2d")!, tex }, popAt: -10 };
    s.onFrame = (t) => {
      const k = Math.min(1, (t - start) / 2.2);
      const e = 1 - Math.pow(1 - k, 3);
      group.position.y = -0.1 - (1 - e) * 1.4;
      group.rotation.x = (1 - e) * 0.7;
      const since = t - r.popAt;
      const pop = since < 1.2 ? 1 + 0.14 * Math.exp(-since * 5) * Math.sin(since * 16) : 1;
      if (r.gem) r.gem.scale.copy(r.gemScale).multiplyScalar(pop);
      const burst = since < 0.9 ? 1 - since / 0.9 : 0;
      for (const g of r.glints) {
        const d = g.userData;
        const tw = Math.pow(Math.max(0, Math.sin(t * d.speed * 2.2 + d.phase)), 18);
        const o = Math.min(1, tw + burst) * (k > 0.6 ? 1 : 0);
        (g.material as THREE.SpriteMaterial).opacity = o;
        const sc = (0.22 + o * 0.3) * (r.gemScale.x || 1);
        g.scale.set(sc, sc, 1);
        g.position.set(Math.cos(d.a + t * 0.05) * d.r * r.gemScale.x, d.y + 0.06 * (ctNow.current - 1), Math.sin(d.a + t * 0.05) * d.r * r.gemScale.z);
      }
    };
    stage.current = s;
    ring.current = r;
    const id = window.setTimeout(() => (s.zoom = 1), 150);
    return () => {
      window.clearTimeout(id);
      s.dispose();
    };
  }, []);

  // Rebuild the stone when cut or carat changes
  useEffect(() => {
    const r = ring.current;
    if (!r) return;
    if (r.gem) {
      r.group.remove(r.gem);
      r.gem.geometry.dispose();
    }
    const prof = [
      [0.001, -0.44],
      [0.2, -0.24],
      [0.4, -0.03],
      [0.41, 0],
      [0.41, 0.03],
      [0.34, 0.1],
      [0.24, 0.155],
      [0.001, 0.155],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const gem = new THREE.Mesh(new THREE.LatheGeometry(prof, cut.seg), r.gemMat);
    const sc = 0.62 + ct * 0.38;
    r.gemScale.set(sc * cut.sx, sc, sc * cut.sz);
    gem.scale.copy(r.gemScale);
    gem.position.y = 1.36 + 0.06 * ct;
    r.group.add(gem);
    r.gem = gem;
    r.prongs.scale.set(sc * cut.sx, 1 + (ct - 1) * 0.15, sc * cut.sz);
    r.popAt = performance.now() / 1000;
    ctNow.current = ct;
  }, [cut, ct]);

  useEffect(() => {
    const r = ring.current;
    if (!r) return;
    r.band.color.set(metal.color);
    r.gemMat.color.set(stone.color);
    r.gemMat.attenuationColor.set(stone.color);
    r.gemMat.attenuationDistance = stone.id === "diamond" ? 10 : 1.4;
    r.gemMat.emissive.set(stone.color);
    r.gemMat.emissiveIntensity = stone.id === "diamond" ? 0.06 : 0.3;
    r.gemMat.ior = stone.id === "diamond" ? 2.42 : 1.77;
    r.popAt = performance.now() / 1000;
  }, [metal, stone]);

  // Engraving drawn onto the inside of the band
  useEffect(() => {
    const r = ring.current;
    if (!r) return;
    const { ctx, tex } = r.engraving;
    ctx.clearRect(0, 0, 2048, 128);
    ctx.save();
    // the band is seen from inside, so the text is drawn flipped
    ctx.translate(1024, 128);
    ctx.scale(1.15, -1);
    ctx.font = '600 104px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = metal.engrave;
    ctx.letterSpacing = "4px";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 3;
    ctx.fillText(engrave, 0, 58);
    ctx.restore();
    tex.needsUpdate = true;
  }, [engrave, metal]);

  // Camera views: slow spin, close on the stone, or looking into the band
  useEffect(() => {
    const s = stage.current;
    if (!s) return;
    const place = () => {
      const wide = window.innerWidth >= 1024;
      s.shiftTarget = wide && view === "spin" ? -1.15 : wide ? -0.9 : 0;
      s.dist = wide ? 8.4 : 7.6;
      if (view === "spin") {
        s.aim = null;
        s.tilt = 0.32;
        s.zoom = 1;
        // on phones the header sits over the canvas, so keep the stone clear of it
        s.lookTarget.set(0, wide ? 0 : 0.45, 0);
      } else if (view === "close") {
        s.aim = null;
        s.tilt = 0.22;
        s.zoom = 0.42;
        s.lookTarget.set(0, 1.35, 0);
      } else {
        s.aim = 0;
        s.tilt = 1.05;
        s.zoom = 0.5;
        s.lookTarget.set(0, -0.8, 0);
      }
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [view]);

  // Price counts to its new value
  useEffect(() => {
    const from = shown.current || price;
    const c = animate(from, price, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        shown.current = v;
        if (priceEl.current) priceEl.current.textContent = `฿${fmt.format(Math.round(v / 100) * 100)}`;
      },
    });
    return () => c.stop();
  }, [price]);

  const opt = (sel: boolean) =>
    `border px-3.5 py-2.5 text-[14px] transition-[border-color,background-color,color] duration-300 ${sel ? "border-ink/80 bg-ink/[0.08] text-ink" : "border-ink/15 text-ink/70 hover:border-ink/40 hover:text-ink"}`;

  return (
    <div>
      {/* opening: the room is dark, then the ring rises into the light */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-bg"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.1, delay: 0.9, ease }}
      >
        <motion.span
          className="font-display text-[clamp(2rem,4vw,3rem)] tracking-[0.6em] [margin-right:-0.6em]"
          initial={{ opacity: 0, letterSpacing: "0.3em" }}
          animate={{ opacity: [0, 1, 1, 0], letterSpacing: "0.6em" }}
          transition={{ duration: 1.8, times: [0, 0.35, 0.7, 1], ease }}
        >
          PHLOI
        </motion.span>
      </motion.div>

      <header className="fixed inset-x-0 top-0 z-30 grid h-16 grid-cols-[1fr_auto_1fr] items-center bg-gradient-to-b from-bg/90 to-transparent px-[var(--gutter)] text-[13px] tracking-[0.04em]">
        <nav className="hidden gap-7 md:flex" aria-label="Main">
          <a href="#ring" className="opacity-70 hover:opacity-100">The ring</a>
          <a href="#stones" className="opacity-70 hover:opacity-100">Stones</a>
          <a href="#visit" className="opacity-70 hover:opacity-100">Visit</a>
        </nav>
        <span className="col-start-2 font-display text-[28px] tracking-[0.5em] [margin-right:-0.5em]">PHLOI</span>
        <button type="button" onClick={() => setDrawer(true)} className="justify-self-end whitespace-nowrap border border-ink/25 px-3 py-2 transition-colors hover:border-ink sm:px-4">
          <span className="sm:hidden">Book</span>
          <span className="hidden sm:inline">Book a viewing</span>
        </button>
      </header>

      <section id="ring" className="relative lg:grid lg:min-h-[100svh] lg:grid-cols-[1.4fr_1fr]">
        <div className="sticky top-0 z-20 h-[46svh] touch-pan-y bg-bg lg:relative lg:z-0 lg:h-auto lg:bg-transparent" data-cursor="Turn" {...drag}>
          <canvas ref={canvas} className="absolute inset-0 h-full w-full lg:fixed lg:inset-auto lg:left-0 lg:top-0 lg:h-[100svh] lg:w-full" role="img" aria-label={`${stone.name} ring in ${metal.name.toLowerCase()}`} />
          <div className="pointer-events-none absolute bottom-8 left-[var(--gutter)] hidden lg:block">
            <SplitLines lines={["Thai stones,", "set by hand"]} delay={1.4} className="font-display text-[clamp(3rem,5.5vw,5.6rem)] leading-[0.95]" />
          </div>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2 lg:bottom-10 lg:justify-end lg:pr-10">
            {(
              [
                ["spin", "Turn"],
                ["close", "Look closer"],
                ["inside", "Inside the band"],
              ] as [View, string][]
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors ${view === v ? "border-ink/70 bg-ink text-bg" : "border-ink/20 bg-bg/70 text-ink/80 hover:border-ink/50"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <aside className="relative z-0 flex flex-col lg:z-10 justify-center bg-bg px-[var(--gutter)] pb-14 pt-8 lg:bg-transparent lg:py-24 lg:pr-[5vw]">
          <AnimatePresence mode="wait">
            <motion.div key={stone.id + metal.id} initial={{ opacity: 0, y: 14, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5, ease }}>
              <p className="text-[13px] text-muted">{stone.from}</p>
              <h1 className="mt-2 font-display text-[clamp(2.6rem,4.4vw,4.2rem)] leading-none">{stone.name} solitaire</h1>
              <p className="mt-2 text-[15px] text-muted">in {metal.name.toLowerCase()}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 grid gap-6">
            <Group label="Stone">
              {stones.map((x) => (
                <button key={x.id} type="button" onClick={() => setStone(x)} aria-pressed={stone.id === x.id} className={`${opt(stone.id === x.id)} flex items-center gap-2`}>
                  <GemIcon color={x.color} className="size-4" />
                  {x.name}
                </button>
              ))}
            </Group>
            <Group label="Metal">
              {metals.map((m) => (
                <button key={m.id} type="button" onClick={() => setMetal(m)} aria-pressed={metal.id === m.id} className={`${opt(metal.id === m.id)} flex items-center gap-2`}>
                  <span className="size-3 rounded-full" style={{ background: `linear-gradient(135deg, #fff8, ${m.color} 45%, ${m.color})` }} />
                  {m.name}
                </button>
              ))}
            </Group>
            <div className="grid gap-6 sm:grid-cols-2">
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
                    {c.toFixed(1)}
                  </button>
                ))}
              </Group>
            </div>
            <div className="grid grid-cols-[auto_1fr] items-end gap-5">
              <label className="grid gap-2 text-[13px] text-muted">
                Size
                <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="border border-ink/15 bg-bg px-3 py-2.5 text-[14px] text-ink">
                  {Array.from({ length: 13 }, (_, i) => 46 + i).map((n) => (
                    <option key={n} value={n}>
                      Thai {n}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-[13px] text-muted">
                Engraving inside the band
                <input
                  value={engrave}
                  onFocus={() => setView("inside")}
                  onChange={(e) => {
                    setEngrave(e.target.value.slice(0, 18));
                    setView("inside");
                  }}
                  placeholder="A date or a name"
                  className="border-b border-ink/25 bg-transparent py-2.5 font-display text-[19px] tracking-[0.06em] text-ink outline-none placeholder:font-body placeholder:text-[14px] placeholder:tracking-normal placeholder:text-muted focus:border-ink"
                />
              </label>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-5 border-t border-ink/10 pt-6">
            <span ref={priceEl} className="tabular text-[1.7rem] font-light tracking-[0.02em]">
              ฿{fmt.format(price)}
            </span>
            <button type="button" onClick={() => setDrawer(true)} className="flex-1 bg-ink py-4 text-[14px] tracking-[0.08em] text-bg transition-opacity hover:opacity-85">
              Reserve to try on
            </button>
          </div>
          <p className="mt-3 text-[13px] text-muted">Made to order in Bangkok in three weeks. Every stone comes with a GIT certificate.</p>
        </aside>
      </section>

      <section id="stones" className="relative z-10 bg-bg px-[var(--gutter)] py-[16vh]">
        <SplitLines as="h2" inView lines={["Four stones,", "where they come from"]} className="font-display text-[clamp(2.6rem,5.4vw,5.4rem)] leading-[0.95]" />
        <div className="mt-16 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {stones.map((x, i) => (
            <FadeUp key={x.id} delay={i * 0.08} className="bg-bg">
              <button
                type="button"
                onClick={() => {
                  setStone(x);
                  setView("close");
                  window.__lenis?.scrollTo(0);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group relative flex h-full w-full flex-col overflow-hidden p-6 text-left sm:p-8"
              >
                <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-40" style={{ background: x.color }} />
                <GemIcon color={x.color} className="relative size-16 transition-transform duration-700 ease-out group-hover:rotate-[22.5deg] group-hover:scale-110" />
                <span className="relative mt-10 font-display text-[2.4rem] leading-none">{x.name}</span>
                <span className="relative mt-2 text-[13px] text-muted">{x.from}</span>
                <span className="relative mt-5 text-[15px] leading-relaxed text-muted">{x.story}</span>
                <span className="relative mt-auto pt-8 text-[13px] underline underline-offset-4">See it on the ring</span>
              </button>
            </FadeUp>
          ))}
        </div>
      </section>

      <section id="visit" className="relative z-10 grid gap-12 border-t border-ink/10 bg-bg px-[var(--gutter)] py-[14vh] lg:grid-cols-2">
        <h2 className="font-display text-[clamp(2.6rem,5vw,5rem)] leading-[0.95]">A private room on Silom Road</h2>
        <div className="self-end">
          <p className="max-w-[44ch] text-[16px] leading-relaxed text-ink/75">Try the ring you built with a stone from our safe, loose, before it is set. Forty-five minutes, by appointment, tea included.</p>
          <ul className="mt-8 max-w-[44ch] divide-y divide-ink/10 border-y border-ink/10 text-[15px] text-ink/80">
            <li className="py-3">A GIT certificate for every stone</li>
            <li className="py-3">Free resizing in the first year</li>
            <li className="py-3">Cleaning and a prong check whenever you visit</li>
          </ul>
          <button type="button" onClick={() => setDrawer(true)} className="mt-8 border border-ink/40 px-6 py-3.5 text-[14px] tracking-[0.08em] transition-colors hover:border-ink">
            Book a viewing
          </button>
        </div>
      </section>
      <footer className="relative z-10 flex flex-col justify-between gap-3 border-t border-ink/10 bg-bg px-[var(--gutter)] pb-24 pt-6 text-[12.5px] text-muted sm:flex-row sm:pb-8">
        <span>PHLOI, 9 Silom Road, Bang Rak. Tuesday to Saturday, 11:00 to 19:00</span>
        <span>© 2026 PHLOI</span>
      </footer>

      <Drawer open={drawer} onClose={() => { setDrawer(false); setSent(false); }} title="Book a private viewing">
        {sent ? (
          <p className="py-8 font-display text-[2rem] leading-tight">We will call you to confirm the time. Your design is saved with the booking.</p>
        ) : (
          <form className="grid gap-5" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="flex items-center gap-4 bg-soft p-4 text-[14px]">
              <GemIcon color={stone.color} className="size-10 shrink-0" />
              <div>
                <p className="font-display text-[1.5rem]">{stone.name} solitaire</p>
                <p className="text-muted">{metal.name}, {cut.name.toLowerCase()} {ct.toFixed(1)} ct, Thai size {size}{engrave && `, engraved "${engrave}"`}</p>
                <p className="tabular mt-1">฿{fmt.format(price)}</p>
              </div>
            </div>
            {[["Name", "text"], ["Phone", "tel"], ["Preferred date", "date"]].map(([l, t]) => (
              <label key={l} className="grid gap-1.5 text-[13px] text-muted">
                {l}
                <input required type={t} className="border-b border-line bg-transparent py-2 text-[16px] text-ink outline-none focus:border-ink" />
              </label>
            ))}
            <button className="mt-2 bg-ink py-4 text-[14px] tracking-[0.08em] text-bg">Request appointment</button>
          </form>
        )}
      </Drawer>
    </div>
  );
}

/** A round brilliant seen from above. */
function GemIcon({ color, className = "" }: { color: string; className?: string }) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 8;
    return [50 + Math.cos(a) * 46, 50 + Math.sin(a) * 46, 50 + Math.cos(a + Math.PI / 8) * 26, 50 + Math.sin(a + Math.PI / 8) * 26];
  });
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <polygon points={pts.map(([x, y]) => `${x},${y}`).join(" ")} fill={color} />
      {pts.map(([x, y, tx, ty], i) => {
        const [nx, ny] = pts[(i + 1) % 8];
        return <polygon key={i} points={`${x},${y} ${nx},${ny} ${tx},${ty}`} fill="#fff" opacity={[0.35, 0.08, 0.22, 0.04, 0.3, 0.12, 0.18, 0.02][i]} />;
      })}
      <polygon points={pts.map(([, , tx, ty]) => `${tx},${ty}`).join(" ")} fill={color} />
      <polygon points={pts.map(([, , tx, ty]) => `${tx},${ty}`).join(" ")} fill="#fff" opacity="0.18" />
      <polygon points={pts.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
    </svg>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-[13px] text-muted">{label}</legend>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </fieldset>
  );
}

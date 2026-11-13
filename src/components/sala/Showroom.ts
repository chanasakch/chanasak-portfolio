import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { contactShadow, disposeScene, gltfLoader, materialsOf, readVariants, type Variants } from "@/components/shared/gltf";
import { Quality } from "@/components/shared/quality";

export type PieceSpec = { id: string; file: string; plinth?: number; rot: number };

type Item = {
  spec: PieceSpec;
  root: THREE.Group;
  turn: THREE.Group;
  model: THREE.Object3D;
  variants: Variants;
  mats: THREE.Material[];
  hashable: THREE.Material[];
  hashed: boolean;
  /** model size without the plinth */
  body: THREE.Vector3;
  size: THREE.Vector3;
  foot: number;
  x: number;
  xTarget: number;
  shown: boolean;
  fade: number;
  hover: number;
  spin: number;
  spinVel: number;
  delay: number;
};

const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt));
const GAP = 0.75;
const FOV = 26;
const TAU = Math.PI * 2;

/** day and evening, blended by one number */
const moods = {
  bg: [new THREE.Color("#ecebe7"), new THREE.Color("#d3cbc0")],
  key: [new THREE.Color("#fff8ee"), new THREE.Color("#ffb877")],
};

/**
 * A white gallery floor with the collection standing in one long row.
 * Scroll or drag to walk along it; pick a piece and the rest dissolve while
 * the camera comes in close and the piece turns. Pieces can be measured
 * against a wall gap, and the room can be lit for day or evening.
 */
export class Showroom {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 60);
  items: Item[] = [];
  focus = -1;
  camX = 0;
  camXTarget = 0;
  onHover?: (id: string | null) => void;
  onIndex?: (i: number) => void;
  onFrame?: () => void;
  private cam = { x: 0, y: 3, z: 14, lx: 0, ly: 0.45 };
  private ray = new THREE.Raycaster();
  private ptr = new THREE.Vector2(9, 9);
  private ptrDirty = false;
  private hovered = -1;
  private raf = 0;
  private last = performance.now();
  private lastDraw = 0;
  private drew = false;
  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private visible = true;
  private key: THREE.DirectionalLight;
  private fill: THREE.DirectionalLight;
  private bulb: THREE.PointLight;
  private glow: THREE.Sprite;
  private reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  private coarse = window.matchMedia("(pointer: coarse)").matches;
  private quality: Quality;
  private settle = 0;
  private panFrom = 0;
  private lastIndex = -1;
  private w = 1;
  private h = 1;
  private dirty = 2;
  private started = 0;
  private mood = 0;
  private moodTarget = 0;
  private bgColor = new THREE.Color();
  // measuring
  measuring = false;
  private space = 0;
  private spaceShow = 0;
  private rulers = new THREE.Group();
  private walls: THREE.Mesh[] = [];
  private wallMat = new THREE.MeshBasicMaterial({ color: "#191918", transparent: true, opacity: 0, depthWrite: false });
  private anchors: THREE.Vector3[] = [];

  constructor(private canvas: HTMLCanvasElement) {
    const r = (this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" }));
    this.quality = new Quality(r, { mobile: 1.5 });
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    // phones get soft blob shadows only; the shadow map is the most expensive pass here
    r.shadowMap.enabled = !this.coarse;
    r.shadowMap.type = THREE.PCFShadowMap;
    this.scene.background = this.bgColor.copy(moods.bg[0]);
    const pm = new THREE.PMREMGenerator(r);
    this.scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    this.scene.environmentIntensity = 0.85;

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 40), new THREE.ShadowMaterial({ opacity: 0.09 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const key = (this.key = new THREE.DirectionalLight("#fff8ee", 1.6));
    key.position.set(-2.5, 5, 3.5);
    key.castShadow = !this.coarse;
    key.shadow.mapSize.set(2048, 2048);
    const sc = key.shadow.camera;
    sc.left = -4;
    sc.right = 4;
    sc.top = 4;
    sc.bottom = -4;
    sc.near = 0.5;
    sc.far = 14;
    key.shadow.radius = 7;
    key.shadow.blurSamples = 12;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    this.scene.add(key, key.target);
    this.fill = new THREE.DirectionalLight("#e8eeff", 0.35);
    this.fill.position.set(4, 2, 2);
    this.scene.add(this.fill);

    // the table lamp's bulb, lit in the evening
    this.bulb = new THREE.PointLight("#ffb46b", 0, 3.2, 1.6);
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, "rgba(255,214,160,1)");
    rg.addColorStop(0.35, "rgba(255,180,110,0.45)");
    rg.addColorStop(1, "rgba(255,160,90,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, 64, 64);
    this.glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, opacity: 0, blending: THREE.AdditiveBlending }));
    this.glow.scale.setScalar(0.7);
    this.scene.add(this.bulb, this.glow);

    // rulers and the two walls of the gap you are measuring for
    this.rulers.visible = false;
    this.rulers.renderOrder = 10;
    for (let i = 0; i < 2; i++) {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(0.03, 1), this.wallMat);
      w.visible = false;
      this.walls.push(w);
      this.scene.add(w);
    }

    this.ro = new ResizeObserver(this.resize);
    this.ro.observe(canvas);
    this.io = new IntersectionObserver(([e]) => (this.visible = e.isIntersecting));
    this.io.observe(canvas);
    this.resize();
    this.loop();
  }

  async load(specs: PieceSpec[], onProgress?: (n: number) => void) {
    let done = 0;
    const loaded = await Promise.all(
      specs.map(async (spec) => {
        const gltf = await gltfLoader().loadAsync(spec.file);
        onProgress?.(++done / specs.length);
        return { spec, gltf };
      }),
    );
    for (const { spec, gltf } of loaded) {
      const variants = await readVariants(gltf);
      const model = gltf.scene;
      // collect every material any variant can show, so fades reach all of them
      const all = new Set<THREE.Material>();
      for (let i = 0; i < Math.max(1, variants.names.length); i++) {
        variants.apply(i);
        materialsOf(model).forEach((m) => all.add(m));
      }
      variants.apply(0);
      for (const m of all) {
        const p = m as THREE.MeshPhysicalMaterial;
        if (this.coarse && p.transmission > 0) {
          // phones draw glass as plain see-through instead of a second refraction pass
          p.transmission = 0;
          p.transparent = true;
          p.depthWrite = false;
          p.userData.base = 0.32;
          p.roughness = Math.min(p.roughness, 0.08);
          p.metalness = 0;
          p.needsUpdate = true;
        }
      }
      model.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.castShadow = !this.coarse;
          m.receiveShadow = !this.coarse;
        }
      });
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const ctr = box.getCenter(new THREE.Vector3());
      model.position.set(-ctr.x, -box.min.y, -ctr.z);
      const turn = new THREE.Group();
      turn.add(model);
      turn.rotation.y = spec.rot;
      const root = new THREE.Group();
      root.add(turn);
      const p = spec.plinth ?? 0;
      const foot = Math.max(size.x, size.z) + (p ? 0.22 : 0.05);
      if (p) {
        const mat = new THREE.MeshStandardMaterial({ color: "#f3f2ee", roughness: 0.92 });
        all.add(mat);
        const box = new THREE.Mesh(new THREE.BoxGeometry(foot, p, foot), mat);
        box.position.y = p / 2;
        box.castShadow = box.receiveShadow = !this.coarse;
        root.add(box);
        turn.position.y = p;
      }
      const shadow = contactShadow(size.x * 1.08 + (p ? 0.25 : 0), size.z * 1.2 + (p ? 0.25 : 0), p ? 0.22 : this.coarse ? 0.34 : 0.24);
      all.add(shadow.material as THREE.Material);
      root.add(shadow);
      if (p) {
        const top = contactShadow(size.x * 1.1, size.z * 1.1, 0.35);
        top.position.y = p + 0.002;
        all.add(top.material as THREE.Material);
        root.add(top);
      }
      // pieces dissolve with alpha hashing only while they fade, so a solid piece never dithers
      const hashable = [...all].filter((m) => !m.transparent);
      this.scene.add(root);
      this.items.push({
        spec,
        root,
        turn,
        model,
        variants,
        mats: [...all],
        hashable,
        hashed: false,
        body: size.clone(),
        size: new THREE.Vector3(size.x, size.y + p, size.z),
        foot,
        x: 0,
        xTarget: 0,
        shown: true,
        fade: 0,
        hover: 0,
        spin: 0,
        spinVel: 0,
        delay: 0,
      });
    }
    this.layout(true);
    this.camX = this.camXTarget = this.items[0]?.x ?? 0;
    // warm both shader versions now so the first fade does not stall
    for (const it of this.items) this.setHash(it, true);
    await this.renderer.compileAsync(this.scene, this.camera);
    for (const it of this.items) this.setHash(it, false);
    await this.renderer.compileAsync(this.scene, this.camera);
  }

  /** Start the opening move: the camera comes down to the row while the pieces arrive one by one. */
  begin(at: number) {
    const s = this.shownItems();
    const it = s[at];
    if (!it) return;
    this.camX = this.camXTarget = it.xTarget;
    this.cam.x = it.xTarget - 1.2;
    this.cam.lx = it.xTarget - 0.6;
    this.cam.y = this.reduce ? 1.4 : 3.4;
    this.cam.z = this.reduce ? 8 : 13;
    this.started = performance.now();
    s.forEach((x) => (x.delay = this.reduce ? 0 : 0.12 + Math.abs(x.xTarget - it.xTarget) * 0.16));
    this.dirty = 2;
  }

  /** Show only these ids; the row closes up around them. */
  filter(ids: string[] | null) {
    for (const it of this.items) it.shown = !ids || ids.includes(it.spec.id);
    this.layout(false);
    const first = this.items.find((i) => i.shown);
    if (first) this.camXTarget = first.xTarget;
    this.dirty = 2;
  }

  private layout(snap: boolean) {
    let x = 0;
    let prev: Item | null = null;
    for (const it of this.items) {
      if (!it.shown) {
        it.xTarget = prev ? prev.xTarget : x;
        continue;
      }
      if (prev) x += prev.foot / 2 + GAP + it.foot / 2;
      it.xTarget = x;
      if (snap) it.x = x;
      prev = it;
    }
  }

  private setHash(it: Item, on: boolean) {
    if (it.hashed === on) return;
    it.hashed = on;
    for (const m of it.hashable) {
      m.alphaHash = on;
      m.needsUpdate = true;
    }
  }

  private shownItems() {
    return this.items.filter((i) => i.shown);
  }

  /** index among the shown pieces nearest the middle of the screen */
  current() {
    const s = this.shownItems();
    let best = 0;
    s.forEach((it, i) => {
      if (Math.abs(it.xTarget - this.camXTarget) < Math.abs(s[best].xTarget - this.camXTarget)) best = i;
    });
    return best;
  }

  goTo(i: number) {
    const s = this.shownItems();
    const it = s[Math.max(0, Math.min(s.length - 1, i))];
    if (!it) return;
    if (this.focus >= 0) this.open(it.spec.id);
    else this.camXTarget = it.xTarget;
    this.dirty = 2;
  }

  pan(dx: number) {
    if (this.focus >= 0) return;
    const s = this.shownItems();
    if (!s.length) return;
    if (this.settle <= 0) this.panFrom = s[this.current()].xTarget;
    this.camXTarget = Math.max(s[0].xTarget - 0.6, Math.min(s[s.length - 1].xTarget + 0.6, this.camXTarget + dx));
    this.settle = 0.28;
    this.dirty = 2;
  }

  /** metres of floor per css pixel at the row, for dragging */
  metresPerPixel() {
    return this.visibleWidth(this.rowDist()) / this.w;
  }

  turnBy(d: number) {
    const it = this.items[this.focus];
    if (!it || this.measuring) return;
    it.spin += d;
    it.spinVel = 0;
    this.dirty = 2;
  }

  /** let go after a drag: the piece carries on turning for a moment */
  release(v: number) {
    const it = this.items[this.focus];
    if (!it || this.measuring) return;
    it.spinVel = Math.max(-0.12, Math.min(0.12, v));
  }

  open(id: string) {
    const i = this.items.findIndex((x) => x.spec.id === id);
    if (i < 0) return;
    if (this.focus >= 0 && this.focus !== i) this.items[this.focus].spinVel = 0;
    this.focus = i;
    this.camXTarget = this.items[i].xTarget;
    if (this.measuring) this.buildRulers();
    this.dirty = 2;
  }

  close() {
    this.focus = -1;
    this.settle = 0;
    this.setMeasure(false);
    this.dirty = 2;
  }

  setVariant(id: string, v: number) {
    this.items.find((x) => x.spec.id === id)?.variants.apply(v);
    this.dirty = 2;
  }

  /** 0 for daylight, 1 for evening with the lamp on */
  setMood(m: number) {
    this.moodTarget = m;
    this.dirty = 2;
  }

  /** Show width, depth and height on the open piece and, if given, the gap it has to fit in (cm). */
  setMeasure(on: boolean, gapCm = 0) {
    this.measuring = on;
    this.space = on ? gapCm / 100 : 0;
    if (on) this.buildRulers();
    this.rulers.visible = on;
    this.dirty = 2;
  }

  /** where the three measurement labels sit on screen; null while not measuring */
  labels() {
    const it = this.items[this.focus];
    if (!this.measuring || !it || !this.anchors.length) return null;
    return this.anchors.map((a) => {
      const v = a.clone();
      it.turn.localToWorld(v);
      v.project(this.camera);
      return { x: (v.x * 0.5 + 0.5) * this.w, y: (-v.y * 0.5 + 0.5) * this.h };
    });
  }

  private buildRulers() {
    const it = this.items[this.focus];
    if (!it) return;
    this.rulers.removeFromParent();
    this.rulers.traverse((o) => (o as THREE.LineSegments).geometry?.dispose());
    this.rulers.clear();
    const { x, y, z } = it.body;
    const hx = x / 2;
    const hz = z / 2;
    const o = Math.max(0.05, Math.min(0.12, Math.max(x, z) * 0.06));
    const t = o * 0.45;
    const pts: number[] = [];
    const seg = (a: number[], b: number[]) => pts.push(...a, ...b);
    // width along the front edge
    seg([-hx, 0.004, hz + o], [hx, 0.004, hz + o]);
    seg([-hx, 0.004, hz + o - t], [-hx, 0.004, hz + o + t]);
    seg([hx, 0.004, hz + o - t], [hx, 0.004, hz + o + t]);
    // depth along the right side
    seg([hx + o, 0.004, -hz], [hx + o, 0.004, hz]);
    seg([hx + o - t, 0.004, -hz], [hx + o + t, 0.004, -hz]);
    seg([hx + o - t, 0.004, hz], [hx + o + t, 0.004, hz]);
    // height at the back left corner
    seg([-hx - o, 0, -hz], [-hx - o, y, -hz]);
    seg([-hx - o - t, 0, -hz], [-hx - o + t, 0, -hz]);
    seg([-hx - o - t, y, -hz], [-hx - o + t, y, -hz]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: "#191918", transparent: true, opacity: 0.9, depthTest: false }));
    lines.renderOrder = 10;
    this.rulers.add(lines);
    it.turn.add(this.rulers);
    this.rulers.visible = this.measuring;
    this.anchors = [new THREE.Vector3(0, 0, hz + o * 2.2), new THREE.Vector3(hx + o * 2.2, 0, 0), new THREE.Vector3(-hx - o * 1.6, y / 2, -hz)];
  }

  setPointer(x: number, y: number) {
    this.ptr.set((x / this.w) * 2 - 1, -(y / this.h) * 2 + 1);
    this.ptrDirty = true;
  }

  clearPointer() {
    this.ptr.set(9, 9);
    this.ptrDirty = true;
  }

  /** the piece under the pointer, if any */
  pick(x: number, y: number) {
    this.ray.setFromCamera(new THREE.Vector2((x / this.w) * 2 - 1, -(y / this.h) * 2 + 1), this.camera);
    const hits = this.ray.intersectObjects(
      this.items.filter((i) => i.shown && i.fade > 0.5).map((i) => i.root),
      true,
    );
    if (!hits.length) return null;
    let o: THREE.Object3D | null = hits[0].object;
    while (o && !this.items.some((i) => i.root === o)) o = o.parent;
    return this.items.find((i) => i.root === o)?.spec.id ?? null;
  }

  /** where a piece's foot sits on screen, in css pixels */
  screenOf(id: string) {
    const it = this.items.find((x) => x.spec.id === id);
    if (!it) return null;
    const v = new THREE.Vector3(it.x, 0, it.foot / 2).project(this.camera);
    return { x: (v.x * 0.5 + 0.5) * this.w, y: (-v.y * 0.5 + 0.5) * this.h };
  }

  private resize = () => {
    this.w = this.canvas.clientWidth || 1;
    this.h = this.canvas.clientHeight || 1;
    this.renderer.setSize(this.w, this.h, false);
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
    this.dirty = 2;
  };

  private visibleWidth(dist: number) {
    return 2 * dist * Math.tan(((FOV / 2) * Math.PI) / 180) * this.camera.aspect;
  }

  private rowDist() {
    // about 4.6 m of floor across a wide screen, 2.5 m on a phone held upright
    const want = this.camera.aspect < 0.8 ? 2.5 : this.camera.aspect < 1.2 ? 3.4 : 4.6;
    return want / 2 / (Math.tan(((FOV / 2) * Math.PI) / 180) * this.camera.aspect);
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    if (!this.visible || document.hidden) {
      this.drew = false;
      return;
    }
    const k = this.reduce ? 30 : 5.5;
    const portrait = this.camera.aspect < 0.8;
    let motion = 0;
    const ease = (a: number, b: number, kk: number) => {
      const v = damp(a, b, kk, dt);
      motion += Math.abs(v - a);
      return Math.abs(v - b) < 1e-5 ? b : v;
    };

    // snap to the nearest piece once a scroll has settled
    if (this.focus < 0 && this.settle > 0) {
      this.settle -= dt;
      motion += 1;
      if (this.settle <= 0) {
        const s = this.shownItems();
        let i = this.current();
        // a short nudge still moves one piece along, the way a wheel notch should
        const moved = this.camXTarget - this.panFrom;
        if (s[i] && s[i].xTarget === this.panFrom && Math.abs(moved) > 0.12) i = Math.max(0, Math.min(s.length - 1, i + Math.sign(moved)));
        if (s[i]) this.camXTarget = s[i].xTarget;
      }
    }
    this.camX = ease(this.camX, this.camXTarget, k);

    const f = this.items[this.focus];
    let tx: number, ty: number, tz: number, lx: number, ly: number;
    if (f) {
      const tan = Math.tan(((FOV / 2) * Math.PI) / 180);
      const a = this.camera.aspect;
      const s = f.size;
      const gap = this.measuring && this.space ? this.space + 0.2 : 0;
      const span = Math.max(s.x, s.z * 0.9, gap) * (this.measuring ? 1.18 : 1);
      // fit the piece in the part of the screen the panel leaves free
      const freeW = portrait ? 0.86 : 0.5;
      const freeH = portrait ? 0.4 : 0.72;
      const dist = Math.max(s.y / freeH / 2 / tan, span / freeW / 2 / (tan * a)) * 1.08;
      const visW = 2 * dist * tan * a;
      const visH = 2 * dist * tan;
      lx = f.x + (portrait ? 0 : visW * 0.17);
      ly = s.y * 0.5 - (portrait ? visH * 0.22 : 0);
      tx = lx;
      ty = ly + dist * (this.measuring ? 0.32 : 0.2);
      tz = dist;
    } else {
      const dist = this.rowDist();
      lx = this.camX;
      ly = portrait ? 0.62 : 0.55;
      tx = this.camX;
      ty = ly + dist * 0.17;
      tz = dist;
    }
    const intro = this.started ? Math.min(1, (now - this.started) / 2400) : 1;
    const kc = intro < 1 ? 2.2 : k;
    const c = this.cam;
    c.x = ease(c.x, tx, kc);
    c.y = ease(c.y, ty, kc);
    c.z = ease(c.z, tz, kc);
    c.lx = ease(c.lx, lx, kc);
    c.ly = ease(c.ly, ly, kc);
    this.camera.position.set(c.x, c.y, c.z);
    this.camera.lookAt(c.lx, c.ly, 0);

    // light: day or evening
    this.mood = ease(this.mood, this.moodTarget, 3);
    const m = this.mood;
    this.bgColor.copy(moods.bg[0]).lerp(moods.bg[1], m);
    this.key.color.copy(moods.key[0]).lerp(moods.key[1], m);
    this.key.intensity = 1.6 - m * 0.75;
    this.key.position.set(c.lx - 2.5 - m * 2.5, 5 - m * 3, 3.5 - m * 1);
    this.key.target.position.set(c.lx, 0, 0);
    this.fill.intensity = 0.35 - m * 0.25;
    this.scene.environmentIntensity = 0.85 - m * 0.45;
    this.renderer.toneMappingExposure = 1.05 - m * 0.12;
    const lamp = this.items.find((i) => i.spec.id === "lamp");
    if (lamp) {
      const y = (lamp.spec.plinth ?? 0) + lamp.body.y * 0.72;
      this.bulb.position.set(lamp.x, y, 0.05);
      this.glow.position.set(lamp.x, y, 0.08);
      this.bulb.intensity = m * 2.2 * lamp.fade;
      (this.glow.material as THREE.SpriteMaterial).opacity = m * 0.85 * lamp.fade;
      this.glow.visible = m > 0.01 && lamp.root.visible;
    }

    // hover
    if (this.ptrDirty && this.focus < 0 && !this.coarse) {
      this.ptrDirty = false;
      this.ray.setFromCamera(this.ptr, this.camera);
      const hits = this.ray.intersectObjects(
        this.items.filter((i) => i.shown).map((i) => i.root),
        true,
      );
      let o: THREE.Object3D | null = hits[0]?.object ?? null;
      while (o && !this.items.some((i) => i.root === o)) o = o.parent;
      const hi = this.items.findIndex((i) => i.root === o);
      if (hi !== this.hovered) {
        this.hovered = hi;
        this.onHover?.(hi >= 0 ? this.items[hi].spec.id : null);
      }
    } else if (this.focus >= 0 && this.hovered >= 0) {
      this.hovered = -1;
      this.onHover?.(null);
    }

    const t = now / 1000;
    const since = this.started ? (now - this.started) / 1000 : 99;
    const sway = !this.coarse && !this.reduce;
    this.items.forEach((it, i) => {
      it.x = ease(it.x, it.xTarget, 6);
      const arrived = since > it.delay;
      const want = arrived && it.shown && (this.focus < 0 || this.focus === i) ? 1 : 0;
      it.fade = ease(it.fade, want, want ? 3.5 : 7);
      if (Math.abs(it.fade - want) < 0.003) it.fade = want;
      it.root.visible = it.fade > 0.002;
      this.setHash(it, it.fade < 0.999);
      for (const m of it.mats) {
        const base = (m.userData.base as number | undefined) ?? 1;
        m.opacity = it.hashed || m.transparent ? it.fade * base : 1;
      }
      it.hover = ease(it.hover, this.hovered === i ? 1 : 0, 9);
      it.root.position.x = it.x;
      // pieces rise a little into place as they arrive
      it.root.position.y = (1 - it.fade) * (this.started && since < 4 ? -0.12 : 0);
      it.turn.position.y = (it.spec.plinth ?? 0) + it.hover * 0.025;
      if (this.focus === i) {
        if (this.measuring) {
          // square on to the wall gap
          it.spin = ease(it.spin, Math.round((it.spin + it.spec.rot) / TAU) * TAU - it.spec.rot, 5);
          it.spinVel = 0;
        } else {
          it.spinVel *= Math.pow(0.02, dt);
          it.spin += it.spinVel * dt * 60 + (this.reduce ? 0 : dt * 0.22);
          motion += 1;
        }
      } else {
        it.spin = ease(it.spin, Math.round(it.spin / TAU) * TAU, 4);
      }
      it.turn.rotation.y = it.spec.rot + it.spin + (this.focus === i || !sway ? 0 : Math.sin(t * 0.4 + i) * 0.03);
    });
    if (sway) motion += 1;

    // the gap you are measuring for, as two thin walls either side
    this.spaceShow = ease(this.spaceShow, this.measuring && this.space && f ? 1 : 0, 6);
    const tooSmall = f && this.space > 0 && this.space < f.body.x;
    this.wallMat.color.set(tooSmall ? "#b5432f" : "#191918");
    this.wallMat.opacity = this.spaceShow * 0.55;
    this.walls.forEach((w, i) => {
      w.visible = this.spaceShow > 0.01;
      if (!f) return;
      const hgt = Math.max(0.9, f.size.y * 1.25);
      w.scale.y = hgt;
      w.position.set(f.x + (i ? 1 : -1) * (this.space / 2 + 0.015), hgt / 2, 0);
    });

    const ci = this.focus >= 0 ? this.shownItems().indexOf(this.items[this.focus]) : this.current();
    if (ci !== this.lastIndex) {
      this.lastIndex = ci;
      this.onIndex?.(ci);
    }
    this.onFrame?.();

    // only draw when something on screen has changed
    if (motion < 1e-5 && this.dirty <= 0) {
      this.drew = false;
      return;
    }
    this.dirty--;
    // only back-to-back frames say anything about how fast this device draws
    if (this.drew) this.quality.frame(now - this.lastDraw);
    this.lastDraw = now;
    this.drew = true;
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.io.disconnect();
    disposeScene(this.scene);
    // fabrics not on show at the moment are not in the scene graph
    for (const it of this.items) for (const m of it.mats) m.dispose();
    this.wallMat.dispose();
    this.renderer.dispose();
  }
}

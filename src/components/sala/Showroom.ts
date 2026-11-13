import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { contactShadow, disposeScene, gltfLoader, materialsOf, readVariants, type Variants } from "@/components/shared/gltf";

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
  size: THREE.Vector3;
  foot: number;
  x: number;
  xTarget: number;
  shown: boolean;
  fade: number;
  hover: number;
  spin: number;
  spinVel: number;
};

const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt));
const GAP = 0.75;
const FOV = 26;

/**
 * A white gallery floor with the collection standing in one long row.
 * Scroll or drag to walk along it; pick a piece and the rest dissolve while
 * the camera comes in close and the piece turns.
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
  onSelect?: (id: string) => void;
  onFrame?: () => void;
  private cam = { x: 0, y: 1.4, z: 6, lx: 0, ly: 0.45 };
  private ray = new THREE.Raycaster();
  private ptr = new THREE.Vector2(9, 9);
  private ptrDirty = false;
  private hovered = -1;
  private raf = 0;
  private last = performance.now();
  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private visible = true;
  private key: THREE.DirectionalLight;
  private reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  private coarse = window.matchMedia("(pointer: coarse)").matches;
  private settle = 0;
  private panFrom = 0;
  private lastIndex = -1;
  private w = 1;
  private h = 1;

  constructor(private canvas: HTMLCanvasElement, bg: string) {
    const r = (this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" }));
    r.setPixelRatio(Math.min(window.devicePixelRatio, this.coarse ? 1.75 : 2));
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    if (this.coarse) r.transmissionResolutionScale = 0.5;
    this.scene.background = new THREE.Color(bg);
    const pm = new THREE.PMREMGenerator(r);
    this.scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.85;

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 40), new THREE.ShadowMaterial({ opacity: 0.09 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const key = (this.key = new THREE.DirectionalLight("#fff8ee", 1.6));
    key.position.set(-2.5, 5, 3.5);
    key.castShadow = true;
    key.shadow.mapSize.set(this.coarse ? 1024 : 2048, this.coarse ? 1024 : 2048);
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
    const fill = new THREE.DirectionalLight("#e8eeff", 0.35);
    fill.position.set(4, 2, 2);
    this.scene.add(fill);

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
      model.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.castShadow = true;
          m.receiveShadow = true;
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
        box.castShadow = box.receiveShadow = true;
        root.add(box);
        turn.position.y = p;
      }
      const shadow = contactShadow(size.x * 1.08 + (p ? 0.25 : 0), size.z * 1.2 + (p ? 0.25 : 0), p ? 0.22 : 0.24);
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
        size: new THREE.Vector3(size.x, size.y + p, size.z),
        foot,
        x: 0,
        xTarget: 0,
        shown: true,
        fade: 0,
        hover: 0,
        spin: 0,
        spinVel: 0,
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

  /** Show only these ids; the row closes up around them. */
  filter(ids: string[] | null) {
    for (const it of this.items) it.shown = !ids || ids.includes(it.spec.id);
    this.layout(false);
    const first = this.items.find((i) => i.shown);
    if (first) this.camXTarget = first.xTarget;
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
  }

  pan(dx: number) {
    if (this.focus >= 0) return;
    const s = this.shownItems();
    if (!s.length) return;
    if (this.settle <= 0) this.panFrom = s[this.current()].xTarget;
    this.camXTarget = Math.max(s[0].xTarget - 0.6, Math.min(s[s.length - 1].xTarget + 0.6, this.camXTarget + dx));
    this.settle = 0.28;
  }

  /** metres of floor per css pixel at the row, for dragging */
  metresPerPixel() {
    return this.visibleWidth(this.rowDist()) / this.w;
  }

  turnBy(d: number) {
    const it = this.items[this.focus];
    if (!it) return;
    it.spin += d;
    it.spinVel = d;
  }

  open(id: string) {
    const i = this.items.findIndex((x) => x.spec.id === id);
    if (i < 0) return;
    if (this.focus >= 0 && this.focus !== i) this.items[this.focus].spinVel = 0;
    this.focus = i;
    this.camXTarget = this.items[i].xTarget;
  }

  close() {
    this.focus = -1;
    this.settle = 0;
  }

  setVariant(id: string, v: number) {
    this.items.find((x) => x.spec.id === id)?.variants.apply(v);
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
    if (!this.visible || document.hidden) return;
    const k = this.reduce ? 30 : 5.5;
    const portrait = this.camera.aspect < 0.8;

    // snap to the nearest piece once a scroll has settled
    if (this.focus < 0 && this.settle > 0) {
      this.settle -= dt;
      if (this.settle <= 0) {
        const s = this.shownItems();
        let i = this.current();
        // a short nudge still moves one piece along, the way a wheel notch should
        const moved = this.camXTarget - this.panFrom;
        if (s[i] && s[i].xTarget === this.panFrom && Math.abs(moved) > 0.12) i = Math.max(0, Math.min(s.length - 1, i + Math.sign(moved)));
        if (s[i]) this.camXTarget = s[i].xTarget;
      }
    }
    this.camX = damp(this.camX, this.camXTarget, k, dt);

    const f = this.items[this.focus];
    let tx: number, ty: number, tz: number, lx: number, ly: number;
    if (f) {
      const tan = Math.tan(((FOV / 2) * Math.PI) / 180);
      const a = this.camera.aspect;
      const s = f.size;
      const span = Math.max(s.x, s.z * 0.9);
      // fit the piece in the part of the screen the panel leaves free
      const freeW = portrait ? 0.86 : 0.5;
      const freeH = portrait ? 0.4 : 0.72;
      const dist = Math.max(s.y / freeH / 2 / tan, span / freeW / 2 / (tan * a)) * 1.08;
      const visW = 2 * dist * tan * a;
      const visH = 2 * dist * tan;
      lx = f.x + (portrait ? 0 : visW * 0.17);
      ly = s.y * 0.5 - (portrait ? visH * 0.22 : 0);
      tx = lx;
      ty = ly + dist * 0.2;
      tz = dist;
    } else {
      const dist = this.rowDist();
      lx = this.camX;
      ly = portrait ? 0.62 : 0.55;
      tx = this.camX;
      ty = ly + dist * 0.17;
      tz = dist;
    }
    const c = this.cam;
    c.x = damp(c.x, tx, k, dt);
    c.y = damp(c.y, ty, k, dt);
    c.z = damp(c.z, tz, k, dt);
    c.lx = damp(c.lx, lx, k, dt);
    c.ly = damp(c.ly, ly, k, dt);
    this.camera.position.set(c.x, c.y, c.z);
    this.camera.lookAt(c.lx, c.ly, 0);
    this.key.position.set(c.lx - 2.5, 5, 3.5);
    this.key.target.position.set(c.lx, 0, 0);

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
    this.items.forEach((it, i) => {
      it.x = damp(it.x, it.xTarget, 6, dt);
      const want = it.shown && (this.focus < 0 || this.focus === i) ? 1 : 0;
      it.fade = damp(it.fade, want, want ? 4 : 7, dt);
      if (Math.abs(it.fade - want) < 0.003) it.fade = want;
      it.root.visible = it.fade > 0.002;
      this.setHash(it, it.fade < 0.999);
      for (const m of it.mats) m.opacity = it.hashed ? it.fade : (m as THREE.MeshBasicMaterial).transparent ? it.fade : 1;
      it.hover = damp(it.hover, this.hovered === i ? 1 : 0, 9, dt);
      it.root.position.x = it.x;
      it.root.position.y = 0;
      it.turn.position.y = (it.spec.plinth ?? 0) + it.hover * 0.025;
      if (this.focus === i) {
        it.spinVel *= Math.pow(0.04, dt);
        it.spin += this.reduce ? 0 : dt * 0.22;
      } else {
        it.spin = damp(it.spin, Math.round(it.spin / (Math.PI * 2)) * Math.PI * 2, 4, dt);
      }
      it.turn.rotation.y = it.spec.rot + it.spin + (this.focus === i || this.reduce ? 0 : Math.sin(t * 0.4 + i) * 0.03);
    });

    const ci = this.focus >= 0 ? this.shownItems().indexOf(this.items[this.focus]) : this.current();
    if (ci !== this.lastIndex) {
      this.lastIndex = ci;
      this.onIndex?.(ci);
    }
    this.onFrame?.();
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.io.disconnect();
    disposeScene(this.scene);
    // fabrics not on show at the moment are not in the scene graph
    for (const it of this.items) for (const m of it.mats) m.dispose();
    this.renderer.dispose();
  }
}

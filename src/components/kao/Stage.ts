import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { contactShadow, disposeScene, gltfLoader } from "@/components/shared/gltf";
import { Quality } from "@/components/shared/quality";

export type Spot = { id: string; p: THREE.Vector3; n: THREE.Vector3 };

export type Way = { id: string; variant: number; hue?: [number, number, number] };

type Shoe = {
  way: Way;
  root: THREE.Group;
  spin: THREE.Group;
  shadow: THREE.Mesh;
  mat: THREE.Material;
  slot: number;
  fade: number;
  phase: number;
};

const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt));
const wrap = (v: number, n: number) => ((v % n) + n) % n;
const FOV = 30;

/** A clone of a variant material with its colour turned round the hue wheel. */
function tinted(base: THREE.Material, [h, s, l]: [number, number, number]) {
  const m = base.clone();
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uHue = { value: h };
    sh.uniforms.uSat = { value: s };
    sh.uniforms.uLit = { value: l };
    sh.fragmentShader =
      "uniform float uHue;\nuniform float uSat;\nuniform float uLit;\n" +
      sh.fragmentShader.replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        {
          vec3 k = vec3(0.57735);
          float ca = cos(uHue);
          vec3 c = diffuseColor.rgb * ca + cross(k, diffuseColor.rgb) * sin(uHue) + k * dot(k, diffuseColor.rgb) * (1.0 - ca);
          float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
          diffuseColor.rgb = max(mix(vec3(lum), c, uSat) * uLit, 0.0);
        }`,
      );
  };
  m.customProgramCacheKey = () => "kao-tint";
  return m;
}

/**
 * Every colourway of one shoe floating in a line that runs back into the
 * page. The front shoe is the one on offer; scroll to bring the next forward,
 * open it to turn it in your hands.
 */
export class KaoStage {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(FOV, 1, 0.01, 30);
  shoes: Shoe[] = [];
  /** continuous position in the line; whole numbers are a shoe at the front */
  pos = 0;
  target = 0;
  open = false;
  onIndex?: (i: number) => void;
  private rx = 0;
  private ry = 0;
  private rxT = 0;
  private ryT = 0;
  private auto = true;
  private raf = 0;
  private last = performance.now();
  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private visible = true;
  private settle = 0;
  private lastIndex = -1;
  private w = 1;
  private h = 1;
  private ray = new THREE.Raycaster();
  private ptr = { x: 0, y: 0 };
  private tilt = { x: 0, y: 0 };
  private look = new THREE.Vector3(0.1, 0.05, 1);
  private reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  private coarse = window.matchMedia("(pointer: coarse)").matches;
  private quality: Quality;
  private lastDraw = 0;
  private drew = false;
  private skipped = 0;
  private frameNo = 0;
  private touched = 0;
  private vel = 0;
  private started = 0;
  /** points on the shoe worth a closer look, in the shoe's own space */
  spots: Spot[] = [];
  private decal: THREE.Mesh | null = null;
  private decalCanvas = document.createElement("canvas");
  private decalTex: THREE.CanvasTexture;
  private initials = "";

  constructor(private canvas: HTMLCanvasElement, bg: string) {
    const r = (this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" }));
    this.quality = new Quality(r, { mobile: 1.6 });
    this.decalCanvas.width = 512;
    this.decalCanvas.height = 256;
    this.decalTex = new THREE.CanvasTexture(this.decalCanvas);
    this.decalTex.colorSpace = THREE.SRGBColorSpace;
    this.decalTex.anisotropy = 4;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.02;
    this.scene.background = new THREE.Color(bg);
    const pm = new THREE.PMREMGenerator(r);
    this.scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    const key = new THREE.DirectionalLight("#ffffff", 1.5);
    key.position.set(1, 3, 2);
    const rim = new THREE.DirectionalLight("#dfe6ff", 0.6);
    rim.position.set(-2, 1, -2);
    this.scene.add(key, rim);
    this.ro = new ResizeObserver(this.resize);
    this.ro.observe(canvas);
    this.io = new IntersectionObserver(([e]) => (this.visible = e.isIntersecting));
    this.io.observe(canvas);
    this.resize();
    this.loop();
  }

  async load(url: string, ways: Way[], onProgress?: (n: number) => void) {
    const gltf = await gltfLoader().loadAsync(url, (e) => e.total && onProgress?.(e.loaded / e.total));
    const parser = gltf.parser;
    let mesh: THREE.Mesh | null = null;
    gltf.scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) mesh = o as THREE.Mesh;
    });
    if (!mesh) throw new Error("no shoe");
    const a = parser.associations.get(mesh) as { meshes: number; primitives: number };
    const maps = parser.json.meshes[a.meshes].primitives[a.primitives].extensions.KHR_materials_variants.mappings as { material: number; variants: number[] }[];
    const base: THREE.Material[] = [];
    for (const m of maps) {
      const mat = (await parser.getDependency("material", m.material)) as THREE.Material;
      for (const v of m.variants) base[v] = mat;
    }
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const ctr = box.getCenter(new THREE.Vector3());
    gltf.scene.position.sub(ctr);
    gltf.scene.updateMatrixWorld(true);
    this.findSpots(gltf.scene, mesh, box.getSize(new THREE.Vector3()));
    ways.forEach((way, i) => {
      const model = gltf.scene.clone(true);
      const mat = way.hue ? tinted(base[way.variant], way.hue) : base[way.variant].clone();
      // one closed mesh per shoe, so blending is safe and fades need no shader swap
      mat.transparent = true;
      model.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = mat;
      });
      const spin = new THREE.Group();
      spin.add(model);
      const root = new THREE.Group();
      root.add(spin);
      const shadow = contactShadow(0.34, 0.16, 0.22);
      this.scene.add(root, shadow);
      this.shoes.push({ way, root, spin, shadow, mat, slot: i, fade: 1, phase: i * 1.7 });
    });
    await this.renderer.compileAsync(this.scene, this.camera);
  }

  /** Raycast the shoe from outside to find its heel, upper, midsole and outsole, and build the heel decal. */
  private findSpots(root: THREE.Object3D, mesh: THREE.Mesh, size: THREE.Vector3) {
    const hit = (o: number[], d: number[]) => {
      const r = new THREE.Raycaster(new THREE.Vector3(...o), new THREE.Vector3(...d).normalize());
      const h = r.intersectObject(root, true)[0];
      if (!h?.face) return null;
      const n = h.face.normal.clone().transformDirection(h.object.matrixWorld).normalize();
      return { p: h.point.clone(), n };
    };
    const L = size.x;
    const H = size.y;
    const pts: [string, ReturnType<typeof hit>][] = [
      ["upper", hit([L * 0.18, H, 0], [0, -1, 0])],
      ["heel", hit([-L, -H * 0.12, 0], [1, 0, 0])],
      ["midsole", hit([-L * 0.05, -H * 0.36, L], [0, 0, -1])],
      ["outsole", hit([L * 0.12, -H, 0.01], [0, 1, 0])],
    ];
    this.spots = pts.filter(([, h]) => h).map(([id, h]) => ({ id, p: h!.p, n: h!.n }));
    // the initials go higher up, on the heel counter
    const heel = hit([-L, H * 0.06, 0], [1, 0, 0]);
    if (!heel) return;
    // project straight in from behind; the compressed mesh's face normals are not reliable enough here
    heel.n.set(-1, 0, 0);
    const helper = new THREE.Object3D();
    helper.position.copy(heel.p);
    helper.lookAt(heel.p.clone().add(heel.n));
    const geo = new DecalGeometry(mesh, heel.p, helper.rotation, new THREE.Vector3(size.z * 0.5, size.z * 0.25, 0.04));
    const mat = new THREE.MeshStandardMaterial({ map: this.decalTex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, roughness: 0.75 });
    this.decal = new THREE.Mesh(geo, mat);
    this.decal.visible = false;
  }

  /** Initials stitched on the heel of the shoe in front; empty to remove. */
  setInitials(text: string, light: boolean) {
    this.initials = text.toUpperCase().slice(0, 3);
    const g = this.decalCanvas.getContext("2d")!;
    g.clearRect(0, 0, 512, 256);
    if (this.initials) {
      g.save();
      g.font = `800 150px "Archivo Variable", "Archivo", system-ui, sans-serif`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.letterSpacing = "6px";
      // the heel counter is dark on every colour, so the thread is always pale
      g.fillStyle = light ? "#f6efe2" : "#f4f1ea";
      g.shadowColor = "rgba(0,0,0,0.25)";
      g.shadowBlur = 3;
      g.shadowOffsetY = 2;
      g.fillText(this.initials, 256, 136);
      g.restore();
    }
    this.decalTex.needsUpdate = true;
    this.poke();
  }

  /** where each spot on the open shoe sits on screen, and whether it faces you */
  spotsOnScreen() {
    if (!this.open) return null;
    const s = this.shoes[this.index()];
    if (!s || s.fade < 0.9) return null;
    // spots were found in the shoe's own space, which is the spin group's space
    s.spin.updateMatrixWorld(true);
    const m = s.spin.matrixWorld;
    const cam = this.camera.position;
    return this.spots.map((sp) => {
      const p = sp.p.clone().applyMatrix4(m);
      const n = sp.n.clone().transformDirection(m);
      const facing = n.dot(cam.clone().sub(p).normalize()) > 0.12;
      p.project(this.camera);
      return { id: sp.id, x: (p.x * 0.5 + 0.5) * this.w, y: (-p.y * 0.5 + 0.5) * this.h, facing };
    });
  }

  /** the shoes arrive from deep in the page, the front one last */
  begin() {
    this.started = performance.now();
  }

  private poke() {
    this.touched = performance.now();
  }

  get count() {
    return this.shoes.length;
  }

  index() {
    return this.count ? wrap(Math.round(this.target), this.count) : 0;
  }

  step(d: number) {
    this.poke();
    if (this.open) return;
    this.target = Math.round(this.target) + d;
  }

  goTo(i: number) {
    this.poke();
    const cur = this.index();
    let d = i - cur;
    if (d > this.count / 2) d -= this.count;
    if (d < -this.count / 2) d += this.count;
    this.target = Math.round(this.target) + d;
  }

  scrub(d: number) {
    this.poke();
    if (this.open) return;
    this.target += d;
    this.settle = 0.3;
  }

  setOpen(on: boolean) {
    this.poke();
    this.vel = 0;
    this.open = on;
    this.auto = true;
    this.rxT = 0;
    this.ryT = 0;
    if (on) this.target = Math.round(this.target);
  }

  /** turn the open shoe by hand */
  turnBy(dx: number, dy: number) {
    this.poke();
    this.vel = 0;
    this.auto = false;
    this.ryT += dx;
    this.rxT = Math.max(-1.3, Math.min(1.3, this.rxT + dy));
  }

  /** let go of a drag: the shoe keeps turning and slows down */
  release(v: number) {
    this.vel = Math.max(-0.15, Math.min(0.15, v));
  }

  /** ease the open shoe round to a named view */
  view(v: "side" | "front" | "back" | "top" | "sole") {
    this.poke();
    this.vel = 0;
    this.auto = false;
    const base = Math.round(this.ryT / (Math.PI * 2)) * Math.PI * 2;
    const ry = { side: 0, front: -Math.PI / 2, back: Math.PI / 2, top: 0, sole: 0 }[v];
    // cancel the angle the front shoe already stands at, so "side" is square on
    this.ryT = base + ry - this.place(0, this.camera.aspect < 0.85).ry;
    this.rxT = v === "top" ? Math.PI / 2 - 0.15 : v === "sole" ? -Math.PI / 2 + 0.15 : 0;
  }

  pointer(x: number, y: number) {
    this.poke();
    this.ptr.x = (x / this.w) * 2 - 1;
    this.ptr.y = -(y / this.h) * 2 + 1;
  }

  /** which colourway was clicked */
  pick(x: number, y: number) {
    this.ray.setFromCamera(new THREE.Vector2((x / this.w) * 2 - 1, -(y / this.h) * 2 + 1), this.camera);
    const hits = this.ray.intersectObjects(
      this.shoes.filter((s) => s.root.visible && s.fade > 0.5).map((s) => s.root),
      true,
    );
    if (!hits.length) return -1;
    let o: THREE.Object3D | null = hits[0].object;
    while (o && !this.shoes.some((s) => s.root === o)) o = o.parent;
    return this.shoes.findIndex((s) => s.root === o);
  }

  pixelsPerShoe() {
    return Math.min(this.w, 900) * 0.32;
  }

  private resize = () => {
    this.w = this.canvas.clientWidth || 1;
    this.h = this.canvas.clientHeight || 1;
    this.renderer.setSize(this.w, this.h, false);
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
    this.poke();
  };

  /** where a shoe sits for a place in the line: 0 is the front, 1, 2... run back, -1 has just left */
  private place(k: number, portrait: boolean) {
    if (portrait) {
      return {
        x: k < 0 ? -0.05 + k * 0.42 : 0.05 * k,
        y: k < 0 ? -0.05 : 0.105 * k - 0.02 * k * k * 0.25,
        z: k < 0 ? 0.15 : -0.32 * k,
        s: k < 0 ? 1 : Math.pow(0.86, k),
        ry: -0.35 + k * 0.25,
        a: k < -0.9 ? 0 : k < 0 ? 1 + k : k > this.count - 2 ? Math.max(0, this.count - 1 - k) : 1,
      };
    }
    return {
      x: k < 0 ? -0.06 + k * 0.55 : -0.06 + 0.17 * k,
      y: k < 0 ? -0.04 : 0.046 * k,
      z: k < 0 ? 0.12 : -0.34 * k,
      s: k < 0 ? 1 : Math.pow(0.9, k),
      ry: -0.38 + k * 0.32,
      a: k < -0.9 ? 0 : k < 0 ? 1 + k : k > this.count - 2 ? Math.max(0, this.count - 1 - k) : 1,
    };
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
    const k = this.reduce ? 30 : 5;
    const t = now / 1000;
    const portrait = this.camera.aspect < 0.85;

    if (!this.open && this.settle > 0) {
      this.settle -= dt;
      if (this.settle <= 0) this.target = Math.round(this.target);
    }
    this.pos = damp(this.pos, this.target, k, dt);

    // camera: the front shoe fills a third of a wide screen, more of a phone;
    // open, it sits in the middle of the space the panel leaves
    const tan = Math.tan(((FOV / 2) * Math.PI) / 180);
    const a = this.camera.aspect;
    const fit = portrait ? 0.62 : a < 1.25 ? 0.5 : 0.4;
    const span = this.open ? (portrait ? 0.84 : 0.4) : fit;
    const dist = 0.34 / span / 2 / (tan * Math.min(a, 1.7));
    this.tilt.x = damp(this.tilt.x, this.ptr.x, 3, dt);
    this.tilt.y = damp(this.tilt.y, this.ptr.y, 3, dt);
    const visW = 2 * dist * tan * a;
    const visH = 2 * dist * tan;
    const fx = this.place(0, portrait).x;
    const lookX = this.open ? fx + (portrait ? 0 : visW * 0.2) : portrait ? 0.03 : 0.1;
    const lookY = this.open ? (portrait ? -visH * 0.2 : 0) : portrait ? 0.1 : 0.05;
    this.look.x = damp(this.look.x, lookX, k, dt);
    this.look.y = damp(this.look.y, lookY, k, dt);
    this.look.z = damp(this.look.z, dist, k, dt);
    const par = this.reduce || this.open ? 0 : 0.03;
    this.camera.position.set(this.look.x + this.tilt.x * par, this.look.y + 0.06 + this.tilt.y * par * 0.6, this.look.z);
    this.camera.lookAt(this.look.x, this.look.y, 0);

    // turning the open shoe
    if (this.open && this.auto && !this.reduce) this.ryT += dt * 0.35;
    if (Math.abs(this.vel) > 1e-4) {
      this.ryT += this.vel * dt * 60;
      this.vel *= Math.pow(0.03, dt);
    }
    this.rx = damp(this.rx, this.open ? this.rxT : 0, 6, dt);
    this.ry = damp(this.ry, this.open ? this.ryT : 0, 6, dt);

    const n = this.count;
    const front = this.index();
    const since = this.started ? (now - this.started) / 1000 : 99;
    this.shoes.forEach((s, i) => {
      // place in the line relative to the front, kept in [-1, n-1)
      let rel = wrap(i - this.pos, n);
      if (rel > n - 1) rel -= n;
      const p = this.place(rel, portrait);
      // opening: each shoe flies in from far back, the farthest first
      const arrive = this.reduce ? 1 : Math.min(1, Math.max(0, (since - (n - 1 - rel) * 0.11) / 1.1));
      const e = 1 - Math.pow(1 - arrive, 4);
      p.z -= (1 - e) * 2.4;
      p.y += (1 - e) * 0.25;
      p.ry -= (1 - e) * 1.6;
      const isFront = i === front;
      const want = (this.open ? (isFront ? 1 : 0) : p.a) * (arrive > 0 ? 1 : 0);
      s.fade = damp(s.fade, want, this.open ? 8 : 12, dt);
      const fade = s.fade;
      s.root.visible = fade > 0.01;
      s.shadow.visible = s.root.visible;
      const bob = this.reduce ? 0 : Math.sin(t * 1.1 + s.phase) * 0.008;
      const scale = p.s;
      s.root.position.set(p.x, p.y + bob, p.z);
      s.root.scale.setScalar(scale * (0.92 + 0.08 * fade));
      s.spin.rotation.set(
        isFront ? this.rx : 0,
        p.ry + (isFront ? this.ry : 0) + (this.reduce ? 0 : Math.sin(t * 0.6 + s.phase) * 0.05),
        this.reduce ? 0 : Math.sin(t * 0.8 + s.phase) * 0.03,
        "YXZ",
      );
      (s.mat as THREE.MeshStandardMaterial).opacity = fade;
      s.mat.depthWrite = fade > 0.5;
      s.shadow.position.set(p.x, p.y - 0.1 * scale, p.z);
      s.shadow.scale.setScalar(scale);
      (s.shadow.material as THREE.MeshBasicMaterial).opacity = 0.2 * fade * (1 - Math.abs(this.rx) * 0.6) * (1 - bob * 20);
      s.root.renderOrder = -Math.round(rel * 10);
    });

    // the stitched initials ride on whichever shoe is in front
    if (this.decal) {
      const s = this.shoes[front];
      if (this.decal.parent !== s.spin) s.spin.add(this.decal);
      this.decal.visible = !!this.initials && s.fade > 0.05;
      (this.decal.material as THREE.MeshStandardMaterial).opacity = s.fade;
    }

    const idx = this.index();
    if (this.count && idx !== this.lastIndex) {
      this.lastIndex = idx;
      this.onIndex?.(idx);
    }
    // phones left alone draw the gentle float at half rate; any touch brings it back to full
    this.frameNo++;
    if (this.coarse && !this.open && since > 2 && now - this.touched > 1500 && this.frameNo % 2) {
      this.skipped++;
      return;
    }
    // a frame skipped on purpose still counts as one frame of time
    if (this.drew) this.quality.frame((now - this.lastDraw) / (this.skipped + 1));
    this.skipped = 0;
    this.lastDraw = now;
    this.drew = true;
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.io.disconnect();
    disposeScene(this.scene);
    this.renderer.dispose();
  }
}

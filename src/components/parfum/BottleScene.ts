import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/** What the page asks of the bottle. The scene eases towards it every frame. */
export type Pose = {
  x: number; // bottle offset, world units
  y: number;
  dist: number; // camera distance
  look: number; // camera height it looks at, relative to the bottle
  spin: number; // 1 = turning on its own, 0 = settle facing the front
  opacity: number;
  scale: number;
};

export type Label = { scent: string; size: string; initials: string; ink: string; paper: string };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A glass perfume bottle with a brass cap and a printed label, drawn with three.js. */
export class BottleScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  private group = new THREE.Group();
  private turn = new THREE.Group();
  private liquid: THREE.MeshPhysicalMaterial;
  private glass: THREE.MeshPhysicalMaterial;
  private labelCanvas = document.createElement("canvas");
  private labelTex: THREE.CanvasTexture;
  private fadeMats: THREE.Material[] = [];
  private glowMat: THREE.MeshBasicMaterial;
  private raf = 0;
  private current: Pose = { x: 0, y: 0, dist: 7, look: 0, spin: 1, opacity: 0, scale: 1 };
  target: Pose = { x: 0, y: 0, dist: 7, look: 0, spin: 1, opacity: 1, scale: 1 };
  /** extra zoom from the viewer's own controls, multiplies camera distance */
  zoom = 1;
  private angle = 0.5;
  private velocity = 0;
  private dragging = false;
  private liquidColor = new THREE.Color("#d9c38a");
  private bgTarget = new THREE.Color("#1d1a14");
  private bg = new THREE.Color("#1d1a14");
  private reduce: boolean;

  constructor(private canvas: HTMLCanvasElement) {
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene.background = this.bg;
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;

    const key = new THREE.DirectionalLight("#ffffff", 1.6);
    key.position.set(3, 5, 4);
    const rim = new THREE.DirectionalLight("#ffe8c4", 1.2);
    rim.position.set(-4, 2, -3);
    this.scene.add(key, rim);

    // Glass body: thick walls, faint tint, strong clear coat
    this.glass = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      transmission: 1,
      thickness: 0.9,
      roughness: 0.03,
      ior: 1.52,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      attenuationColor: new THREE.Color("#ffffff"),
      attenuationDistance: 8,
      specularIntensity: 1,
      envMapIntensity: 1.4,
    });
    const body = new THREE.Mesh(new RoundedBoxGeometry(1.5, 1.9, 0.92, 8, 0.2), this.glass);

    this.liquid = new THREE.MeshPhysicalMaterial({ color: this.liquidColor, roughness: 0.2, clearcoat: 1, sheen: 0.3, envMapIntensity: 1, emissive: this.liquidColor, emissiveIntensity: 0.06 });
    const liquid = new THREE.Mesh(new RoundedBoxGeometry(1.22, 1.52, 0.64, 6, 0.12), this.liquid);
    liquid.position.y = -0.1;

    const brass = new THREE.MeshPhysicalMaterial({ color: "#c8a46c", metalness: 1, roughness: 0.28, clearcoat: 0.4, envMapIntensity: 1.3, transparent: true });
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.2, 48), brass);
    neck.position.y = 1.04;
    const cap = new THREE.Mesh(new RoundedBoxGeometry(0.86, 0.72, 0.86, 6, 0.08), brass);
    cap.position.y = 1.5;

    this.labelCanvas.width = 1024;
    this.labelCanvas.height = 640;
    this.labelTex = new THREE.CanvasTexture(this.labelCanvas);
    this.labelTex.colorSpace = THREE.SRGBColorSpace;
    this.labelTex.anisotropy = 8;
    const labelMat = new THREE.MeshPhysicalMaterial({ map: this.labelTex, roughness: 0.7, transparent: true });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.6), labelMat);
    label.position.set(0, -0.12, 0.462);

    // Soft contact shadow
    const sc = document.createElement("canvas");
    sc.width = sc.height = 256;
    const g = sc.getContext("2d")!;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(0,0,0,0.55)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const shadowMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false });
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.97;

    // Warm glow behind the bottle, tinted by the scent; the glass refracts it
    const gc = document.createElement("canvas");
    gc.width = gc.height = 256;
    const gg = gc.getContext("2d")!;
    const glow = gg.createRadialGradient(128, 128, 0, 128, 128, 128);
    glow.addColorStop(0, "rgba(255,255,255,0.9)");
    glow.addColorStop(0.45, "rgba(255,255,255,0.25)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    gg.fillStyle = glow;
    gg.fillRect(0, 0, 256, 256);
    this.glowMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(gc), transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending });
    const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), this.glowMat);
    backdrop.position.set(0, 0.2, -2.5);
    this.group.add(backdrop);

    this.fadeMats = [shadowMat];
    this.turn.add(liquid, body, neck, cap, label);
    this.group.add(this.turn, shadow);
    this.scene.add(this.group);

    this.resize();
    window.addEventListener("resize", this.resize);
    this.loop();
  }

  private resize = () => {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  setScent(color: string, background: string) {
    this.liquidColor.set(color);
    this.bgTarget.set(background);
  }

  drawLabel({ scent, size, initials, ink, paper }: Label) {
    const c = this.labelCanvas.getContext("2d")!;
    const { width: w, height: h } = this.labelCanvas;
    c.fillStyle = paper;
    c.fillRect(0, 0, w, h);
    c.strokeStyle = ink;
    c.globalAlpha = 0.35;
    c.lineWidth = 3;
    c.strokeRect(28, 28, w - 56, h - 56);
    c.globalAlpha = 1;
    c.fillStyle = ink;
    c.textAlign = "center";
    c.font = '150px "Instrument Serif", Georgia, serif';
    c.fillText("HOM", w / 2, 215);
    c.font = 'italic 76px "Instrument Serif", Georgia, serif';
    c.fillText(scent, w / 2, 350);
    c.font = '500 30px "Instrument Sans Variable", "Instrument Sans", sans-serif';
    c.fillText(`EAU DE PARFUM   ${size}   BANGKOK`, w / 2, 450);
    if (initials) {
      c.font = 'italic 64px "Instrument Serif", Georgia, serif';
      c.fillText(initials, w / 2, 560);
    } else {
      c.globalAlpha = 0.5;
      c.fillRect(w / 2 - 40, 535, 80, 2);
      c.globalAlpha = 1;
    }
    this.labelTex.needsUpdate = true;
  }

  /** Pointer drag turns the bottle; letting go keeps a little momentum. */
  dragStart() {
    this.dragging = true;
    this.velocity = 0;
  }
  dragMove(dx: number) {
    const d = dx * 0.008;
    this.angle += d;
    this.velocity = d;
  }
  dragEnd() {
    this.dragging = false;
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const c = this.current;
    const t = this.target;
    const k = this.reduce ? 1 : 0.075;
    (Object.keys(t) as (keyof Pose)[]).forEach((key) => (c[key] = lerp(c[key], t[key], k)));

    if (!this.dragging) {
      this.velocity *= 0.94;
      this.angle += this.velocity;
      if (c.spin > 0.5) this.angle += this.reduce ? 0 : 0.0035 * c.spin;
      else {
        const front = Math.round((this.angle - 0.35) / (Math.PI * 2)) * Math.PI * 2 + 0.35;
        this.angle = lerp(this.angle, front, 0.04 * (1 - c.spin));
      }
    }
    this.turn.rotation.y = this.angle;
    this.turn.rotation.x = Math.sin(performance.now() / 2400) * 0.025;
    this.group.position.set(c.x, c.y + Math.sin(performance.now() / 1800) * 0.03, 0);
    this.group.scale.setScalar(c.scale);

    this.liquid.color.lerp(this.liquidColor, 0.06);
    this.liquid.emissive.copy(this.liquid.color);
    this.glowMat.color.copy(this.liquid.color);
    this.bg.lerp(this.bgTarget, 0.05);
    this.glass.attenuationColor.copy(this.liquid.color).lerp(new THREE.Color("#ffffff"), 0.8);
    this.fadeMats.forEach((m) => (m.opacity = c.opacity));
    this.group.visible = c.opacity > 0.01;

    const dist = c.dist * this.zoom;
    this.camera.position.set(c.x * 0.15, c.y + c.look + 0.25, dist);
    this.camera.lookAt(c.x * 0.15, c.y + c.look, 0);
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    this.renderer.dispose();
  }
}

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * A small three.js stage: studio lighting, an object you can turn by dragging,
 * smooth zoom, a background colour that eases between values, and a frame hook.
 */
export class Stage3D {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(32, 1, 0.05, 100);
  turn = new THREE.Group();
  /** camera distance the stage eases towards; multiply by zoom */
  dist = 6;
  zoom = 1;
  /** where the camera looks, eased */
  look = new THREE.Vector3();
  lookTarget = new THREE.Vector3();
  /** horizontal shift of the object, eased */
  shift = 0;
  shiftTarget = 0;
  autoSpin = 0.003;
  tilt = 0.15;
  onFrame?: (t: number) => void;
  private bg = new THREE.Color();
  private bgTarget = new THREE.Color();
  private curDist = 6;
  private angle = 0.6;
  private vel = 0;
  private dragging = false;
  private raf = 0;
  private ro: ResizeObserver;
  private reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  constructor(private canvas: HTMLCanvasElement, background: string, envIntensity = 0.04) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.matchMedia("(pointer: coarse)").matches ? 1.5 : 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.bg.set(background);
    this.bgTarget.set(background);
    this.scene.background = this.bg;
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), envIntensity).texture;
    this.scene.add(this.turn);
    this.ro = new ResizeObserver(this.resize);
    this.ro.observe(canvas);
    this.resize();
    this.loop();
  }

  setBackground(c: string) {
    this.bgTarget.set(c);
  }

  private resize = () => {
    const w = this.canvas.clientWidth || 1;
    const h = this.canvas.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  private last = 0;
  dragStart(x: number) {
    this.dragging = true;
    this.vel = 0;
    this.last = x;
  }
  dragMove(x: number) {
    if (!this.dragging) return;
    const d = (x - this.last) * 0.008;
    this.last = x;
    this.angle += d;
    this.vel = d;
  }
  dragEnd() {
    this.dragging = false;
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const t = performance.now() / 1000;
    if (!this.dragging) {
      this.vel *= 0.94;
      this.angle += this.vel + (this.reduce ? 0 : this.autoSpin);
    }
    this.turn.rotation.y = this.angle;
    this.bg.lerp(this.bgTarget, 0.05);
    this.curDist = lerp(this.curDist, this.dist * this.zoom, 0.07);
    this.shift = lerp(this.shift, this.shiftTarget, 0.07);
    this.look.lerp(this.lookTarget, 0.07);
    this.turn.position.x = this.shift;
    this.camera.position.set(this.shift * 0.2, this.look.y + this.curDist * this.tilt, this.curDist);
    this.camera.lookAt(this.shift * 0.2, this.look.y, 0);
    this.onFrame?.(t);
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.renderer.dispose();
  }
}

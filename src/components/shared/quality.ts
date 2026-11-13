import type * as THREE from "three";

/**
 * Keeps a WebGL page smooth on any phone. It watches how long frames really
 * take and lowers the render resolution a step when the device falls behind
 * the screen's refresh rate, then tries a step up again later when there is
 * room, never going back to a level that already proved too heavy.
 */
export class Quality {
  ratio: number;
  private max: number;
  private min: number;
  private ceiling: number;
  private samples: number[] = [];
  private refresh = 16.7;
  private good = 0;
  private wait = 30;

  constructor(private renderer: THREE.WebGLRenderer, opts: { mobile?: number; desktop?: number } = {}) {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = window.devicePixelRatio || 1;
    this.max = Math.min(dpr, 2);
    this.min = Math.min(this.max, coarse ? 0.9 : 1);
    this.ratio = Math.min(this.max, coarse ? (opts.mobile ?? 1.5) : (opts.desktop ?? 2));
    this.ceiling = this.max;
    renderer.setPixelRatio(this.ratio);
  }

  /** milliseconds since the previous rendered frame */
  frame(ms: number) {
    if (ms <= 0 || ms > 1500) return; // coming back from a hidden tab, not a slow frame
    if (this.wait > 0) {
      this.wait--;
      return;
    }
    this.samples.push(ms);
    // a device that is badly behind gets help after a handful of frames, not seconds
    const quick = this.samples.length >= 8 && this.samples.slice(-8).sort((a, b) => a - b)[4] > 50;
    if (!quick && this.samples.length < 45) return;
    const s = this.samples.sort((a, b) => a - b);
    this.samples = [];
    // the fastest frames show the screen's own rate (60, 90, 120 Hz)
    this.refresh = Math.min(this.refresh * 0.8 + s[3] * 0.2, 16.7);
    const median = s[Math.floor(s.length / 2)];
    const slow = s[Math.floor(s.length * 0.8)];
    if (median > this.refresh * 1.35 || slow > this.refresh * 2) {
      this.ceiling = Math.max(this.min, this.ratio - 0.25);
      this.set(Math.max(this.min, this.ratio - 0.25));
      this.good = 0;
    } else if (slow < this.refresh * 1.15 && this.ratio < this.ceiling) {
      if (++this.good >= 4) {
        this.set(Math.min(this.ceiling, this.ratio + 0.25));
        this.good = 0;
      }
    }
  }

  private set(r: number) {
    if (Math.abs(r - this.ratio) < 0.01) return;
    this.ratio = r;
    this.renderer.setPixelRatio(r);
    this.wait = 6;
  }
}

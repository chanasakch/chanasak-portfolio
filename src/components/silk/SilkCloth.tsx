"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Stage3D } from "@/components/shared/Stage3D";
import { useDrag3D } from "@/components/shared/useDrag3D";

/**
 * A length of silk hanging from the top edge and moving in a slow breeze.
 * The woven pattern from the loom is its texture, and sheen gives the silk lustre.
 */
export function SilkCloth({ url, background, className = "", shift = 0, dist = 6.2 }: { url: string | null; background: string; className?: string; shift?: number; dist?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<Stage3D | null>(null);
  const mat = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const drag = useDrag3D(stage);

  useEffect(() => {
    if (!canvas.current) return;
    const s = new Stage3D(canvas.current, background, 0.35);
    s.autoSpin = 0;
    s.tilt = 0.02;
    s.dist = dist;
    s.shiftTarget = shift;
    s.renderer.toneMappingExposure = 0.92;
    const W = 2.4;
    const H = 3.6;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const geo = new THREE.PlaneGeometry(W, H, coarse ? 44 : 64, coarse ? 66 : 96);
    const base = Float32Array.from(geo.attributes.position.array);
    const m = new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.48, sheen: 1, sheenRoughness: 0.32, sheenColor: new THREE.Color("#ffe6bd"), side: THREE.DoubleSide });
    const cloth = new THREE.Mesh(geo, m);
    cloth.rotation.y = -0.32;
    s.turn.add(cloth);
    const key = new THREE.DirectionalLight("#fff1dc", 2);
    key.position.set(3, 4, 5);
    const rim = new THREE.DirectionalLight("#c9d6ff", 1.3);
    rim.position.set(-4, 1, -3);
    s.scene.add(key, rim, new THREE.AmbientLight("#ffffff", 0.12));
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    s.onFrame = (t0) => {
      const t = reduce ? 1 : t0;
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3];
        const y = base[i * 3 + 1];
        const a = (H / 2 - y) / H; // 0 at the top edge, 1 at the hem
        const z = a * (0.32 * Math.sin(x * 2.1 + t * 1.15 + y * 0.7) + 0.1 * Math.sin(x * 6.2 - t * 1.6)) + 0.18 * Math.sin(x * 3.4) * (0.3 + a);
        pos.setXYZ(i, x + a * 0.07 * Math.sin(t * 0.8 + y * 1.3), y, z);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    };
    stage.current = s;
    mat.current = m;
    return () => {
      s.dispose();
      geo.dispose();
      m.dispose();
    };
  }, [background, shift, dist]);

  useEffect(() => {
    if (!url || !mat.current) return;
    const m = mat.current;
    new THREE.TextureLoader().load(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      m.map?.dispose();
      m.map = tex;
      m.needsUpdate = true;
    });
  }, [url]);

  return (
    <div className={`touch-pan-y ${className}`} data-cursor="Turn" {...drag}>
      <canvas ref={canvas} className="block h-full w-full" role="img" aria-label="Silk hanging in folds" />
    </div>
  );
}

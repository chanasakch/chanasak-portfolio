import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

let loader: GLTFLoader | null = null;
export function gltfLoader() {
  loader ??= new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  return loader;
}

export type Variants = { names: string[]; apply: (i: number) => void };

/** Reads KHR_materials_variants from a loaded file so a fabric or colourway can be swapped at runtime. */
export async function readVariants(gltf: GLTF): Promise<Variants> {
  const parser = gltf.parser;
  const json = parser.json;
  const names: string[] = (json.extensions?.KHR_materials_variants?.variants ?? []).map((v: { name: string }) => v.name);
  const targets: { mesh: THREE.Mesh; mats: Record<number, THREE.Material> }[] = [];
  const jobs: Promise<void>[] = [];
  gltf.scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const a = parser.associations.get(mesh) as { meshes?: number; primitives?: number } | undefined;
    if (a?.meshes === undefined || a.primitives === undefined) return;
    const ext = json.meshes[a.meshes].primitives[a.primitives].extensions?.KHR_materials_variants;
    if (!ext) return;
    const t = { mesh, mats: {} as Record<number, THREE.Material> };
    targets.push(t);
    for (const m of ext.mappings as { material: number; variants: number[] }[])
      jobs.push(
        parser.getDependency("material", m.material).then((mat: THREE.Material) => {
          for (const v of m.variants) t.mats[v] = mat;
        }),
      );
  });
  await Promise.all(jobs);
  return {
    names,
    apply(i) {
      for (const t of targets) if (t.mats[i]) t.mesh.material = t.mats[i];
    },
  };
}

/** Every material under an object, including variant materials once they have been applied. */
export function materialsOf(o: THREE.Object3D) {
  const set = new Set<THREE.Material>();
  o.traverse((c) => {
    const m = (c as THREE.Mesh).material;
    if (!m) return;
    (Array.isArray(m) ? m : [m]).forEach((x) => set.add(x));
  });
  return [...set];
}

/** A soft round shadow drawn once and reused under every object. */
let blob: THREE.Texture | null = null;
export function contactShadow(w: number, d: number, strength = 0.5) {
  if (!blob) {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(0,0,0,0.85)");
    r.addColorStop(0.5, "rgba(0,0,0,0.4)");
    r.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
    blob = new THREE.CanvasTexture(c);
  }
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshBasicMaterial({ map: blob, transparent: true, opacity: strength, depthWrite: false, toneMapped: false }),
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.002;
  m.renderOrder = -1;
  return m;
}

/** Free every geometry, material and texture under a scene before its renderer goes. */
export function disposeScene(scene: THREE.Scene) {
  const seen = new Set<object>();
  scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry && !seen.has(m.geometry)) {
      seen.add(m.geometry);
      m.geometry.dispose();
    }
    const mats = m.material ? (Array.isArray(m.material) ? m.material : [m.material]) : [];
    for (const mat of mats) {
      if (seen.has(mat)) continue;
      seen.add(mat);
      for (const v of Object.values(mat)) if (v instanceof THREE.Texture && v !== blob) v.dispose();
      mat.dispose();
    }
  });
  scene.environment?.dispose();
}

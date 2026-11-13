import Link from "next/link";
import type { Metadata } from "next";
import { pexelsPage, photos } from "@/data/images";
import { orra } from "@/data/orra";
import { soniq } from "@/data/soniq";
import { dests } from "@/data/tera";

export const metadata: Metadata = { title: "Credits" };

const models = [
  ["Runner shoe (KAO)", "MaterialsVariantsShoe", "Shopify", "CC BY 4.0"],
  ["Curved sofa (SALA)", "GlamVelvetSofa", "Eric Chadwick", "CC BY 4.0"],
  ["Lounge chair (SALA)", "SheenChair", "Eric Chadwick", "CC0 1.0"],
  ["Floor pouf (SALA)", "SpecularSilkPouf", "Eric Chadwick", "CC BY 4.0"],
  ["Table lamp (SALA)", "IridescenceLamp", "Eric Chadwick", "CC BY 4.0"],
  ["Potted plant (SALA)", "DiffuseTransmissionPlant", "Eric Chadwick, Rico Cilliers", "CC BY 4.0, CC0 1.0"],
  ["Bud vases (SALA)", "GlassVaseFlowers", "Eric Chadwick, Rico Cilliers", "CC0 1.0"],
  ["Cup and saucer (SALA)", "DiffuseTransmissionTeacup", "Poly Haven, Eric Chadwick", "CC0 1.0"],
];

export default function Credits() {
  // Several crops come from one photo; list each source once.
  const seen = new Set<number>();
  const list = Object.values(photos).filter((p) => (seen.has(p.pexelsId) ? false : (seen.add(p.pexelsId), true)));

  return (
    <main className="mx-auto max-w-[760px] px-4 py-14 sm:px-8">
      <Link href="/" className="text-[14px] text-muted underline underline-offset-4">
        All concepts
      </Link>
      <h1 className="mt-6 text-[2.2rem] font-[450] tracking-[-0.01em]">Credits</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        All photographs are from Pexels and free to use under the Pexels license. The furniture, ceramics and places in them
        are not made or run by the fictional brands in these concepts.
      </p>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {list.map((p) => (
          <li key={p.pexelsId} className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-3 text-[14px]">
            <span>
              {p.alt}
              {p.photographer && <span className="block text-[13px] text-muted">{p.photographer}</span>}
            </span>
            <a href={pexelsPage(p)} className="shrink-0 text-muted underline underline-offset-4" target="_blank" rel="noreferrer">
              Pexels {p.pexelsId}
            </a>
          </li>
        ))}
      </ul>
      <h2 className="mt-14 text-[1.5rem] font-[450] tracking-[-0.01em]">ORRA, SONIQ and Tera</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        These photographs are also from Pexels under the Pexels license, taken from the pexels_hq_diverse_40k collection on Hugging Face, which does not
        keep the photographers&apos; names. The products, buildings and landscapes shown belong to their makers and owners, not to these fictional brands.
        Destination photos are cut along the skyline in the browser so the place name can sit behind the landmark.
      </p>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {[
          ...orra.map((p) => ["ORRA", p.alt]),
          ...soniq.map((p) => ["SONIQ", p.alt]),
          ...dests.map((d) => ["Tera", `${d.place}, ${d.name}`]),
        ].map(([brand, alt]) => (
          <li key={brand + alt} className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-3 text-[14px]">
            <span>{alt}</span>
            <span className="shrink-0 text-muted">{brand}</span>
          </li>
        ))}
      </ul>
      <h2 className="mt-14 text-[1.5rem] font-[450] tracking-[-0.01em]">3D models</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        From the Khronos glTF Sample Assets library, compressed for the web. Extra shoe colours are tinted in the browser.
      </p>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {models.map(([use, name, by, lic]) => (
          <li key={name} className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-3 text-[14px]">
            <span>
              {use}
              <span className="block text-[13px] text-muted">
                {name}, {by}
              </span>
            </span>
            <a href={`https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/${name}`} className="shrink-0 text-muted underline underline-offset-4" target="_blank" rel="noreferrer">
              {lic}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

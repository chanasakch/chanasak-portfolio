import Link from "next/link";
import { Photo } from "@/components/shared/Photo";
import { photos } from "@/data/images";

const concepts = [
  {
    href: "/furniture",
    name: "Loom & Tide",
    nameStyle: { fontFamily: '"Schibsted Grotesk Variable", "Schibsted Grotesk", sans-serif', fontWeight: 650, letterSpacing: "-0.03em" },
    photo: photos.archedTerraceChairs,
    position: "50% 70%",
    job: "Furniture brand and trade catalogue",
    problem:
      "A woven furniture maker selling to hotels, designers and homeowners. Visitors filter more than a hundred pieces, read the specifications and send one quote request for a whole project.",
    inside: ["Catalogue with filters", "Spec pages", "Colourway preview", "Quote list", "Thai and English"],
  },
  {
    href: "/ceramics",
    name: "DIN Studio",
    nameStyle: { fontFamily: '"Italiana", serif', letterSpacing: "0.12em" },
    photo: photos.budVases,
    position: "50% 45%",
    job: "Craft brand site",
    problem:
      "A small stoneware studio that sells pieces, supplies restaurants and teaches. The site tells the material story and turns it into orders, sample requests and class bookings.",
    inside: ["Product grid", "Glaze explorer", "Making process", "Restaurant sample request", "Workshop booking"],
  },
  {
    href: "/hotel",
    name: "Ruen Doi",
    nameStyle: { fontFamily: '"Bodoni Moda Variable", "Bodoni Moda", serif', fontStyle: "italic" as const },
    photo: photos.balconyRattanPods,
    position: "50% 60%",
    job: "Boutique hotel",
    problem:
      "A 24-room hotel in the hills of Chiang Rai. Guests check prices for their dates, compare rooms and see the furniture in each space, with links to the maker.",
    inside: ["Availability check", "Room comparison", "Furniture hotspots", "Spaces gallery", "Stay request"],
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-24 pt-10 sm:px-8 sm:pt-16">
      <header className="grid gap-6 border-b border-line pb-10 md:grid-cols-[1.4fr_1fr] md:items-end">
        <h1 className="max-w-[17ch] text-[clamp(2.2rem,5vw,3.9rem)] font-[450] leading-[1.02] tracking-[-0.02em]">
          Three website concepts for Thai craft and hospitality brands
        </h1>
        <div className="space-y-3 text-[15px] leading-relaxed text-muted">
          <p>
            Working front-ends, not mockups. Every page can be clicked through, every form responds. The brands are fictional,
            built to show how makers and hotels in Thailand can present themselves to buyers at home and abroad.
          </p>
          <p className="text-ink">Chanasak Choonuch, full-stack engineer and product owner, Bangkok</p>
        </div>
      </header>

      <ol className="divide-y divide-line">
        {concepts.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="group grid gap-6 py-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-12">
              <Photo photo={c.photo} className="aspect-[4/3] rounded-[2px]" position={c.position} sizes="(min-width: 768px) 600px, 100vw" />
              <div className="flex flex-col">
                <p className="text-[13px] text-muted">{c.job}</p>
                <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] leading-none" style={c.nameStyle}>
                  {c.name}
                </h2>
                <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed">{c.problem}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {c.inside.map((i) => (
                    <li key={i} className="rounded-full border border-line px-3 py-1 text-[13px] text-muted">
                      {i}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto pt-8 text-[15px] underline decoration-line underline-offset-[6px] transition-colors group-hover:decoration-ink">
                  Open {c.name}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <footer className="border-t border-line pt-6 text-[13px] leading-relaxed text-muted">
        Next.js, TypeScript and Tailwind CSS. Photos from Pexels, used under the Pexels license.{" "}
        <Link href="/credits" className="underline underline-offset-4">
          Photo credits
        </Link>
      </footer>
    </main>
  );
}

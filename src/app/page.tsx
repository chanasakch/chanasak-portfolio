import Link from "next/link";
import { Photo } from "@/components/shared/Photo";
import { photos } from "@/data/images";

const concepts = [
  {
    href: "/saan",
    name: "SAAN Atelier",
    nameStyle: { fontFamily: "Marcellus, serif", letterSpacing: "0.08em" },
    swatch: "#8c2b26",
    photo: photos.bambooChairStudio,
    job: "Brand website",
    problem:
      "A rattan maker with 35 years of craft, award-winning designers and a material story, presented with the confidence of a European design brand.",
    inside: ["Editorial product hero", "Colourway picker", "Material process", "Designers and awards", "Showroom booking"],
  },
  {
    href: "/trade",
    name: "Loom & Tide Trade",
    nameStyle: { fontFamily: '"Schibsted Grotesk Variable", sans-serif', fontWeight: 650 },
    swatch: "#d4501c",
    photo: photos.cafeRattanRow,
    job: "Trade catalogue",
    problem:
      "Hundreds of products and no prices online. Interior designers and distributors filter, compare specs and send one quote request instead of five emails.",
    inside: ["Filters by use and material", "Spec sheets you can print", "Live colourway preview", "Quote list", "Thai and English"],
  },
  {
    href: "/projects",
    name: "Ruen Projects",
    nameStyle: { fontFamily: '"Bodoni Moda Variable", serif', fontStyle: "italic" as const },
    swatch: "#e7a336",
    photo: photos.pergolaPool,
    job: "Hospitality showcase",
    problem:
      "Hotels, condos and screen work turned into case studies that sell. Tap a piece in the photo to see what it is and request it for your own project.",
    inside: ["Case studies by sector", "Shop-the-space hotspots", "Project facts", "Client quotes", "Project inquiry form"],
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-24 pt-10 sm:px-8 sm:pt-16">
      <header className="grid gap-6 border-b border-line pb-10 md:grid-cols-[1.4fr_1fr] md:items-end">
        <h1 className="max-w-[16ch] text-[clamp(2.2rem,5vw,3.9rem)] font-[450] leading-[1.02] tracking-[-0.02em]">
          Three website concepts for a Thai rattan furniture maker
        </h1>
        <div className="space-y-3 text-[15px] leading-relaxed text-muted">
          <p>
            Built as working front-ends, not mockups. Every brand, product and project here is fictional, made to show
            how a craft furniture company could present itself to homeowners, designers and hotels.
          </p>
          <p className="text-ink">Chanasak Choonuch, full-stack engineer and product owner, Bangkok</p>
        </div>
      </header>

      <ol className="divide-y divide-line">
        {concepts.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="group grid gap-6 py-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-12"
            >
              <Photo
                photo={c.photo}
                className="aspect-[4/3] rounded-[2px]"
                imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                sizes="(min-width: 768px) 600px, 100vw"
              />
              <div className="flex flex-col">
                <p className="flex items-center gap-2 text-[13px] text-muted">
                  <span className="inline-block size-2.5 rounded-full" style={{ background: c.swatch }} />
                  {c.job}
                </p>
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

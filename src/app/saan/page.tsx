import Link from "next/link";
import { SaanNav } from "@/components/saan/SaanNav";
import { SaanHero } from "@/components/saan/SaanHero";
import { ColorwayStudio } from "@/components/saan/ColorwayStudio";
import { DesignerList, type Designer } from "@/components/saan/DesignerList";
import { VisitForm } from "@/components/saan/VisitForm";
import { Photo } from "@/components/shared/Photo";
import { photos } from "@/data/images";
import { projects } from "@/data/projects";

const collections = [
  {
    name: "Malai",
    material: "Rattan peel on solid teak",
    pieces: 6,
    photo: photos.wickerArmchairTable,
    href: "/trade/malai-lounge-chair",
    tile: "md:col-span-7 md:row-span-2",
    ratio: "aspect-[4/5]",
  },
  {
    name: "Prang",
    material: "Aluminium laced with poly-rope, in four colours",
    pieces: 5,
    photo: photos.chairsPatternFloor,
    href: "/trade/prang-bar-stool",
    tile: "md:col-span-5",
    ratio: "aspect-[4/3]",
  },
  {
    name: "Kluen",
    material: "Outdoor rope woven in a wave",
    pieces: 8,
    photo: photos.terraceSet,
    href: "/trade/kluen-dining-chair",
    tile: "md:col-span-5",
    ratio: "aspect-[4/3]",
  },
  {
    name: "Saeng",
    material: "Rattan lighting, wrapped in one continuous spiral",
    pieces: 4,
    photo: photos.wickerPendants,
    href: "/trade/saeng-pendant",
    tile: "md:col-span-12",
    ratio: "aspect-[16/9] md:aspect-[21/8]",
  },
];

const steps = [
  {
    name: "Origin",
    text: "Cane from certified groves in the south of Thailand, split and dried in our own yard.",
    photo: photos.rawRattan,
  },
  {
    name: "Shape",
    text: "Heated and bent by hand over steel forms. A curve that would crack in wood holds in rattan.",
    photo: photos.workshop,
  },
  {
    name: "Recompose",
    text: "Offcuts from every order are cut to length and linked into new panels, so very little reaches the bin.",
    photo: photos.woodWeave,
  },
  {
    name: "Evolve",
    text: "Our rice-husk PE rattan keeps the look of cane outdoors, made partly from husks that would otherwise be burned.",
    photo: photos.hexWeave,
  },
];

const designers: Designer[] = [
  {
    name: "Pim Asavarat",
    practice: "Industrial designer trained in Milan and Bangkok. Pim works on how rattan behaves under load, and designed our best-selling lounge collection.",
    work: "Malai, Chan",
    photo: photos.wickerArmchairTable,
  },
  {
    name: "Studio Noknoi",
    practice: "A two-person studio from Chiang Mai known for colour. They brought powder-coated aluminium into our workshop for the first time.",
    work: "Prang, Wan",
    photo: photos.chairsPatternFloor,
  },
  {
    name: "Krit Wattanapong",
    practice: "Former boat builder who designs our outdoor pieces. Everything he draws is tested on a pool deck in Pattaya for one monsoon season.",
    work: "Kluen, Duang",
    photo: photos.terraceSet,
  },
  {
    name: "Mali & Ton",
    practice: "Husband and wife who grew up in a weaving village in Sakon Nakhon. Their pieces use patterns their grandparents taught them.",
    work: "Tor, Phai, Noi",
    photo: photos.armrestDetail,
  },
  {
    name: "Arun Sae-lim",
    practice: "Lighting designer. Arun's lamps are built from a single strand of rattan wrapped without a break.",
    work: "Saeng, Lom",
    photo: photos.rattanLamps,
  },
];

const awards = [
  { year: 2026, award: "Design Excellence Award, furniture", piece: "Prang collection" },
  { year: 2025, award: "Asia Design Prize, sustainable material", piece: "Rice-husk PE rattan" },
  { year: 2024, award: "Good Design selection, Tokyo", piece: "Malai lounge chair" },
  { year: 2024, award: "Export Award for best design", piece: "Phai armchair" },
  { year: 2022, award: "Design Excellence Award, lighting", piece: "Saeng pendant" },
];

export default function SaanPage() {
  return (
    <>
      <SaanNav />
      <main>
        <SaanHero />

        <section className="border-t border-line">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-8 md:grid-cols-[1.3fr_1fr] md:py-28">
            <h2 className="max-w-[18ch] font-display text-[clamp(2rem,4vw,3.6rem)] leading-[1.06]">
              We weave tropical materials into furniture for homes, hotels and the people who design them.
            </h2>
            <div className="md:pt-3">
              <p className="max-w-[44ch] text-[17px] leading-[1.65]">
                SAAN began as a repair shop for rattan chairs in Bangkok in 1989. Today 38 weavers in our Pathum Thani
                workshop make each piece by hand, with designers who know the material as well as they do.
              </p>
              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6">
                {[
                  ["1989", "Founded in Bangkok"],
                  ["38", "Weavers on staff"],
                  ["22", "Countries we ship to"],
                ].map(([value, label]) => (
                  <div key={label} className="flex flex-col">
                    <dt className="text-[13px] leading-snug text-muted">{label}</dt>
                    <dd className="mt-auto pt-1 font-display text-[1.9rem]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="collections" className="mx-auto max-w-[1440px] scroll-mt-6 px-4 pb-10 sm:px-8">
          <div className="flex items-end justify-between gap-6 border-t border-line pt-10">
            <h2 className="font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-none">Collections</h2>
            <Link href="/trade" className="text-[15px] underline underline-offset-[6px]">
              Browse all 120 pieces
            </Link>
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-12">
            {collections.map((c) => (
              <Link key={c.name} href={c.href} className={`group block ${c.tile}`}>
                <Photo
                  photo={c.photo}
                  className={`${c.ratio} w-full rounded-[2px]`}
                  imgClassName="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
                  sizes="(min-width: 768px) 60vw, 100vw"
                />
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-[1.9rem] leading-none">{c.name}</h3>
                  <span className="text-[13px] text-muted">{c.pieces} pieces</span>
                </div>
                <p className="mt-1.5 text-[15px] text-muted">{c.material}</p>
              </Link>
            ))}
          </div>
        </section>

        <ColorwayStudio />

        <section id="material" className="scroll-mt-0 bg-ink text-bg">
          <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 md:py-28">
            <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
              <h2 className="font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.02]">From cane to chair</h2>
              <p className="max-w-[46ch] text-[17px] leading-[1.65] text-bg/75">
                Rattan is getting harder to find. These four stages are how we keep weaving it, and how we are learning
                to weave what comes after it.
              </p>
            </div>
            <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {steps.map((s, i) => (
                <li key={s.name}>
                  <Photo photo={s.photo} className="aspect-[3/4] w-full rounded-[2px] opacity-95" sizes="(min-width: 1024px) 25vw, 50vw" />
                  <p className="mt-5 text-[13px] text-bg/55">Stage {i + 1}</p>
                  <h3 className="mt-1 font-display text-[1.7rem]">{s.name}</h3>
                  <p className="mt-2 max-w-[34ch] text-[15px] leading-[1.6] text-bg/75">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="designers" className="mx-auto max-w-[1440px] scroll-mt-6 px-4 py-20 sm:px-8 md:py-28">
          <div className="mb-10 grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
            <h2 className="font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-none">The designers</h2>
            <p className="max-w-[44ch] text-[16px] leading-relaxed text-muted">
              We work with Thai designers on long collaborations, often five years or more, so each collection has time to
              grow.
            </p>
          </div>
          <DesignerList designers={designers} />
        </section>

        <section className="border-t border-line">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-20 sm:px-8 md:grid-cols-[1fr_2fr]">
            <h2 className="font-display text-[clamp(2rem,3.4vw,3rem)] leading-none">Recognition</h2>
            <table className="w-full text-left text-[15px]">
              <caption className="sr-only">Awards received</caption>
              <thead className="text-[13px] text-muted">
                <tr className="border-b border-line">
                  <th scope="col" className="pb-3 pr-4 font-normal">Year</th>
                  <th scope="col" className="pb-3 pr-4 font-normal">Award</th>
                  <th scope="col" className="pb-3 font-normal">Piece</th>
                </tr>
              </thead>
              <tbody>
                {awards.map((a) => (
                  <tr key={a.award + a.year} className="border-b border-line align-baseline">
                    <td className="tabular py-4 pr-4 text-muted">{a.year}</td>
                    <td className="py-4 pr-4">{a.award}</td>
                    <td className="py-4 text-muted">{a.piece}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="projects" className="scroll-mt-6 bg-soft">
          <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 md:py-28">
            <div className="flex items-end justify-between gap-6">
              <h2 className="max-w-[16ch] font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.02]">
                Where you can sit in our work
              </h2>
              <Link href="/projects" className="shrink-0 text-[15px] underline underline-offset-[6px]">
                All projects
              </Link>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {projects.slice(0, 3).map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}`} className="group block">
                  <Photo
                    photo={p.cover}
                    className="aspect-[4/5] w-full rounded-[2px]"
                    imgClassName="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <h3 className="mt-4 font-display text-[1.5rem] leading-tight">{p.name}</h3>
                  <p className="mt-1 text-[14px] text-muted">{p.location}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="showroom" className="mx-auto max-w-[1440px] scroll-mt-6 px-4 py-20 sm:px-8 md:py-28">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.02]">Visit the showroom</h2>
              <p className="mt-6 max-w-[42ch] text-[17px] leading-[1.65]">
                Sit in every chair before you choose. Our team can bring rope and fabric samples to the table, and talk
                through lead times for a project.
              </p>
              <dl className="mt-10 grid gap-6 text-[15px] sm:grid-cols-2">
                <div>
                  <dt className="text-[13px] text-muted">Address</dt>
                  <dd className="mt-1 leading-relaxed">
                    88 Sukhumvit 49, Klongton-Nua
                    <br />
                    Watthana, Bangkok 10110
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] text-muted">Open</dt>
                  <dd className="mt-1 leading-relaxed">
                    Tuesday to Sunday
                    <br />
                    10:00 to 19:00
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] text-muted">Getting here</dt>
                  <dd className="mt-1 leading-relaxed">Six minutes on foot from BTS Phrom Phong</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-muted">Contact</dt>
                  <dd className="mt-1 leading-relaxed">
                    hello@saan-atelier.example
                    <br />
                    LINE @saanatelier
                  </dd>
                </div>
              </dl>
            </div>
            <div className="md:pt-3">
              <VisitForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 pb-24 pt-10 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:pb-10">
          <span className="font-display text-[18px] tracking-[0.32em] text-ink">SAAN</span>
          <span>Concept site. SAAN Atelier and its products are fictional. Photos from Pexels.</span>
        </div>
      </footer>
    </>
  );
}

import { ProjectIndex } from "@/components/projects/ProjectIndex";
import { IndexInquiry } from "@/components/projects/IndexInquiry";
import { Photo } from "@/components/shared/Photo";
import { photos } from "@/data/images";

const sectors = [
  { name: "Hotels and resorts", detail: "Pool decks, villas, lobbies and bars, built to contract grade." },
  { name: "Residences", detail: "Common areas for condominiums that still look new after years of use." },
  { name: "Restaurants and bars", detail: "Light chairs that staff can reset twice a night." },
  { name: "Film and editorial", detail: "Set pieces delivered to a shooting schedule." },
];

export default function ProjectsPage() {
  return (
    <main>
      <section className="mx-auto max-w-[1440px] px-4 pb-12 pt-28 sm:px-8 sm:pt-36">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <h1 className="font-display text-[clamp(2.8rem,7.4vw,7rem)] font-[450] leading-[0.95] tracking-[-0.01em]">
            Furniture for places people come back to
          </h1>
          <div className="lg:pb-3">
            <p className="max-w-[44ch] text-[17px] leading-[1.65]">
              Since 1989 we have furnished more than 140 hotels, residences and restaurants in 22 countries. These are a
              few of them, with the pieces we made and how we made them.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-8">
        <div className="relative">
          <Photo photo={photos.tropicalPoolside} priority className="aspect-[16/9] w-full rounded-[3px] md:aspect-[21/9]" sizes="100vw" />
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map((s) => (
            <li key={s.name} className="border-t border-ink pt-4">
              <h2 className="font-display text-[1.4rem] italic leading-tight">{s.name}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <ProjectIndex />

      <section id="start" className="bg-soft">
        <div className="mx-auto grid max-w-[1440px] scroll-mt-6 gap-12 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1.3fr] md:py-28">
          <div>
            <h2 className="font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.02]">Planning an opening?</h2>
            <p className="mt-6 max-w-[42ch] text-[17px] leading-[1.65]">
              Tell us about the space and your timeline. We reply with a first selection, sample options and a realistic
              lead time, usually within a week.
            </p>
          </div>
          <IndexInquiry />
        </div>
      </section>
    </main>
  );
}

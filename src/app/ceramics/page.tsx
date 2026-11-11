import Link from "next/link";
import { Photo } from "@/components/shared/Photo";
import { GlazeStudio } from "@/components/ceramics/GlazeStudio";
import { SampleBoxForm, WorkshopBooking } from "@/components/ceramics/Forms";
import { photos } from "@/data/images";
import { pieces } from "@/data/ceramics";

const fmt = new Intl.NumberFormat("en-US");

const nav = [
  { href: "#pieces", label: "Pieces" },
  { href: "#glazes", label: "Glazes" },
  { href: "#restaurants", label: "For restaurants" },
  { href: "#workshops", label: "Workshops" },
];

const steps = [
  { name: "Wedge", photo: photos.clayWorkbench, text: "Red stoneware dug ten kilometres from the studio, aged for a month and kneaded by hand to push out the air." },
  { name: "Throw", photo: photos.throwing, text: "Every piece is thrown on the wheel, then trimmed the next day when the clay is firm as leather." },
  { name: "Dry and bisque", photo: photos.bisqueShelves, text: "Pieces dry slowly on open shelves for a week, then go through a first firing at 900 °C." },
  { name: "Glaze and fire", photo: photos.glazedShelves, text: "Dipped by hand and fired a second time, to 1,280 °C, over fourteen hours. About one in ten does not survive." },
];

export default function CeramicsPage() {
  return (
    <>
      <header className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-5 sm:px-8">
        <a href="#top" className="font-display text-[30px] leading-none tracking-[0.18em]" aria-label="DIN Studio home">
          DIN
        </a>
        <nav className="hidden items-center gap-7 text-[14px] text-muted md:flex" aria-label="Main">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-ink">
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#visit" className="rounded-[2px] border border-ink/25 px-4 py-2 text-[14px] hover:border-ink">
          Visit the studio
        </a>
      </header>

      <main>
        <section id="top" className="mx-auto grid max-w-[1440px] gap-8 px-4 pb-20 pt-4 sm:px-8 md:grid-cols-12 md:gap-10 md:pb-28">
          <div className="md:col-span-7">
            <Photo photo={photos.budVases} priority className="aspect-[4/5] w-full rounded-[2px] md:aspect-[5/6]" position="50% 45%" sizes="(min-width: 768px) 58vw, 100vw" />
          </div>
          <div className="flex flex-col justify-end md:col-span-5 md:pb-4">
            <h1 className="font-display text-[clamp(3rem,6.6vw,6rem)] leading-[0.95]">Stoneware from Lampang</h1>
            <p className="mt-6 max-w-[40ch] text-[17px] leading-[1.7]">
              Vases and tableware thrown, glazed and wood-fired by four potters in a studio on the edge of the town. Each glaze is
              mixed from local ash and earth.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#pieces" className="rounded-[2px] bg-ink px-5 py-3 text-[15px] text-bg">
                See the pieces
              </a>
              <a href="#workshops" className="rounded-[2px] border border-ink/25 px-5 py-3 text-[15px] hover:border-ink">
                Book a wheel class
              </a>
            </div>
            <p className="mt-10 text-[13px] text-muted">Bud vases in iron and rice-husk white, ฿1,450 the pair</p>
          </div>
        </section>

        <section id="pieces" className="mx-auto max-w-[1440px] scroll-mt-6 px-4 pb-24 sm:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-8">
            <h2 className="font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-none">Pieces</h2>
            <p className="max-w-[46ch] text-[15px] text-muted">
              Made in small runs, so glazes vary from piece to piece. Most pieces ship within a week, tableware sets in three.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {pieces.map((p) => (
              <li key={p.name}>
                <Photo photo={p.photo} className="aspect-[4/5] w-full rounded-[2px]" position={p.focus} sizes="(min-width: 768px) 25vw, 50vw" />
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h3 className="text-[15px] font-medium">{p.name}</h3>
                  <span className="tabular shrink-0 text-[14px]">
                    {p.note ? `${p.note} ` : ""}฿{fmt.format(p.priceThb)}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-muted">
                  {p.glaze}. {p.detail}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section id="glazes" className="scroll-mt-6 border-y border-line">
          <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 md:py-28">
            <h2 className="mb-10 max-w-[18ch] font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.02]">Four glazes, all from the ground here</h2>
            <GlazeStudio />
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 md:py-28">
          <h2 className="mb-12 font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-none">How a piece is made</h2>
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((s, i) => (
              <li key={s.name}>
                <Photo photo={s.photo} className="aspect-[3/4] w-full rounded-[2px]" sizes="(min-width: 1024px) 25vw, 50vw" />
                <p className="mt-5 text-[13px] text-muted">Step {i + 1}</p>
                <h3 className="mt-1 font-display text-[1.9rem] leading-none">{s.name}</h3>
                <p className="mt-3 max-w-[36ch] text-[15px] leading-[1.65]">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="restaurants" className="scroll-mt-6 bg-ink text-bg">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1.1fr] md:items-center md:py-24">
            <Photo photo={photos.placeSetting} className="aspect-[4/5] w-full rounded-[2px]" sizes="(min-width: 768px) 45vw, 100vw" />
            <div>
              <h2 className="font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.02]">Tableware for restaurants and hotels</h2>
              <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.7] text-bg/80">
                We make plates and bowls for twelve kitchens in Bangkok and Chiang Mai. Rims are rolled and thickened so they
                survive a dish pit, and every design can be reordered for years.
              </p>
              <dl className="mt-8 grid max-w-[520px] grid-cols-2 gap-6 border-t border-white/20 pt-6 text-[15px]">
                <div>
                  <dt className="text-[13px] text-bg/60">Minimum order</dt>
                  <dd className="mt-1">48 pieces per design</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-bg/60">Lead time</dt>
                  <dd className="mt-1">6 to 8 weeks</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-bg/60">Care</dt>
                  <dd className="mt-1">Dishwasher and microwave safe</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-bg/60">Custom glaze</dt>
                  <dd className="mt-1">From 200 pieces</dd>
                </div>
              </dl>
              <div className="mt-10 rounded-[2px] bg-bg p-5 text-ink sm:p-6">
                <SampleBoxForm />
              </div>
            </div>
          </div>
        </section>

        <section id="workshops" className="mx-auto grid max-w-[1440px] scroll-mt-6 gap-10 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1.15fr] md:py-28">
          <div>
            <h2 className="font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.02]">Wheel workshops</h2>
            <p className="mt-6 max-w-[42ch] text-[17px] leading-[1.7]">
              Small classes in the studio, six people at most. We fire what you make and post it to you three weeks later.
            </p>
            <Photo photo={photos.twoHandsWheel} className="mt-8 aspect-[4/3] w-full rounded-[2px]" sizes="(min-width: 768px) 45vw, 100vw" />
          </div>
          <div className="md:pt-3">
            <WorkshopBooking />
          </div>
        </section>

        <section id="visit" className="scroll-mt-6 border-t border-line">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-16 sm:px-8 md:grid-cols-3">
            <h2 className="font-display text-[clamp(2rem,3.4vw,3rem)] leading-none">Visit</h2>
            <p className="text-[15px] leading-relaxed">
              Studio and shop
              <br />
              <span className="text-muted">
                212 Ban Pong Road, Lampang 52000
                <br />
                Thursday to Sunday, 10:00 to 17:00
              </span>
            </p>
            <p className="text-[15px] leading-relaxed">
              In Bangkok
              <br />
              <span className="text-muted">
                A small selection at concept stores in Ari and Talat Noi.
                <br />
                hello@dinstudio.example
              </span>
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 pb-24 pt-8 text-[13px] text-muted sm:flex-row sm:justify-between sm:px-8 sm:pb-10">
          <span className="font-display text-[20px] tracking-[0.18em] text-ink">DIN</span>
          <span>
            Concept site. DIN Studio is fictional. Photos from Pexels.{" "}
            <Link href="/credits" className="underline underline-offset-4">
              Credits
            </Link>
          </span>
        </div>
      </footer>
    </>
  );
}

import Link from "next/link";
import { DinHero, PiecesRail } from "@/components/ceramics/Din";
import { StickyStory } from "@/components/shared/ui";
import { Photo } from "@/components/shared/Photo";
import { GlazeStudio } from "@/components/ceramics/GlazeStudio";
import { SampleBoxForm, WorkshopBooking } from "@/components/ceramics/Forms";
import { photos } from "@/data/images";

const steps = [
  { name: "Wedge", photo: photos.clayWorkbench, text: "Red stoneware dug ten kilometres from the studio, aged for a month and kneaded by hand to push out the air." },
  { name: "Throw", photo: photos.throwing, text: "Every piece is thrown on the wheel, then trimmed the next day when the clay is firm as leather." },
  { name: "Dry and bisque", photo: photos.bisqueShelves, text: "Pieces dry slowly on open shelves for a week, then go through a first firing at 900 °C." },
  { name: "Glaze and fire", photo: photos.glazedShelves, text: "Dipped by hand and fired a second time, to 1,280 °C, over fourteen hours. About one in ten does not survive." },
];

export default function CeramicsPage() {
  return (
    <>
      <main>
        <DinHero />

        <section id="pieces" className="mx-auto max-w-[1600px] scroll-mt-16 overflow-hidden px-4 pb-28 pt-10 sm:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-none">Pieces</h2>
            <p className="max-w-[46ch] text-[15px] text-muted">
              Made in small runs, so glazes vary from piece to piece. Most pieces ship within a week, tableware sets in three.
            </p>
          </div>
          <PiecesRail />
        </section>

        <section id="glazes" className="scroll-mt-16 border-y border-line">
          <div className="mx-auto max-w-[1600px] px-4 py-20 sm:px-8 md:py-28">
            <h2 className="mb-10 max-w-[18ch] font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.02]">Four glazes, all from the ground here</h2>
            <GlazeStudio />
          </div>
        </section>

        <section id="process" className="mx-auto max-w-[1600px] scroll-mt-16 px-4 py-20 sm:px-8 md:py-28">
          <h2 className="mb-6 font-display text-[clamp(3rem,6vw,5.5rem)] leading-none lg:mb-0">How a piece is made</h2>
          <StickyStory steps={steps.map((s) => ({ title: s.name, text: s.text, photo: s.photo }))} />
        </section>

        <section id="restaurants" className="scroll-mt-16 bg-ink text-bg">
          <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1.1fr] md:items-center md:py-24">
            <Photo photo={photos.placeSetting} className="aspect-[4/5] w-full" sizes="(min-width: 768px) 45vw, 100vw" />
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
              <div className="mt-10 bg-bg p-5 text-ink sm:p-6">
                <SampleBoxForm />
              </div>
            </div>
          </div>
        </section>

        <section id="workshops" className="mx-auto grid max-w-[1600px] scroll-mt-16 gap-10 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1.15fr] md:py-28">
          <div>
            <h2 className="font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.02]">Wheel workshops</h2>
            <p className="mt-6 max-w-[42ch] text-[17px] leading-[1.7]">
              Small classes in the studio, six people at most. We fire what you make and post it to you three weeks later.
            </p>
            <Photo photo={photos.twoHandsWheel} className="mt-8 aspect-[4/3] w-full" sizes="(min-width: 768px) 45vw, 100vw" />
          </div>
          <div className="md:pt-3">
            <WorkshopBooking />
          </div>
        </section>

        <section id="visit" className="scroll-mt-16 border-t border-line">
          <div className="mx-auto grid max-w-[1600px] gap-8 px-4 py-16 sm:px-8 md:grid-cols-3">
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
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 pb-24 pt-8 text-[13px] text-muted sm:flex-row sm:justify-between sm:px-8 sm:pb-10">
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

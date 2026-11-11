import Link from "next/link";
import { DinHero, PiecesRail } from "@/components/ceramics/Din";
import { StickyStory } from "@/components/shared/ui";
import { RevealImage, ScrollText, SplitLines } from "@/components/shared/motion";
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

        <section className="grid gap-12 px-[var(--gutter)] py-[16vh] lg:grid-cols-12 lg:gap-6">
          <p className="text-[14px] text-muted lg:col-span-3">The studio</p>
          <div className="lg:col-span-8 lg:col-start-5">
            <ScrollText
              className="font-display text-[clamp(2rem,4vw,3.9rem)] leading-[1.08]"
              text="Four potters, one wood kiln and red clay dug ten kilometres up the road. Nothing is cast in a mould, so no two cups are quite the same, and we think that is the point."
            />
            <div className="mt-16 grid grid-cols-2 gap-[var(--gutter)]">
              <RevealImage photo={photos.whiteVesselsSoft} className="aspect-[4/5] w-full" sizes="33vw" />
              <RevealImage photo={photos.glazedShelves} className="mt-[12vh] aspect-[4/5] w-full" sizes="33vw" />
            </div>
          </div>
        </section>

        <section id="pieces" className="scroll-mt-16 px-[var(--gutter)] pb-[18vh]">
          <div className="mb-6 grid gap-6 lg:grid-cols-12">
            <SplitLines as="h2" inView lines={["Pieces"]} className="font-display text-[clamp(3.4rem,8vw,8rem)] leading-[0.9] lg:col-span-6" />
            <p className="max-w-[40ch] self-end text-[15px] leading-relaxed text-muted lg:col-span-4 lg:col-start-9">
              Made in small runs, so glazes vary from piece to piece. Most pieces ship within a week, tableware sets in three.
            </p>
          </div>
          <PiecesRail />
        </section>

        <section id="glazes" className="scroll-mt-16 border-y border-line">
          <div className="px-[var(--gutter)] py-[16vh]">
            <SplitLines as="h2" inView lines={["Four glazes,", "all from the ground here"]} className="mb-14 font-display text-[clamp(2.6rem,5.4vw,5.2rem)] leading-[0.95]" />
            <GlazeStudio />
          </div>
        </section>

        <section id="process" className="scroll-mt-16 px-[var(--gutter)] py-[16vh]">
          <SplitLines as="h2" inView lines={["How a piece", "is made"]} className="mb-10 font-display text-[clamp(2.6rem,5.4vw,5.2rem)] leading-[0.95] lg:mb-4" />
          <StickyStory steps={steps.map((s) => ({ title: s.name, text: s.text, photo: s.photo }))} />
        </section>

        <section id="restaurants" className="scroll-mt-16 bg-ink text-bg">
          <div className="grid gap-12 px-[var(--gutter)] py-[16vh] lg:grid-cols-2 lg:items-center lg:gap-[var(--gutter)]">
            <RevealImage photo={photos.placeSetting} className="aspect-[4/5] w-full" sizes="(min-width: 1024px) 45vw, 100vw" />
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

        <section id="workshops" className="grid scroll-mt-16 gap-12 px-[var(--gutter)] py-[16vh] lg:grid-cols-2 lg:gap-[var(--gutter)]">
          <div>
            <h2 className="font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.02]">Wheel workshops</h2>
            <p className="mt-6 max-w-[42ch] text-[17px] leading-[1.7]">
              Small classes in the studio, six people at most. We fire what you make and post it to you three weeks later.
            </p>
            <RevealImage photo={photos.twoHandsWheel} className="mt-10 aspect-[4/3] w-full" sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
          <div className="md:pt-3">
            <WorkshopBooking />
          </div>
        </section>

        <section id="visit" className="scroll-mt-16 border-t border-line">
          <div className="grid gap-8 px-[var(--gutter)] py-20 md:grid-cols-3">
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

      <footer className="overflow-hidden border-t border-line">
        <div className="flex flex-col gap-3 px-[var(--gutter)] pt-10 text-[13px] text-muted sm:flex-row sm:justify-between">
          <span>hello@dinstudio.example</span>
          <span>
            Concept site. DIN Studio is fictional. Photos from Pexels.{" "}
            <Link href="/credits" className="underline underline-offset-4">
              Credits
            </Link>
          </span>
        </div>
        <p aria-hidden className="select-none px-[var(--gutter)] pb-16 pt-6 text-center font-display text-[clamp(8rem,38vw,40rem)] leading-[0.75] tracking-[0.06em] sm:pb-2">
          DIN
        </p>
      </footer>
    </>
  );
}

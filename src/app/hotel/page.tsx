import Link from "next/link";
import { Photo } from "@/components/shared/Photo";
import { BookButton, RoomsRail, RuenHero, SpacesGallery } from "@/components/hotel/Ruen";
import { RevealImage, ScrollText, SplitLines } from "@/components/shared/motion";
import { ShopTheSpace } from "@/components/hotel/ShopTheSpace";
import { photos } from "@/data/images";
import { balconySpots } from "@/data/hotel";

export default function HotelPage() {
  return (
    <>
      <main>
        <RuenHero />

        <section className="grid gap-12 px-[var(--gutter)] py-[18vh] lg:grid-cols-12 lg:gap-6">
          <p className="text-[14px] text-muted lg:col-span-3">Since 2019</p>
          <div className="lg:col-span-8 lg:col-start-5">
            <ScrollText
              className="font-display text-[clamp(2rem,4vw,3.9rem)] leading-[1.1]"
              text="We built Ruen Doi around a teak house that stood here for seventy years, and furnished it with chairs woven a day’s drive away."
            />
            <dl className="mt-16 grid grid-cols-2 gap-6 text-[15px] sm:grid-cols-4">
              {[
                ["Rooms", "24"],
                ["From the airport", "55 min"],
                ["Above sea level", "680 m"],
                ["Cool season", "Nov to Feb"],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-ink pt-4">
                  <dt className="text-[13px] text-muted">{k}</dt>
                  <dd className="mt-2 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div id="rooms" className="scroll-mt-0 pb-[14vh]">
          <RoomsRail />
        </div>

        <section className="bg-[var(--forest)] text-white">
          <div className="px-[var(--gutter)] py-[16vh]">
            <div className="mb-10 grid gap-4 md:grid-cols-[1.2fr_1fr] md:items-end">
              <h2 className="max-w-[18ch] font-display text-[clamp(2rem,3.8vw,3.3rem)] leading-[1.04]">
                Every chair on the balcony was woven in Thailand
              </h2>
              <p className="max-w-[44ch] text-[16px] leading-relaxed text-white/75">
                Select a marker to see the piece. Our furniture comes from Loom &amp; Tide in Bangkok, and every room lists
                what is in it.
              </p>
            </div>
            <ShopTheSpace photo={photos.balconyRattanPods} spots={balconySpots} caption="Lake Room balcony, early morning" />
          </div>
        </section>

        <section id="house" className="scroll-mt-20 px-[var(--gutter)] py-[18vh]">
          <SplitLines as="h2" inView lines={["The house", "and grounds"]} className="mb-20 font-display text-[clamp(3rem,7vw,7rem)] leading-[0.9]" />
          <SpacesGallery />
        </section>

        <section id="dining" className="scroll-mt-20 bg-soft">
          <div className="grid gap-12 px-[var(--gutter)] py-[16vh] lg:grid-cols-2 lg:items-center lg:gap-[var(--gutter)]">
            <RevealImage photo={photos.mistyTerrace} className="aspect-[4/5] w-full" sizes="(min-width: 1024px) 50vw, 100vw" />
            <div>
              <h2 className="font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-none">Dinner on the terrace</h2>
              <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.7]">
                One long table, a set menu from the Tuesday market in Mae Suai, and wine chosen by our manager, who used to run a
                cellar in Bangkok. Guests from outside the hotel are welcome on Friday and Saturday.
              </p>
              <dl className="mt-8 grid max-w-[460px] grid-cols-2 gap-6 border-t border-line pt-6 text-[15px]">
                <div>
                  <dt className="text-[13px] text-muted">Breakfast</dt>
                  <dd className="mt-1">7:00 to 10:30</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-muted">Dinner</dt>
                  <dd className="mt-1">From 18:30, one seating</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section id="getting-here" className="grid scroll-mt-20 gap-12 px-[var(--gutter)] py-[16vh] lg:grid-cols-12 lg:gap-6">
          <h2 className="font-display text-[clamp(2.4rem,4.6vw,4.4rem)] leading-none lg:col-span-4">Getting here</h2>
          <ol className="grid gap-6 text-[16px] leading-relaxed sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
            <li className="border-t border-ink pt-4">
              <span className="block text-[13px] text-muted">Fly</span>
              Bangkok to Chiang Rai takes 1 hour 20 minutes, with around ten flights a day.
            </li>
            <li className="border-t border-ink pt-4">
              <span className="block text-[13px] text-muted">Drive</span>
              Our driver meets you at arrivals. The road climbs for the last twenty minutes.
            </li>
            <li className="border-t border-ink pt-4">
              <span className="block text-[13px] text-muted">Arrive</span>
              Tea is served in the old house while we carry your bags up.
            </li>
          </ol>
        </section>

        <section id="start" className="relative overflow-hidden text-white">
          <Photo photo={photos.resortPool} className="absolute inset-0 h-full w-full" position="50% 60%" sizes="100vw" />
          <div className="absolute inset-0 bg-[rgb(12_26_22/0.55)]" />
          <div className="relative flex min-h-[90svh] flex-col items-start justify-end px-[var(--gutter)] py-20">
            <h2 className="max-w-[14ch] font-display text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.96]">Come up for a few cool nights</h2>
            <p className="mt-5 max-w-[42ch] text-[17px] leading-relaxed text-white/85">Rates include breakfast, airport transfer and afternoon tea. stay@ruendoi.example, +66 53 000 000</p>
            <BookButton className="mt-8 rounded-full bg-accent px-7 py-3.5 text-[15px] font-medium text-accent-ink transition-transform hover:scale-[1.03]">Request a stay</BookButton>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="flex flex-col gap-3 px-[var(--gutter)] pb-24 pt-8 text-[13px] text-muted sm:flex-row sm:justify-between sm:px-8 sm:pb-10">
          <span className="font-display text-[20px] italic text-ink">Ruen Doi</span>
          <span>
            Concept site. Ruen Doi is fictional. Photos from Pexels.{" "}
            <Link href="/credits" className="underline underline-offset-4">
              Credits
            </Link>
          </span>
        </div>
      </footer>
    </>
  );
}

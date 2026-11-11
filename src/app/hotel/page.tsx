import Link from "next/link";
import { Photo } from "@/components/shared/Photo";
import { BookButton, RoomsRail, RuenHero, SpacesGallery } from "@/components/hotel/Ruen";
import { ShopTheSpace } from "@/components/hotel/ShopTheSpace";
import { photos } from "@/data/images";
import { balconySpots } from "@/data/hotel";

export default function HotelPage() {
  return (
    <>
      <main>
        <RuenHero />

        <section className="mx-auto grid max-w-[1600px] gap-10 px-4 pb-20 pt-24 sm:px-8 md:grid-cols-[1.2fr_1fr] md:pt-32">
          <p className="max-w-[28ch] font-display text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.18]">
            We built Ruen Doi around a teak house that stood here for seventy years, and furnished it with chairs woven a day&rsquo;s drive away.
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 self-end border-t border-line pt-6 text-[15px]">
            <div>
              <dt className="text-[13px] text-muted">Rooms</dt>
              <dd className="mt-1 font-display text-[1.8rem]">24</dd>
            </div>
            <div>
              <dt className="text-[13px] text-muted">From Chiang Rai airport</dt>
              <dd className="mt-1 font-display text-[1.8rem]">55 min</dd>
            </div>
            <div>
              <dt className="text-[13px] text-muted">Height above sea level</dt>
              <dd className="mt-1 font-display text-[1.8rem]">680 m</dd>
            </div>
            <div>
              <dt className="text-[13px] text-muted">Cool season</dt>
              <dd className="mt-1 font-display text-[1.8rem]">Nov to Feb</dd>
            </div>
          </dl>
        </section>

        <section id="rooms" className="mx-auto max-w-[1600px] scroll-mt-20 overflow-hidden px-4 pb-28 sm:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(2.6rem,5.4vw,4.8rem)] leading-none">Rooms</h2>
            <p className="max-w-[40ch] text-[15px] text-muted">Twenty-four rooms in three kinds. Drag or use the arrows, and open a room to see what is in it.</p>
          </div>
          <RoomsRail />
        </section>

        <section className="bg-[var(--forest)] text-white">
          <div className="mx-auto max-w-[1600px] px-4 py-20 sm:px-8 md:py-24">
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

        <section id="house" className="mx-auto max-w-[1600px] scroll-mt-20 px-4 py-24 sm:px-8">
          <h2 className="mb-12 font-display text-[clamp(2.6rem,5.4vw,4.8rem)] leading-none">The house and grounds</h2>
          <SpacesGallery />
        </section>

        <section id="dining" className="scroll-mt-20 bg-soft">
          <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1.1fr] md:items-center md:py-24">
            <Photo photo={photos.mistyTerrace} className="aspect-[4/3] w-full" sizes="(min-width: 768px) 45vw, 100vw" />
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

        <section id="getting-here" className="mx-auto grid max-w-[1600px] scroll-mt-20 gap-10 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1.3fr]">
          <h2 className="font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-none">Getting here</h2>
          <ol className="grid gap-6 text-[16px] leading-relaxed sm:grid-cols-3">
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
          <div className="relative mx-auto flex min-h-[70svh] max-w-[1600px] flex-col items-start justify-end px-4 py-20 sm:px-8">
            <h2 className="max-w-[14ch] font-display text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.96]">Come up for a few cool nights</h2>
            <p className="mt-5 max-w-[42ch] text-[17px] leading-relaxed text-white/85">Rates include breakfast, airport transfer and afternoon tea. stay@ruendoi.example, +66 53 000 000</p>
            <BookButton className="mt-8 rounded-full bg-accent px-7 py-3.5 text-[15px] font-medium text-accent-ink transition-transform hover:scale-[1.03]">Request a stay</BookButton>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 pb-24 pt-8 text-[13px] text-muted sm:flex-row sm:justify-between sm:px-8 sm:pb-10">
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

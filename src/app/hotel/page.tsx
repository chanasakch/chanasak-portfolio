import Link from "next/link";
import { Photo } from "@/components/shared/Photo";
import { AvailabilityBar, EnquiryForm } from "@/components/hotel/Booking";
import { Rooms } from "@/components/hotel/Rooms";
import { ShopTheSpace } from "@/components/hotel/ShopTheSpace";
import { photos } from "@/data/images";
import { balconySpots, spaces } from "@/data/hotel";

const nav = [
  { href: "#rooms", label: "Rooms" },
  { href: "#house", label: "The house" },
  { href: "#dining", label: "Dining" },
  { href: "#getting-here", label: "Getting here" },
];

export default function HotelPage() {
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30 text-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-5 sm:px-8">
          <a href="#top" className="font-display text-[26px] italic leading-none">
            Ruen Doi
          </a>
          <nav className="hidden items-center gap-7 text-[14px] md:flex" aria-label="Main">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="opacity-85 hover:opacity-100">
                {n.label}
              </a>
            ))}
          </nav>
          <a href="#start" className="rounded-full bg-accent px-4 py-2 text-[14px] font-medium text-accent-ink">
            Book a stay
          </a>
        </div>
      </header>

      <main>
        <section id="top" className="relative bg-[var(--forest)]">
          <div className="relative h-[78svh] min-h-[520px] max-h-[860px]">
            <Photo photo={photos.balconyRattanPods} priority className="absolute inset-0 h-full w-full" position="50% 55%" sizes="100vw" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(12_26_22/0.45)_0%,rgb(12_26_22/0)_22%,rgb(12_26_22/0.15)_45%,rgb(12_26_22/0.82)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-4 pb-28 text-white sm:px-8 sm:pb-32">
              <h1 className="max-w-[16ch] font-display text-[clamp(2.6rem,6.4vw,5.8rem)] font-[450] leading-[0.98]">
                A small hotel above the lake
              </h1>
              <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-white/90">
                Twenty-four rooms in the hills of Chiang Rai, where the mist burns off the water by nine.
              </p>
            </div>
          </div>
          <div className="relative z-10 mx-auto -mt-16 max-w-[1100px] px-4 sm:-mt-20 sm:px-8">
            <AvailabilityBar />
          </div>
          <div className="h-10 bg-bg" aria-hidden />
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-10 px-4 pb-20 pt-14 sm:px-8 md:grid-cols-[1.2fr_1fr] md:pt-20">
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

        <section id="rooms" className="mx-auto max-w-[1440px] scroll-mt-6 px-4 pb-24 sm:px-8">
          <h2 className="mb-8 font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-none">Rooms</h2>
          <Rooms />
        </section>

        <section className="bg-[var(--forest)] text-white">
          <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 md:py-24">
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

        <section id="house" className="mx-auto max-w-[1440px] scroll-mt-6 px-4 py-24 sm:px-8">
          <h2 className="mb-10 font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-none">The house and grounds</h2>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
            {spaces.map((s, i) => (
              <figure key={s.name} className={i % 2 === 1 ? "sm:mt-20" : ""}>
                <Photo photo={s.photo} className="aspect-[4/5] w-full rounded-[2px]" position={s.focus} sizes="(min-width: 640px) 50vw, 100vw" />
                <figcaption className="mt-4">
                  <span className="block font-display text-[1.5rem] italic leading-tight">{s.name}</span>
                  <span className="mt-1 block max-w-[44ch] text-[15px] leading-relaxed text-muted">{s.text}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="dining" className="scroll-mt-6 bg-soft">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1.1fr] md:items-center md:py-24">
            <Photo photo={photos.mistyTerrace} className="aspect-[4/3] w-full rounded-[2px]" sizes="(min-width: 768px) 45vw, 100vw" />
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

        <section id="getting-here" className="mx-auto grid max-w-[1440px] scroll-mt-6 gap-10 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1.3fr]">
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

        <section id="start" className="scroll-mt-6 bg-soft">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1.3fr] md:py-24">
            <div>
              <h2 className="font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1.02]">Request a stay</h2>
              <p className="mt-6 max-w-[40ch] text-[17px] leading-[1.65]">
                Tell us your dates and we will hold a room while we confirm. Rates include breakfast, airport transfer and
                afternoon tea.
              </p>
              <p className="mt-6 text-[15px] leading-relaxed">
                stay@ruendoi.example
                <br />
                +66 53 000 000
              </p>
            </div>
            <EnquiryForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 pb-24 pt-8 text-[13px] text-muted sm:flex-row sm:justify-between sm:px-8 sm:pb-10">
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

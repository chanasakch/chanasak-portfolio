import Link from "next/link";

const concepts = [
  { href: "/parfum", name: "HOM", font: '"Cormorant Garamond", Georgia, serif', weight: 300, track: "0.3em", bg: "#1d1a14", ink: "#efe9df", job: "Fragrance house", what: "A perfume bottle rendered live. The camera tours it as you scroll, then you turn it, zoom in, switch scents and print initials on the label.", tags: ["Live 3D", "Scroll tour", "360 turn", "Label preview"] },
  { href: "/furniture", name: "Loom & Tide", font: '"Hanken Grotesk Variable", sans-serif', weight: 600, track: "-0.02em", bg: "#2b2f2a", ink: "#f4f2ee", job: "Rattan furniture", what: "A complete shop for a rattan furniture maker: collection with filters, product pages with photo zoom, a quote list, projects, trade programme and showroom.", tags: ["Full site, 8 pages", "Photo zoom", "Quote list", "Trade enquiry"] },
  { href: "/jewelry", name: "PHLOI", font: '"Italiana", Georgia, serif', weight: 400, track: "0.4em", bg: "#eceef0", ink: "#15171a", job: "Fine jewellery", what: "A solitaire ring you build in 3D: Thai sapphire, ruby or emerald, metal, cut and carat, with the engraving previewed inside the band.", tags: ["Live 3D", "Gem refraction", "Engraving preview", "Viewing booking"] },
  { href: "/ceramics", name: "DIN", font: '"Schibsted Grotesk Variable", sans-serif', weight: 800, track: "-0.05em", bg: "#f2f2ef", ink: "#1b1b19", job: "Stoneware studio", what: "The shop is one endless wall of pieces you drag through in any direction. Open one to magnify the glaze and add it to an order.", tags: ["Infinite drag wall", "Magnifier", "Filters", "Order drawer"] },
  { href: "/hotel", name: "Ruen Doi", font: '"Bodoni Moda Variable", serif', weight: 400, track: "0", bg: "#17221e", ink: "#e9e4d8", job: "Boutique hotel", what: "One day at the hotel, told hour by hour. The page moves from morning mist to night as you scroll, then a calendar shows nightly rates.", tags: ["Time of day scroll", "Rate calendar", "Room hold"] },
  { href: "/residence", name: "RIM NAM", font: '"Inter Tight Variable", sans-serif', weight: 750, track: "-0.04em", bg: "#e3e1dc", ink: "#14171a", job: "Riverside residences", what: "Pick a floor on the tower to see what is left, open a residence plan room by room and work out the payments.", tags: ["Stacking plan", "Interactive floor plan", "Payment calculator"] },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#e9e8e4] px-[var(--gutter)] pb-24 pt-12 text-[#151514]" style={{ fontFamily: '"Jost Variable", "Jost", system-ui, sans-serif' }}>
      <header className="grid gap-6 pb-12 md:grid-cols-[1.4fr_1fr] md:items-end">
        <h1 className="max-w-[16ch] text-[clamp(2.4rem,5vw,4.4rem)] font-[450] leading-[1] tracking-[-0.03em]">Six website concepts for Thai brands</h1>
        <div className="space-y-3 text-[15px] leading-relaxed text-[#5f5e59]">
          <p>Working front-ends, not mockups. Each one is built around a single interaction that suits what the brand sells. Brands are fictional.</p>
          <p className="text-[#151514]">Chanasak Choonuch, full-stack engineer and product owner, Bangkok</p>
        </div>
      </header>
      <ol className="grid gap-4 md:grid-cols-2">
        {concepts.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="group flex h-full min-h-[340px] flex-col justify-between rounded-[2px] p-7 transition-transform duration-500 hover:-translate-y-1 sm:p-10" style={{ background: c.bg, color: c.ink }}>
              <div className="flex items-start justify-between gap-6">
                <span className="text-[13px] opacity-60">{c.job}</span>
                <span className="text-[14px] underline decoration-current/30 underline-offset-[6px] transition-colors group-hover:decoration-current">Open</span>
              </div>
              <div>
                <h2 className="text-[clamp(2.8rem,6vw,4.6rem)] leading-none" style={{ fontFamily: c.font, fontWeight: c.weight, letterSpacing: c.track }}>
                  {c.name}
                </h2>
                <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed opacity-75">{c.what}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <li key={t} className="rounded-full border border-current/20 px-3 py-1 text-[12px] opacity-80">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          </li>
        ))}
      </ol>
      <footer className="pt-8 text-[13px] text-[#5f5e59]">
        Next.js, TypeScript, Tailwind CSS, Motion and three.js. Photos from Pexels.{" "}
        <Link href="/credits" className="underline underline-offset-4">
          Photo credits
        </Link>
      </footer>
    </main>
  );
}

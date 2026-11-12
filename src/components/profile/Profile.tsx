"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ease, SmoothScroll, SplitLines, useFinePointer } from "@/components/shared/motion";
import { IMG_BASE } from "@/data/images";

const work = [
  { href: "/furniture", shot: "furniture", name: "Loom & Tide", font: '"Hanken Grotesk Variable", sans-serif', weight: 600, track: "-0.02em", bg: "#2b2f2a", ink: "#f4f2ee", job: "Rattan furniture maker", what: "A full shop: collection with filters, product pages with photo zoom, a quote list for hotels and restaurants, projects and showroom.", tags: ["8 pages", "Photo zoom", "Quote list"] },
  { href: "/parfum", shot: "parfum", name: "HOM", font: '"Cormorant Garamond", Georgia, serif', weight: 300, track: "0.3em", bg: "#1d1a14", ink: "#efe9df", job: "Perfume house", what: "The bottle is real-time 3D. It turns as you scroll, then you spin it, change the scent and print your initials on the label.", tags: ["Three.js", "360° product", "Label preview"] },
  { href: "/jewelry", shot: "jewelry", name: "PHLOI", font: '"Italiana", Georgia, serif', weight: 400, track: "0.4em", bg: "#e6e8eb", ink: "#15171a", job: "Fine jewellery", what: "Build a solitaire ring in 3D. Stone, metal, cut and carat change the ring and the price, and the engraving shows inside the band.", tags: ["Three.js", "Configurator", "Booking"] },
  { href: "/ceramics", shot: "ceramics", name: "DIN", font: '"Schibsted Grotesk Variable", sans-serif', weight: 800, track: "-0.05em", bg: "#ecebe6", ink: "#1b1b19", job: "Stoneware studio", what: "The shop is one wall of pieces you drag in any direction. Open a piece to magnify the glaze and add it to an order.", tags: ["Infinite canvas", "Magnifier", "Order drawer"] },
  { href: "/hotel", shot: "hotel", name: "Ruen Doi", font: '"Bodoni Moda Variable", serif', weight: 400, track: "0", bg: "#17221e", ink: "#e9e4d8", job: "Boutique hotel", what: "One day at the hotel, from morning mist to night. The colours change with the hour, then a calendar shows rates and holds a room.", tags: ["Scroll story", "Rate calendar", "Room hold"] },
  { href: "/residence", shot: "residence", name: "RIM NAM", font: '"Inter Tight Variable", sans-serif', weight: 750, track: "-0.04em", bg: "#dddbd5", ink: "#14171a", job: "Riverside condominium", what: "Pick a floor on the tower to see which units are left, open the plan room by room and work out the down payment.", tags: ["Stacking plan", "Floor plans", "Payment calculator"] },
];

const jobs = [
  { logo: "garena.webp", co: "Garena Online (Thailand)", role: "Full Stack Engineer", when: "Oct 2025 to now", note: "Lead product delivery end to end, from PRD and system design to release, UAT and user training. Go, React, MySQL, Redis, RabbitMQ, Grafana." },
  { logo: "realsmart.svg", co: "Real Smart", role: "Developer", when: "Aug 2024 to Sep 2025", note: "LLM chatbot and text tools, and a course and accommodation booking site with live availability. Vue, Nuxt, Node.js, Laravel." },
  { logo: "bookdose.webp", co: "Bookdose", role: "Full Stack Web Developer", when: "Mar 2023 to Jul 2024", note: "E-library, e-commerce and e-learning systems for partners such as the Golden Jubilee Museum of Agriculture, plus APIs for the mobile apps." },
  { logo: "act.webp", co: "Assumption College Thonburi", role: "Web Developer, internship", when: "Feb to May 2022", note: "Built the library system alone, from interviews with staff to deployment on the school server." },
  { logo: "vpadvance.webp", co: "VP Advance", role: "Front-end Developer, internship", when: "Mar to Jun 2021", note: "Front-end for the Eastern Economic Corridor (EEC) information system." },
];

const skills = [
  ["Build", "Go (Fiber), React, Next.js, Node.js, TypeScript, Vue, Nuxt, Laravel, Three.js"],
  ["Data", "MySQL, MongoDB, Redis, RabbitMQ, schema design, query tuning"],
  ["Ship", "Docker, Nginx, GitLab CI, GitHub Actions, CDN and object storage, Grafana"],
  ["Test", "Playwright, Cypress, manual test plans, UAT"],
  ["Plan", "PRDs, user flows, acceptance criteria, ERD, C4, sequence diagrams"],
];

const certs = [
  { title: "Supervised Machine Learning: Regression and Classification", by: "DeepLearning.AI and Stanford", logo: "stanford.svg" },
  { title: "Introduction to Front-End Development", by: "Meta", logo: "meta.svg" },
  { title: "Introduction to Databases for Back-End Development", by: "Meta", logo: "meta.svg" },
  { title: "Programming with JavaScript", by: "Meta", logo: "meta.svg" },
  { title: "Introduction to Agile Development and Scrum", by: "IBM", logo: "ibm.svg" },
  { title: "AWS Cloud Technical Essentials", by: "Amazon Web Services", logo: "aws.svg" },
];

const awards = [
  { title: "Hackathon Teaching Academy Award", when: "2020" },
  { title: "CRU Robot Games: Nuclear Fusion Mechanical Innovation Power Plant for Humanity", when: "2019" },
  { title: "Software Innovation Teaching Academy Award, 1st runner-up", when: "2019" },
];

const stack = ["go", "fiber", "react", "nodejs", "typescript", "vue", "nuxt", "laravel", "mysql", "mongodb", "redis", "rabbitmq", "docker", "nginx", "gitlab", "githubactions", "grafana", "playwright", "cypress"];

const logo = (f: string) => `${IMG_BASE}logos/${f}`;

function Logo({ src, size = 40, className = "" }: { src: string; size?: number; className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5 ring-1 ring-black/5 ${className}`} style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo(src)} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
    </span>
  );
}

const shot = (s: string, w: 700 | 1400) => `${IMG_BASE}work/${s}-${w}.webp`;

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 mix-blend-difference text-white">
      <div className="flex items-center justify-between px-[var(--gutter)] py-5 text-[14px]">
        <Link href="/" className="font-semibold tracking-[-0.01em]">
          Chanasak Choonuch
        </Link>
        <nav className="flex gap-5 sm:gap-7">
          <a href="#work">Work</a>
          <a href="#experience" className="hidden sm:inline">
            Experience
          </a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}

const wallRows = [
  ["furniture", "parfum", "jewelry", "ceramics", "hotel", "residence"],
  ["hotel", "residence", "ceramics", "furniture", "jewelry", "parfum"],
];

/** Phones: the same tilted wall drifting on its own, so it runs on the GPU and never fights the finger. */
function WallTouch() {
  return (
    <div className="relative overflow-hidden py-4 [perspective:1100px]" aria-hidden>
      <div className="space-y-3 [transform:rotateX(16deg)_scale(0.94)] [transform-origin:50%_0]">
        {wallRows.map((items, r) => (
          <div key={r} className={`flex w-max gap-3 pr-3 will-change-transform ${r ? "animate-[wall_46s_linear_infinite_reverse]" : "animate-[wall_40s_linear_infinite]"}`}>
            {[...items, ...items].map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={shot(s, 700)} alt="" decoding="async" className="aspect-[16/10] w-[64vw] shrink-0 rounded-md object-cover shadow-[0_10px_24px_-14px_rgb(0_0_0/0.45)]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Tilted wall of the six sites that straightens as you scroll. */
function Wall() {
  return useFinePointer() ? <WallScroll /> : <WallTouch />;
}

function WallScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [32, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.86, 1]);
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-22%", "0%"]);
  const rows: [string[], MotionValue<string>][] = [
    [["furniture", "parfum", "jewelry", "ceramics", "hotel", "residence"], x1],
    [["hotel", "residence", "ceramics", "furniture", "jewelry", "parfum"], x2],
  ];
  return (
    <div ref={ref} className="relative overflow-hidden py-6 [perspective:1400px]">
      <motion.div style={{ rotateX, scale }} className="origin-top space-y-4 sm:space-y-6">
        {rows.map(([items, x], r) => (
          <motion.div key={r} style={{ x }} className="flex w-max gap-4 sm:gap-6">
            {[...items, ...items.slice(0, 2)].map((s, i) => {
              const w = work.find((k) => k.shot === s)!;
              return (
                <Link key={i} href={w.href} className="block w-[62vw] shrink-0 overflow-hidden rounded-lg shadow-[0_30px_60px_-20px_rgb(0_0_0/0.35)] sm:w-[34vw]" tabIndex={-1} aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={shot(s, 700)} alt="" className="aspect-[16/10] w-full object-cover" loading={i < 4 ? "eager" : "lazy"} />
                </Link>
              );
            })}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function WorkCard({ w, i, progress }: { w: (typeof work)[number]; i: number; progress: MotionValue<number> }) {
  const n = work.length;
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.035]);
  const fine = useFinePointer();
  return (
    <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center">
      <motion.article
        style={{ scale: fine ? scale : 1, background: w.bg, color: w.ink, top: fine ? `${i * 14}px` : 0 }}
        className="relative grid origin-top items-center gap-8 overflow-hidden rounded-2xl p-6 sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-14 lg:p-14"
      >
        <div className="min-w-0">
          <p className="text-[13px] opacity-60">{w.job}</p>
          <h3 className="mt-3 text-[clamp(2.2rem,4.5vw,4rem)] leading-none" style={{ fontFamily: w.font, fontWeight: w.weight, letterSpacing: w.track }}>
            {w.name}
          </h3>
          <p className="mt-6 max-w-[44ch] text-[15.5px] leading-relaxed opacity-80">{w.what}</p>
          <ul className="mt-6 flex flex-wrap gap-2 text-[12.5px]">
            {w.tags.map((t) => (
              <li key={t} className="rounded-full border border-current/25 px-3 py-1">
                {t}
              </li>
            ))}
          </ul>
          <Link href={w.href} className="mt-8 inline-flex rounded-full px-6 py-3 text-[14px] transition-transform hover:scale-[1.03]" style={{ background: w.ink, color: w.bg }}>
            Open the site
          </Link>
        </div>
        <Link href={w.href} className="group block min-w-0 overflow-hidden rounded-lg shadow-[0_40px_80px_-30px_rgb(0_0_0/0.5)]" aria-label={`Open ${w.name}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shot(w.shot, 1400)}
            srcSet={`${shot(w.shot, 700)} 700w, ${shot(w.shot, 1400)} 1400w`}
            sizes="(min-width:1024px) 55vw, 90vw"
            alt={`${w.name} home page`}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </Link>
      </motion.article>
    </div>
  );
}

function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section id="work" className="px-[var(--gutter)] pt-28">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
        <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">Six sites for Thai brands</h2>
        <p className="max-w-[46ch] text-[16px] leading-relaxed text-muted lg:justify-self-end">
          Designed and built in Next.js, each around what the brand sells. Open any of them and use it on your phone or laptop.
        </p>
      </div>
      <div ref={ref} className="mt-12 space-y-6 lg:mt-4 lg:space-y-0">
        {work.map((w, i) => (
          <WorkCard key={w.href} w={w} i={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

export function Profile() {
  return (
    <div className="b-me">
      <SmoothScroll />
      <Nav />
      <section className="px-[var(--gutter)] pt-28 sm:pt-36">
        <div className="flex items-end justify-between gap-6">
        <SplitLines
          as="h1"
          lines={["Chanasak", "Choonuch"]}
          delay={0.15}
          className="text-[clamp(3.4rem,14vw,12rem)] font-semibold leading-[0.86] tracking-[-0.055em]"
        />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease }}
            className="hidden w-[clamp(140px,17vw,260px)] shrink-0 overflow-hidden rounded-2xl shadow-[0_30px_60px_-25px_rgb(0_0_0/0.4)] sm:block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG_BASE}me/me-610.webp`} srcSet={`${IMG_BASE}me/me-320.webp 320w, ${IMG_BASE}me/me-610.webp 610w`} sizes="260px" alt="Chanasak Choonuch" className="aspect-[4/5] w-full object-cover" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease }}
          className="mt-10 grid gap-8 border-t border-line pt-6 sm:grid-cols-[1.3fr_1fr_1fr] sm:gap-10"
        >
          <div className="flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${IMG_BASE}me/me-320.webp`} alt="" className="aspect-square w-16 shrink-0 rounded-full object-cover object-top sm:hidden" />
          <p className="max-w-[38ch] text-[clamp(1.05rem,1.5vw,1.3rem)] leading-snug">
            Full stack engineer in Bangkok. I take web products from the first requirement to the production release.
          </p>
          </div>
          <div className="flex items-center gap-3 text-[14px] text-muted">
            <Logo src="garena.webp" />
            <p>
              <span className="block text-ink">Garena Online (Thailand)</span>
              Full Stack Engineer
            </p>
          </div>
          <div className="flex items-center gap-3 text-[14px] text-muted">
            <Logo src="chula.svg" />
            <p>
              <span className="block text-ink">Chulalongkorn University</span>
              M.Sc. Software Engineering
            </p>
          </div>
        </motion.div>
      </section>

      <div className="mt-16">
        <Wall />
      </div>

      <Work />

      <section id="experience" className="px-[var(--gutter)] pt-32">
        <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold tracking-[-0.035em]">Experience</h2>
        <ol className="mt-10 border-t border-line">
          {jobs.map((j) => (
            <li key={j.co} className="grid gap-3 border-b border-line py-6 sm:grid-cols-[1.3fr_1fr_2fr] sm:gap-8">
              <div className="flex items-start gap-4">
                <Logo src={j.logo} size={44} />
                <div>
                  <p className="text-[17px] font-medium tracking-[-0.01em]">{j.co}</p>
                  <p className="text-[14px] text-muted">{j.when}</p>
                </div>
              </div>
              <p className="text-[15px]">{j.role}</p>
              <p className="max-w-[60ch] text-[15px] leading-relaxed text-muted">{j.note}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-16 px-[var(--gutter)] pt-28 lg:grid-cols-2">
        <div>
          <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em]">Tools</h2>
          <ul className="mt-8 flex flex-wrap gap-2">
            {stack.map((t) => (
              <li key={t} title={t}>
                <Logo src={`${t}.svg`} size={44} className="transition-transform duration-300 hover:-translate-y-1" />
              </li>
            ))}
          </ul>
          <dl className="mt-8 border-t border-line">
            {skills.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[5rem_1fr] gap-4 border-b border-line py-4 text-[15px]">
                <dt className="text-muted">{k}</dt>
                <dd className="leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em]">Education</h2>
          <dl className="mt-8 border-t border-line text-[15px]">
            <div className="flex items-center gap-4 border-b border-line py-4">
              <Logo src="chula.svg" size={44} />
              <div>
                <dt className="font-medium">Chulalongkorn University</dt>
                <dd className="text-muted">M.Sc. Software Engineering, 2023 to now</dd>
              </div>
            </div>
            <div className="flex items-center gap-4 border-b border-line py-4">
              <Logo src="rmutp.webp" size={44} />
              <div>
                <dt className="font-medium">Rajamangala University of Technology Phra Nakhon</dt>
                <dd className="text-muted">B.S.Tech.Ed. Computer Engineering, 2018 to 2023, GPAX 3.47</dd>
              </div>
            </div>
          </dl>
          <h2 className="mt-16 text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em]">Certificates</h2>
          <ul className="mt-8 border-t border-line text-[15px]">
            {certs.map((c) => (
              <li key={c.title} className="flex items-center gap-4 border-b border-line py-3.5">
                <Logo src={c.logo} size={36} />
                <div className="min-w-0">
                  <p className="leading-snug">{c.title}</p>
                  <p className="text-[13px] text-muted">{c.by}, Coursera, 2022</p>
                </div>
              </li>
            ))}
          </ul>
          <h2 className="mt-16 text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em]">Awards</h2>
          <ul className="mt-8 border-t border-line text-[15px]">
            {awards.map((a) => (
              <li key={a.title} className="flex justify-between gap-6 border-b border-line py-3.5">
                <span>{a.title}</span>
                <span className="shrink-0 text-muted">{a.when}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contact" className="mt-32 bg-ink px-[var(--gutter)] pb-24 pt-24 text-bg sm:pb-12">
        <p className="text-[15px] text-bg/60">Have a site to build?</p>
        <a
          href="mailto:chanasak.choonuch@gmail.com"
          className="mt-4 block break-all text-[clamp(1.6rem,5.4vw,5.4rem)] font-semibold leading-[1] tracking-[-0.04em] transition-opacity hover:opacity-70"
        >
          chanasak.choonuch@gmail.com
        </a>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-bg/15 pt-6 text-[14px] text-bg/60 sm:flex-row">
          <span>063 828 5292</span>
          <span>Bangkok, Thailand</span>
          <Link href="/credits" className="hover:text-bg">
            Photo credits
          </Link>
        </div>
      </section>
    </div>
  );
}

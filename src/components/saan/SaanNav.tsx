"use client";

import { useState } from "react";

const links = [
  { href: "#collections", label: "Collections" },
  { href: "#material", label: "Material" },
  { href: "#designers", label: "Designers" },
  { href: "#projects", label: "Projects" },
  { href: "#showroom", label: "Showroom" },
];

export function SaanNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-30 mx-auto flex max-w-[1440px] items-center justify-between px-4 py-5 sm:px-8">
      <a href="#top" className="font-display text-[22px] tracking-[0.32em]" aria-label="SAAN Atelier, home">
        SAAN
      </a>
      <nav className="hidden items-center gap-8 text-[14px] lg:flex" aria-label="Main">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="text-muted transition-colors hover:text-ink">
            {l.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <a
          href="#showroom"
          className="hidden rounded-full bg-ink px-5 py-2.5 text-[14px] text-bg transition-colors hover:bg-accent sm:inline-block"
        >
          Book a visit
        </a>
        <button
          type="button"
          className="rounded-full border border-line px-4 py-2 text-[14px] lg:hidden"
          aria-expanded={open}
          aria-controls="saan-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav
          id="saan-menu"
          className="absolute inset-x-4 top-full rounded-[2px] bg-bg p-6 shadow-[0_20px_40px_rgb(0_0_0/0.12)] sm:inset-x-8 lg:hidden"
          aria-label="Main"
        >
          <ul className="space-y-4 font-display text-[26px]">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function RuenHeader() {
  const pathname = usePathname();
  const overPhoto = pathname !== "/projects";

  return (
    <header className={`absolute inset-x-0 top-0 z-30 ${overPhoto ? "text-white" : "text-ink"}`}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-5 sm:px-8">
        <Link href="/projects" className="font-display text-[28px] italic leading-none" aria-label="Ruen Projects home">
          Ruen
        </Link>
        <nav className="flex items-center gap-6 text-[14px]" aria-label="Main">
          <Link href="/projects" className="hidden opacity-85 hover:opacity-100 sm:inline">
            All projects
          </Link>
          <a href="#start" className="rounded-full bg-accent px-4 py-2 font-medium text-accent-ink">
            Start a project
          </a>
        </nav>
      </div>
    </header>
  );
}

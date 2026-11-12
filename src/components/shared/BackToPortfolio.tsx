"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Small pill back to the portfolio page. It tucks away while you scroll down,
 * so it never sits on top of a button, and comes back when you scroll up.
 */
export function BackToPortfolio({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 80);
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const colors = tone === "dark" ? "bg-[#15302a] text-[#eef1ec] hover:bg-[#1d3d36]" : "bg-white/95 text-[#1d1e1b] hover:bg-white";
  return (
    <Link
      href="/"
      className={`no-print fixed bottom-4 right-4 z-50 rounded-full px-4 py-2 text-[13px] shadow-[0_6px_24px_rgb(0_0_0/0.18)] transition-[transform,opacity,background-color] duration-300 sm:left-4 sm:right-auto ${colors} ${hidden ? "pointer-events-none translate-y-16 opacity-0" : ""}`}
      style={{ fontFamily: '"Jost Variable", "Jost", system-ui, sans-serif' }}
    >
      Portfolio
    </Link>
  );
}

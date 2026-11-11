import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { Cursor, SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "HOM | Eau de parfum from Bangkok",
  description: "Four scents of a Bangkok night, poured by hand on Charoen Krung Road. Turn the bottle, choose a size and print your initials on the label.",
};

export default function ParfumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="brand-hom [--cursor-ink:#1a1714] [--cursor:#efe9df]">
      <SmoothScroll />
      <Cursor />
      {children}
      <BackToPortfolio />
    </div>
  );
}

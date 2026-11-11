import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { Cursor } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "DIN | Stoneware from Lampang",
  description: "A wall of stoneware to drag through. Open any piece to look closely and order it.",
};

export default function CeramicsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-din [--cursor-ink:#f2f2ef] [--cursor:#1b1b19]">
      <Cursor />
      {children}
      <BackToPortfolio />
    </div>
  );
}

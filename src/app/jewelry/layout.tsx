import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { Cursor, SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "PHLOI | Thai sapphire and ruby rings, Bangkok",
  description: "Build a solitaire ring in 3D: stone, metal, cut, carat and engraving, then book a private viewing on Silom Road.",
};

export default function JewelryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-phloi [--cursor-ink:#0b0d11] [--cursor:#eee9df]">
      <SmoothScroll />
      <Cursor />
      {children}
      <BackToPortfolio />
    </div>
  );
}

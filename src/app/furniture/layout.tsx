import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { Cursor, SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "Loom & Tide | Woven rattan lighting from Bangkok",
  description: "Hand-woven rattan pendants. Choose a shape, weave, finish and size, switch the light on and see it in the room.",
};

export default function FurnitureLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-lamp [--cursor-ink:#141210] [--cursor:#ffb46b]">
      <SmoothScroll />
      <Cursor />
      {children}
      <BackToPortfolio />
    </div>
  );
}

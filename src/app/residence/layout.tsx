import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { Cursor, SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "Rim Nam Residences | Thirty-two floors on the Chao Phraya",
  description: "Choose a floor on the tower, open a residence plan and work out the payments.",
};

export default function ResidenceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-rim [--cursor-ink:#e3e1dc] [--cursor:#14171a]">
      <SmoothScroll />
      <Cursor />
      {children}
      <BackToPortfolio />
    </div>
  );
}

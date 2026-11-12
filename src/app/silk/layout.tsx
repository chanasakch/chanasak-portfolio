import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { Cursor, SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "Mudmee House | Hand-woven Thai silk from Surin",
  description: "Design a mudmee silk scarf, shawl or fabric in natural dyes and watch it woven on screen, then order from the weavers in Surin.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-silk [--cursor-ink:#170f15] [--cursor:#f1e6d4]">
      <SmoothScroll />
      <Cursor />
      {children}
      <BackToPortfolio />
    </div>
  );
}

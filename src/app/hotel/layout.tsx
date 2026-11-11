import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { Cursor, SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "Ruen Doi | A small hotel above a lake in Chiang Rai",
  description: "Scroll through one day at Ruen Doi, from morning mist to lanterns, then pick your dates and room.",
};

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-stay [--cursor-ink:#1e2a25] [--cursor:#c58b3e]">
      <SmoothScroll />
      <Cursor />
      {children}
      <BackToPortfolio tone="dark" />
    </div>
  );
}

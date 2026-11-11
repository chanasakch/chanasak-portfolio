import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { RuenHeader, RuenProvider } from "@/components/hotel/Ruen";
import { Cursor, Preloader, SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "Ruen Doi | A small hotel above a lake in the hills of Chiang Rai",
  description: "Twenty-four rooms, a restored teak house and two pools, an hour from Chiang Rai airport.",
};

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="brand-ruen [--cursor-ink:#17302a] [--cursor:#e3a33a]">
      <SmoothScroll />
      <Cursor />
      <Preloader id="ruen" name={<span className="font-display text-[30px] italic">Ruen Doi</span>} className="bg-[#17302a] text-[#e7ebe6]" />
      <RuenProvider>
        <RuenHeader />
        {children}
      </RuenProvider>
      <BackToPortfolio tone="dark" />
    </div>
  );
}

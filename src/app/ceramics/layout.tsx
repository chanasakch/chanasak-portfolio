import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { DinHeader, DinProvider } from "@/components/ceramics/Din";
import { Cursor, Preloader, SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "DIN Studio | Stoneware from Lampang",
  description: "Stoneware vases and tableware thrown, glazed and fired in Lampang. Wheel workshops and tableware for restaurants.",
};

export default function CeramicsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="brand-din [--cursor-ink:#f1f2ee] [--cursor:#27241f]">
      <SmoothScroll />
      <Cursor />
      <Preloader id="din" name={<span className="font-display text-[34px] tracking-[0.22em]">DIN</span>} className="bg-[#e3e6df] text-[#27241f]" />
      <DinProvider>
        <DinHeader />
        {children}
      </DinProvider>
      <BackToPortfolio />
    </div>
  );
}

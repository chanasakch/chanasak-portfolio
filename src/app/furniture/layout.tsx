import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { TradeProvider } from "@/components/trade/TradeProvider";
import { TradeHeader } from "@/components/trade/TradeHeader";
import { TradeOverlays } from "@/components/trade/TradeOverlays";

export const metadata: Metadata = {
  title: "Loom & Tide | Woven furniture and lighting from Bangkok",
  description: "Rattan, cane and rope furniture for hotels and homes. Filter by use and material, check specifications and request a quote.",
};

export default function FurnitureLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="brand-trade">
      <TradeProvider>
        <TradeHeader />
        {children}
        <footer className="overflow-hidden bg-ink text-bg">
          <div className="mx-auto grid max-w-[1600px] gap-10 px-4 pt-16 text-[14px] sm:grid-cols-3 sm:px-8">
            <p className="max-w-[34ch] leading-relaxed opacity-70">Woven furniture and lighting for hotels and homes. Workshop and showroom in Bang Bua Thong, Nonthaburi.</p>
            <div className="grid gap-1.5 opacity-70">
              <span>trade@loomtide.example</span>
              <span>+66 2 000 0000</span>
              <span>Mon to Sat, 9:00 to 18:00</span>
            </div>
            <p className="opacity-50 sm:text-right">Concept site. Loom &amp; Tide and its products are fictional. Photos from Pexels.</p>
          </div>
          <p aria-hidden className="mx-auto max-w-[1600px] select-none whitespace-nowrap px-4 pb-20 pt-10 text-[clamp(4rem,15vw,15rem)] font-[650] leading-[0.8] tracking-[-0.06em] sm:px-8 sm:pb-6">
            Loom &amp; Tide
          </p>
        </footer>
        <TradeOverlays />
        <BackToPortfolio />
      </TradeProvider>
    </div>
  );
}

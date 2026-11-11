import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { TradeProvider } from "@/components/trade/TradeProvider";
import { TradeHeader } from "@/components/trade/TradeHeader";

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
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 pb-24 pt-8 text-[13px] text-muted sm:flex-row sm:justify-between sm:px-8 sm:pb-10">
            <span className="font-[650] text-ink">Loom &amp; Tide</span>
            <span>Concept site. Loom &amp; Tide and its products are fictional. Photos from Pexels.</span>
          </div>
        </footer>
        <BackToPortfolio />
      </TradeProvider>
    </div>
  );
}

import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { TradeProvider } from "@/components/trade/TradeProvider";
import { TradeHeader } from "@/components/trade/TradeHeader";

export const metadata: Metadata = {
  title: "Loom & Tide Trade | Rattan and rope furniture for hospitality",
  description: "Trade catalogue for hotels, developers and distributors. Filter by use and material, check specs and request a quote.",
};

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="brand-trade">
      <TradeProvider>
        <TradeHeader />
        {children}
        <BackToPortfolio />
      </TradeProvider>
    </div>
  );
}

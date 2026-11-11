import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { DinHeader, DinProvider } from "@/components/ceramics/Din";

export const metadata: Metadata = {
  title: "DIN Studio | Stoneware from Lampang",
  description: "Stoneware vases and tableware thrown, glazed and fired in Lampang. Wheel workshops and tableware for restaurants.",
};

export default function CeramicsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="brand-din">
      <DinProvider>
        <DinHeader />
        {children}
      </DinProvider>
      <BackToPortfolio />
    </div>
  );
}

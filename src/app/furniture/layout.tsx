import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { QuoteProvider } from "@/components/loom/store";
import { SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "Loom & Tide | Rattan furniture and lighting",
  description: "Rattan chairs, tables, pendants and outdoor furniture, woven by hand in Ayutthaya. Showroom on Charoen Krung, Bangkok.",
};

export default function FurnitureLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-loom">
      <SmoothScroll />
      <QuoteProvider>{children}</QuoteProvider>
      <BackToPortfolio />
    </div>
  );
}

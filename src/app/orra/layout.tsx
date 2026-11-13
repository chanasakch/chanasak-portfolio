import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "ORRA | Furniture made in Samut Sakhon",
  description: "Lounge chairs, modular sofas, solid timber tables and warm lighting, made to order in Thailand. Showroom on Charoen Krung, Bangkok.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-orra">
      <SmoothScroll />
      {children}
      <BackToPortfolio />
    </div>
  );
}

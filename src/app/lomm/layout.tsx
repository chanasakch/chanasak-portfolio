import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "lomm | Outdoor furniture",
  description: "A concept site for an outdoor furniture brand: drag the terrace through the day, scroll the collection sideways and plan your space to scale.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-lomm">
      <SmoothScroll />
      {children}
      <BackToPortfolio />
    </div>
  );
}

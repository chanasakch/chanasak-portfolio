import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "Tera | Small group journeys from Bangkok",
  description: "Small group trips to Egypt, the Alps, the Yucatan, Nepal, Iceland, Lofoten, the Cyclades and the Dolomites, led by people who live there.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-tera">
      <SmoothScroll />
      {children}
      <BackToPortfolio />
    </div>
  );
}

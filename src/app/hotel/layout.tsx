import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { RuenHeader, RuenProvider } from "@/components/hotel/Ruen";

export const metadata: Metadata = {
  title: "Ruen Doi | A small hotel above a lake in the hills of Chiang Rai",
  description: "Twenty-four rooms, a restored teak house and two pools, an hour from Chiang Rai airport.",
};

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="brand-ruen">
      <RuenProvider>
        <RuenHeader />
        {children}
      </RuenProvider>
      <BackToPortfolio tone="dark" />
    </div>
  );
}

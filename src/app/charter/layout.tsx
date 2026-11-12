import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { Cursor, SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "Nava | Private boat charters on Phang Nga Bay",
  description: "Plan a day on Phang Nga Bay: pick islands on the chart, choose a boat and see the timeline and price.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-nava [--cursor-ink:#0b1d27] [--cursor:#ece6d8]">
      <SmoothScroll />
      <Cursor />
      {children}
      <BackToPortfolio />
    </div>
  );
}

import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "khom | Woven lamps",
  description: "A concept site for a woven lighting maker: switch the site to evening, size pendants for your table and send a lighting list for a quote.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-khom">
      <SmoothScroll />
      {children}
      <BackToPortfolio />
    </div>
  );
}

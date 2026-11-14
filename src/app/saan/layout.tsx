import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "SAAN | Rattan furniture for homes and hotels",
  description: "A concept site for a Thai rattan furniture maker: living, dining, outdoor and lighting, with projects, an e-catalogue and quote requests, in English and Thai.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-saan">
      <SmoothScroll />
      {children}
      <BackToPortfolio />
    </div>
  );
}

import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "Hattha Works | Rattan furniture manufacturer",
  description: "A concept site for a rattan furniture factory that makes for brands, hotels and retailers, with a quote request that estimates lead time as you go.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-hattha">
      <SmoothScroll />
      {children}
      <BackToPortfolio />
    </div>
  );
}

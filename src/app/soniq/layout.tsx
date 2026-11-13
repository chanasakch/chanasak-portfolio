import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "SONIQ | Headphones, earbuds and smart watches",
  description: "Noise cancelling headphones, earbuds, watches and speakers with Bangkok same day delivery, two year warranty and repairs at Siam.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-soniq">
      <SmoothScroll />
      {children}
      <BackToPortfolio />
    </div>
  );
}

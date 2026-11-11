import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";

export const metadata: Metadata = {
  title: "SAAN Atelier | Hand-woven rattan furniture, Bangkok",
  description: "Rattan furniture woven by hand in Bangkok since 1989, for homes, hotels and the people who design them.",
};

export default function SaanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="brand-saan">
      {children}
      <BackToPortfolio />
    </div>
  );
}

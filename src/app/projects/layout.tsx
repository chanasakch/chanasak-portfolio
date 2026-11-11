import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { RuenHeader } from "@/components/projects/RuenHeader";

export const metadata: Metadata = {
  title: "Ruen Projects | Furniture for hotels, residences and restaurants",
  description: "Case studies of hotels, residences, restaurants and screen sets furnished with hand-woven Thai furniture.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="brand-ruen">
      <RuenHeader />
      {children}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 pb-24 pt-8 text-[13px] text-muted sm:flex-row sm:justify-between sm:px-8 sm:pb-10">
          <span className="font-display text-[20px] italic text-ink">Ruen</span>
          <span>Concept site. Ruen, its clients and projects are fictional. Photos from Pexels.</span>
        </div>
      </footer>
      <BackToPortfolio tone="dark" />
    </div>
  );
}

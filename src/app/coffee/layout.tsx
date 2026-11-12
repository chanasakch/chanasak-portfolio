import type { Metadata } from "next";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { Cursor, SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "Sung Coffee | Single-origin coffee from northern Thailand",
  description: "Five farms above 1,100 metres in Chiang Rai, Chiang Mai and Nan. Taste profiles, a brew timer and subscriptions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-sung [--cursor-ink:#dfe3d6] [--cursor:#1f2a1e]">
      <SmoothScroll />
      <Cursor />
      {children}
      <BackToPortfolio />
    </div>
  );
}

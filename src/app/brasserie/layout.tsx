import type { Metadata } from "next";
import "@fontsource/gloock/400.css";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { Cursor, SmoothScroll } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "Vermeil | Brasserie on Charoen Krung, Bangkok",
  description: "Step through the curtain into Vermeil, a French brasserie in an old trading house on Charoen Krung. See the menu, look around the rooms and book a table.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-vermeil [--cursor-ink:#1c0b0d] [--cursor:#c9a35c]">
      <SmoothScroll />
      <Cursor />
      {children}
      <BackToPortfolio tone="dark" />
    </div>
  );
}

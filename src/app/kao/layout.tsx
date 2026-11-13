import type { Metadata } from "next";
import "@fontsource-variable/archivo/wdth.css";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { Cursor } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "KAO | Runner 01",
  description: "One knit running shoe in six colours, made in Thailand. Turn it in 3D, pick your size and order with free delivery.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-kao [--cursor-ink:#efefec] [--cursor:#161616]">
      <Cursor />
      {children}
      <BackToPortfolio />
    </div>
  );
}

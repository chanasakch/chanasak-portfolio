import type { Metadata } from "next";
import "@fontsource-variable/familjen-grotesk";
import { BackToPortfolio } from "@/components/shared/BackToPortfolio";
import { Cursor } from "@/components/shared/motion";

export const metadata: Metadata = {
  title: "SALA | Furniture and objects, Bangkok",
  description: "Walk the SALA showroom in 3D. Turn each piece, try the fabrics, and order for delivery in Bangkok.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-sala [--cursor-ink:#f4f3ef] [--cursor:#191918]">
      <Cursor />
      {children}
      <BackToPortfolio />
    </div>
  );
}

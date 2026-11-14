import type { Metadata, Viewport } from "next";
import "@fontsource/italiana/400.css";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/jost";
import "@fontsource/anuphan/400.css";
import "@fontsource/anuphan/500.css";
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource/ibm-plex-sans-thai/400.css";
import "@fontsource/ibm-plex-sans-thai/500.css";
import "@fontsource/ibm-plex-sans-thai/600.css";
import "@fontsource-variable/bodoni-moda";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/familjen-grotesk";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/bodoni-moda/wght-italic.css";
import "@fontsource-variable/work-sans";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/albert-sans";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/manrope";
import "@fontsource/libre-caslon-display/400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Thai craft web concepts | Chanasak Choonuch",
    template: "%s",
  },
  description:
    "Three website concepts for Thai craft and hospitality brands: a woven furniture catalogue, a ceramics studio and a boutique hotel.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}

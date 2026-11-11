import type { Metadata, Viewport } from "next";
import "@fontsource/marcellus/400.css";
import "@fontsource-variable/jost";
import "@fontsource/anuphan/400.css";
import "@fontsource/anuphan/500.css";
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource/ibm-plex-sans-thai/400.css";
import "@fontsource/ibm-plex-sans-thai/500.css";
import "@fontsource/ibm-plex-sans-thai/600.css";
import "@fontsource-variable/bodoni-moda";
import "@fontsource-variable/bodoni-moda/wght-italic.css";
import "@fontsource-variable/work-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Furniture and craft web concepts | Chanasak Choonuch",
    template: "%s",
  },
  description:
    "Three website concepts for a Thai rattan furniture brand: a brand site, a trade catalogue with quote list, and a hospitality projects showcase.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}

import Link from "next/link";

/** Small pill that takes a reviewer back to the list of concepts. */
export function BackToPortfolio({ tone = "light" }: { tone?: "light" | "dark" }) {
  const colors =
    tone === "dark"
      ? "bg-[#15302a] text-[#eef1ec] hover:bg-[#1d3d36]"
      : "bg-white/90 text-[#1d1e1b] hover:bg-white";
  return (
    <Link
      href="/"
      className={`no-print fixed bottom-4 left-4 z-50 rounded-full px-4 py-2 text-[13px] shadow-[0_6px_24px_rgb(0_0_0/0.12)] backdrop-blur transition-colors ${colors}`}
      style={{ fontFamily: '"Jost Variable", system-ui, sans-serif' }}
    >
      All concepts
    </Link>
  );
}

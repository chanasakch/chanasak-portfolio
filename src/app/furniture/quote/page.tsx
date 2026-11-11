import type { Metadata } from "next";
import { QuoteView } from "@/components/trade/QuoteView";

export const metadata: Metadata = { title: "Quote list | Loom & Tide Trade" };

export default function QuotePage() {
  return <QuoteView />;
}

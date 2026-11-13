import { OrraSite } from "@/components/orra/OrraSite";
import { orra, orraCats } from "@/data/orra";

export const instant = false;

export function generateStaticParams() {
  return [
    { slug: [] },
    ...["shop", "checkout", "account", "wishlist", "visit"].map((s) => ({ slug: [s] })),
    ...orraCats.map((c) => ({ slug: ["shop", c.slug] })),
    ...orra.map((p) => ({ slug: ["p", p.id] })),
  ];
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return <OrraSite segs={slug} />;
}

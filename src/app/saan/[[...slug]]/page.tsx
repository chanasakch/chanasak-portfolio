import { SaanSite } from "@/components/saan/SaanSite";
import { cats, products } from "@/data/saan";

export const instant = false;

export function generateStaticParams() {
  return [
    { slug: [] },
    ...["collection", "projects", "story", "catalogue", "contact"].map((s) => ({ slug: [s] })),
    ...cats.map((c) => ({ slug: ["collection", c.id] })),
    ...products.map((p) => ({ slug: ["p", p.id] })),
  ];
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return <SaanSite segs={slug} />;
}

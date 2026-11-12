import { LoomSite } from "@/components/loom/LoomSite";
import { categories, products } from "@/data/loom";

export function generateStaticParams() {
  return [
    { slug: [] },
    ...["shop", "projects", "about", "trade", "contact", ...categories.map((c) => c.toLowerCase())].map((s) => ({ slug: [s] })),
    ...products.map((p) => ({ slug: ["products", p.slug] })),
  ];
}

export default async function FurniturePage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return <LoomSite segs={slug} />;
}

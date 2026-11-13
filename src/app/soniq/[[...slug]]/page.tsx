import { SoniqSite } from "@/components/soniq/SoniqSite";
import { soniq, soniqCats } from "@/data/soniq";

export const instant = false;

export function generateStaticParams() {
  return [
    { slug: [] },
    ...["shop", "checkout", "account", "wishlist", "support"].map((s) => ({ slug: [s] })),
    ...soniqCats.map((c) => ({ slug: ["shop", c.slug] })),
    ...soniq.map((p) => ({ slug: ["p", p.id] })),
  ];
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return <SoniqSite segs={slug} />;
}

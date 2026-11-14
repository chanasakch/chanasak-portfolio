import { KhomSite } from "@/components/khom/KhomSite";
import { lamps } from "@/data/khom";

export const instant = false;

export function generateStaticParams() {
  return [{ slug: [] }, { slug: ["lamps"] }, { slug: ["contact"] }, ...lamps.map((l) => ({ slug: ["lamp", l.id] }))];
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return <KhomSite segs={slug} />;
}

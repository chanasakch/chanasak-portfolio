import { LommSite } from "@/components/lomm/LommSite";

export const instant = false;

export function generateStaticParams() {
  return [{ slug: [] }, { slug: ["enquire"] }];
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return <LommSite segs={slug} />;
}

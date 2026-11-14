import { HatthaSite } from "@/components/hattha/HatthaSite";

export const instant = false;

export function generateStaticParams() {
  return [{ slug: [] }, { slug: ["rfq"] }];
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return <HatthaSite segs={slug} />;
}

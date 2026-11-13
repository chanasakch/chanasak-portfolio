import { TeraSite } from "@/components/tera/TeraSite";
import { trips } from "@/data/tera";

export const instant = false;

export function generateStaticParams() {
  return [{ slug: [] }, ...["destinations", "trips", "book", "account"].map((s) => ({ slug: [s] })), ...trips.map((t) => ({ slug: ["trip", t.id] }))];
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return <TeraSite segs={slug} />;
}

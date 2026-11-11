import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import { ProductDetail } from "@/components/trade/ProductDetail";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product ? `${product.name} | Loom & Tide Trade` : "Loom & Tide Trade" };
}

async function ProductLoader({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}

function ProductSkeleton() {
  return (
    <main className="mx-auto grid max-w-[1440px] gap-10 px-4 pt-11 sm:px-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]" aria-busy="true">
      <div className="weave aspect-[4/3] rounded-[6px]" />
      <div className="space-y-4">
        <div className="h-4 w-24 rounded bg-soft" />
        <div className="h-10 w-3/4 rounded bg-soft" />
        <div className="h-24 w-full rounded bg-soft" />
      </div>
    </main>
  );
}

export default function ProductPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductLoader params={params} />
    </Suspense>
  );
}

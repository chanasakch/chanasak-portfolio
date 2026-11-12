"use client";

import { bySlug, categories } from "@/data/loom";
import { Footer, Header } from "./Chrome";
import { About, Contact, Home, NotFound, Projects, Shop, Trade } from "./Pages";
import { ProductPage } from "./Product";

export function LoomSite({ segs = [] }: { segs?: string[] }) {
  const [a, b] = segs;
  const cat = categories.find((c) => c.toLowerCase() === a);
  const product = a === "products" && b ? bySlug(b) : undefined;

  let view;
  if (!a) view = <Home />;
  else if (a === "shop") view = <Shop />;
  else if (cat) view = <Shop key={cat} category={cat} />;
  else if (product) view = <ProductPage key={product.slug} product={product} />;
  else if (a === "projects") view = <Projects />;
  else if (a === "about") view = <About />;
  else if (a === "trade") view = <Trade />;
  else if (a === "contact") view = <Contact />;
  else view = <NotFound />;

  return (
    <>
      <Header path={["/furniture", ...segs].join("/")} />
      <main>{view}</main>
      <Footer />
    </>
  );
}

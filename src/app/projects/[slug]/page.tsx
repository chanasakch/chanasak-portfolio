import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { ProjectDetail } from "@/components/projects/ProjectDetail";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.name} | Ruen Projects` : "Ruen Projects" };
}

async function ProjectLoader({ params }: { params: Params }) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const next = projects[(index + 1) % projects.length];
  return <ProjectDetail project={projects[index]} next={next} />;
}

export default function ProjectPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="h-[86svh] min-h-[520px] bg-[var(--forest)]" aria-busy="true" />}>
      <ProjectLoader params={params} />
    </Suspense>
  );
}

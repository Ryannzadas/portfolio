import { Suspense } from "react";
import type { Metadata } from "next";
import { getPortfolioProjects } from "@/lib/github";
import { ProjectArchive } from "@/components/projects/project-archive";
import { ProjectsEmpty, ProjectsError } from "@/components/projects/projects-states";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Arquivo completo dos projetos pessoais de João Ryan, carregados direto do GitHub.",
  alternates: { canonical: "/projetos" },
};

async function ArchiveList() {
  const result = await getPortfolioProjects();
  if (result.status === "error") return <ProjectsError />;
  if (result.projects.length === 0) return <ProjectsEmpty />;
  return <ProjectArchive projects={result.projects} />;
}

function ArchiveSkeleton() {
  return (
    <div className="border-t border-line" aria-busy="true" aria-label="Carregando projetos">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-6 border-b border-line py-8">
          <div className="shimmer h-4 w-8 rounded" />
          <div className="shimmer h-10 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <section className="min-h-[80vh] px-4 pb-28 pt-40 md:px-8 md:pt-48">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
          <span className="text-accent">Arquivo</span>
          <span className="h-px w-10 bg-line" aria-hidden="true" />
          GitHub / Ryannzadas
        </p>
        <h1 className="font-display text-[clamp(3rem,11vw,10rem)] font-semibold leading-[0.88] tracking-[-0.05em]">
          Todos os <span className="text-outline">projetos</span>
        </h1>
        <p className="mt-8 max-w-lg text-lg text-muted">
          Repositórios marcados com o tópico <code className="font-mono text-accent">portfolio</code> no meu GitHub.
          Clique em um projeto para ler o README.
        </p>

        <div className="mt-20">
          <Suspense fallback={<ArchiveSkeleton />}>
            <ArchiveList />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

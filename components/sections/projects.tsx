import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { getPortfolioProjects } from "@/lib/github";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { ProjectsEmpty, ProjectsError, ProjectsSkeleton } from "@/components/projects/projects-states";

const HOME_LIMIT = 5;

async function ProjectsGrid() {
  const result = await getPortfolioProjects();

  if (result.status === "error") return <ProjectsError />;
  if (result.projects.length === 0) return <ProjectsEmpty />;

  return (
    <>
      <ProjectGallery projects={result.projects.slice(0, HOME_LIMIT)} />
      <div className="mt-14 flex justify-center">
        <Magnetic>
          <ButtonLink href="/projetos" variant="outline" className="px-8 py-4">
            Ver arquivo completo
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </ButtonLink>
        </Magnetic>
      </div>
    </>
  );
}

export function Projects() {
  return (
    <section id="projetos" aria-labelledby="projetos-titulo" className="px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="projetos-titulo"
            index="02"
            label="Projetos"
            title={
              <>
                Coisas que eu <span className="text-outline">construí</span>
              </>
            }
          />
          <p className="mb-14 max-w-xs text-sm text-muted md:mb-20">
            Carregados direto do meu GitHub — cada card abre o README completo do projeto.
          </p>
        </div>

        <Suspense fallback={<ProjectsSkeleton />}>
          <ProjectsGrid />
        </Suspense>
      </div>
    </section>
  );
}

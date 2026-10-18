"use client";

import { ArrowUpRight, Star } from "lucide-react";
import type { Project } from "@/lib/github";
import { tiltClasses, useTilt } from "@/lib/use-tilt";
import { cn } from "@/lib/utils";
import { GithubIcon } from "@/components/ui/icons";
import { ProjectCover } from "./project-cover";
import { Badges } from "./badges";

type ProjectCardProps = {
  project: Project;
  index: number;
  featured?: boolean;
  onOpen: (project: Project) => void;
};

/**
 * Card de projeto com inclinação 3D (tilt) e brilho que segue o cursor.
 * O card inteiro abre o modal (botão "esticado" por baixo); os links
 * de código/demo ficam por cima e continuam clicáveis e focáveis.
 */
export function ProjectCard({ project, index, featured, onOpen }: ProjectCardProps) {
  const tilt = useTilt(featured ? 5 : 8);

  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <article
        {...tilt}
        className={cn(
          tiltClasses,
          "group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-surface hover:border-fg/20",
          featured && "lg:grid lg:grid-cols-[1.3fr_1fr]",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(500px_circle_at_var(--gx,50%)_var(--gy,50%),var(--accent-soft),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <ProjectCover
          project={project}
          priority={index === 0}
          sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 45vw, 100vw"}
          className={cn("aspect-[16/10] w-full", featured && "lg:aspect-auto lg:min-h-[420px]")}
        />

        {/* Botão esticado: cobre o card inteiro e abre o modal */}
        <button
          type="button"
          onClick={() => onOpen(project)}
          data-cursor-label="Abrir"
          aria-label={`Ver detalhes de ${project.title}`}
          className="absolute inset-0 z-[5] rounded-[24px] focus-visible:outline-offset-[-2px]"
        />

        <div className="pointer-events-none relative z-10 flex flex-1 flex-col p-6 md:p-8">
          <div className="mb-4 flex items-center justify-between font-mono text-xs text-muted">
            <span>
              <span className="text-accent">{String(index + 1).padStart(2, "0")}</span> / {project.slug}
            </span>
            {project.stars > 0 && (
              <span className="flex items-center gap-1" aria-label={`${project.stars} estrelas`}>
                <Star className="h-3.5 w-3.5" aria-hidden="true" />
                {project.stars}
              </span>
            )}
          </div>

          <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{project.title}</h3>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted md:text-base">{project.description}</p>

          <Badges languages={project.languages} topics={project.topics} className="mt-5" />

          <div className="pointer-events-auto mt-auto flex flex-wrap gap-2 pt-7">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-fg"
            >
              <GithubIcon className="h-4 w-4" />
              Código
              <span className="sr-only"> de {project.title} no GitHub</span>
            </a>
            {project.homepage && (
              <a
                href={project.homepage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-fg px-4 py-2 text-sm text-bg transition-colors hover:bg-accent hover:text-accent-fg"
              >
                Demo
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only"> de {project.title}</span>
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

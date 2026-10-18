"use client";

import { useState } from "react";
import type { Project } from "@/lib/github";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "./project-card";
import { ProjectModal } from "./project-modal";

/**
 * Grid de cards da home (2 colunas no desktop).
 * Com número ímpar de projetos, o primeiro ganha destaque em largura total —
 * assim a grade nunca termina com um card sozinho na última linha.
 */
export function ProjectGallery({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);
  const featureFirst = projects.length % 2 === 1;

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        {projects.map((project, i) => {
          const featured = featureFirst && i === 0;
          return (
            <Reveal key={project.id} delay={(i % 2) * 0.1} className={featured ? "h-full lg:col-span-2" : "h-full"}>
              <ProjectCard project={project} index={i} featured={featured} onOpen={setActive} />
            </Reveal>
          );
        })}
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </>
  );
}

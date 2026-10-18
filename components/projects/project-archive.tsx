"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/github";
import { usePointerEffects } from "@/lib/hooks";
import { ProjectCover } from "./project-cover";
import { ProjectModal } from "./project-modal";

/**
 * Lista editorial de projetos. No desktop, passar o mouse sobre uma linha
 * mostra a capa do projeto flutuando junto ao cursor.
 */
export function ProjectArchive({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pointerEnabled = usePointerEffects();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 25 });
  const sy = useSpring(y, { stiffness: 200, damping: 25 });

  const onMove = (e: React.PointerEvent) => {
    if (!listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <>
      <ul
        ref={listRef}
        onPointerMove={onMove}
        onPointerLeave={() => setHovered(null)}
        className="relative border-t border-line"
      >
        {projects.map((project, i) => (
          <li key={project.id} className="border-b border-line">
            <button
              type="button"
              onClick={() => setActive(project)}
              onPointerEnter={() => setHovered(project)}
              onFocus={() => setHovered(null)}
              data-cursor-label="Abrir"
              className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-7 text-left transition-colors md:grid-cols-[60px_1fr_auto_auto] md:gap-8 md:py-10"
            >
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0">
                <span className="block font-display text-[clamp(1.8rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.04em] transition-transform duration-500 ease-out-expo group-hover:translate-x-3">
                  {project.title}
                </span>
                <span className="mt-3 block truncate text-sm text-muted md:hidden">{project.description}</span>
              </span>
              <span className="hidden font-mono text-xs text-muted md:block">
                {project.languages.slice(0, 3).join(" · ")}
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-full border border-line transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg">
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}

        {/* Prévia flutuante (decorativa) */}
        {pointerEnabled && (
          <motion.div
            aria-hidden="true"
            style={{ x: sx, y: sy }}
            className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
          >
            <AnimatePresence>
              {hovered && (
                <motion.div
                  key={hovered.id}
                  initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <ProjectCover project={hovered} className="h-[220px] w-[340px] rounded-2xl shadow-2xl" sizes="340px" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </ul>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </>
  );
}

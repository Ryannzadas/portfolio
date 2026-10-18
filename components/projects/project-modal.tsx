"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Star, X } from "lucide-react";
import type { Project } from "@/lib/github";
import { useLenis } from "@/components/providers/smooth-scroll";
import { GithubIcon } from "@/components/ui/icons";
import { ProjectCover } from "./project-cover";
import { Badges } from "./badges";

// react-markdown e plugins só são baixados quando um modal é aberto.
const ReadmeContent = dynamic(() => import("./readme-content"), {
  loading: () => (
    <div className="space-y-3" aria-label="Carregando README">
      {[100, 92, 96, 60, 88, 75].map((w, i) => (
        <div key={i} className="shimmer h-4 rounded" style={{ width: `${w}%` }} />
      ))}
    </div>
  ),
});

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

/**
 * Modal com os detalhes e o README do projeto.
 * Radix Dialog cuida do foco preso, Esc para fechar e aria-modal.
 */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const lenis = useLenis();

  // Pausa o smooth scroll da página enquanto o modal está aberto.
  useEffect(() => {
    if (!project) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [project, lenis]);

  return (
    <Dialog.Root open={Boolean(project)} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {project && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay forceMount asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content forceMount asChild aria-describedby="modal-descricao">
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-x-0 bottom-0 top-[6vh] z-[85] mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-t-[28px] border border-line bg-bg md:inset-x-4 md:bottom-[4vh] md:rounded-[28px]"
              >
                <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
                  <div className="relative">
                    <ProjectCover project={project} hideMeta className="aspect-[21/9] w-full" sizes="(min-width: 896px) 896px, 100vw" />
                    <Dialog.Close
                      aria-label="Fechar"
                      className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
                    >
                      <X className="h-5 w-5" />
                    </Dialog.Close>
                  </div>

                  <div className="p-6 md:p-10">
                    <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
                      <span>{project.owner}/{project.slug}</span>
                      {project.stars > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5" aria-hidden="true" /> {project.stars}
                        </span>
                      )}
                    </div>
                    <Dialog.Title className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                      {project.title}
                    </Dialog.Title>
                    <Dialog.Description id="modal-descricao" className="mt-4 max-w-2xl text-lg text-muted">
                      {project.description}
                    </Dialog.Description>

                    <Badges languages={project.languages} topics={project.topics} max={12} className="mt-6" />

                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm transition-colors hover:border-fg"
                      >
                        <GithubIcon className="h-4 w-4" /> Ver no GitHub
                      </a>
                      {project.homepage && (
                        <a
                          href={project.homepage}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-colors hover:bg-fg hover:text-bg"
                        >
                          Abrir demo <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                      )}
                    </div>

                    <div className="mt-12 border-t border-line pt-10">
                      <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-muted">README.md</p>
                      {project.readme ? (
                        <ReadmeContent project={project} />
                      ) : (
                        <p className="text-muted">Este repositório ainda não tem um README.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

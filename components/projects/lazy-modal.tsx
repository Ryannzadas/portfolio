"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Project } from "@/lib/github";

// Radix Dialog, Framer Motion e o README só são baixados quando um projeto é aberto.
const ProjectModal = dynamic(() => import("./project-modal").then((m) => m.ProjectModal), { ssr: false });

/**
 * Monta o modal só depois da primeira abertura e o mantém montado
 * (para a animação de saída funcionar nas próximas vezes).
 */
export function LazyProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  if (project && !mounted) setMounted(true);
  if (!mounted) return null;
  return <ProjectModal project={project} onClose={onClose} />;
}

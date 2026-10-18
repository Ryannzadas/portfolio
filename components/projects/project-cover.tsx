import Image from "next/image";
import type { Project } from "@/lib/github";
import { cn, hashString } from "@/lib/utils";

/**
 * Capa do projeto: imagem de preview (social preview / preview.png)
 * ou, na falta dela, um gradiente único gerado a partir do nome do repositório.
 */
export function ProjectCover({
  project,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  hideMeta = false,
}: {
  project: Project;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Esconde o rótulo da linguagem (ex: no modal, onde fica o botão de fechar). */
  hideMeta?: boolean;
}) {
  if (project.image) {
    return (
      <div className={cn("relative overflow-hidden bg-surface-2", className)}>
        <Image
          src={project.image}
          alt={`Prévia do projeto ${project.title}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
        />
      </div>
    );
  }

  // Gradiente determinístico: o mesmo repo sempre gera as mesmas cores.
  const hash = hashString(project.slug);
  const h1 = 250 + (hash % 60); // família do roxo/violeta
  const h2 = (h1 + 40 + (hash % 80)) % 360;
  const angle = hash % 360;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      role="img"
      aria-label={`Capa gerada para o projeto ${project.title}`}
      style={{
        background: `radial-gradient(120% 120% at ${20 + (hash % 60)}% 0%, hsl(${h1} 90% 62% / 0.9), transparent 55%), radial-gradient(100% 100% at 100% 100%, hsl(${h2} 85% 55% / 0.75), transparent 60%), linear-gradient(${angle}deg, hsl(${h1} 40% 12%), hsl(${h2} 40% 8%))`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgb(255_255_255/0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.12)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-6 bottom-5 font-display text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[0.85] tracking-[-0.05em] text-white/90 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1"
      >
        {project.title}
      </span>
      {!hideMeta && (
        <span aria-hidden="true" className="absolute right-5 top-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
          {project.language ?? "repo"}
        </span>
      )}
    </div>
  );
}

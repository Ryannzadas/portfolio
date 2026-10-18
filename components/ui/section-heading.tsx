import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  index: string;
  label: string;
  title: React.ReactNode;
  className?: string;
  id?: string;
};

/** Cabeçalho padrão das seções: "02 / Projetos" + título grande. */
export function SectionHeading({ index, label, title, className, id }: SectionHeadingProps) {
  return (
    <div className={cn("mb-14 md:mb-20", className)}>
      <Reveal>
        <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
          <span className="text-accent">{index}</span>
          <span className="h-px w-10 bg-line" aria-hidden="true" />
          {label}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          id={id}
          className="max-w-[18ch] font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-balance"
        >
          {title}
        </h2>
      </Reveal>
    </div>
  );
}

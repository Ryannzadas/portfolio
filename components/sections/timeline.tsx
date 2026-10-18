import { ArrowUpRight } from "lucide-react";
import { certificates, timeline } from "@/content/dados";
import { formatMonthYear } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TimelineLine } from "@/components/motion/timeline-line";

export function Timeline() {
  const sorted = [...certificates].sort((a, b) => b.date.localeCompare(a.date));
  const totalHours = certificates.reduce((sum, c) => sum + (c.hours ?? 0), 0);

  return (
    <section id="trajetoria" aria-labelledby="trajetoria-titulo" className="px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="trajetoria-titulo"
          index="04"
          label="Trajetória"
          title={
            <>
              Experiência <span className="text-outline">&</span> formação
            </>
          }
        />

        {/* Timeline vertical: a linha é "desenhada" conforme o scroll */}
        <TimelineLine>
          <ol className="space-y-14 md:space-y-20">
            {timeline.map((item, i) => (
              <li key={item.title} className="timeline-item relative grid gap-3 pl-10 md:grid-cols-[220px_1fr] md:gap-12 md:pl-16">
                <span
                  aria-hidden="true"
                  className="timeline-dot absolute left-0 top-1.5 grid h-[17px] w-[17px] -translate-x-1/2 place-items-center rounded-full border border-line bg-bg transition-colors duration-500 md:left-0"
                >
                  <span className="h-[7px] w-[7px] rounded-full bg-line transition-colors duration-500" />
                </span>

                <Reveal delay={0.05}>
                  <p className="font-mono text-sm text-muted">{item.period}</p>
                  {item.current && (
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-accent">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> Atual
                    </p>
                  )}
                </Reveal>

                <Reveal delay={0.12}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{item.kind}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-4xl">{item.title}</h3>
                  <p className="mt-1 text-lg text-fg/80">{item.place}</p>
                  <p className="mt-4 max-w-2xl leading-relaxed text-muted">{item.description}</p>
                </Reveal>
                <span className="sr-only">Item {i + 1} de {timeline.length}</span>
              </li>
            ))}
          </ol>
        </TimelineLine>

        {/* Certificados */}
        <div className="mt-28 md:mt-40">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">Certificados</h3>
            <p className="font-mono text-sm text-muted">
              {certificates.length} cursos · {totalHours}h+ de estudo
            </p>
          </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((cert, i) => (
              <li key={cert.file} className="h-full">
                <Reveal delay={(i % 3) * 0.06} className="h-full">
                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor-label="PDF"
                    className="group flex h-full flex-col justify-between gap-8 rounded-[20px] border border-line bg-surface p-6 transition-colors duration-300 hover:border-accent/60"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted">{cert.issuer}</span>
                      <ArrowUpRight
                        className="h-5 w-5 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="font-display text-lg font-medium leading-snug">{cert.title}</p>
                      <p className="mt-3 font-mono text-xs text-muted">
                        {formatMonthYear(cert.date)}
                        {cert.hours ? ` · ${cert.hours}h` : ""}
                      </p>
                    </div>
                    <span className="sr-only">(abre o certificado em PDF)</span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

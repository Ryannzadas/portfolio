import { skillGroups } from "@/content/dados";
import { Marquee } from "@/components/motion/marquee";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function Skills() {
  const all = skillGroups.flatMap((g) => g.items);
  const half = Math.ceil(all.length / 2);
  const rows = [all.slice(0, half), all.slice(half)];

  return (
    <section id="habilidades" aria-labelledby="habilidades-titulo" className="overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          id="habilidades-titulo"
          index="03"
          label="Habilidades"
          title={
            <>
              Ferramentas do <span className="text-accent">dia a dia</span>
            </>
          }
        />
      </div>

      {/* Duas faixas em sentidos opostos (decorativas: a lista acessível está no grid abaixo) */}
      <div aria-hidden="true" className="space-y-3 border-y border-line py-8 md:space-y-5 md:py-12">
        {rows.map((row, r) => (
          <Marquee key={r} reverse={r === 1} duration={r === 0 ? 38 : 46}>
            {row.map((skill) => (
              <span
                key={skill}
                className={`flex items-center whitespace-nowrap px-4 font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-none tracking-[-0.04em] md:px-8 ${
                  r === 1 ? "text-outline" : ""
                }`}
              >
                {skill}
                <span className="ml-8 text-[0.4em] text-accent md:ml-16">✦</span>
              </span>
            ))}
          </Marquee>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
      <div className="grid gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.08} className="bg-bg p-6 md:p-8">
            <h3 className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {group.title}
              <span className="text-accent">0{i + 1}</span>
            </h3>
            <ul className="mt-8 space-y-3">
              {group.items.map((item) => (
                <li key={item} className="group flex items-center gap-3 text-lg">
                  <span className="h-px w-3 bg-line transition-all duration-300 group-hover:w-6 group-hover:bg-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}

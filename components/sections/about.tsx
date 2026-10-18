import { certificates, profile } from "@/content/dados";
import { Reveal } from "@/components/motion/reveal";
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text";
import { PortraitCard } from "@/components/effects/portrait-card";

export function About() {
  const totalHours = certificates.reduce((sum, c) => sum + (c.hours ?? 0), 0);
  const stats = [
    { value: `${certificates.length}`, label: "certificados" },
    { value: `${totalHours}h+`, label: "de cursos" },
    { value: "2026", label: "estágio em TI" },
  ];

  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="relative px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
        <div>
          <Reveal>
            <p className="mb-10 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
              <span className="text-accent">01</span>
              <span className="h-px w-10 bg-line" aria-hidden="true" />
              <span id="sobre-titulo">Sobre mim</span>
            </p>
          </Reveal>

          <ScrollRevealText
            text={profile.about}
            className="font-display text-[clamp(1.6rem,3.4vw,2.9rem)] font-medium leading-[1.2] tracking-[-0.02em]"
          />

          <Reveal className="mt-14 flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full border border-line px-4 py-2 text-sm text-muted"
              >
                {interest}
              </span>
            ))}
          </Reveal>

          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-3xl font-semibold tracking-tight md:text-5xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{stat.label}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <PortraitCard />
      </div>
    </section>
  );
}

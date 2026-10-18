import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { profile } from "@/content/dados";
import { SplitText } from "@/components/motion/split-text";
import { Typewriter } from "@/components/motion/typewriter";
import { Magnetic } from "@/components/motion/magnetic";
import { LazyHeroCanvas } from "@/components/effects/lazy-effects";
import { SectionLink } from "@/components/layout/nav-link";
import { buttonClasses } from "@/components/ui/button";

/** Atraso (s) de cada elemento do hero depois do nome. */
const d = (seconds: number) => ({ "--d": `${seconds}s` }) as React.CSSProperties;

export function Hero() {
  return (
    <section
      data-hero=""
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-4 pb-8 pt-28 md:px-8 md:pt-32"
    >
      {/* Fundo: grade de pontos interativa + gradiente flutuante */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="hero-blob absolute left-1/2 top-1/3 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--accent-soft)_0%,transparent_60%)]" />
        <LazyHeroCanvas />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col">
        {/* Linha de metadados */}
        <div
          className="intro-fade flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted"
          style={d(0.6)}
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Disponível para oportunidades
          </span>
          <span className="hidden sm:inline">
            {profile.location} · {profile.coordinates}
          </span>
        </div>

        {/* Nome */}
        <div className="flex flex-1 flex-col justify-center py-12">
          <p className="intro-fade mb-4 font-mono text-sm text-muted md:mb-6" style={d(0.1)}>
            Olá, eu sou
          </p>
          <h1
            id="hero-title"
            className="font-display font-semibold leading-[0.88] tracking-[-0.055em]"
          >
            <SplitText text="João Ryan" className="block text-[clamp(3.6rem,15vw,13.5rem)]" />
            <span className="flex flex-wrap items-baseline gap-x-4">
              <SplitText
                text="da Silva Santos"
                startIndex={9}
                className="text-outline text-[clamp(2.2rem,8.4vw,7.5rem)] font-medium"
              />
              <span
                className="intro-fade inline-block h-[clamp(0.6rem,1.6vw,1.2rem)] w-[clamp(0.6rem,1.6vw,1.2rem)] rounded-full bg-accent"
                style={d(0.75)}
                aria-hidden="true"
              />
            </span>
          </h1>

          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-xl">
              <p className="intro-fade font-display text-xl text-muted md:text-2xl" style={d(0.7)}>
                <Typewriter words={profile.roles} />
              </p>
              {/* Sem animação de entrada: é o maior texto do hero e precisa pintar no 1º frame (LCP). */}
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted">{profile.tagline}</p>
            </div>

            <div className="intro-fade flex flex-wrap gap-3" style={d(0.85)}>
              <Magnetic>
                <SectionLink section="projetos" className={buttonClasses("primary")} data-cursor-label="Ver">
                  Ver projetos
                  <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[-45deg]" />
                </SectionLink>
              </Magnetic>
              <Magnetic>
                <SectionLink section="contato" className={buttonClasses("outline")}>
                  Entrar em contato
                  <ArrowUpRight className="h-4 w-4" />
                </SectionLink>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div
          className="intro-fade flex items-end justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted"
          style={d(1)}
        >
          <span className="flex items-center gap-3">
            <span className="scroll-line relative block h-10 w-px overflow-hidden bg-line" aria-hidden="true" />
            Role para explorar
          </span>
          <span className="hidden sm:inline">Sistemas de Informação · UNIFACOL</span>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIdleGSAP } from "@/lib/use-idle-gsap";
import { profile } from "@/content/dados";
import { tiltClasses, useTilt } from "@/lib/use-tilt";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cartão de "foto" do Sobre.
 * - Parallax vertical ligado ao scroll (GSAP).
 * - Hover: inclinação 3D + brilho que segue o cursor.
 * - Sem foto em `profile.photo`, mostra um crachá gerativo com o monograma.
 */
export function PortraitCard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tilt = useTilt(14);

  useIdleGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".portrait-inner",
          { yPercent: 8 },
          {
            yPercent: -8,
            ease: "none",
            scrollTrigger: { trigger: wrapRef.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    wrapRef,
  );

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-sm self-center lg:max-w-none" style={{ perspective: 1000 }}>
      <div className="portrait-inner">
        <div
          {...tilt}
          className={`${tiltClasses} group relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line bg-surface`}
        >
          {profile.photo ? (
            <Image
              src={profile.photo}
              alt={`Foto de ${profile.name}`}
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover grayscale transition-[filter,transform] duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
          ) : (
            <GeneratedBadge />
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgb(255_255_255/0.16),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>
      </div>
    </div>
  );
}

/** Crachá gerativo exibido enquanto não houver foto. */
function GeneratedBadge() {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8" role="img" aria-label={`Crachá com as iniciais de ${profile.name}`}>
      {/* Malha de gradiente + linhas */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -left-1/4 -top-1/4 h-[80%] w-[80%] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_45%,transparent),transparent_70%)] transition-transform duration-1000 group-hover:translate-x-10 group-hover:translate-y-6" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgb(217_70_239/0.22),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <div className="relative flex items-start justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        <span>ID / 2026</span>
        <span>{profile.coordinates}</span>
      </div>

      <div className="relative" aria-hidden="true">
        <span className="block font-display text-[clamp(7rem,22vw,13rem)] font-bold leading-[0.8] tracking-[-0.08em] text-fg transition-transform duration-700 group-hover:-translate-y-2">
          {profile.initials}
          <span className="text-accent">.</span>
        </span>
      </div>

      <div className="relative space-y-1 border-t border-line pt-4">
        <p className="font-display text-lg font-medium">{profile.name}</p>
        <p className="text-sm text-muted">Sistemas de Informação — UNIFACOL</p>
      </div>
    </div>
  );
}

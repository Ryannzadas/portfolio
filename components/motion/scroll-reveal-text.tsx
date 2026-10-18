"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIdleGSAP } from "@/lib/use-idle-gsap";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * Parágrafo cujas palavras "acendem" uma a uma conforme o scroll (GSAP scrub).
 * Cada palavra vai da cor `muted` (que já passa no contraste WCAG AA) até `fg`,
 * via a variável --lit (0 → 1). Com movimento reduzido o texto aparece aceso.
 */
export function ScrollRevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useIdleGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".srt-word",
          { "--lit": 0 },
          {
            "--lit": 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              end: "bottom 45%",
              scrub: 0.6,
            },
          },
        );
      });
    },
    ref,
  );

  return (
    <p ref={ref} className={cn("text-balance", className)}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="srt-word [color:color-mix(in_srgb,var(--fg)_calc(var(--lit,1)*100%),var(--muted))]"
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

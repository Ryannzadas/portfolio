"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIdleGSAP } from "@/lib/use-idle-gsap";

gsap.registerPlugin(ScrollTrigger);

/**
 * Envolve a timeline: desenha a linha vertical conforme o scroll (scrub)
 * e acende cada marcador quando a linha passa por ele.
 */
export function TimelineLine({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useIdleGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".timeline-progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 65%", end: "bottom 65%", scrub: 0.5 },
          },
        );
      });

      // Marcadores acendem em qualquer modo (é só troca de cor).
      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 65%",
          onEnter: () => item.classList.add("is-active"),
          onLeaveBack: () => item.classList.remove("is-active"),
        });
      });
    },
    ref,
  );

  return (
    <div ref={ref} className="relative [&_.is-active_.timeline-dot]:border-accent [&_.is-active_.timeline-dot>span]:bg-accent">
      <div aria-hidden="true" className="absolute bottom-0 left-0 top-2 w-px bg-line">
        <div className="timeline-progress h-full w-full origin-top bg-accent motion-reduce:scale-y-100" />
      </div>
      {children}
    </div>
  );
}

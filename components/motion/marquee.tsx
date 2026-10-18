"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: React.ReactNode;
  reverse?: boolean;
  /** Duração de um ciclo completo, em segundos. */
  duration?: number;
  className?: string;
};

/**
 * Faixa infinita. O loop é CSS (transform em GPU) e só roda enquanto a faixa
 * está visível; pausa no hover. O conteúdo é duplicado para o loop ser contínuo —
 * a cópia fica oculta para leitores de tela.
 */
export function Marquee({ children, reverse, duration = 40, className }: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Liga/desliga a animação conforme a faixa entra/sai da tela.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      el.toggleAttribute("data-running", entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("marquee flex overflow-hidden", className)}>
      <div
        className="marquee-track flex w-max shrink-0"
        style={
          {
            "--duration": `${duration}s`,
            "--direction": reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

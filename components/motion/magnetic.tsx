"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: React.ReactNode;
  /** Quanto o elemento acompanha o cursor (0–1). */
  strength?: number;
  className?: string;
};

/**
 * Efeito magnético: o conteúdo segue levemente o cursor enquanto ele está por cima
 * e volta com uma transição elástica ao sair. Implementado sem bibliotecas
 * (só transform), então dezenas de instâncias não pesam na hidratação.
 * Ignorado em telas de toque e com movimento reduzido.
 */
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const enabled = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || !enabled()) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    el.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)";
    el.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} className={cn("inline-block", className)}>
      {children}
    </div>
  );
}

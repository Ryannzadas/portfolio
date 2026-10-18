"use client";

import { useEffect, useRef, useState } from "react";
import { usePointerEffects } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, [data-cursor]";

/**
 * Cursor customizado: um ponto que segue o mouse e um anel com atraso.
 * Sobre elementos clicáveis o anel cresce e pode mostrar um rótulo (data-cursor-label).
 * Só existe em dispositivos com mouse e sem preferência por movimento reduzido.
 */
export function Cursor() {
  const enabled = usePointerEffects();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ hover: boolean; label: string | null; hidden: boolean }>({
    hover: false,
    label: null,
    hidden: true,
  });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    const mouse = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setState((s) => (s.hidden ? { ...s, hidden: false } : s));
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(INTERACTIVE);
      const isText = target?.matches("input, textarea");
      setState((s) => ({
        ...s,
        hover: Boolean(target) && !isText,
        label: target?.dataset.cursorLabel ?? null,
      }));
    };

    const onLeave = () => setState((s) => ({ ...s, hidden: true }));

    // Loop de animação: o anel persegue o ponto com interpolação (lerp).
    const loop = () => {
      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className={cn("transition-opacity duration-300", state.hidden && "opacity-0")}>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[95] will-change-transform"
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-300 ease-out-expo",
            state.label
              ? "h-20 w-20 border-transparent bg-accent"
              : state.hover
                ? "h-14 w-14 border-accent bg-accent-soft"
                : "h-9 w-9 border-fg/30",
          )}
        >
          {state.label && (
            <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-accent-fg">
              {state.label}
            </span>
          )}
        </div>
      </div>
      <div
        ref={dotRef}
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[96] h-1.5 w-1.5 rounded-full bg-accent will-change-transform transition-opacity",
          (state.hover || state.label) && "opacity-0",
        )}
      />
    </div>
  );
}

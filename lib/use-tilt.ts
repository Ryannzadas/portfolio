"use client";

import { useCallback } from "react";

/**
 * Inclinação 3D + posição do brilho seguindo o cursor, sem bibliotecas:
 * só escreve variáveis CSS (--rx, --ry, --gx, --gy) no elemento.
 * O elemento usa `transform: rotateX(var(--rx)) rotateY(var(--ry))` com transição,
 * o que dá a suavidade de uma mola sem custo de hidratação.
 * Ignorado em telas de toque e com movimento reduzido.
 */
export function useTilt(intensity = 8) {
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      el.style.setProperty("--ry", `${(px - 0.5) * intensity}deg`);
      el.style.setProperty("--rx", `${(0.5 - py) * intensity}deg`);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    },
    [intensity],
  );

  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  }, []);

  return { onPointerMove, onPointerLeave };
}

/** Classes do elemento inclinável (transform lido das variáveis do useTilt). */
export const tiltClasses =
  "[transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transform-style:preserve-3d] transition-[transform,border-color] duration-500 ease-out-expo";

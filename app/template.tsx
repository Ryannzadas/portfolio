"use client";

import { useEffect } from "react";

// Na primeira carga não há transição (o loader cuida disso); só nas navegações seguintes.
let hasNavigated = false;

/**
 * Transição entre páginas: uma cortina cobre a tela e sobe revelando a nova página,
 * enquanto o conteúdo entra com um leve fade/slide (keyframes em globals.css).
 * O template remonta a cada navegação, o que dispara a animação.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const animate = hasNavigated;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  if (!animate) return <>{children}</>;

  return (
    <>
      <div
        aria-hidden="true"
        className="page-curtain pointer-events-none fixed inset-0 z-[75] flex items-end bg-accent p-6 md:p-10"
      >
        <span className="font-display text-[12vw] font-bold leading-none tracking-tighter text-accent-fg">JR.</span>
      </div>
      <div className="page-enter">{children}</div>
    </>
  );
}

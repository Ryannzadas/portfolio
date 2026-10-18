"use client";

import dynamic from "next/dynamic";

/**
 * Efeitos puramente decorativos carregados só no cliente, em chunks separados,
 * depois da hidratação — assim não competem com o conteúdo principal (melhor LCP/TBT).
 */
export const LazyCursor = dynamic(() => import("./cursor").then((m) => m.Cursor), { ssr: false });

export const LazyHeroCanvas = dynamic(() => import("./hero-canvas").then((m) => m.HeroCanvas), {
  ssr: false,
});

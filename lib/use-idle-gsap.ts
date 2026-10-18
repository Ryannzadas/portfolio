"use client";

import { useEffect, type RefObject } from "react";

type GsapModules = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

/**
 * Cria animações GSAP/ScrollTrigger só quando o navegador estiver ocioso,
 * fora do commit da hidratação. O GSAP é importado sob demanda (não entra no
 * JavaScript inicial) e os ScrollTriggers, que medem a página ao serem criados,
 * não forçam layouts durante o carregamento.
 * Tudo é revertido automaticamente ao desmontar (gsap.context).
 */
export function useIdleGSAP(setup: (modules: GsapModules) => void, scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let cancelled = false;
    let revert = () => {};

    const run = () => {
      Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => setup({ gsap, ScrollTrigger }), scope.current ?? undefined);
        revert = () => ctx.revert();
      });
    };

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(run, { timeout: 2500 })
      : window.setTimeout(run, 300);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      revert();
    };
    // A configuração roda uma vez por montagem.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

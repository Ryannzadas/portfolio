"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";

/**
 * Cria animações GSAP/ScrollTrigger só quando o navegador estiver ocioso,
 * fora do commit da hidratação. Os ScrollTriggers medem a página ao serem criados;
 * fazer isso durante a hidratação força layouts caros e bloqueia a thread principal.
 * Tudo é revertido automaticamente ao desmontar (gsap.context).
 */
export function useIdleGSAP(setup: () => void, scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let ctx: gsap.Context | undefined;
    const run = () => {
      ctx = gsap.context(setup, scope.current ?? undefined);
    };

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(run, { timeout: 1500 })
      : window.setTimeout(run, 200);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      ctx?.revert();
    };
    // A configuração roda uma vez por montagem.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

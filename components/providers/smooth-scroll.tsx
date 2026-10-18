"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

/**
 * Smooth scroll com Lenis, sincronizado com o ticker do GSAP
 * para que as animações do ScrollTrigger fiquem perfeitamente alinhadas.
 * - Só em dispositivos com mouse/trackpad (no touch o Lenis não suaviza a rolagem).
 * - Desativado quando o usuário prefere movimento reduzido.
 * - Lenis e GSAP são importados sob demanda, fora do carregamento inicial.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let cancelled = false;
    let cleanup = () => {};

    Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: LenisClass }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const instance = new LenisClass({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        instance.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => instance.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        setLenis(instance);

        cleanup = () => {
          gsap.ticker.remove(tick);
          instance.destroy();
          setLenis(null);
        };
      },
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  // Ao trocar de página: volta ao topo (ou à âncora) e recalcula os ScrollTriggers.
  useEffect(() => {
    // Na carga inicial não há nada a resetar (evita um ScrollTrigger.refresh extra).
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;

    // Cancela qualquer scroll suave em andamento da página anterior e recalcula as dimensões.
    lenis?.resize();
    const hash = window.location.hash;
    const target = hash ? document.querySelector<HTMLElement>(hash) : null;
    if (target) {
      if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
      else target.scrollIntoView();
    } else if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
    const id = window.setTimeout(() => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    }, 300);
    return () => window.clearTimeout(id);
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** Rola suavemente até um seletor/elemento (cai no scroll nativo se o Lenis estiver desligado). */
export function useScrollTo() {
  const lenis = useContext(LenisContext);
  return useCallback(
    (target: string | HTMLElement | number) => {
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.4 });
        return;
      }
      const smooth = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      if (typeof target === "number") window.scrollTo({ top: target, behavior: smooth });
      else {
        const el = typeof target === "string" ? document.querySelector(target) : target;
        el?.scrollIntoView({ behavior: smooth });
      }
    },
    [lenis],
  );
}

/** Pausa/retoma o scroll (usado no modal). */
export function useLenis() {
  return useContext(LenisContext);
}

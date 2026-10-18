"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

/**
 * Smooth scroll com Lenis, sincronizado com o ticker do GSAP
 * para que as animações do ScrollTrigger fiquem perfeitamente alinhadas.
 * Desativado quando o usuário prefere movimento reduzido.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // O Lenis só existe no cliente: expomos a instância via contexto depois de criá-la.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
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
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
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
      if (typeof target === "number") window.scrollTo({ top: target });
      else {
        const el = typeof target === "string" ? document.querySelector(target) : target;
        el?.scrollIntoView();
      }
    },
    [lenis],
  );
}

/** Pausa/retoma o scroll (usado no menu mobile). */
export function useLenis() {
  return useContext(LenisContext);
}

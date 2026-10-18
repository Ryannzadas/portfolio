"use client";

import { useSyncExternalStore } from "react";

/**
 * Lê uma media query de forma segura para SSR.
 * No servidor retorna `serverFallback` e sincroniza no cliente sem mismatch.
 */
export function useMediaQuery(query: string, serverFallback = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

/** true quando o usuário pediu menos movimento no sistema operacional. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** true em dispositivos com mouse/trackpad (cursor customizado, tilt, magnetismo). */
export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/** Combinação usada pelos efeitos que dependem do cursor. */
export function usePointerEffects() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  return fine && !reduced;
}

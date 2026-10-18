"use client";

import { useEffect } from "react";

/**
 * Observa todos os elementos [data-reveal] da página (inclusive os que entram depois,
 * como os cards de projetos carregados via Suspense) e marca .is-visible ao entrarem na tela.
 */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    const observe = (root: ParentNode) => {
      root.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => io.observe(el));
    };
    observe(document);

    // Novos nós (navegação, Suspense, modais) também são observados.
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches("[data-reveal]")) io.observe(node);
          observe(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}

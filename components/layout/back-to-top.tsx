"use client";

import { ArrowUp } from "lucide-react";
import { useScrollTo } from "@/components/providers/smooth-scroll";

export function BackToTop() {
  const scrollTo = useScrollTo();
  return (
    <button
      type="button"
      onClick={() => {
        scrollTo(0);
        document.getElementById("conteudo")?.focus({ preventScroll: true });
      }}
      className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-fg transition-colors hover:border-fg"
    >
      Voltar ao topo
      <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}

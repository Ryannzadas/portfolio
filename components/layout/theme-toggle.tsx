"use client";

import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};

/**
 * Alterna entre tema escuro e claro.
 * Usa a View Transitions API para revelar o novo tema em círculo a partir do botão
 * (com fallback instantâneo em navegadores sem suporte ou com movimento reduzido).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // Evita mismatch de hidratação: o tema só é conhecido no cliente.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = !mounted || resolvedTheme === "dark";

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark";
    const apply = () => {
      document.documentElement.classList.toggle("dark", next === "dark");
      flushSync(() => setTheme(next));
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      apply();
      return;
    }

    const { clientX: x, clientY: y } = e;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      className={cn(
        "relative grid h-10 w-10 place-items-center rounded-full border border-line text-fg transition-colors hover:border-fg",
        className,
      )}
    >
      <Sun className={cn("h-4 w-4 transition-all duration-500", isDark ? "rotate-0 scale-100" : "rotate-90 scale-0")} />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-500",
          isDark ? "-rotate-90 scale-0" : "rotate-0 scale-100",
        )}
      />
    </button>
  );
}

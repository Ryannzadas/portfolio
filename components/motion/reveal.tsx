import { cn } from "@/lib/utils";

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  /** Distância (px) do deslocamento inicial. */
  y?: number;
};

/**
 * Fade + slide quando o elemento entra na tela (uma única vez).
 * Componente de servidor: só marca o elemento com data-reveal. Um único
 * IntersectionObserver global (<RevealObserver />) adiciona .is-visible —
 * zero custo de hidratação, mesmo com dezenas de elementos na página.
 * Use abaixo da dobra; nunca no hero, para não atrasar o LCP.
 */
export function Reveal({ delay = 0, y = 28, className, style, children, ...props }: RevealProps) {
  return (
    <div
      data-reveal=""
      className={cn(className)}
      style={{ "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px`, ...style } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}

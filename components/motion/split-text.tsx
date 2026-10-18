import { cn } from "@/lib/utils";

type SplitTextProps = {
  text: string;
  className?: string;
  /** Índice inicial do stagger (para encadear várias linhas). */
  startIndex?: number;
};

/**
 * Divide o texto em palavras e letras para a animação de entrada do hero.
 * A animação é CSS pura (.split-char em globals.css), então funciona antes da hidratação.
 * Leitores de tela leem o texto inteiro (sr-only); as letras animadas ficam ocultas para eles.
 */
export function SplitText({ text, className, startIndex = 0 }: SplitTextProps) {
  const words = text.split(" ");
  let index = startIndex;

  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            <span className="split-word">
              {Array.from(word).map((char, c) => (
                <span key={c} className="split-char" style={{ "--i": index++ } as React.CSSProperties}>
                  {char}
                </span>
              ))}
            </span>
            {w < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </span>
  );
}

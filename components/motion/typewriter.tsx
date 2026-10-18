"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type TypewriterProps = {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
  /** Espera (ms) antes de começar a digitar — deixa a entrada do hero acontecer primeiro. */
  startDelay?: number;
};

/**
 * Efeito de digitação que alterna entre várias palavras.
 * O texto animado é decorativo (aria-hidden); a lista completa fica disponível
 * para leitores de tela. Com movimento reduzido, troca as palavras sem digitar.
 */
export function Typewriter({ words, typeSpeed = 70, deleteSpeed = 35, pause = 1800, startDelay = 2600 }: TypewriterProps) {
  const reduced = usePrefersReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState(words[0]);
  const [deleting, setDeleting] = useState(false);
  const [ready, setReady] = useState(false);

  // Só começa a alternar depois da animação de entrada do hero.
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), startDelay);
    return () => window.clearTimeout(id);
  }, [startDelay]);

  useEffect(() => {
    if (!ready) return;
    if (reduced) {
      const id = window.setInterval(() => {
        setWordIndex((i) => (i + 1) % words.length);
      }, pause + 1200);
      return () => window.clearInterval(id);
    }

    const current = words[wordIndex];
    let delay = deleting ? deleteSpeed : typeSpeed;

    if (!deleting && text === current) delay = pause;
    if (deleting && text === "") delay = 300;

    const id = window.setTimeout(() => {
      if (!deleting && text === current) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      } else {
        setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
      }
    }, delay);

    return () => window.clearTimeout(id);
  }, [ready, text, deleting, wordIndex, words, typeSpeed, deleteSpeed, pause, reduced]);

  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true" className="inline-block min-h-[1.4em]">
        <span className="text-fg">{reduced ? words[wordIndex] : text}</span>
        <span className="caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-accent" />
      </span>
    </>
  );
}

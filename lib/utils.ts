import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina classes condicionais e resolve conflitos do Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Transforma "ruins_of_aether" em "Ruins of Aether". */
export function prettifyRepoName(name: string) {
  const small = new Set(["of", "the", "and", "de", "da", "do", "e", "a"]);
  return name
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word, i) =>
      i > 0 && small.has(word.toLowerCase())
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

/** Hash simples e determinístico de uma string (usado para gerar gradientes). */
export function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Formata "2025-08-12" como "ago 2025". */
export function formatMonthYear(iso: string) {
  const [year, month] = iso.split("-").map(Number);
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${months[month - 1]} ${year}`;
}

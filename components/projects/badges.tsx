import { cn } from "@/lib/utils";

/** Cores aproximadas das linguagens (mesma ideia do GitHub). */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  HTML: "#e34c26",
  CSS: "#663399",
  Shell: "#89e051",
  Go: "#00ADD8",
  Rust: "#dea584",
  PHP: "#4F5D95",
  Lua: "#000080",
  GDScript: "#355570",
};

type BadgesProps = {
  languages: string[];
  topics: string[];
  max?: number;
  className?: string;
};

/** Linguagens (com bolinha colorida) seguidas dos tópicos do repositório. */
export function Badges({ languages, topics, max = 6, className }: BadgesProps) {
  const items = [
    ...languages.map((name) => ({ name, color: LANGUAGE_COLORS[name] ?? "var(--muted)", kind: "lang" as const })),
    ...topics.map((name) => ({ name, color: null, kind: "topic" as const })),
  ];
  const visible = items.slice(0, max);
  const hidden = items.length - visible.length;

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Tecnologias e tópicos">
      {visible.map((item) => (
        <li
          key={`${item.kind}-${item.name}`}
          className="flex items-center gap-1.5 rounded-full border border-line bg-bg/40 px-2.5 py-1 font-mono text-[11px] text-muted"
        >
          {item.color ? (
            <span className="h-2 w-2 rounded-full" style={{ background: item.color }} aria-hidden="true" />
          ) : (
            <span className="text-accent" aria-hidden="true">#</span>
          )}
          {item.name}
        </li>
      ))}
      {hidden > 0 && (
        <li className="rounded-full px-2 py-1 font-mono text-[11px] text-muted">+{hidden}</li>
      )}
    </ul>
  );
}

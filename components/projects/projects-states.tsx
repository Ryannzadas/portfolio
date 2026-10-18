import { ArrowUpRight, CloudOff, FolderGit2 } from "lucide-react";
import { githubProfileUrl } from "@/lib/github";

/** Skeleton exibido enquanto os projetos carregam. */
export function ProjectsSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-2" aria-busy="true" aria-label="Carregando projetos">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`overflow-hidden rounded-[24px] border border-line bg-surface ${i === 0 ? "lg:col-span-2" : ""}`}
        >
          <div className="shimmer aspect-[16/10] w-full lg:aspect-[21/8]" />
          <div className="space-y-4 p-6 md:p-8">
            <div className="shimmer h-3 w-24 rounded" />
            <div className="shimmer h-7 w-1/2 rounded" />
            <div className="shimmer h-4 w-full rounded" />
            <div className="shimmer h-4 w-4/5 rounded" />
            <div className="flex gap-2 pt-2">
              {[0, 1, 2].map((b) => (
                <div key={b} className="shimmer h-6 w-16 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StateBox({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex flex-col items-start gap-5 rounded-[24px] border border-dashed border-line p-8 md:p-12">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">{icon}</span>
      <div>
        <p className="font-display text-2xl font-semibold">{title}</p>
        <p className="mt-2 max-w-lg text-muted">{text}</p>
      </div>
      <a
        href={githubProfileUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-fg"
      >
        Ver perfil no GitHub <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}

/** Fallback quando a API do GitHub falha (rate limit, fora do ar…). */
export function ProjectsError() {
  return (
    <StateBox
      icon={<CloudOff className="h-5 w-5" />}
      title="Os projetos não carregaram agora"
      text="A API do GitHub não respondeu. Enquanto isso, você pode ver todos os repositórios direto no meu perfil."
    />
  );
}

/** Nenhum repositório com o tópico "portfolio". */
export function ProjectsEmpty() {
  return (
    <StateBox
      icon={<FolderGit2 className="h-5 w-5" />}
      title="Novos projetos em breve"
      text="Estou preparando os próximos projetos para mostrar aqui. Os repositórios públicos já estão no GitHub."
    />
  );
}

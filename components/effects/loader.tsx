import { profile } from "@/content/dados";

/**
 * Tela de loading com contador 0 → 100%.
 * É 100% CSS (ver .loader em globals.css): aparece antes do JavaScript carregar,
 * só na primeira visita da sessão, e sai com uma "cortina" para cima.
 */
export function Loader() {
  return (
    <div
      className="loader fixed inset-0 z-[90] flex-col justify-between bg-bg p-5 text-fg md:p-10"
      aria-hidden="true"
    >
      <div className="flex justify-between font-mono text-xs uppercase tracking-[0.2em] text-muted">
        <span>{profile.shortName}</span>
        <span>Portfólio</span>
      </div>

      <div>
        <div className="flex items-end justify-between gap-6">
          <p className="max-w-[16ch] font-display text-lg leading-tight text-muted md:text-2xl">
            Carregando experiências, linha por linha.
          </p>
          <p className="loader-count font-display text-[22vw] font-semibold leading-[0.8] tracking-tighter md:text-[14vw]">
            <span className="text-accent">%</span>
          </p>
        </div>
        <div className="mt-6 h-px w-full bg-line">
          <div className="loader-bar h-full w-full bg-accent" />
        </div>
      </div>
    </div>
  );
}

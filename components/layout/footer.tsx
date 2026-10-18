import { cacheLife } from "next/cache";
import { ArrowUpRight } from "lucide-react";
import { profile, socials } from "@/content/dados";
import { Magnetic } from "@/components/motion/magnetic";
import { LocalTime } from "./local-time";
import { BackToTop } from "./back-to-top";

/** Ano atual em cache (renova diariamente) — exigência do modelo Cache Components. */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line px-4 pb-6 pt-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="max-w-sm font-display text-2xl leading-tight md:text-3xl">
              Aberto a estágios, freelas e projetos que me façam aprender.
            </p>
          </div>

          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-muted">Redes</p>
            <ul className="space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.icon === "mail" ? undefined : "_blank"}
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 text-fg transition-colors hover:text-accent"
                  >
                    {s.label}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-muted">Local</p>
            <p>{profile.location}</p>
            <LocalTime className="mt-1 block font-mono text-sm" />
          </div>
        </div>

        {/* Assinatura gigante */}
        <p
          aria-hidden="true"
          className="mt-20 select-none whitespace-nowrap text-center font-display text-[18.5vw] font-bold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--line)] xl:text-[16.5rem]"
        >
          {profile.shortName}
        </p>

        <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-line pt-6 text-sm text-muted sm:flex-row">
          <p>
            © <CurrentYear /> {profile.name}
          </p>
          <Magnetic>
            <BackToTop />
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}

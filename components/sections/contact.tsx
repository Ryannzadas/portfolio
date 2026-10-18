import { profile, socials } from "@/content/dados";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { ContactForm } from "@/components/contact/contact-form";
import { CopyEmail } from "@/components/contact/copy-email";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="relative overflow-hidden px-4 py-28 md:px-8 md:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[50vmax] w-[50vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--accent-soft)_0%,transparent_65%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
            <span className="text-accent">05</span>
            <span className="h-px w-10 bg-line" aria-hidden="true" />
            Contato
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            id="contato-titulo"
            className="font-display text-[clamp(3rem,10vw,9.5rem)] font-semibold leading-[0.88] tracking-[-0.05em]"
          >
            Vamos criar
            <br />
            algo <span className="text-outline">juntos</span>
            <span className="text-accent">?</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <Reveal className="flex flex-col gap-10">
            <p className="max-w-md text-lg leading-relaxed text-muted">
              Tem uma vaga de estágio, um projeto ou só quer trocar uma ideia sobre web, jogos ou segurança?
              Me manda uma mensagem — respondo rapidinho.
            </p>

            <CopyEmail email={profile.email} />

            <div className="flex gap-3">
              {socials
                .filter((s) => s.icon !== "mail")
                .map((s) => (
                  <Magnetic key={s.label} strength={0.5}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="grid h-14 w-14 place-items-center rounded-full border border-line transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg"
                    >
                      {s.icon === "github" ? <GithubIcon className="h-5 w-5" /> : <LinkedinIcon className="h-5 w-5" />}
                    </a>
                  </Magnetic>
                ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

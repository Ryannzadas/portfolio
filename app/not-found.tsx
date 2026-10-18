import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[90vh] flex-col items-start justify-center px-4 pt-28 md:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <p className="font-mono text-sm text-accent">Erro 404</p>
        <h1 className="mt-4 font-display text-[clamp(5rem,22vw,18rem)] font-bold leading-[0.8] tracking-[-0.06em]">
          4<span className="text-outline">0</span>4
        </h1>
        <p className="mt-8 max-w-md text-lg text-muted">
          Essa página não existe — ou foi parar em outro commit. Que tal voltar para o início?
        </p>
        <ButtonLink href="/" className="mt-10">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar ao início
        </ButtonLink>
      </div>
    </section>
  );
}

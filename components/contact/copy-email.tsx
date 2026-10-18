"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";

/** E-mail grande clicável + botão de copiar para a área de transferência. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.assign(`mailto:${email}`);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={`mailto:${email}`}
        className="font-display text-xl font-medium underline decoration-line decoration-1 underline-offset-8 transition-colors hover:decoration-accent sm:text-2xl"
      >
        {email}
      </a>
      <Magnetic>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-fg"
        >
          {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </Magnetic>
      <span className="sr-only" aria-live="polite">
        {copied ? "E-mail copiado para a área de transferência" : ""}
      </span>
    </div>
  );
}

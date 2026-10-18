"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { profile } from "@/content/dados";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/motion/magnetic";
import { buttonClasses } from "@/components/ui/button";

type FormValues = {
  name: string;
  email: string;
  message: string;
  /** Honeypot anti-spam: humanos não veem nem preenchem este campo. */
  _gotcha?: string;
};

// Regras de validação (nativas do react-hook-form — sem bibliotecas extras no bundle).
const rules = {
  name: {
    validate: (v = "") => {
      const value = v.trim();
      if (value.length < 2) return "Digite seu nome (mínimo 2 letras).";
      if (value.length > 80) return "Nome muito longo.";
      return true;
    },
  },
  email: {
    validate: (v = "") => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Digite um e-mail válido.",
  },
  message: {
    validate: (v = "") => {
      const value = v.trim();
      if (value.length < 10) return "Escreva pelo menos 10 caracteres.";
      if (value.length > 2000) return "Máximo de 2000 caracteres.";
      return true;
    },
  },
};
type Status = "idle" | "success" | "error";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

/**
 * Formulário de contato com validação em tempo real (react-hook-form).
 * Envia para o Formspree; sem ID configurado, abre o app de e-mail como fallback.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ mode: "onTouched" });

  const onSubmit = async (values: FormValues) => {
    if (values._gotcha) return;

    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent(`Contato pelo portfólio — ${values.name}`);
      const body = encodeURIComponent(`${values.message}\n\n${values.name} (${values.email})`);
      window.location.assign(`mailto:${profile.email}?subject=${subject}&body=${body}`);
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name.trim(), email: values.email.trim(), message: values.message.trim() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative rounded-[28px] border border-line bg-surface/70 p-6 backdrop-blur md:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex min-h-[420px] flex-col items-start justify-center gap-5"
            role="status"
          >
            <CheckCircle2 className="h-12 w-12 text-accent" aria-hidden="true" />
            <p className="font-display text-3xl font-semibold">Mensagem enviada!</p>
            <p className="max-w-sm text-muted">Obrigado pelo contato. Vou responder no seu e-mail o quanto antes.</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="text-sm text-accent underline underline-offset-4"
            >
              Enviar outra mensagem
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-7"
            aria-label="Formulário de contato"
          >
            <Field label="Seu nome" id="name" error={errors.name?.message}>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Como posso te chamar?"
                {...register("name", rules.name)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={inputClasses(Boolean(errors.name))}
              />
            </Field>

            <Field label="Seu e-mail" id="email" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="voce@exemplo.com"
                {...register("email", rules.email)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputClasses(Boolean(errors.email))}
              />
            </Field>

            <Field label="Mensagem" id="message" error={errors.message?.message}>
              <textarea
                id="message"
                rows={5}
                placeholder="Conte um pouco sobre a ideia, vaga ou projeto…"
                {...register("message", rules.message)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={cn(inputClasses(Boolean(errors.message)), "resize-none")}
              />
            </Field>

            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="_gotcha">Não preencha</label>
              <input id="_gotcha" type="text" tabIndex={-1} autoComplete="off" {...register("_gotcha")} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <p role="alert" className="text-sm text-red-500 dark:text-red-400">
                {status === "error" && "Não foi possível enviar agora. Tente de novo ou me chame por e-mail."}
              </p>
              <Magnetic>
                <button type="submit" disabled={isSubmitting} className={buttonClasses("primary", "px-8 py-4")}>
                  {isSubmitting ? (
                    <>
                      Enviando <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      Enviar mensagem
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden="true" />
                    </>
                  )}
                </button>
              </Magnetic>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function inputClasses(invalid: boolean) {
  return cn(
    "w-full border-0 border-b bg-transparent px-0 py-3 text-lg text-fg placeholder:text-muted transition-colors focus:outline-none focus-visible:outline-none",
    invalid ? "border-red-500 dark:border-red-400" : "border-line focus:border-accent",
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-sm text-red-500 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

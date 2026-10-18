"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { X } from "lucide-react";
import { navLinks, socials } from "@/content/dados";
import { LocalTime } from "./local-time";
import { SectionLink } from "./nav-link";

const ease = [0.76, 0, 0.24, 1] as const;

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Botão que abriu o menu — recebe o foco de volta ao fechar. */
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
};

/**
 * Menu em tela cheia do mobile (Radix Dialog: foco preso, Esc fecha).
 * Carregado sob demanda pela navbar, só no primeiro toque em "Menu".
 */
export function MobileMenu({ open, onOpenChange, returnFocusRef }: MobileMenuProps) {
  return (
    // reducedMotion="user": respeita prefers-reduced-motion.
    <MotionConfig reducedMotion="user">
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Content
              forceMount
              aria-describedby={undefined}
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                returnFocusRef.current?.focus();
              }}
              asChild
            >
              <motion.div
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                exit={{ clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: 0.7, ease }}
                className="fixed inset-0 z-[70] flex flex-col bg-surface px-6 pb-8 pt-6"
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                    Navegação
                  </Dialog.Title>
                  <Dialog.Close
                    className="grid h-11 w-11 place-items-center rounded-full border border-line"
                    aria-label="Fechar menu"
                  >
                    <X className="h-5 w-5" />
                  </Dialog.Close>
                </div>

                <ul className="mt-auto space-y-1">
                  {navLinks.map((link, i) => (
                    <li key={link.id} className="overflow-hidden">
                      <motion.div
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "110%" }}
                        transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.05 }}
                      >
                        <SectionLink
                          section={link.id}
                          onClick={() => onOpenChange(false)}
                          className="flex items-baseline gap-4 font-display text-[13vw] font-semibold leading-[1.05] tracking-tight sm:text-7xl"
                        >
                          <span className="font-mono text-sm text-accent">0{i + 1}</span>
                          {link.label}
                        </SectionLink>
                      </motion.div>
                    </li>
                  ))}
                </ul>

                <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-sm">
                  <div className="flex gap-5">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target={s.icon === "mail" ? undefined : "_blank"}
                        rel="noreferrer"
                        className="text-muted hover:text-fg"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                  <LocalTime className="font-mono text-xs" />
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
    </MotionConfig>
  );
}

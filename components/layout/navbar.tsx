"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { navLinks, profile, socials } from "@/content/dados";
import { cn } from "@/lib/utils";
import { useScrollTo } from "@/components/providers/smooth-scroll";
import { Magnetic } from "@/components/motion/magnetic";
import { ThemeToggle } from "./theme-toggle";
import { LocalTime } from "./local-time";
import { SectionLink } from "./nav-link";

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Navbar fixa que se esconde ao rolar para baixo e volta ao rolar para cima.
 * No mobile abre um menu em tela cheia (Radix Dialog: foco preso, Esc fecha).
 */
export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const scrollTo = useScrollTo();

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(current > 40);
    // Esconde só depois de passar do topo e se estiver descendo.
    setHidden(current > 160 && current > previous);
  });

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8"
      >
        <nav
          aria-label="Principal"
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between rounded-full border px-3 py-2 pl-5 transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled ? "border-line bg-bg/70 backdrop-blur-xl" : "border-transparent",
          )}
        >
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                scrollTo(0);
              }
            }}
            className="group flex items-center gap-3"
            aria-label={`${profile.shortName} — início`}
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-fg font-display text-xs font-bold text-bg transition-colors group-hover:bg-accent group-hover:text-accent-fg">
              {profile.initials}
            </span>
            <span className="hidden font-display text-sm font-medium sm:inline">{profile.shortName}</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link, i) => (
              <li key={link.id}>
                <SectionLink
                  section={link.id}
                  className="group relative flex items-baseline gap-1.5 rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-fg"
                >
                  <span className="font-mono text-[11px] text-accent">0{i + 1}</span>
                  {link.label}
                </SectionLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <LocalTime className="mr-2 hidden font-mono text-xs xl:inline" />
            <ThemeToggle />
            <Magnetic className="hidden lg:inline-block">
              <SectionLink
                section="contato"
                className="flex items-center gap-1.5 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-fg"
              >
                Vamos conversar
                <ArrowUpRight className="h-4 w-4" />
              </SectionLink>
            </Magnetic>

            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger
                className="flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm lg:hidden"
                aria-label="Abrir menu"
              >
                Menu
                <span className="flex flex-col gap-1" aria-hidden="true">
                  <span className="h-px w-4 bg-fg" />
                  <span className="h-px w-4 bg-fg" />
                </span>
              </Dialog.Trigger>
              <AnimatePresence>
                {open && (
                  <Dialog.Portal forceMount>
                    <Dialog.Content forceMount aria-describedby={undefined} asChild>
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
                                  onClick={() => setOpen(false)}
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
          </div>
        </nav>
      </motion.header>
    </>
  );
}

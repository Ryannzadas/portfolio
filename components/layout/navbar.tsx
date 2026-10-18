"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { navLinks, profile } from "@/content/dados";
import { cn } from "@/lib/utils";
import { useScrollTo } from "@/components/providers/smooth-scroll";
import { Magnetic } from "@/components/motion/magnetic";
import { ThemeToggle } from "./theme-toggle";
import { LocalTime } from "./local-time";
import { SectionLink } from "./nav-link";

// O menu mobile (Radix + Framer Motion) só é baixado no primeiro toque em "Menu".
const MobileMenu = dynamic(() => import("./mobile-menu").then((m) => m.MobileMenu), { ssr: false });

/**
 * Navbar fixa que se esconde ao rolar para baixo e volta ao rolar para cima.
 * O movimento é uma transição CSS de transform; o scroll é lido num listener passivo
 * agrupado por requestAnimationFrame (sem bibliotecas no carregamento inicial).
 */
export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const scrollTo = useScrollTo();

  useEffect(() => {
    let previous = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const current = window.scrollY;
      const delta = current - previous;
      setScrolled(current > 40);
      // Esconde ao descer (depois de passar do topo) e mostra ao subir;
      // movimentos mínimos (ou nenhum) mantêm o estado atual.
      if (current <= 160) setHidden(false);
      else if (delta > 4) setHidden(true);
      else if (delta < -4) setHidden(false);
      previous = current;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const openMenu = () => {
    setMenuLoaded(true);
    setOpen(true);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-4 pt-4 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:px-8",
        hidden && !open && "-translate-y-[110%]",
      )}
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

          <button
            ref={menuButtonRef}
            type="button"
            onClick={openMenu}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label="Abrir menu"
            className="flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm lg:hidden"
          >
            Menu
            <span className="flex flex-col gap-1" aria-hidden="true">
              <span className="h-px w-4 bg-fg" />
              <span className="h-px w-4 bg-fg" />
            </span>
          </button>
          {menuLoaded && <MobileMenu open={open} onOpenChange={setOpen} returnFocusRef={menuButtonRef} />}
        </div>
      </nav>
    </header>
  );
}

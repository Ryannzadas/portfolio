"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrollTo } from "@/components/providers/smooth-scroll";

type SectionLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  /** id da seção na home (sem #). */
  section: string;
};

/**
 * Link para uma seção da home.
 * Na home rola suavemente com o Lenis; em outras páginas navega para "/#secao".
 */
export function SectionLink({ section, onClick, ...props }: SectionLinkProps) {
  const pathname = usePathname();
  const scrollTo = useScrollTo();

  return (
    <Link
      href={`/#${section}`}
      onClick={(e) => {
        onClick?.(e);
        if (pathname === "/") {
          e.preventDefault();
          scrollTo(`#${section}`);
          history.replaceState(null, "", `#${section}`);
        }
      }}
      {...props}
    />
  );
}

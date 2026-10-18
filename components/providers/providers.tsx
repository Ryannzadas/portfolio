"use client";

import { ThemeProvider } from "next-themes";
import { SmoothScroll } from "./smooth-scroll";

/** Agrupa todos os providers de cliente usados no layout. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <SmoothScroll>{children}</SmoothScroll>
    </ThemeProvider>
  );
}

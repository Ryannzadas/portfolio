"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { SmoothScroll } from "./smooth-scroll";

/** Agrupa todos os providers de cliente usados no layout. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      {/* reducedMotion="user": Framer Motion respeita prefers-reduced-motion automaticamente */}
      <MotionConfig reducedMotion="user">
        <SmoothScroll>{children}</SmoothScroll>
      </MotionConfig>
    </ThemeProvider>
  );
}

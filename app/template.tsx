"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

// Na primeira carga não há transição (o loader cuida disso); só nas navegações seguintes.
let hasNavigated = false;

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Transição entre páginas: uma cortina cobre a tela e sobe revelando a nova página,
 * enquanto o conteúdo entra com um leve fade/slide.
 * O template remonta a cada navegação, o que dispara a animação.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const animate = hasNavigated;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  if (!animate) return <>{children}</>;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[75] flex items-end bg-accent p-6 md:p-10"
        initial={{ clipPath: "inset(0 0 0% 0)" }}
        animate={{ clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.8, ease, delay: 0.1 }}
      >
        <span className="font-display text-[12vw] font-bold leading-none tracking-tighter text-accent-fg">JR.</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
      >
        {children}
      </motion.div>
    </>
  );
}

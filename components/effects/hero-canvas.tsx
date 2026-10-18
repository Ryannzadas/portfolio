"use client";

import { useEffect, useRef } from "react";

/**
 * Fundo do hero: grade de pontos que "respira" em ondas e se afasta do cursor.
 * - Canvas 2D leve (sem WebGL), DPR limitado a 2.
 * - Só anima enquanto o cursor se move sobre a página (e um pouco depois);
 *   parado, fica um quadro estático — nenhum custo de CPU em repouso ou no mobile.
 * - Pausa quando sai da tela ou a aba fica oculta.
 * - Com movimento reduzido desenha um único quadro estático.
 */
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -9999, y: -9999, active: false };
    let width = 0;
    let height = 0;
    let gap = 28;
    let frame = 0;
    let visible = true;
    let running = false;
    let lastActivity = 0;
    const IDLE_AFTER = 1800; // ms sem mexer o mouse até a animação parar
    let colors = { dot: "", accent: "" };

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement);
      colors = {
        dot: styles.getPropertyValue("--fg").trim(),
        accent: styles.getPropertyValue("--accent").trim(),
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      gap = width < 768 ? 34 : 28;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = time * 0.0006;
      const radius = 160;

      for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
          // Onda suave que percorre a grade.
          const wave = Math.sin(x * 0.012 + t) * Math.cos(y * 0.014 - t * 0.8);
          let px = x;
          let py = y;
          let influence = 0;

          if (pointer.active) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < radius) {
              influence = 1 - dist / radius;
              const push = influence * influence * 18;
              px += (dx / (dist || 1)) * push;
              py += (dy / (dist || 1)) * push;
            }
          }

          const alpha = 0.1 + (wave + 1) * 0.07 + influence * 0.6;
          const size = 1 + influence * 1.6;
          ctx.globalAlpha = Math.min(alpha, 1);
          ctx.fillStyle = influence > 0.15 ? colors.accent : colors.dot;
          ctx.fillRect(px - size / 2, py - size / 2, size, size);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      draw(time);
      const idle = performance.now() - lastActivity > IDLE_AFTER;
      if (visible && !document.hidden && !idle) {
        frame = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    readColors();
    resize();

    draw(0);

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      lastActivity = performance.now();
      if (visible) start();
    };
    const onLeave = () => (pointer.active = false);
    const onResize = () => {
      resize();
      draw(performance.now());
    };

    // Recarrega as cores quando o tema muda (classe .dark no <html>).
    const themeObserver = new MutationObserver(() => {
      readColors();
      draw(performance.now());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
    />
  );
}

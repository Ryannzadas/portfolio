"use client";

import { useSyncExternalStore } from "react";
import { profile } from "@/content/dados";

const formatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: profile.timezone,
});

// "Loja" externa: o relógio. Atualiza a cada 15s; o snapshot só muda quando o minuto muda.
const subscribe = (onChange: () => void) => {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
};
const getSnapshot = () => formatter.format(new Date());
const getServerSnapshot = () => null;

/** Horário local de Moreno, PE (renderiza só no cliente). */
export function LocalTime({ className }: { className?: string }) {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <span className={className}>
      <time>{time ?? "--:--"}</time> <span className="text-muted">BRT</span>
    </span>
  );
}

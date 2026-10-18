import { ImageResponse } from "next/og";

export const alt = "João Ryan da Silva Santos — Desenvolvedor Web";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem gerada para compartilhamento em redes sociais (Open Graph / Twitter). */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 15% 10%, rgba(176,124,255,0.35), transparent 45%), radial-gradient(circle at 90% 100%, rgba(217,70,239,0.18), transparent 50%)",
          color: "#ededef",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#8d8d98" }}>
          <span>PORTFÓLIO</span>
          <span>Moreno, PE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 150, fontWeight: 700, letterSpacing: -8, lineHeight: 0.9 }}>João Ryan</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 28, fontSize: 40, color: "#8d8d98" }}>
            <div style={{ width: 18, height: 18, borderRadius: 999, background: "#b07cff" }} />
            Desenvolvedor Web · Sistemas de Informação
          </div>
        </div>
      </div>
    ),
    size,
  );
}

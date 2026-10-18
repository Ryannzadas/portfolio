/**
 * Utilitários para lidar com READMEs do GitHub.
 */

/**
 * Extrai o primeiro parágrafo "de verdade" de um README:
 * ignora títulos, badges, imagens, HTML, blocos de código, listas e tabelas.
 */
export function extractFirstParagraph(markdown: string, maxLength = 220): string | null {
  const cleaned = markdown
    .replace(/<!--[\s\S]*?-->/g, "") // comentários HTML
    .replace(/```[\s\S]*?```/g, "") // blocos de código
    .replace(/\r\n/g, "\n");

  const blocks = cleaned.split(/\n\s*\n/);

  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;
    if (/^(#|>|\||[-*+]\s|\d+\.\s|<|!\[|\[!\[|---|===)/.test(block)) continue;

    const text = block
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // imagens
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links → texto
      .replace(/<[^>]+>/g, "") // tags soltas
      .replace(/(\*\*|__|\*|_|~~|`)/g, "") // ênfases e código inline
      .replace(/\s+/g, " ")
      .trim();

    // Precisa parecer uma frase, não só um emoji ou uma palavra solta.
    if (text.length < 20) continue;

    if (text.length <= maxLength) return text;
    const cut = text.slice(0, maxLength);
    return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "") + "…";
  }

  return null;
}

type RepoRef = { owner: string; repo: string; branch: string; dir?: string };

/**
 * Converte links relativos do README em absolutos:
 * imagens → raw.githubusercontent.com, links → github.com/.../blob/...
 */
export function resolveReadmeUrl(url: string, kind: "src" | "href", ref: RepoRef) {
  if (!url || /^(https?:|mailto:|tel:|data:|#)/i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;

  const base = ref.dir ? `${ref.dir}/` : "";
  const path = url.startsWith("/") ? url.slice(1) : `${base}${url.replace(/^\.\//, "")}`;

  return kind === "src"
    ? `https://raw.githubusercontent.com/${ref.owner}/${ref.repo}/${ref.branch}/${path}`
    : `https://github.com/${ref.owner}/${ref.repo}/blob/${ref.branch}/${path}`;
}

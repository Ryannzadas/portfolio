import { cacheLife, cacheTag } from "next/cache";
import { extractFirstParagraph } from "./markdown";
import { prettifyRepoName } from "./utils";

/**
 * Integração com a API do GitHub.
 *
 * - Busca os repositórios públicos do usuário e mantém só os com o tópico "portfolio".
 * - O resultado inteiro fica em cache (`use cache`) e é revalidado a cada hora.
 * - Defina GITHUB_TOKEN para subir o limite de 60 → 5000 req/h e habilitar
 *   a imagem de preview personalizada do repositório (só disponível via GraphQL).
 */

const GITHUB_USER = "Ryannzadas";
const PORTFOLIO_TOPIC = "portfolio";
const README_MAX_CHARS = 60_000;

export type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  url: string;
  homepage: string | null;
  stars: number;
  language: string | null;
  languages: string[];
  topics: string[];
  image: string | null;
  readme: string | null;
  readmeDir: string;
  owner: string;
  branch: string;
  updatedAt: string;
};

export type ProjectsResult =
  | { status: "ok"; projects: Project[] }
  | { status: "error"; message: string };

type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  archived: boolean;
  default_branch: string;
  pushed_at: string;
  owner: { login: string };
};

function githubHeaders(accept = "application/vnd.github+json"): HeadersInit {
  const headers: Record<string, string> = {
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-ryannzadas",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

async function githubFetch<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, { headers: githubHeaders() });
  if (!res.ok) throw new Error(`GitHub ${res.status} em ${path}`);
  return res.json() as Promise<T>;
}

/** Linguagens do repositório, da mais usada para a menos usada. */
async function getLanguages(repo: GitHubRepo): Promise<string[]> {
  try {
    const data = await githubFetch<Record<string, number>>(
      `/repos/${repo.owner.login}/${repo.name}/languages`,
    );
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);
  } catch {
    return repo.language ? [repo.language] : [];
  }
}

/** Conteúdo do README (ou null se não existir) e a pasta onde ele está. */
async function getReadme(repo: GitHubRepo): Promise<{ content: string; dir: string } | null> {
  try {
    const data = await githubFetch<{ content: string; encoding: string; path: string }>(
      `/repos/${repo.owner.login}/${repo.name}/readme`,
    );
    const content = Buffer.from(data.content, data.encoding as BufferEncoding).toString("utf8");
    const dir = data.path.includes("/") ? data.path.slice(0, data.path.lastIndexOf("/")) : "";
    return { content: content.slice(0, README_MAX_CHARS), dir };
  } catch {
    return null;
  }
}

/** Verifica se existe um preview.png na raiz (raw.githubusercontent não conta no rate limit). */
async function getPreviewPng(repo: GitHubRepo): Promise<string | null> {
  const url = `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${repo.default_branch}/preview.png`;
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok ? url : null;
  } catch {
    return null;
  }
}

/**
 * Imagens de "social preview" personalizadas. A API REST não expõe esse campo,
 * então usamos GraphQL — que exige token. Sem token, retorna um mapa vazio.
 */
async function getCustomPreviews(names: string[]): Promise<Map<string, string>> {
  const previews = new Map<string, string>();
  if (!process.env.GITHUB_TOKEN || names.length === 0) return previews;

  const fields = names
    .map(
      (name, i) =>
        `r${i}: repository(name: ${JSON.stringify(name)}) { openGraphImageUrl usesCustomOpenGraphImage }`,
    )
    .join("\n");
  const query = `query { user(login: ${JSON.stringify(GITHUB_USER)}) { ${fields} } }`;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { ...githubHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) return previews;
    const json = (await res.json()) as {
      data?: { user?: Record<string, { openGraphImageUrl: string; usesCustomOpenGraphImage: boolean } | null> };
    };
    names.forEach((name, i) => {
      const repo = json.data?.user?.[`r${i}`];
      if (repo?.usesCustomOpenGraphImage) previews.set(name, repo.openGraphImageUrl);
    });
  } catch {
    // Sem preview personalizado — segue para o próximo fallback.
  }
  return previews;
}

function normalizeHomepage(homepage: string | null) {
  const value = homepage?.trim();
  if (!value) return null;
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

async function toProject(repo: GitHubRepo, customPreview?: string): Promise<Project> {
  const [languages, readme, previewPng] = await Promise.all([
    getLanguages(repo),
    getReadme(repo),
    customPreview ? Promise.resolve(null) : getPreviewPng(repo),
  ]);

  // Descrição: campo do repo → 1º parágrafo do README → texto padrão.
  const description =
    repo.description?.trim() ||
    (readme && extractFirstParagraph(readme.content)) ||
    `Projeto pessoal em ${repo.language ?? languages[0] ?? "código"}`;

  return {
    id: repo.id,
    slug: repo.name,
    title: prettifyRepoName(repo.name),
    description,
    url: repo.html_url,
    homepage: normalizeHomepage(repo.homepage),
    stars: repo.stargazers_count,
    language: repo.language,
    languages,
    topics: (repo.topics ?? []).filter((t) => t !== PORTFOLIO_TOPIC),
    image: customPreview ?? previewPng,
    readme: readme?.content ?? null,
    readmeDir: readme?.dir ?? "",
    owner: repo.owner.login,
    branch: repo.default_branch,
    updatedAt: repo.pushed_at,
  };
}

/**
 * Projetos do portfólio, em cache.
 * Sucesso → revalida a cada hora. Falha → tenta de novo em poucos minutos
 * (o erro não fica "preso" no cache por uma hora inteira).
 */
export async function getPortfolioProjects(): Promise<ProjectsResult> {
  "use cache";
  cacheTag("github");

  try {
    const repos = await githubFetch<GitHubRepo[]>(
      `/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
    );
    const selected = repos.filter((r) => !r.archived && r.topics?.includes(PORTFOLIO_TOPIC));
    const previews = await getCustomPreviews(selected.map((r) => r.name));
    const projects = await Promise.all(selected.map((r) => toProject(r, previews.get(r.name))));

    // Mais estrelas primeiro; empate → atualizado mais recentemente.
    projects.sort(
      (a, b) => b.stars - a.stars || Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
    );

    cacheLife("hours");
    return { status: "ok", projects };
  } catch (error) {
    cacheLife("minutes");
    console.error("[github] falha ao buscar projetos:", error);
    return { status: "error", message: "Não foi possível carregar os projetos do GitHub agora." };
  }
}

export const githubProfileUrl = `https://github.com/${GITHUB_USER}`;

# Portfólio — João Ryan da Silva Santos

Portfólio pessoal em **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**, com Framer Motion, GSAP + ScrollTrigger e Lenis.
Os projetos são carregados automaticamente do GitHub ([@Ryannzadas](https://github.com/Ryannzadas)).

## Rodando localmente

Requisitos: **Node.js 20.9+** (testado com o 22).

```bash
npm install
cp .env.example .env.local   # opcional — veja "Variáveis de ambiente"
npm run dev                  # http://localhost:3000
```

Build de produção local:

```bash
npm run build
npm start
```

## Variáveis de ambiente

| Variável | Obrigatória | Para que serve |
| --- | --- | --- |
| `GITHUB_TOKEN` | Recomendada | Token *fine-grained* **somente leitura** (Public repositories). Sobe o limite da API de 60 → 5000 req/h e habilita a imagem de *social preview* personalizada do repositório. |
| `NEXT_PUBLIC_FORMSPREE_ID` | Para o formulário | ID do formulário no [Formspree](https://formspree.io) (a parte depois de `/f/` na URL). Sem ele, o formulário abre o app de e-mail do visitante. |
| `NEXT_PUBLIC_SITE_URL` | Não | URL pública usada no SEO. Na Vercel é detectada automaticamente. |

Criar o token: GitHub → *Settings* → *Developer settings* → *Personal access tokens* → *Fine-grained tokens* → *Repository access: Public repositories (read-only)*.

## Como os projetos aparecem

1. No GitHub, abra o repositório → engrenagem ao lado de **About** → em **Topics** adicione `portfolio`.
2. Preencha a **descrição** e o **Website** (vira o botão "Demo").
3. Imagem do card, nesta ordem:
   - a *social preview* do repositório (*Settings → Social preview*) — exige `GITHUB_TOKEN`;
   - um arquivo `preview.png` na raiz do repositório;
   - se nenhum existir, um card com gradiente gerado a partir do nome.
4. Sem descrição, o site usa o primeiro parágrafo do README; sem README, mostra "Projeto pessoal em [linguagem]".

Os dados ficam em cache e **revalidam a cada hora** (`"use cache"` + `cacheLife("hours")` em `lib/github.ts`). Se a API falhar, aparece um fallback com link para o perfil e o erro só fica em cache por poucos minutos.

## Editando o conteúdo

Quase tudo está em **`content/dados.ts`**: textos do hero e do "Sobre", links, habilidades, trajetória e certificados.

- **Foto:** coloque a imagem em `public/` (ex.: `public/joao.jpg`) e defina `photo: "/joao.jpg"`. Sem foto, aparece um crachá com o monograma.
- **Certificados:** coloque o PDF em `public/certificados/` e adicione um item em `certificates`.

## Deploy na Vercel

**Opção 1 — pelo site (recomendado)**

1. Suba o projeto para um repositório no GitHub:
   ```bash
   git add .
   git commit -m "Portfólio"
   git branch -M main
   git remote add origin https://github.com/Ryannzadas/portfolio.git
   git push -u origin main
   ```
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório (o framework Next.js é detectado sozinho).
3. Em *Environment Variables*, adicione `GITHUB_TOKEN` e `NEXT_PUBLIC_FORMSPREE_ID`.
4. Clique em **Deploy**. Cada `git push` na `main` gera um novo deploy.

**Opção 2 — pela CLI**

```bash
npm i -g vercel
vercel            # primeiro deploy (preview) e vínculo do projeto
vercel env add GITHUB_TOKEN
vercel env add NEXT_PUBLIC_FORMSPREE_ID
vercel --prod     # deploy de produção
```

> Adicione o tópico `portfolio` nos repositórios **antes** do deploy, ou espere até 1h para o cache revalidar.

## Estrutura

```
app/
  layout.tsx            fontes, SEO/Open Graph, providers, loader, cursor
  page.tsx              home (seções + JSON-LD)
  projetos/page.tsx     arquivo completo de projetos
  template.tsx          transição entre páginas
  opengraph-image.tsx   imagem de compartilhamento gerada
  sitemap.ts, robots.ts, not-found.tsx, icon.svg, globals.css
components/
  sections/   hero, about, projects, skills, timeline, contact
  projects/   card com tilt, modal com README, capa gerada, arquivo, skeleton/erro
  motion/     split text, typewriter, reveal, magnetic, marquee, scroll-reveal, timeline-line
  effects/    loader (CSS puro), cursor, canvas do hero, crachá/foto
  layout/     navbar, footer, tema, relógio local
  providers/  Lenis + GSAP, next-themes, Framer Motion
  contact/    formulário (react-hook-form + zod + Formspree)
content/dados.ts        todo o conteúdo editável
lib/                    github.ts (API + cache), markdown.ts, hooks, utils
public/certificados/    PDFs dos certificados
```

## Acessibilidade e desempenho

- `prefers-reduced-motion`: desliga loader, Lenis, split text, tilt, magnetismo, marquee e reveals.
- Navegação por teclado, link "pular para o conteúdo", foco visível, modal com foco preso (Radix).
- Loader e animação do nome são CSS puro (pintam antes do JavaScript); efeitos decorativos carregam depois da hidratação;
  ScrollTriggers são criados com o navegador ocioso; reveals usam um único IntersectionObserver.

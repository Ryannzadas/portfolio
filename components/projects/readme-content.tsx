"use client";

import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import type { Project } from "@/lib/github";
import { resolveReadmeUrl } from "@/lib/markdown";

// Permite atributos comuns em READMEs (alinhamento, largura de imagens) sem abrir brechas de XSS.
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [...(defaultSchema.attributes?.img ?? []), "width", "height", "align"],
    p: [...(defaultSchema.attributes?.p ?? []), "align"],
    div: [...(defaultSchema.attributes?.div ?? []), "align"],
    h1: [...(defaultSchema.attributes?.h1 ?? []), "align"],
  },
};

/**
 * README renderizado (carregado sob demanda, só quando o modal abre).
 * HTML bruto é permitido mas sanitizado; links relativos viram absolutos no GitHub.
 */
export default function ReadmeContent({ project }: { project: Project }) {
  const ref = { owner: project.owner, repo: project.slug, branch: project.branch, dir: project.readmeDir };

  return (
    <div className="readme">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema], [rehypeHighlight, { detect: false }]]}
        urlTransform={(url, key) =>
          resolveReadmeUrl(defaultUrlTransform(url), key === "src" ? "src" : "href", ref)
        }
        components={{
          a: ({ node, ...props }) => {
            void node;
            const external = props.href?.startsWith("http");
            return <a {...props} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} />;
          },
          img: ({ node, alt, ...props }) => {
            void node;
            // eslint-disable-next-line @next/next/no-img-element
            return <img {...props} alt={alt ?? ""} loading="lazy" decoding="async" />;
          },
        }}
      >
        {project.readme ?? ""}
      </ReactMarkdown>
    </div>
  );
}

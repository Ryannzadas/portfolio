import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers/providers";
import { Loader } from "@/components/effects/loader";
import { LazyCursor } from "@/components/effects/lazy-effects";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { profile } from "@/content/dados";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Na Vercel a URL de produção vem automaticamente; localmente usa localhost.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const description =
  "Portfólio de João Ryan da Silva Santos — estudante de Sistemas de Informação na UNIFACOL, desenvolvedor web e entusiasta de jogos e cibersegurança.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — Desenvolvedor Web`,
    template: `%s — ${profile.shortName}`,
  },
  description,
  keywords: [
    "João Ryan",
    "portfólio",
    "desenvolvedor web",
    "Sistemas de Informação",
    "UNIFACOL",
    "Next.js",
    "React",
    "cibersegurança",
    "jogos",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: `${profile.shortName} — Portfólio`,
    title: `${profile.name} — Desenvolvedor Web`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Desenvolvedor Web`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#f4f3ef" },
  ],
};

/**
 * Roda antes da primeira pintura: decide se o loader aparece
 * (só na 1ª visita da sessão e nunca com movimento reduzido).
 */
const introScript = `try{if(!sessionStorage.getItem("jr-intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="";sessionStorage.setItem("jr-intro","1");setTimeout(function(){delete document.documentElement.dataset.intro},2600)}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        {/* Sem JavaScript, nada fica escondido esperando o reveal. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}.loader{display:none!important}"}</style>
        </noscript>
      </head>
      <body className="min-h-dvh">
        <a
          href="#conteudo"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-accent px-5 py-3 font-medium text-accent-fg transition-transform focus-visible:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <Providers>
          <Loader />
          <LazyCursor />
          <RevealObserver />
          <Navbar />
          <main id="conteudo" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </Providers>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}

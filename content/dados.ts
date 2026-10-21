/**
 * Conteúdo do site em um só lugar.
 * Edite este arquivo para atualizar textos, links, habilidades, trajetória e certificados.
 */

export const profile = {
  name: "João Ryan da Silva Santos",
  shortName: "João Ryan",
  initials: "JR",
  location: "Moreno, PE",
  coordinates: "8.12°S 35.09°W",
  timezone: "America/Recife",
  email: "joaoryan2005@gmail.com",
  github: "Ryannzadas",
  // Coloque uma foto em /public (ex: /public/joao.jpg) e troque para "/joao.jpg".
  photo: null as string | null,
  // Funções alternadas pelo efeito de digitação no hero.
  roles: [
    "Desenvolvedor Web",
    "Estudante de Sistemas de Informação",
    "Entusiasta de Cibersegurança",
    "Criador de Jogos",
  ],
  tagline:
    "Construo experiências digitais rápidas, acessíveis e com cuidado nos detalhes.",
  // Texto do "Sobre mim" — revelado palavra por palavra conforme o scroll.
  about:
    "Sou estudante de Sistemas de Informação na UNIFACOL e estagiário de TI na Secretaria de Saúde de Moreno. Gosto de construir coisas para a web, de entender como sistemas quebram — e como protegê-los — e de criar jogos que contam histórias. Cada projeto aqui é uma desculpa para aprender algo novo.",
  interests: ["Desenvolvimento web", "Jogos", "Cibersegurança"],
};

export const socials = [
  { label: "GitHub", href: "https://github.com/Ryannzadas", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jo%C3%A3o-ryan-941769268/",
    icon: "linkedin",
  },
  { label: "E-mail", href: "mailto:joaoryan2005@gmail.com", icon: "mail" },
] as const;

export const navLinks = [
  { id: "sobre", label: "Sobre" },
  { id: "projetos", label: "Projetos" },
  { id: "habilidades", label: "Habilidades" },
  { id: "trajetoria", label: "Trajetória" },
  { id: "contato", label: "Contato" },
] as const;

/** Tecnologias exibidas no marquee e no grid de habilidades. */
export const skillGroups = [
  {
    title: "Front-end",
    items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Linguagens & Back-end",
    items: ["Node.js", "Python", "Java", "C++"],
  },
  {
    title: "Ferramentas",
    items: ["Git", "GitHub", "Vercel", "n8n", "VS Code"],
  },
  {
    title: "Explorando",
    items: ["Cibersegurança", "Desenvolvimento de jogos", "Automação"],
  },
];

export type TimelineItem = {
  period: string;
  title: string;
  place: string;
  description: string;
  current?: boolean;
  kind: "trabalho" | "formação";
};

export const timeline: TimelineItem[] = [
  {
    period: "Jan 2026 — Dez 2026",
    title: "Estagiário de TI",
    place: "Secretaria de Saúde de Moreno",
    // Ajuste a descrição com as atividades que você realiza no estágio.
    description:
      "Atuação no setor de TI da Secretaria Municipal de Saúde, apoiando a equipe e os sistemas usados no dia a dia.",
    current: true,
    kind: "trabalho",
  },
  {
    period: "Em andamento",
    title: "Bacharelado em Sistemas de Informação",
    place: "UNIFACOL — Vitória de Santo Antão",
    description:
      "Formação em desenvolvimento de software, banco de dados, redes e gestão de sistemas.",
    current: true,
    kind: "formação",
  },
  {
    period: "Abr 2025",
    title: "10º Sintonia — Semana de SI",
    place: "UNIFACOL",
    description:
      "Minicursos de desenvolvimento web básico (HTML, CSS e JavaScript) e full stack com frameworks modernos.",
    kind: "formação",
  },
];

export type Certificate = {
  title: string;
  issuer: string;
  /** Data ISO (AAAA-MM-DD) — usada para ordenar. */
  date: string;
  hours?: number;
  file: string;
};

export const certificates: Certificate[] = [
  {
    title: "GFT Start #7 - Java",
    issuer: "DIO · GFT",
    date: "2026-10-21",
    hours: 71,
    file: "/certificados/dio-gft-start-7-java.pdf",
  },
  {
    title: "Formação JavaScript Developer",
    issuer: "DIO",
    date: "2026-10-20",
    hours: 39,
    file: "/certificados/dio-formacao-javascript-developer.pdf",
  },
  {
    title: "Front-end Frameworks",
    issuer: "Impacta",
    date: "2026-04-13",
    file: "/certificados/impacta-front-end-frameworks.pdf",
  },
  {
    title: "N8N — Fundamentos",
    issuer: "Impacta",
    date: "2026-03-24",
    hours: 5,
    file: "/certificados/impacta-n8n-fundamentos.pdf",
  },
  {
    title: "Princípios de Desenvolvimento de Aplicações",
    issuer: "DIO",
    date: "2025-08-12",
    hours: 8,
    file: "/certificados/dio-principios-desenvolvimento-aplicacoes.pdf",
  },
  {
    title: "Sintaxe Básica com Java",
    issuer: "DIO",
    date: "2025-08-12",
    hours: 6,
    file: "/certificados/dio-sintaxe-basica-java.pdf",
  },
  {
    title: "Java e a Arte da Abstração com Classes e Encapsulamento",
    issuer: "DIO",
    date: "2025-08-12",
    hours: 2,
    file: "/certificados/dio-java-abstracao-encapsulamento.pdf",
  },
  {
    title: "Desafios de Código: Lógica e Pensamento Computacional",
    issuer: "DIO",
    date: "2025-08-12",
    hours: 1,
    file: "/certificados/dio-desafios-de-codigo.pdf",
  },
  {
    title: "Desenvolvimento Web Full Stack com Frameworks Modernos",
    issuer: "UNIFACOL · 10º Sintonia",
    date: "2025-04-29",
    hours: 5,
    file: "/certificados/sintonia-web-full-stack.pdf",
  },
  {
    title: "Desenvolvimento Web Básico com HTML, CSS e JavaScript",
    issuer: "UNIFACOL · 10º Sintonia",
    date: "2025-04-28",
    hours: 5,
    file: "/certificados/sintonia-web-basico.pdf",
  },
];

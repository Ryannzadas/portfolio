import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Timeline } from "@/components/sections/timeline";
import { Contact } from "@/components/sections/contact";
import { profile, socials } from "@/content/dados";

// Dados estruturados (schema.org) para mecanismos de busca.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Desenvolvedor Web e Estudante de Sistemas de Informação",
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Moreno", addressRegion: "PE", addressCountry: "BR" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "UNIFACOL" },
  knowsAbout: profile.interests,
  sameAs: socials.filter((s) => s.icon !== "mail").map((s) => s.href),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Timeline />
      <Contact />
    </>
  );
}

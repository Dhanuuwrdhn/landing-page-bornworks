"use client";

import AnimatedSection from "./AnimatedSection";

const techStack = [
  { name: "Next.js", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Flutter", category: "Mobile" },
  { name: "Dart", category: "Language" },
  { name: "Node.js", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Firebase", category: "Cloud" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Figma", category: "Design" },
  { name: "Docker", category: "DevOps" },
  { name: "Vercel", category: "Hosting" },
];

export default function TechStack() {
  return (
    <section
      id="tech-stack"
      className="relative py-20 md:py-24 bg-white dark:bg-[#0a0e1a]"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-amber mb-4">
              Tech Stack
            </span>
            <h2 className="text-3xl font-bold text-brand-dark dark:text-white sm:text-4xl">
              Technologies We Use
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="glass-card rounded-xl px-5 py-3 flex items-center gap-2 hover:border-brand-amber/30 transition-all cursor-default"
              >
                <span className="text-sm font-semibold text-brand-dark dark:text-white">
                  {tech.name}
                </span>
                <span className="text-[10px] font-medium text-brand-muted dark:text-white/40 bg-brand-dark/5 dark:bg-white/5 rounded-md px-1.5 py-0.5">
                  {tech.category}
                </span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

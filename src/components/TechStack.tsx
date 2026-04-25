"use client";

import AnimatedSection from "./AnimatedSection";

const techStack = [
  { name: "Next.js", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Flutter", category: "Mobile" },
  { name: "Dart", category: "Language" },
  { name: "Laravel", category: "Backend" },
  { name: "PHP", category: "Language" },
  { name: "NestJS", category: "Backend" },
  { name: "Node.js", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MySQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "Redis", category: "Cache" },
  { name: "Firebase", category: "Cloud" },
  { name: "AWS", category: "Cloud" },
  { name: "Docker", category: "DevOps" },
  { name: "Vercel", category: "Hosting" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Figma", category: "Design" },
  { name: "Git", category: "Tooling" },
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
            <h2 className="text-3xl font-bold text-brand-dark dark:text-white sm:text-4xl">
              Our Stack
            </h2>
            <p className="mt-3 text-brand-muted dark:text-white/45 text-base">
              Tools and technologies we work with daily.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3 max-w-4xl mx-auto">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="glass-card rounded-full px-4 py-2 flex items-center gap-2 hover:border-brand-amber/30 transition-all cursor-default text-sm"
              >
                <span className="font-medium text-brand-dark dark:text-white">
                  {tech.name}
                </span>
                <span className="text-[10px] text-brand-muted dark:text-white/35">
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

"use client";

import { ExternalLink } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const projects = [
  {
    title: "Financial Planning App",
    description:
      "A comprehensive personal finance management app with budgeting tools, expense tracking, and investment portfolio insights. Built for Android with a beautiful Material Design interface.",
    tags: ["Android", "Flutter"],
    gradient: "from-amber-400/20 to-orange-300/20 dark:from-amber-400/10 dark:to-orange-300/10",
  },
  {
    title: "Company Profile + CMS",
    description:
      "A modern company profile website with a fully-featured content management system. SEO-optimized, blazing-fast page loads, and intuitive admin dashboard for non-technical teams.",
    tags: ["Next.js", "TypeScript"],
    gradient: "from-blue-400/20 to-indigo-300/20 dark:from-blue-400/10 dark:to-indigo-300/10",
  },
];

export default function Portfolio() {
  return (
    <section
      id="portfolio"
      className="relative py-24 md:py-32 bg-white dark:bg-[#0a0e1a]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-amber/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-amber mb-4">
              Portfolio
            </span>
            <h2 className="text-3xl font-bold text-brand-dark dark:text-white sm:text-4xl lg:text-5xl">
              Recently Shipped
            </h2>
            <p className="mt-4 text-brand-muted dark:text-white/50 text-lg">
              Real products we built and launched for our clients.
            </p>
          </div>
        </AnimatedSection>

        {/* Project Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <AnimatedSection key={index} delay={index * 0.15}>
              <div className="glass-card rounded-3xl overflow-hidden h-full group">
                {/* Card Image Placeholder — gradient */}
                <div
                  className={`h-48 md:h-56 bg-gradient-to-br ${project.gradient} relative flex items-center justify-center`}
                >
                  <div className="glass rounded-2xl px-8 py-6">
                    <span className="text-lg font-bold text-brand-dark dark:text-white">
                      {project.title}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-lg bg-brand-amber/10 px-3 py-1 text-xs font-semibold text-brand-amber-dark dark:text-brand-amber"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark dark:text-white mb-3">
                    {project.title}
                  </h3>
                  <p className="text-brand-muted dark:text-white/50 leading-relaxed mb-6">
                    {project.description}
                  </p>
                  <button
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-amber hover:text-brand-amber-dark transition-colors group/link"
                    id={`portfolio-project-${index + 1}`}
                  >
                    View Project
                    <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

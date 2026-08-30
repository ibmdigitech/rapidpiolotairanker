"use client";

import React, { useRef } from "react";
import { Search, Brain, PenTool, BarChart3, ShieldAlert, LineChart } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Search,
    title: "Instant SEO Audit",
    description: "Deep crawl of your website to identify indexing bugs, metadata structure flaws, page speed problems, and ranking blockers.",
  },
  {
    icon: Brain,
    title: "AEO Engine Optimizer",
    description: "Structure your schema codes, FAQ blocks, and conversational content so modern AI models select you as their primary answer source.",
  },
  {
    icon: PenTool,
    title: "AI Semantic Composer",
    description: "Generate highly optimized landing pages, articles, and product descriptions tailored for search algorithms in English and Arabic.",
  },
  {
    icon: BarChart3,
    title: "LSI Keyword Research",
    description: "Uncover hidden search volume intent, regional local SEO keywords for the UAE, and difficulty scores powered by current data models.",
  },
  {
    icon: ShieldAlert,
    title: "Competitor Leak Analysis",
    description: "Scan your main industry competitors to detect their high-performing content hubs, backlink strategies, and keyword gaps.",
  },
  {
    icon: LineChart,
    title: "AI visibility Tracking",
    description: "Gain dynamic visibility insights tracking exactly how frequently your product/brand gets referenced in Google AI Overviews and ChatGPT.",
  },
];

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = containerRef.current?.getElementsByClassName("spotlight-card");
    if (!cards) return;

    for (const card of Array.from(cards) as HTMLDivElement[]) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <section id="features" className="py-24 relative bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-white mb-4">
            Optimise Your Website For The Future of Search
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            A comprehensive tool suite built to rank your brand on traditional search layouts and next-generation AI platforms.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="spotlight-card glass-card rounded-2xl p-8 hover:border-white/15 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-105 transition-transform">
                    <Icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-accent transition-colors cursor-pointer">
                  <span>Learn more</span>
                  <span>&rarr;</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

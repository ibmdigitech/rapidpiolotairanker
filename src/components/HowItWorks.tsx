"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Link Your Domain",
    description: "Enter your URL. Our system quickly crawls pages, indexing structures, core web vitals, and metadata properties.",
  },
  {
    step: "02",
    title: "Generate AI Visibility Audit",
    description: "Our agent queries search indexes alongside conversational models to measure real-time brand citations.",
  },
  {
    step: "03",
    title: "Optimize and Rank",
    description: "Review step-by-step technical SEO blueprints and conversational semantic schemas to push your website to the top.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative bg-neutral-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-white mb-4">
            How RankPilot Optimises Your Site
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            A simplified three-step pipeline built to bring visibility clarity to complex algorithms.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          {/* Decorative connector line */}
          <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              {/* Number Circle */}
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent p-[2px] mb-8 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                <div className="h-full w-full rounded-full bg-neutral-950 flex items-center justify-center">
                  <span className="font-heading font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    {step.step}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-heading font-bold text-xl text-white mb-4">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

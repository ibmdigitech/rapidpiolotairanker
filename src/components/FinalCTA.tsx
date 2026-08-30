"use client";

import { Sparkles, ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 relative bg-background overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          data-aos="zoom-in"
          data-aos-duration="600"
          className="rounded-3xl bg-gradient-to-tr from-neutral-900 via-neutral-950 to-neutral-900 border border-white/5 p-12 sm:p-16 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Animated border or element */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {/* Sub icon */}
          <div className="inline-flex h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 items-center justify-center text-accent mb-6 animate-bounce">
            <Sparkles className="h-5 w-5" />
          </div>

          {/* Heading */}
          <h2 data-aos="fade-up" data-aos-delay="100" className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-white mb-6">
            Rank Your Brand on the AI Frontier Today
          </h2>

          {/* Description */}
          <p data-aos="fade-up" data-aos-delay="200" className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Gain immediate optimization suggestions, audit traditional Search Engine Index ranks, and guarantee high visibility positions across LLM engines.
          </p>

          {/* Action CTAs */}
          <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-background font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-primary/25 cursor-pointer">
              <span>Start Your Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 text-muted-foreground hover:text-white font-semibold transition-colors cursor-pointer">
              Talk with an Expert
            </button>
          </div>

          <p data-aos="fade-up" data-aos-delay="400" className="text-xs text-muted-foreground/60 mt-6">
            No credit card required. 14-day free trial. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

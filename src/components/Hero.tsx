"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const engines = ["Google Search", "ChatGPT Search", "Gemini", "Perplexity", "Claude"];

export default function Hero() {
  const [engineIndex, setEngineIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = engines[engineIndex];

    const typeSpeed = isDeleting ? 40 : 100;

    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayText((prev) => currentFullText.substring(0, prev.length + 1));
        if (displayText === currentFullText) {
          timer = setTimeout(() => setIsDeleting(true), 2000);
        } else {
          timer = setTimeout(handleTyping, typeSpeed);
        }
      } else {
        setDisplayText((prev) => currentFullText.substring(0, prev.length - 1));
        if (displayText === "") {
          setIsDeleting(false);
          setEngineIndex((prev) => (prev + 1) % engines.length);
        } else {
          timer = setTimeout(handleTyping, typeSpeed);
        }
      }
    };

    timer = setTimeout(handleTyping, typeSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, engineIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-background">
      {/* Dynamic ambient background orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-orb-slow-1 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-accent/15 blur-[150px] animate-orb-slow-2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Glow announcement badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass-card border-white/10 text-xs font-semibold text-accent mb-8"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
          <span>New: AIVisibility Tracker Engine</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none mb-6 max-w-4xl mx-auto"
        >
          Rank on Google. <br />
          Rank in <span className="bg-gradient-to-r from-primary via-accent to-indigo-400 bg-clip-text text-transparent">{displayText}</span>
          <span className="animate-pulse text-accent">|</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Optimise your content visibility across traditional Search Engines and modern AI Answer Engines (AEO). The all-in-one SEO workspace for marketing leaders.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16"
        >
          <Link href="/signup" className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-background font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-primary/25 cursor-pointer">
            <span>Start Optimising</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <button className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 font-semibold text-muted-foreground hover:text-white transition-colors cursor-pointer">
            <Play className="h-4 w-4 fill-current" />
            <span>Watch Demo</span>
          </button>
        </motion.div>

        {/* Preview Frame */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="w-full max-w-5xl mx-auto rounded-2xl glass-card p-2 border-white/5 relative shadow-2xl shadow-primary/10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/5 pointer-events-none z-0" />
          <div className="h-8 w-full bg-neutral-900/50 flex items-center px-4 space-x-2 border-b border-white/5 rounded-t-xl">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <div className="ml-4 bg-neutral-950/80 text-[10px] px-8 py-1 rounded text-muted-foreground/60 w-64 truncate">rankpilot.ai/dashboard</div>
          </div>
          {/* Simulated content panel */}
          <div className="relative bg-neutral-950/80 aspect-[16/9] flex items-center justify-center p-8 rounded-b-xl overflow-hidden">
            <div className="w-full h-full flex flex-col justify-between text-left space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-heading font-semibold text-white">Project: Acme.org SEO Visibility</h3>
                  <p className="text-xs text-muted-foreground">Domain Audit & AI Visibility Score</p>
                </div>
                <div className="bg-primary/20 text-primary border border-primary/20 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full">LIVE SCANNING</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow">
                <div className="glass-card rounded-xl p-4 flex flex-col justify-between border-white/5">
                  <span className="text-xs text-muted-foreground">Traditional SEO Score</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-4xl font-extrabold text-accent">87</span>
                    <span className="text-xs text-green-400">+4% this week</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div className="bg-accent h-1.5 w-[87%] rounded-full" />
                  </div>
                </div>
                <div className="glass-card rounded-xl p-4 flex flex-col justify-between border-white/5">
                  <span className="text-xs text-muted-foreground">AI Visibility Index (AEO)</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-4xl font-extrabold text-primary">94</span>
                    <span className="text-xs text-green-400">+12% this week</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div className="bg-primary h-1.5 w-[94%] rounded-full" />
                  </div>
                </div>
                <div className="glass-card rounded-xl p-4 flex flex-col justify-between border-white/5">
                  <span className="text-xs text-muted-foreground">UAE Local Authority</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-4xl font-extrabold text-indigo-400">79</span>
                    <span className="text-xs text-indigo-400">Steady</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div className="bg-indigo-400 h-1.5 w-[79%] rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t border-white/5">
                <span>Engines verified: Google, ChatGPT, Gemini, Perplexity</span>
                <span className="text-primary hover:underline cursor-pointer">Explore full audit report &rarr;</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

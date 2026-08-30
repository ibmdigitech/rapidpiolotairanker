"use client";

import { motion } from "framer-motion";

const engines = [
  { name: "Google Search", type: "Search Engine" },
  { name: "ChatGPT Search", type: "AI Chatbot" },
  { name: "Gemini", type: "AI Agent" },
  { name: "Perplexity", type: "Answer Engine" },
  { name: "Claude AI", type: "AI Writer" },
  { name: "Bing Search", type: "Search Engine" },
];

export default function AIEngines() {
  return (
    <section className="py-20 border-t border-white/5 bg-neutral-950/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sub-header */}
        <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest mb-10">
          RANKPILOT OPTIMISES AND TRACKS RANKINGS FOR ALL MAJOR ENGINES
        </p>

        {/* Engine Grid Wrapper */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {engines.map((engine, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-xl p-6 text-center border-white/5 hover:border-white/10 transition-all duration-300"
            >
              <div className="h-8 w-8 rounded-lg bg-white/5 mx-auto mb-3 flex items-center justify-center font-black text-sm text-accent">
                {engine.name[0]}
              </div>
              <h4 className="font-heading font-bold text-sm text-white mb-1">
                {engine.name}
              </h4>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {engine.type}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

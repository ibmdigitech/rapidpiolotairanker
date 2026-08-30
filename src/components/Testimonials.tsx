"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote: "RankPilot completely overhauled our search approach. We went from zero visibility on ChatGPT Search to being cited as the top recommendation for UAE Real Estate within 3 weeks.",
    author: "Faris Al-Masri",
    role: "Marketing Director, Dubai Properties Group",
    rating: 5,
  },
  {
    quote: "Traditional SEO dashboards look ancient compared to this. The AEO recommendations helped us rewrite our FAQ blocks, yielding immediate jumps in Google AI Overviews representation.",
    author: "Sarah Jenkins",
    role: "SEO Consultant, Jenkins Media",
    rating: 5,
  },
  {
    quote: "Arabic NLP optimization is generally hit-or-miss. RankPilot's Bilingual AI Composer generated optimized landing pages that ranked on competitive terms quickly. Brilliant tool.",
    author: "Imad Mansoor",
    role: "Founder, GrowthEngine Middle East",
    rating: 5,
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-24 relative bg-neutral-950/40 border-y border-white/5 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        {/* Quote Icon decorative */}
        <Quote className="h-12 w-12 text-primary/20 mx-auto mb-6" />

        {/* Carousel Area */}
        <div className="min-h-[220px] flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              {/* Rating stars */}
              <div className="flex justify-center space-x-1 mb-6">
                {[...Array(testimonials[index].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-xl sm:text-2xl text-white font-heading font-medium italic leading-relaxed mb-8">
                &ldquo;{testimonials[index].quote}&rdquo;
              </p>

              {/* Author */}
              <h4 className="font-heading font-bold text-base text-white">
                {testimonials[index].author}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {testimonials[index].role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mt-12">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex space-x-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                className={`h-2 rounded-full transition-all duration-305 ${idx === index ? "w-6 bg-accent" : "w-2 bg-neutral-800"}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white transition-all cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav shadow-lg" : "bg-transparent py-4"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
              <Rocket className="h-5 w-5 text-background font-bold" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              RankPilot<span className="text-accent font-extrabold">.AI</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-white transition-colors">How It Works</Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-white transition-colors">Pricing</Link>
            <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-white transition-colors">Testimonials</Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-background text-sm font-semibold hover:opacity-90 active:scale-98 transition-all hover:shadow-lg hover:shadow-primary/20">
              Start Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-nav absolute top-16 left-0 right-0 p-6 flex flex-col space-y-4"
          >
            <Link href="#features" onClick={() => setIsOpen(false)} className="text-lg text-muted-foreground hover:text-white">Features</Link>
            <Link href="#how-it-works" onClick={() => setIsOpen(false)} className="text-lg text-muted-foreground hover:text-white">How It Works</Link>
            <Link href="#pricing" onClick={() => setIsOpen(false)} className="text-lg text-muted-foreground hover:text-white">Pricing</Link>
            <Link href="#testimonials" onClick={() => setIsOpen(false)} className="text-lg text-muted-foreground hover:text-white">Testimonials</Link>
            <hr className="border-white/10 my-2" />
            <Link href="/login" onClick={() => setIsOpen(false)} className="w-full py-3 text-center rounded-xl border border-white/10 text-muted-foreground hover:text-white">
              Sign In
            </Link>
            <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full py-3 text-center rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold">
              Start Free
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

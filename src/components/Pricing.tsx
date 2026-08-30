"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    priceMonthly: 0,
    priceAnnually: 0,
    description: "Perfect for testing capabilities and audit runs.",
    features: [
      "5 website audits per month",
      "Basic AI keyword lookup",
      "Standard dashboard reports",
      "Single project seat",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    priceMonthly: 49,
    priceAnnually: 39,
    description: "The complete setup for marketers and content owners.",
    features: [
      "Unlimited audits & tracking",
      "AEO schema generators",
      "Multilingual AI Composer",
      "LSI Keyword discovery database",
      "Competitive tracking dashboard",
      "Email & discord support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Agency",
    priceMonthly: 149,
    priceAnnually: 119,
    description: "Designed for professional agencies and developers.",
    features: [
      "Everything in Pro plan",
      "White-labeled PDF reporting",
      "Arabic+English advanced generation",
      "10 dedicated user accounts",
      "Priority API endpoint integration",
      "Weekly performance audits",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 relative bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-white mb-4">
            Transparent Pricing Models
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            No hidden costs. Scale plans up or down anytime as your optimization goals grow.
          </p>

          {/* Toggle switcher */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <span className={`text-sm font-medium ${!isAnnual ? "text-white" : "text-muted-foreground"}`}>Monthly billing</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-primary/20 border border-primary/30 p-1 flex items-center transition-colors cursor-pointer"
            >
              <div className={`h-4.5 w-4.5 rounded-full bg-accent transition-transform duration-300 ${isAnnual ? "translate-x-6" : "translate-x-0"}`} />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-white" : "text-muted-foreground"}`}>
              Yearly billing <span className="text-xs text-accent font-bold bg-accent/10 px-2 py-0.5 rounded-full ml-1">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const price = isAnnual ? plan.priceAnnually : plan.priceMonthly;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card rounded-2xl p-8 flex flex-col justify-between relative ${plan.popular ? "border-primary/50 shadow-2xl shadow-primary/10 scale-102" : "border-white/5"}`}
              >
                {/* Popular highlight */}
                {plan.popular && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-accent text-background text-[10px] font-extrabold uppercase px-4 py-1.5 rounded-full tracking-wider shadow-lg">
                    Highly Recommended
                  </span>
                )}

                {/* Plan Info */}
                <div>
                  <h3 className="font-heading font-extrabold text-2xl text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-heading font-black text-white">${price}</span>
                    <span className="text-sm text-muted-foreground ml-2">/month</span>
                  </div>

                  <hr className="border-white/5 mb-8" />

                  {/* Feature Lists */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <Check className="h-4.5 w-4.5 text-accent shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Action */}
                <button className={`w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] cursor-pointer ${plan.popular ? "bg-gradient-to-r from-primary to-accent text-background shadow-lg shadow-primary/25" : "bg-neutral-900 hover:bg-neutral-850 border border-white/5 text-white"}`}>
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

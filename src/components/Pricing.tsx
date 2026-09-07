"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

type PlanKey = "free" | "pro" | "agency";

const plans: Array<{
  key: PlanKey;
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  ctaAction: "signup" | "trial" | "contact";
}> = [
  {
    key: "free",
    name: "Free",
    priceMonthly: 0,
    priceAnnually: 0,
    description: "Perfect for testing capabilities and audit runs. Ad-supported.",
    features: [
      "5 website audits per month",
      "Basic AI keyword lookup",
      "Standard dashboard reports",
      "Single project seat",
      "Ad-supported (banner & sidebar)",
    ],
    cta: "Get Started",
    popular: false,
    ctaAction: "signup",
  },
  {
    key: "pro",
    name: "Pro",
    priceMonthly: 49,
    priceAnnually: 39,
    description: "The complete setup for marketers and content owners. Ad-free.",
    features: [
      "Unlimited audits & tracking",
      "AEO schema generators",
      "Multilingual AI Composer",
      "LSI Keyword discovery database",
      "Competitive tracking dashboard",
      "Email & discord support",
      "No ads, ad-free experience",
    ],
    cta: "Start Free Trial",
    popular: true,
    ctaAction: "trial",
  },
  {
    key: "agency",
    name: "Agency",
    priceMonthly: 149,
    priceAnnually: 119,
    description: "Designed for professional agencies and developers. Ad-free.",
    features: [
      "Everything in Pro plan",
      "White-labeled PDF reporting",
      "Arabic+English advanced generation",
      "10 dedicated user accounts",
      "Priority API endpoint integration",
      "Weekly performance audits",
      "No ads, ad-free experience",
    ],
    cta: "Contact Sales",
    popular: false,
    ctaAction: "contact",
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState<PlanKey | null>(null);
  const router = useRouter();

  const handleCta = async (plan: typeof plans[number]) => {
    setLoading(plan.key);
    try {
      if (plan.ctaAction === "contact") {
        const subject = encodeURIComponent("Agency Plan Inquiry - RankPilot AI");
        const body = encodeURIComponent(
          "Hi RankPilot team,\n\nI'm interested in the Agency plan for our team. Please share details about:\n\n- Onboarding process\n- Custom volume pricing\n- White-label setup\n\nThanks!"
        );
        window.location.href = `mailto:sales@rankpilot.ai?subject=${subject}&body=${body}`;
        return;
      }

      // For signup and trial, check if user is already logged in
      const user = await new Promise<unknown>((resolve) => {
        const unsub = onAuthStateChanged(auth, (u) => {
          unsub();
          resolve(u);
        });
        // safety timeout
        setTimeout(() => {
          unsub();
          resolve(null);
        }, 1500);
      });

      if (user && plan.ctaAction === "trial") {
        // Already logged in: send to dashboard with intent
        router.push(`/dashboard?plan=${plan.key}&intent=trial`);
      } else if (user) {
        router.push(`/dashboard?plan=${plan.key}`);
      } else {
        // Not logged in: send to signup with plan intent
        router.push(`/signup?plan=${plan.key}`);
      }
    } finally {
      setTimeout(() => setLoading(null), 500);
    }
  };

  return (
    <section id="pricing" className="py-24 relative bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-white mb-4">
            Transparent Pricing Models
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            No hidden costs. Scale plans up or down anytime as your optimization goals grow.
          </p>

          <div className="flex items-center justify-center space-x-4 mt-8">
            <span className={`text-sm font-medium ${!isAnnual ? "text-white" : "text-muted-foreground"}`}>Monthly billing</span>
            <button
              type="button"
              role="switch"
              aria-checked={isAnnual}
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-primary/20 border border-primary/30 p-1 flex items-center transition-colors cursor-pointer"
            >
              <div className={`h-4 w-4 rounded-full bg-accent transition-transform duration-300 ${isAnnual ? "translate-x-6" : "translate-x-0"}`} />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-white" : "text-muted-foreground"}`}>
              Yearly billing <span className="text-xs text-accent font-bold bg-accent/10 px-2 py-0.5 rounded-full ml-1">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const price = isAnnual ? plan.priceAnnually : plan.priceMonthly;
            const isLoading = loading === plan.key;
            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card rounded-2xl p-8 flex flex-col justify-between relative ${plan.popular ? "border-primary/50 shadow-2xl shadow-primary/10 md:scale-102" : "border-white/5"}`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-accent text-background text-[10px] font-extrabold uppercase px-4 py-1.5 rounded-full tracking-wider shadow-lg">
                    Highly Recommended
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-heading font-extrabold text-2xl text-white">
                      {plan.name}
                    </h3>
                    {plan.key === "free" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                        Ad-Supported
                      </span>
                    )}
                    {(plan.key === "pro" || plan.key === "agency") && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                        Ad-Free
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-heading font-black text-white">${price}</span>
                    <span className="text-sm text-muted-foreground ml-2">/month</span>
                  </div>

                  <hr className="border-white/5 mb-8" />

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleCta(plan)}
                  disabled={isLoading}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-accent text-background shadow-lg shadow-primary/25 hover:opacity-90 cursor-pointer"
                      : "bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-white cursor-pointer"
                  } disabled:opacity-50 disabled:cursor-wait`}
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-12">
          All plans include Firebase security, encrypted data transmission, and 99.9% uptime SLA.
          <br />
          <span className="text-amber-400/80">Free plan displays non-intrusive ads to support platform costs.</span>
        </p>
      </div>
    </section>
  );
}

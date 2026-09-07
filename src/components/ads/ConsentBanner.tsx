"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CATEGORIES = [
  { key: "necessary", label: "Necessary", desc: "Required for basic site functionality", required: true },
  { key: "analytics", label: "Analytics", desc: "Help us improve by understanding usage", required: false },
  { key: "advertising", label: "Advertising", desc: "Personalized ads and tracking", required: false },
] as const;

type ConsentKey = "necessary" | "analytics" | "advertising";
type ConsentMap = Record<ConsentKey, boolean>;
type View = "banner" | "modal" | "hidden";

const DEFAULT_CONSENT: ConsentMap = { necessary: true, analytics: false, advertising: false };

export function ConsentBanner() {
  const [view, setView] = useState<View>("hidden");
  const [consent, setConsent] = useState<ConsentMap>(DEFAULT_CONSENT);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("monetization_consent") || "null");
      if (stored && typeof stored === "object" && stored.necessary !== undefined) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConsent({ ...DEFAULT_CONSENT, ...stored });
        setView("hidden");
      } else {
        setView("banner");
      }
    } catch {
      setView("banner");
    }
  }, []);

  const save = (next: ConsentMap) => {
    setConsent(next);
    localStorage.setItem("monetization_consent", JSON.stringify(next));
    setView("hidden");
  };

  const toggleCategory = (key: ConsentKey, required: boolean) => {
    if (required) return;
    setConsent({ ...consent, [key]: !consent[key] });
  };

  if (view === "hidden") return null;

  if (view === "modal") {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-modal-title"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center p-4"
      >
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full space-y-4">
          <div className="flex items-start justify-between">
            <h3 id="consent-modal-title" className="font-heading font-bold text-lg text-white">Privacy &amp; Cookie Preferences</h3>
            <button
              onClick={() => setView("banner")}
              aria-label="Close preferences"
              className="text-muted-foreground hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage how we use cookies. See our{" "}
            <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link> and{" "}
            <Link href="/cookies" className="text-accent hover:underline">Cookie Policy</Link>.
          </p>
          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const k = cat.key as ConsentKey;
              const checked = !!consent[k];
              return (
                <div key={cat.key} className="flex items-center justify-between p-3 rounded-xl bg-neutral-800 border border-white/5">
                  <div>
                    <p className="text-xs font-semibold text-white">{cat.label}</p>
                    <p className="text-[10px] text-muted-foreground">{cat.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    disabled={cat.required}
                    onClick={() => toggleCategory(k, cat.required)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                      checked ? "bg-primary/20 text-primary" : "bg-neutral-700 text-neutral-300"
                    } ${cat.required ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {checked ? "On" : "Off"}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => save({ necessary: true, analytics: true, advertising: true })}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-primary to-accent text-background"
            >
              Accept All
            </button>
            <button
              onClick={() => save({ necessary: true, analytics: false, advertising: false })}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-bold border border-white/10 text-white hover:bg-white/5"
            >
              Reject Non-Essential
            </button>
            <button
              onClick={() => save(consent)}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-bold bg-white/10 text-white hover:bg-white/20"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur border-t border-white/10 p-4"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          We use cookies and similar technologies to improve your experience, analyze traffic, and support advertising.{" "}
          <Link href="/cookies" className="text-accent hover:underline">Learn more</Link>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => save({ necessary: true, analytics: true, advertising: true })}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-primary to-accent text-background"
          >
            Accept All
          </button>
          <button
            onClick={() => save({ necessary: true, analytics: false, advertising: false })}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 text-white hover:bg-white/5"
          >
            Reject Non-Essential
          </button>
          <button
            onClick={() => setView("modal")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:text-white"
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}

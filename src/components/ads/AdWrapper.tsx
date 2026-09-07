"use client";

import { useUserPlan } from "@/lib/useUserPlan";
import { AdSlot } from "@/components/ads/AdSlot";
import { Sparkles, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface AdWrapperProps {
  placement: string;
  device?: "desktop" | "mobile" | "all";
  className?: string;
}

export function AdWrapper({ placement, device = "all", className = "" }: AdWrapperProps) {
  const { isFree, loading } = useUserPlan();
  const [dismissed, setDismissed] = useState(false);

  if (loading) return null;
  if (!isFree) return null;
  if (dismissed) return null;

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
        <Link
          href="/#pricing"
          className="inline-flex items-center gap-1 bg-neutral-900/80 hover:bg-primary/20 text-muted-foreground hover:text-primary border border-white/5 hover:border-primary/30 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider transition-colors"
        >
          <Sparkles className="h-2.5 w-2.5" />
          Upgrade to remove
        </Link>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Hide ad for this session"
          className="bg-neutral-900/80 hover:bg-neutral-800 text-muted-foreground hover:text-white border border-white/5 rounded-full p-0.5 transition-colors"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      </div>
      <AdSlot placement={placement} device={device} />
    </div>
  );
}

export function InlineAdBanner({ placement = "content_top" }: { placement?: string }) {
  const { isFree, loading } = useUserPlan();
  const [dismissed, setDismissed] = useState(false);

  if (loading || !isFree || dismissed) return null;

  return (
    <div className="relative my-6 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 p-4">
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded">
          Sponsored
        </span>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Hide ad"
          className="text-muted-foreground hover:text-white"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center border border-amber-500/20">
          <Sparkles className="h-5 w-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">Ad slot • {placement}</p>
          <p className="text-xs text-muted-foreground">
            Your free plan supports us with non-intrusive ads.{" "}
            <Link href="/#pricing" className="text-accent hover:underline">Upgrade to Pro for an ad-free experience</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

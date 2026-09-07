"use client";

import { useEffect, useRef } from "react";

interface GoogleAdSenseProps {
  publisherId: string;
  slotId?: string;
  format?: string;
  responsive?: boolean;
  fullWidthResponsive?: boolean;
}

export default function GoogleAdSense({ publisherId, slotId, format = "auto", fullWidthResponsive = true }: GoogleAdSenseProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const w = window as typeof window & { adsbygoogle?: unknown[] };
      if (!w.adsbygoogle) {
        w.adsbygoogle = [];
      }
      w.adsbygoogle.push({});
    } catch {
      // ignore push errors
    }
  }, []);

  if (!publisherId || !slotId) return null;

  return (
    <div ref={containerRef} className="w-full min-h-[90px] flex items-center justify-center bg-neutral-900/50 border border-white/5 rounded-xl overflow-hidden">
      <ins
        className="adsbygoogle block"
        style={{ display: "block", width: "100%", height: "90px" }}
        data-ad-client={`ca-pub-${publisherId}`}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}

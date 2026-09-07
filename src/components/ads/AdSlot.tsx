"use client";

import { useEffect, useState } from "react";
import { getDocs, doc, getDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Ad = {
  id: string;
  platform: "adsense" | "meta" | "instagram" | "custom";
  placement: string;
  device: "all" | "desktop" | "mobile";
  status: "active" | "draft" | "disabled";
  priority: number;
  startDate?: string;
  endDate?: string;
  configuration?: Record<string, unknown>;
};

type MonetizationSettings = {
  adsEnabled?: boolean;
  adsenseEnabled?: boolean;
  metaEnabled?: boolean;
  instagramEnabled?: boolean;
  customAdsEnabled?: boolean;
  consentRequired?: boolean;
  [key: string]: unknown;
};

const PLACEMENTS = [
  "header", "hero_bottom", "content_top", "content_middle", "content_bottom",
  "sidebar", "footer", "mobile_sticky", "desktop_sticky"
];

function isAdActive(ad: Ad, device: string, consent: Record<string, boolean>): boolean {
  if (ad.status !== "active") return false;
  if (ad.device !== "all" && ad.device !== device) return false;
  const now = new Date();
  if (ad.startDate && new Date(ad.startDate) > now) return false;
  if (ad.endDate && new Date(ad.endDate) < now) return false;
  if (ad.platform === "adsense" && !consent.advertising) return false;
  if (ad.platform === "meta" && !consent.analytics && !consent.advertising) return false;
  return true;
}

function renderAd(ad: Ad) {
  const config = ad.configuration || {};
  if (ad.platform === "custom" && config.customHtml) {
    return <div className="ad-custom" dangerouslySetInnerHTML={{ __html: config.customHtml as string }} />;
  }
  if (ad.platform === "adsense") {
    return (
      <div className="ad-adsense w-full min-h-[90px] bg-neutral-800/50 rounded-xl flex items-center justify-center">
        <span className="text-[10px] text-muted-foreground">Ad Slot: {String(config.adSlotId || ad.id)}</span>
      </div>
    );
  }
  return (
    <div className="ad-generic w-full min-h-[90px] bg-neutral-800/50 rounded-xl flex items-center justify-center">
      <span className="text-[10px] text-muted-foreground capitalize">{ad.platform} ad • {ad.placement.replace("_", " ")}</span>
    </div>
  );
}

export function useAds(placement: string, device: string = "desktop") {
  const [ads, setAds] = useState<Ad[]>([]);
  const [settings, setSettings] = useState<MonetizationSettings>({});
  const [consent, setConsent] = useState<Record<string, boolean>>({ necessary: true, analytics: false, advertising: false });

  useEffect(() => {
    (async () => {
      try {
        const settingsSnap = await getDoc(doc(db, "monetizationSettings", "global"));
        if (settingsSnap.exists()) setSettings(settingsSnap.data() as MonetizationSettings);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "advertisements"));
        const list = snap.docs
          .filter((d) => !(d.data() as Record<string, unknown>).deleted)
          .map((d) => ({ id: d.id, ...d.data() } as Ad));
        list.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        setAds(list);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("monetization_consent") || "{}");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConsent({ necessary: true, ...stored });
    } catch {}
  }, []);

  const visibleAds = ads.filter((ad) => ad.placement === placement && isAdActive(ad, device, consent));
  const canRender = (settings.adsEnabled !== false) && (!settings.consentRequired || consent.advertising || consent.analytics);

  return { visibleAds, canRender, renderAd, settings, consent };
}

export function AdSlot({ placement, device = "desktop" }: { placement: string; device?: string }) {
  const { visibleAds, canRender, renderAd } = useAds(placement, device);

  if (!PLACEMENTS.includes(placement)) return null;
  if (!canRender) return null;

  if (visibleAds.length === 0) {
    return <div className="ad-slot w-full min-h-[90px] bg-neutral-900/30 rounded-xl border border-dashed border-white/5" data-placement={placement} />;
  }

  return (
    <div className="ad-slot w-full space-y-3" data-placement={placement}>
      {visibleAds.map((ad) => (
        <div key={ad.id} className="ad-item">{renderAd(ad)}</div>
      ))}
    </div>
  );
}

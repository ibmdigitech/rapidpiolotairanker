export interface Advertisement {
  id: string;
  name: string;
  platform: "adsense" | "meta" | "instagram" | "custom";
  placement: "header" | "hero_bottom" | "content_top" | "content_middle" | "content_bottom" | "sidebar" | "footer" | "mobile_sticky" | "desktop_sticky";
  type: string;
  status: "active" | "draft" | "disabled";
  device: "all" | "desktop" | "mobile";
  priority: number;
  startDate?: string;
  endDate?: string;
  configuration: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface MonetizationSettings {
  id: string;
  adsenseEnabled: boolean;
  adsensePublisherId: string;
  adsenseClientId: string;
  adsenseAutoAds: boolean;
  adsenseAdFormat: string;
  adsenseResponsive: boolean;
  adsenseScript: string;
  metaEnabled: boolean;
  metaPixelId: string;
  metaAppId: string;
  metaEventsApiToken: string;
  metaEnvironment: string;
  instagramEnabled: boolean;
  instagramBusinessAccountId: string;
  customAdsEnabled: boolean;
  consentRequired: boolean;
  updatedAt: string;
  updatedBy: string;
}

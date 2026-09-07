import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RankPilot AI - Rank on Google, ChatGPT, Gemini & Perplexity",
  description: "Optimize your website visibility across traditional search engines and modern AI Answer Engines (AEO). AI audits, keyword gap analysis, and multilingual content generation.",
};

import { AosInit } from "@/components/AosInit";
import { SchemaMarkup } from "@/components/SchemaMarkup";
import { ConsentBanner } from "@/components/ads/ConsentBanner";
import MetaPixel from "@/components/ads/MetaPixel";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/schema-builder";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = buildOrganizationSchema({
    name: "Rankpilot AI",
    url: "https://rankpilot.ai",
    description: "AI-driven SEO and AEO optimization platform.",
  });

  const websiteSchema = buildWebSiteSchema({
    name: "Rankpilot AI",
    url: "https://rankpilot.ai",
    description: "Rank on Google, ChatGPT, Gemini & Perplexity.",
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is AEO and how does it help businesses?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AEO, or Answer Engine Optimization, is the practice of structuring and optimizing content so that search engines and AI-powered systems can better understand, extract, and present information from a website."
        }
      },
      {
        "@type": "Question",
        name: "How much does your SEO platform cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our SEO platform offers flexible monthly plans starting at $49 per month, with a free trial available for users who want to evaluate the core features before subscribing."
        }
      },
      {
        "@type": "Question",
        name: "What does the AEO Schema Builder do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The AEO Schema Builder helps businesses create Schema.org structured data in JSON-LD format from their website content, making important information easier for search engines and other machine-readable systems to understand."
        }
      },
      {
        "@type": "Question",
        name: "How can I contact customer support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Customers can contact our support team through email or the support form available on our website. Our team typically responds to support requests within one business day."
        }
      }
    ]
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <SchemaMarkup schema={orgSchema} />
        <SchemaMarkup schema={websiteSchema} />
        <SchemaMarkup schema={faqSchema} />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        <AosInit />
        {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
          />
        )}
        {children}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} />}
        <ConsentBanner />
      </body>
    </html>
  );
}

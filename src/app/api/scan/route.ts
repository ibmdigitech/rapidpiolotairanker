import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface AuditIssue {
  id: number;
  title: string;
  priority: "High" | "Medium" | "Low";
  page: string;
  category: "seo" | "aeo" | "performance" | "accessibility";
}

// Fetch a single page with timeout
async function fetchPage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RankPilot-Bot/2.0; +https://rankpilot.ai)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
      },
      redirect: "follow",
    });
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

// Extract internal links from the homepage
function extractInternalLinks(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const links = new Set<string>();
  const baseOrigin = new URL(baseUrl).origin;

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    try {
      let fullUrl: string;
      if (href.startsWith("http")) {
        fullUrl = href;
      } else if (href.startsWith("/")) {
        fullUrl = baseOrigin + href;
      } else {
        return;
      }

      const parsed = new URL(fullUrl);
      // Only same-origin, no anchors, no files, no query strings with tracking
      if (
        parsed.origin === baseOrigin &&
        !parsed.hash &&
        !parsed.pathname.match(/\.(jpg|png|gif|svg|pdf|css|js|ico|woff|mp4|mp3|zip)$/i)
      ) {
        links.add(parsed.origin + parsed.pathname);
      }
    } catch {}
  });

  return Array.from(links).slice(0, 5); // Max 5 subpages to avoid long scans
}

// Audit a single page
function auditPage(html: string, pageUrl: string, pagePath: string): {
  issues: Omit<AuditIssue, "id">[];
  seoDeductions: number;
  aeoDeductions: number;
  pageStats: {
    hasTitle: boolean;
    hasMeta: boolean;
    hasH1: boolean;
    h1Count: number;
    imgCount: number;
    imgWithoutAlt: number;
    hasSchema: boolean;
    hasFAQ: boolean;
    hasOrg: boolean;
    hasOG: boolean;
    hasCanonical: boolean;
    hasViewport: boolean;
    hasLangAttr: boolean;
    linkCount: number;
    wordCount: number;
  };
} {
  const $ = cheerio.load(html);
  const issues: Omit<AuditIssue, "id">[] = [];
  let seoDeductions = 0;
  let aeoDeductions = 0;

  // ============== SEO CHECKS ==============

  // 1. Title Tag
  const title = $("title").text().trim();
  const hasTitle = title.length > 0;
  if (!hasTitle) {
    issues.push({ title: "Missing Title Tag", priority: "High", page: pagePath, category: "seo" });
    seoDeductions += 12;
  } else if (title.length < 20) {
    issues.push({ title: `Title Tag Too Short (${title.length} chars)`, priority: "Medium", page: pagePath, category: "seo" });
    seoDeductions += 5;
  } else if (title.length > 70) {
    issues.push({ title: `Title Tag Too Long (${title.length} chars, max ~60)`, priority: "Low", page: pagePath, category: "seo" });
    seoDeductions += 3;
  }

  // 2. Meta Description
  const metaDesc = $("meta[name='description']").attr("content")?.trim() || "";
  const hasMeta = metaDesc.length > 0;
  if (!hasMeta) {
    issues.push({ title: "Missing Meta Description", priority: "High", page: pagePath, category: "seo" });
    seoDeductions += 10;
  } else if (metaDesc.length < 50) {
    issues.push({ title: `Meta Description Too Short (${metaDesc.length} chars)`, priority: "Medium", page: pagePath, category: "seo" });
    seoDeductions += 4;
  } else if (metaDesc.length > 160) {
    issues.push({ title: `Meta Description Too Long (${metaDesc.length} chars, max ~155)`, priority: "Low", page: pagePath, category: "seo" });
    seoDeductions += 2;
  }

  // 3. H1 Tag
  const h1s = $("h1");
  const h1Count = h1s.length;
  const hasH1 = h1Count > 0;
  if (h1Count === 0) {
    issues.push({ title: "Missing H1 Tag", priority: "Medium", page: pagePath, category: "seo" });
    seoDeductions += 8;
  } else if (h1Count > 1) {
    issues.push({ title: `Multiple H1 Tags Found (${h1Count})`, priority: "Medium", page: pagePath, category: "seo" });
    seoDeductions += 4;
  }

  // 4. H2 headings (content structure)
  const h2Count = $("h2").length;
  if (h2Count === 0 && hasH1) {
    issues.push({ title: "No H2 Subheadings Found (Poor Structure)", priority: "Low", page: pagePath, category: "seo" });
    seoDeductions += 3;
  }

  // 5. Images Alt Tags
  const imgAll = $("img");
  const imgCount = imgAll.length;
  const imgsWithoutAlt = $("img:not([alt]), img[alt='']");
  const imgWithoutAlt = imgsWithoutAlt.length;
  if (imgWithoutAlt > 0) {
    issues.push({ title: `${imgWithoutAlt} of ${imgCount} Images Missing Alt Text`, priority: "Medium", page: pagePath, category: "accessibility" });
    seoDeductions += Math.min(10, imgWithoutAlt * 2);
  }

  // 6. Canonical Tag
  const canonical = $("link[rel='canonical']").attr("href") || "";
  const hasCanonical = canonical.length > 0;
  if (!hasCanonical) {
    issues.push({ title: "Missing Canonical Tag", priority: "Medium", page: pagePath, category: "seo" });
    seoDeductions += 5;
  }

  // 7. Viewport Meta
  const viewport = $("meta[name='viewport']").attr("content") || "";
  const hasViewport = viewport.length > 0;
  if (!hasViewport) {
    issues.push({ title: "Missing Viewport Meta Tag (Not Mobile-Friendly)", priority: "High", page: pagePath, category: "seo" });
    seoDeductions += 8;
  }

  // 8. Open Graph
  const ogTitle = $("meta[property='og:title']").attr("content") || "";
  const hasOG = ogTitle.length > 0;
  if (!hasOG) {
    issues.push({ title: "Missing Open Graph Tags", priority: "Low", page: pagePath, category: "seo" });
    seoDeductions += 3;
  }

  // 9. Lang Attribute
  const langAttr = $("html").attr("lang") || "";
  const hasLangAttr = langAttr.length > 0;
  if (!hasLangAttr) {
    issues.push({ title: "HTML Missing lang Attribute", priority: "Low", page: pagePath, category: "accessibility" });
    seoDeductions += 2;
  }

  // 10. Internal Links Count
  const linkCount = $("a[href]").length;

  // 11. Word Count (thin content check)
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.split(" ").filter(w => w.length > 1).length;
  if (wordCount < 300) {
    issues.push({ title: `Thin Content (Only ~${wordCount} words)`, priority: "Medium", page: pagePath, category: "seo" });
    seoDeductions += 6;
    aeoDeductions += 5;
  }

  // ============== AEO CHECKS ==============

  // 12. JSON-LD Schema
  const schemas = $("script[type='application/ld+json']");
  const hasSchema = schemas.length > 0;
  let hasFAQ = false;
  let hasOrg = false;

  if (!hasSchema) {
    issues.push({ title: "No JSON-LD Schema Found", priority: "High", page: pagePath, category: "aeo" });
    aeoDeductions += 20;
  } else {
    schemas.each((_, el) => {
      try {
        const content = $(el).html() || "";
        if (content.includes("FAQPage") || content.includes("Question")) hasFAQ = true;
        if (content.includes("Organization") || content.includes("WebSite")) hasOrg = true;
      } catch {}
    });

    if (!hasFAQ) {
      issues.push({ title: "No FAQ Schema (Reduces AI Citations)", priority: "Medium", page: pagePath, category: "aeo" });
      aeoDeductions += 10;
    }
    if (!hasOrg) {
      issues.push({ title: "No Organization/WebSite Schema", priority: "Medium", page: pagePath, category: "aeo" });
      aeoDeductions += 8;
    }
  }

  // 13. Conversational content check (does content have Q&A patterns?)
  const hasQAPattern = bodyText.match(/\?/g);
  const questionCount = hasQAPattern ? hasQAPattern.length : 0;
  if (questionCount < 2) {
    issues.push({ title: "No Conversational Q&A Content Detected", priority: "Medium", page: pagePath, category: "aeo" });
    aeoDeductions += 7;
  }

  // 14. Meta robots
  const robotsMeta = $("meta[name='robots']").attr("content") || "";
  if (robotsMeta.includes("noindex")) {
    issues.push({ title: "Page Set to noindex (Blocks Search + AI)", priority: "High", page: pagePath, category: "seo" });
    seoDeductions += 15;
    aeoDeductions += 15;
  }

  return {
    issues,
    seoDeductions,
    aeoDeductions,
    pageStats: { hasTitle, hasMeta, hasH1, h1Count, imgCount, imgWithoutAlt, hasSchema, hasFAQ, hasOrg, hasOG, hasCanonical, hasViewport, hasLangAttr, linkCount, wordCount }
  };
}

export async function POST(request: Request) {
  try {
    const { domainUrl } = await request.json();

    if (!domainUrl) {
      return NextResponse.json({ error: "Missing domainUrl" }, { status: 400 });
    }

    // Normalize URL
    let targetUrl = domainUrl.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    // 1. Fetch the homepage
    const homepageHtml = await fetchPage(targetUrl);
    if (!homepageHtml) {
      return NextResponse.json({
        error: "Failed to fetch domain",
        details: "Could not connect to " + targetUrl
      }, { status: 422 });
    }

    // 2. Extract internal links for multi-page crawl
    const internalLinks = extractInternalLinks(homepageHtml, targetUrl);

    // 3. Audit homepage
    const homePath = new URL(targetUrl).pathname || "/";
    const homeAudit = auditPage(homepageHtml, targetUrl, homePath);
    
    let totalSeoDeductions = homeAudit.seoDeductions;
    let totalAeoDeductions = homeAudit.aeoDeductions;
    const allIssues: AuditIssue[] = homeAudit.issues.map((issue, idx) => ({ ...issue, id: idx + 1 }));
    let idCounter = allIssues.length + 1;

    // 4. Crawl subpages in parallel
    const subpageResults = await Promise.allSettled(
      internalLinks
        .filter(link => link !== targetUrl && link !== targetUrl + "/")
        .map(async (link) => {
          const html = await fetchPage(link);
          if (!html) return null;
          const pagePath = new URL(link).pathname;
          return { ...auditPage(html, link, pagePath), pagePath };
        })
    );

    let pagesScanned = 1;
    for (const result of subpageResults) {
      if (result.status === "fulfilled" && result.value) {
        pagesScanned++;
        const { issues, seoDeductions, aeoDeductions } = result.value;
        // Average in subpage deductions (weighted less than homepage)
        totalSeoDeductions += seoDeductions * 0.5;
        totalAeoDeductions += aeoDeductions * 0.5;
        for (const issue of issues) {
          // Avoid exact duplicates
          const isDuplicate = allIssues.some(
            existing => existing.title === issue.title && existing.page === issue.page
          );
          if (!isDuplicate) {
            allIssues.push({ ...issue, id: idCounter++ });
          }
        }
      }
    }

    // 5. Calculate final scores
    const seoScore = Math.max(0, Math.min(100, Math.round(100 - totalSeoDeductions)));
    const aeoScore = Math.max(0, Math.min(100, Math.round(100 - totalAeoDeductions)));

    // 6. Sort issues: High first, then Medium, then Low
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    allIssues.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return NextResponse.json({
      success: true,
      data: {
        domainUrl: targetUrl,
        seoScore,
        aeoScore,
        auditIssues: allIssues,
        pagesScanned,
        scannedAt: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

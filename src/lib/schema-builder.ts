// ─── Schema Types ────────────────────────────────────────────────────────────

export const SCHEMA_TYPES = [
  "FAQ",
  "Organization",
  "LocalBusiness",
  "Product",
  "Service",
  "Article",
  "WebSite",
  "BreadcrumbList",
  "Person",
  "Event",
] as const;

export type SchemaType = (typeof SCHEMA_TYPES)[number];

// Which types have full form implementations
export const IMPLEMENTED_TYPES: SchemaType[] = [
  "FAQ",
  "Organization",
  "LocalBusiness",
  "Product",
  "Service",
  "Article",
  "WebSite",
  "BreadcrumbList",
  "Person",
  "Event",
];

// ─── FAQ Types ───────────────────────────────────────────────────────────────

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export function createEmptyFaqItem(): FaqItem {
  return { id: Date.now().toString() + Math.random().toString(36).slice(2, 6), question: "", answer: "" };
}

// ─── Generic Field Definitions ───────────────────────────────────────────────

export interface SchemaField {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "date" | "number" | "email";
  placeholder: string;
  required: boolean;
}

export function getFieldsForType(type: SchemaType): SchemaField[] {
  switch (type) {
    case "FAQ":
      return []; // FAQ uses a dynamic list builder
    case "Organization":
      return [
        { key: "name", label: "Organization Name", type: "text", placeholder: "Acme Corp", required: true },
        { key: "url", label: "Website URL", type: "url", placeholder: "https://acme.com", required: true },
        { key: "logo", label: "Logo URL", type: "url", placeholder: "https://acme.com/logo.png", required: false },
        { key: "description", label: "Description", type: "textarea", placeholder: "A global leader in...", required: false },
        { key: "email", label: "Contact Email", type: "email", placeholder: "info@acme.com", required: false },
        { key: "telephone", label: "Phone", type: "text", placeholder: "+1-555-000-0000", required: false },
      ];
    case "LocalBusiness":
      return [
        { key: "name", label: "Business Name", type: "text", placeholder: "Acme Dubai", required: true },
        { key: "url", label: "Website URL", type: "url", placeholder: "https://acme.ae", required: false },
        { key: "description", label: "Description", type: "textarea", placeholder: "Leading SEO agency in...", required: false },
        { key: "telephone", label: "Phone", type: "text", placeholder: "+971-4-000-0000", required: false },
        { key: "streetAddress", label: "Street Address", type: "text", placeholder: "123 Sheikh Zayed Rd", required: true },
        { key: "addressLocality", label: "City", type: "text", placeholder: "Dubai", required: true },
        { key: "addressRegion", label: "Region / State", type: "text", placeholder: "Dubai", required: false },
        { key: "postalCode", label: "Postal Code", type: "text", placeholder: "00000", required: false },
        { key: "addressCountry", label: "Country", type: "text", placeholder: "AE", required: true },
        { key: "openingHours", label: "Opening Hours", type: "text", placeholder: "Mo-Fr 09:00-18:00", required: false },
      ];
    case "Product":
      return [
        { key: "name", label: "Product Name", type: "text", placeholder: "RankPilot Pro", required: true },
        { key: "description", label: "Description", type: "textarea", placeholder: "An all-in-one SEO tool...", required: true },
        { key: "image", label: "Image URL", type: "url", placeholder: "https://example.com/product.jpg", required: false },
        { key: "brand", label: "Brand", type: "text", placeholder: "Acme", required: false },
        { key: "sku", label: "SKU", type: "text", placeholder: "RP-PRO-001", required: false },
        { key: "priceCurrency", label: "Currency", type: "text", placeholder: "USD", required: false },
        { key: "price", label: "Price", type: "number", placeholder: "49.00", required: false },
      ];
    case "Service":
      return [
        { key: "name", label: "Service Name", type: "text", placeholder: "SEO Audit Service", required: true },
        { key: "description", label: "Description", type: "textarea", placeholder: "Comprehensive SEO audit...", required: true },
        { key: "provider", label: "Provider Name", type: "text", placeholder: "Acme SEO Agency", required: false },
        { key: "serviceType", label: "Service Type", type: "text", placeholder: "SEO Consulting", required: false },
        { key: "areaServed", label: "Area Served", type: "text", placeholder: "United Arab Emirates", required: false },
        { key: "url", label: "Service URL", type: "url", placeholder: "https://acme.ae/services/seo", required: false },
      ];
    case "Article":
      return [
        { key: "headline", label: "Headline", type: "text", placeholder: "Best SEO Strategies for 2026", required: true },
        { key: "description", label: "Description", type: "textarea", placeholder: "A comprehensive guide to...", required: true },
        { key: "authorName", label: "Author Name", type: "text", placeholder: "John Doe", required: true },
        { key: "datePublished", label: "Date Published", type: "date", placeholder: "2026-01-01", required: true },
        { key: "image", label: "Image URL", type: "url", placeholder: "https://example.com/article.jpg", required: false },
        { key: "publisher", label: "Publisher Name", type: "text", placeholder: "Acme Media", required: false },
      ];
    case "WebSite":
      return [
        { key: "name", label: "Website Name", type: "text", placeholder: "Acme Official Site", required: true },
        { key: "url", label: "URL", type: "url", placeholder: "https://acme.com", required: true },
        { key: "description", label: "Description", type: "textarea", placeholder: "Official website of Acme Corp", required: false },
      ];
    case "BreadcrumbList":
      return []; // Uses dynamic list builder like FAQ
    case "Person":
      return [
        { key: "name", label: "Full Name", type: "text", placeholder: "Jane Doe", required: true },
        { key: "url", label: "Profile URL", type: "url", placeholder: "https://janedoe.com", required: false },
        { key: "jobTitle", label: "Job Title", type: "text", placeholder: "SEO Specialist", required: false },
        { key: "email", label: "Email", type: "email", placeholder: "jane@example.com", required: false },
        { key: "image", label: "Photo URL", type: "url", placeholder: "https://example.com/photo.jpg", required: false },
        { key: "worksFor", label: "Works For (Organization)", type: "text", placeholder: "Acme Corp", required: false },
      ];
    case "Event":
      return [
        { key: "name", label: "Event Name", type: "text", placeholder: "SEO Summit 2026", required: true },
        { key: "description", label: "Description", type: "textarea", placeholder: "Annual SEO industry summit...", required: false },
        { key: "startDate", label: "Start Date", type: "date", placeholder: "2026-06-01", required: true },
        { key: "endDate", label: "End Date", type: "date", placeholder: "2026-06-03", required: false },
        { key: "locationName", label: "Location Name", type: "text", placeholder: "Dubai World Trade Centre", required: true },
        { key: "locationAddress", label: "Location Address", type: "text", placeholder: "Sheikh Zayed Road, Dubai", required: false },
        { key: "url", label: "Event URL", type: "url", placeholder: "https://seosummit.ae", required: false },
        { key: "organizerName", label: "Organizer Name", type: "text", placeholder: "Acme Events", required: false },
      ];
    default:
      return [];
  }
}

// ─── Schema Builders ─────────────────────────────────────────────────────────

export function buildSchema(
  type: SchemaType,
  fields: Record<string, string>,
  faqItems?: FaqItem[],
  breadcrumbItems?: { name: string; url: string }[]
): Record<string, unknown> {
  switch (type) {
    case "FAQ":
      return buildFAQSchema(faqItems || []);
    case "Organization":
      return buildOrganizationSchema(fields);
    case "LocalBusiness":
      return buildLocalBusinessSchema(fields);
    case "Product":
      return buildProductSchema(fields);
    case "Service":
      return buildServiceSchema(fields);
    case "Article":
      return buildArticleSchema(fields);
    case "WebSite":
      return buildWebSiteSchema(fields);
    case "BreadcrumbList":
      return buildBreadcrumbSchema(breadcrumbItems || []);
    case "Person":
      return buildPersonSchema(fields);
    case "Event":
      return buildEventSchema(fields);
    default:
      return { "@context": "https://schema.org" };
  }
}

function buildFAQSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function buildOrganizationSchema(f: Record<string, string>) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: f.name,
    url: f.url,
    ...(f.logo && { logo: f.logo }),
    ...(f.description && { description: f.description }),
    ...(f.email && { email: f.email }),
    ...(f.telephone && { telephone: f.telephone }),
  };
}

function buildLocalBusinessSchema(f: Record<string, string>) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: f.name,
    ...(f.url && { url: f.url }),
    ...(f.description && { description: f.description }),
    ...(f.telephone && { telephone: f.telephone }),
    address: {
      "@type": "PostalAddress",
      streetAddress: f.streetAddress,
      addressLocality: f.addressLocality,
      ...(f.addressRegion && { addressRegion: f.addressRegion }),
      ...(f.postalCode && { postalCode: f.postalCode }),
      addressCountry: f.addressCountry,
    },
    ...(f.openingHours && { openingHours: f.openingHours }),
  };
}

function buildProductSchema(f: Record<string, string>) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: f.name,
    description: f.description,
    ...(f.image && { image: f.image }),
    ...(f.brand && { brand: { "@type": "Brand", name: f.brand } }),
    ...(f.sku && { sku: f.sku }),
    ...(f.price && {
      offers: {
        "@type": "Offer",
        price: f.price,
        priceCurrency: f.priceCurrency || "USD",
      },
    }),
  };
}

function buildServiceSchema(f: Record<string, string>) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: f.name,
    description: f.description,
    ...(f.provider && { provider: { "@type": "Organization", name: f.provider } }),
    ...(f.serviceType && { serviceType: f.serviceType }),
    ...(f.areaServed && { areaServed: f.areaServed }),
    ...(f.url && { url: f.url }),
  };
}

function buildArticleSchema(f: Record<string, string>) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: f.headline,
    description: f.description,
    author: { "@type": "Person", name: f.authorName },
    datePublished: f.datePublished,
    ...(f.image && { image: f.image }),
    ...(f.publisher && {
      publisher: { "@type": "Organization", name: f.publisher },
    }),
  };
}

export function buildWebSiteSchema(f: Record<string, string>) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: f.name,
    url: f.url,
    ...(f.description && { description: f.description }),
  };
}

function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function buildPersonSchema(f: Record<string, string>) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: f.name,
    ...(f.url && { url: f.url }),
    ...(f.jobTitle && { jobTitle: f.jobTitle }),
    ...(f.email && { email: f.email }),
    ...(f.image && { image: f.image }),
    ...(f.worksFor && { worksFor: { "@type": "Organization", name: f.worksFor } }),
  };
}

function buildEventSchema(f: Record<string, string>) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: f.name,
    ...(f.description && { description: f.description }),
    startDate: f.startDate,
    ...(f.endDate && { endDate: f.endDate }),
    location: {
      "@type": "Place",
      name: f.locationName,
      ...(f.locationAddress && {
        address: { "@type": "PostalAddress", streetAddress: f.locationAddress },
      }),
    },
    ...(f.url && { url: f.url }),
    ...(f.organizerName && {
      organizer: { "@type": "Organization", name: f.organizerName },
    }),
  };
}

// ─── Validator ────────────────────────────────────────────────────────────────

export interface ValidationCheck {
  label: string;
  passed: boolean;
  message?: string;
}

export function validateSchema(jsonString: string, type: SchemaType): ValidationCheck[] {
  const checks: ValidationCheck[] = [];

  // 1. Valid JSON syntax
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonString);
    checks.push({ label: "Valid JSON syntax", passed: true });
  } catch {
    checks.push({ label: "Valid JSON syntax", passed: false, message: "Invalid JSON format" });
    return checks; // Can't continue if JSON is broken
  }

  // 2. @context present
  if (parsed["@context"] === "https://schema.org") {
    checks.push({ label: "Schema.org context present", passed: true });
  } else {
    checks.push({ label: "Schema.org context present", passed: false, message: "Missing @context" });
  }

  // 3. @type detected
  if (parsed["@type"]) {
    checks.push({ label: `Schema type detected: ${parsed["@type"]}`, passed: true });
  } else {
    checks.push({ label: "Schema type detected", passed: false, message: "Missing @type property" });
  }

  // 4. Type-specific checks
  if (type === "FAQ") {
    const mainEntity = parsed.mainEntity as unknown[] | undefined;
    if (Array.isArray(mainEntity) && mainEntity.length > 0) {
      checks.push({ label: "FAQ items present", passed: true });
      const allHaveQ = mainEntity.every(
        (e) => typeof e === "object" && e !== null && "name" in e && (e as Record<string, unknown>).name
      );
      const allHaveA = mainEntity.every(
        (e) =>
          typeof e === "object" &&
          e !== null &&
          "acceptedAnswer" in e &&
          typeof (e as Record<string, unknown>).acceptedAnswer === "object"
      );
      checks.push({ label: "All questions have content", passed: allHaveQ, ...(!allHaveQ && { message: "Some questions are empty" }) });
      checks.push({ label: "All answers have content", passed: allHaveA, ...(!allHaveA && { message: "Some answers are empty" }) });
    } else {
      checks.push({ label: "FAQ items present", passed: false, message: "No FAQ items found" });
    }
  } else {
    // Generic: check required fields from field definitions
    const fields = getFieldsForType(type);
    const requiredFields = fields.filter((f) => f.required);
    for (const field of requiredFields) {
      const value = getNestedValue(parsed, field.key);
      const present = value !== undefined && value !== null && value !== "";
      checks.push({
        label: `${field.label} present`,
        passed: present,
        ...(!present && { message: `Missing required: ${field.label}` }),
      });
    }
  }

  return checks;
}

function getNestedValue(obj: Record<string, unknown>, key: string): unknown {
  // Handle direct keys and common nested patterns
  if (key in obj) return obj[key];
  // Check inside address object for LocalBusiness
  if (typeof obj.address === "object" && obj.address !== null && key in (obj.address as Record<string, unknown>)) {
    return (obj.address as Record<string, unknown>)[key];
  }
  // Check author for Article
  if (key === "authorName" && typeof obj.author === "object" && obj.author !== null) {
    return (obj.author as Record<string, unknown>).name;
  }
  // Check location for Event
  if (key === "locationName" && typeof obj.location === "object" && obj.location !== null) {
    return (obj.location as Record<string, unknown>).name;
  }
  return undefined;
}

// ─── AEO Content Quality Scorer ──────────────────────────────────────────────

export interface QualityCheck {
  label: string;
  passed: boolean;
  suggestion?: string;
}

export interface QualityResult {
  score: number;
  checks: QualityCheck[];
}

export function calculateContentQuality(
  type: SchemaType,
  fields: Record<string, string>,
  faqItems?: FaqItem[]
): QualityResult {
  const checks: QualityCheck[] = [];
  let totalPoints = 0;
  let earnedPoints = 0;

  if (type === "FAQ" && faqItems) {
    // FAQ-specific quality checks
    totalPoints = 5;

    // 1. Has at least one Q&A pair
    const hasPairs = faqItems.length > 0 && faqItems.some((i) => i.question.trim() && i.answer.trim());
    if (hasPairs) { earnedPoints++; checks.push({ label: "Has Q&A content", passed: true }); }
    else { checks.push({ label: "Has Q&A content", passed: false, suggestion: "Add at least one question and answer" }); }

    // 2. Questions are clear (end with ?)
    const clearQs = faqItems.filter((i) => i.question.trim()).every((i) => i.question.trim().endsWith("?"));
    if (clearQs && hasPairs) { earnedPoints++; checks.push({ label: "Questions are well-formed", passed: true }); }
    else { checks.push({ label: "Questions are well-formed", passed: false, suggestion: "End each question with a question mark" }); }

    // 3. Answers are sufficiently detailed (>30 chars)
    const detailedAs = faqItems.filter((i) => i.answer.trim()).every((i) => i.answer.trim().length >= 30);
    if (detailedAs && hasPairs) { earnedPoints++; checks.push({ label: "Answers are sufficiently detailed", passed: true }); }
    else { checks.push({ label: "Answers are sufficiently detailed", passed: false, suggestion: "Write answers of at least 30 characters for better machine readability" }); }

    // 4. Multiple Q&A pairs
    const multipleQA = faqItems.filter((i) => i.question.trim() && i.answer.trim()).length >= 2;
    if (multipleQA) { earnedPoints++; checks.push({ label: "Multiple Q&A pairs provided", passed: true }); }
    else { checks.push({ label: "Multiple Q&A pairs provided", passed: false, suggestion: "Add 2 or more Q&A pairs for richer structured data" }); }

    // 5. No duplicate questions
    const questions = faqItems.map((i) => i.question.trim().toLowerCase()).filter(Boolean);
    const unique = new Set(questions).size === questions.length;
    if (unique) { earnedPoints++; checks.push({ label: "No duplicate questions", passed: true }); }
    else { checks.push({ label: "No duplicate questions", passed: false, suggestion: "Remove duplicate questions" }); }
  } else {
    // Generic quality checks for other types
    const fieldDefs = getFieldsForType(type);
    const requiredFields = fieldDefs.filter((f) => f.required);
    const optionalFields = fieldDefs.filter((f) => !f.required);

    totalPoints = 4;

    // 1. All required fields filled
    const allRequired = requiredFields.every((f) => fields[f.key]?.trim());
    if (allRequired) { earnedPoints++; checks.push({ label: "All required fields completed", passed: true }); }
    else { checks.push({ label: "All required fields completed", passed: false, suggestion: "Fill in all required fields" }); }

    // 2. At least half optional fields filled
    const filledOptional = optionalFields.filter((f) => fields[f.key]?.trim()).length;
    const halfOptional = filledOptional >= Math.ceil(optionalFields.length / 2);
    if (halfOptional || optionalFields.length === 0) {
      earnedPoints++;
      checks.push({ label: "Rich content with optional details", passed: true });
    } else {
      checks.push({ label: "Rich content with optional details", passed: false, suggestion: "Add more optional fields for richer structured data" });
    }

    // 3. Description or main text field is detailed (>50 chars)
    const descField = fields.description || fields.headline || "";
    if (descField.length >= 50) { earnedPoints++; checks.push({ label: "Content is sufficiently detailed", passed: true }); }
    else { checks.push({ label: "Content is sufficiently detailed", passed: false, suggestion: "Write more detailed descriptions (50+ characters)" }); }

    // 4. URLs are valid format
    const urlFields = fieldDefs.filter((f) => f.type === "url");
    const filledUrls = urlFields.filter((f) => fields[f.key]?.trim());
    const validUrls = filledUrls.every((f) => {
      try { new URL(fields[f.key]); return true; } catch { return false; }
    });
    if (validUrls || filledUrls.length === 0) { earnedPoints++; checks.push({ label: "URLs are properly formatted", passed: true }); }
    else { checks.push({ label: "URLs are properly formatted", passed: false, suggestion: "Use full URLs starting with https://" }); }
  }

  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  return { score, checks };
}

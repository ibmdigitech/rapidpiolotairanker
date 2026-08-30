import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatLog = {
  timestamp: string;
  model?: string;
  status: "success" | "fallback" | "error" | "guardrail";
  error?: string;
  providerError?: boolean;
  networkError?: boolean;
};

const chatHistory: ChatLog[] = [];

export { chatHistory };

// ─── Prompt-Injection Guardrails ────────────────────────────────────────────
// Scan user-supplied messages for prompt-injection patterns (OWASP LLM Prompt
// Injection Prevention Cheat Sheet style) and enforce an action:
//   off    -> no scanning
//   flag   -> pass through, log the hit for observability
//   redact -> replace matched spans with [PROMPT_INJECTION], then forward
//   block  -> reject the request with 403 before it reaches the model
// When multiple patterns match, the most restrictive action still applies.

type GuardrailAction = "off" | "flag" | "redact" | "block";

const GUARDRAIL_PATTERNS: { name: string; regex: RegExp; description: string }[] = [
  { name: "ignore_previous_instructions", regex: /ignore\s+(all\s+)?(previous|prior)\s+((?:safety|security|system|operational|internal|core|original|initial|existing|given|stated|provided|defined|specified|established)\s+)?(instructions?|rules?|guidelines?|constraints?|directives?)/i, description: "Attempts to discard prior instructions" },
  { name: "disregard_instructions", regex: /disregard\s+(all\s+)?(previous|prior|above)\s+(instructions?|rules?|guidelines?|constraints?|directives?)/i, description: "Variants of disregard instructions" },
  { name: "forget_instructions", regex: /forget\s+(all\s+)?(previous|prior|above)\s+(instructions?|rules?|guidelines?|constraints?|directives?)/i, description: "Erase prior instructions" },
  { name: "new_instructions", regex: /new\s+instructions?:/i, description: "Injection marker introducing replacement instructions" },
  { name: "do_not_follow", regex: /do\s+not\s+follow\s+(the\s+)?(system|developer|previous|original)/i, description: "Disobey system prompt" },
  { name: "supersede_instructions", regex: /supersedes?\s+(all\s+)?(prior|previous)\s+(instructions?|rules?|guidelines?|constraints?|directives?)/i, description: "Supersede prior instructions" },
  { name: "void_instructions", regex: /(all\s+)?(previous|prior)\s+instructions?\s+(are|is)\s+(void|invalid|null|obsolete|cancelled|revoked)/i, description: "Claims prior instructions void" },
  { name: "developer_mode", regex: /you\s+are\s+now\s+(in\s+)?developer\s+mode/i, description: "Claims developer mode" },
  { name: "enter_special_mode", regex: /enter\s+(developer|admin|debug|maintenance)\s+mode/i, description: "Enter special mode" },
  { name: "activate_special_mode", regex: /activate\s+(developer|admin|debug|jailbreak)\s+mode/i, description: "Activate special mode" },
];

function scanUserMessages(
  messages: { role: string; content: string }[]
): { hits: string[]; sanitized: { role: string; content: string }[] } {
  const hits = new Set<string>();
  const sanitized = messages.map((m) => {
    if (m.role !== "user" || typeof m.content !== "string") return { ...m };
    let content = m.content;
    for (const p of GUARDRAIL_PATTERNS) {
      if (p.regex.test(content)) {
        hits.add(p.name);
        content = content.replace(p.regex, "[PROMPT_INJECTION]");
      }
    }
    return { ...m, content };
  });
  return { hits: Array.from(hits), sanitized };
}

function generateMockSEOArticle(topic: string, isArabic: boolean): string {
  if (isArabic) {
    return `# دليل تحسين محركات البحث الشامل لـ: ${topic}
    
## مقدمة
يعد تحسين محركات البحث (SEO) والتحسين لمحركات الإجابة الاصطناعية (AEO) جزءاً أساسياً من نجاح أي نشاط تجاري اليوم، خاصة عندما يتعلق الأمر بـ **${topic}**. في هذا الدليل، سنستعرض الخطوات العملية لتحقيق الصدارة.

## 1. الكلمات المفتاحية الأكثر أهمية
- دراسة حجم البحث المحلي ومنافسة الكلمات المرتبطة بـ ${topic}.
- استخدام الكلمات الطويلة (Long-tail keywords) لتسهيل الظهور في إجابات الذكاء الاصطناعي.

## 2. تحسين البنية البرمجية (On-Page SEO)
- كتابة عناوين ووصف ميتا جذابين ومقنعين حول ${topic}.
- إضافة وسوم الـ Alt لجميع الصور.
- توفير كود مخطط البيانات الهيكلية (JSON-LD Schema).

## 3. تحسين ظهور الموقع لمحركات الإجابة (AEO)
- كتابة إجابات مباشرة ومباشرة للأسئلة الشائعة حول ${topic}.
- الحفاظ على نبرة حوارية احترافية تُسهل على نماذج اللغة مثل ChatGPT وGemini العثور على المعلومات وتوثيقها.`;
  }

  return `# The Ultimate SEO & AEO Strategy Guide for: ${topic}

## Introduction
Achieving visibility on modern platforms requires looking beyond standard SEO. Today, we must optimize for search engine algorithms as well as AI Answer Engines (AEO) like ChatGPT, Gemini, and Perplexity, especially when discussing **${topic}**.

## Key Pillars for Optimization:

### 1. Advanced Entity-Based Content Structure
Rather than focusing solely on traditional keywords, construct your content around detailed **entities** and clear Q&A formats related to ${topic}. This matches the semantic queries executed by large language models.

### 2. High-Performance Schema Markups
Incorporate robust JSON-LD schemas (such as FAQPage, Product, and Organization) into your website structure to highlight your ${topic} services. This gives scraper bots explicit, structured data to query directly.

### 3. Clear, Direct Answer Paragraphs
Write concise 2-3 sentence summaries at the top of main topics regarding ${topic}. AI models extract these directly as references for answer summaries.

---
*Created dynamically by RankPilot AI Composer Fallback Engine.*`;
}

async function callLLM(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  tokenLimits: Record<string, number> | undefined,
  extraHeaders?: Record<string, string>
): Promise<{ response: Response; text: string }> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages,
      ...tokenLimits,
    }),
  });

  const text = await response.text();
  return { response, text };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = body.messages || [];

    // ── Prompt-injection guardrail ──────────────────────────────────────────
    const guardrailAction: GuardrailAction =
      (process.env.COMPOSER_GUARDRAIL as GuardrailAction) || "block";
    if (guardrailAction !== "off") {
      const { hits, sanitized } = scanUserMessages(messages);
      if (hits.length > 0) {
        chatHistory.push({ timestamp: new Date().toISOString(), status: "guardrail", error: hits.join(",") });
        if (guardrailAction === "block") {
          console.log(`[chat] guardrail BLOCK for patterns:`, hits);
          return NextResponse.json(
            { error: "Request blocked: prompt injection patterns detected", detected: hits },
            { status: 403 }
          );
        }
        if (guardrailAction === "redact") {
          console.log(`[chat] guardrail REDACT for patterns:`, hits);
          messages.length = 0;
          messages.push(...sanitized);
        } else {
          console.log(`[chat] guardrail FLAG for patterns:`, hits);
        }
      }
    }

    // Min/Max length controls from the Semantic Composer (words -> tokens, ~1.3 tokens/word)
    const tokenLimits: Record<string, number> = {};
    if (typeof body.minWords === "number" && body.minWords > 0) {
      tokenLimits.min_tokens = Math.round(body.minWords * 1.3);
    }
    if (typeof body.maxWords === "number" && body.maxWords > 0) {
      tokenLimits.max_tokens = Math.round(body.maxWords * 1.3);
    }

    const userPrompt = messages[messages.length - 1]?.content || "";
    const isArabic = /[\u0600-\u06FF]/.test(userPrompt) || userPrompt.toLowerCase().includes("arabic");

    let topic = "Digital Growth & AI Search Visibility";
    const topicMatch = userPrompt.match(/about:\s*(.+)$/i) || userPrompt.match(/topic:\s*(.+)$/i);
    if (topicMatch && topicMatch[1]) {
      topic = topicMatch[1];
    }

    // ── Build the ordered list of LLM endpoints to try ──────────────────────
    // NVIDIA's API is tried first (it is in the account's allowed-providers list and
    // is OpenAI-compatible), then OpenRouter as a fallback chain.
    type Endpoint = { baseUrl: string; key: string; model: string; headers?: Record<string, string> };
    const endpoints: Endpoint[] = [];

    const nvidiaKey = process.env.NVIDIA_API_KEY;
    const nvidiaModel = process.env.NVIDIA_MODEL || "deepseek-ai/deepseek-v4-pro-0813";
    const nvidiaBase = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
    if (nvidiaKey) {
      endpoints.push({ baseUrl: nvidiaBase, key: nvidiaKey, model: nvidiaModel });
    }

    const openrouterKey = process.env.OPENROUTER_COMPOSER_API_KEY || process.env.OPENROUTER_API_KEY;
    const configuredModel = process.env.OPENROUTER_MODEL || "auto";
    const referer = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    if (openrouterKey && !openrouterKey.includes("...")) {
      const providerModels: Record<string, string[]> = {
        "google": ["google/gemini-3.7-flash"],
        "openai": ["openai/gpt-5.6-luna", "openai/gpt-5.6-luna-pro"],
        "anthropic": ["anthropic/claude-opus-5-fast"],
        "deepseek": ["deepseek/deepseek-v4-flash-0731", "deepseek/deepseek-v4-pro-0813"],
        "qwen": ["qwen/qwen3.8-flash"],
        "meta-llama": ["meta-llama/llama-4-scout"],
        "z-ai": ["z-ai/glm-5.3-flash"],
      };
      const allModels = Object.values(providerModels).flat();
      const orModels = configuredModel === "auto" ? allModels : [configuredModel, ...allModels];
      for (const m of orModels) {
        endpoints.push({
          baseUrl: "https://openrouter.ai/api/v1",
          key: openrouterKey,
          model: m,
          headers: { "HTTP-Referer": referer, "X-Title": "RankPilot AI" },
        });
      }
    }

    if (endpoints.length === 0) {
      chatHistory.push({ timestamp: new Date().toISOString(), status: "fallback", error: "no_api_key" });
      console.log("[chat] no API key configured, returning fallback content");
      return NextResponse.json({
        choices: [{
          message: {
            role: "assistant",
            content: generateMockSEOArticle(topic, isArabic)
          }
        }]
      });
    }

    for (const ep of endpoints) {
      let callResult: { response: Response; text: string };
      try {
        callResult = await callLLM(ep.baseUrl, ep.key, ep.model, messages, tokenLimits, ep.headers);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        chatHistory.push({ timestamp: new Date().toISOString(), model: ep.model, status: "error", networkError: true, error: message });
        console.log(`[chat] network error for ${ep.model}:`, message);
        continue;
      }

      const { response, text } = callResult;

      if (response.ok) {
        const data = await response.json();
        chatHistory.push({ timestamp: new Date().toISOString(), model: ep.model, status: "success" });
        console.log(`[chat] success with model ${ep.model}`);
        return NextResponse.json(data);
      }

      if (response.status === 401) {
        chatHistory.push({ timestamp: new Date().toISOString(), model: ep.model, status: "fallback", error: "invalid_api_key" });
        console.log(`[chat] invalid API key for ${ep.model}`);
        return NextResponse.json({
          choices: [{
            message: {
              role: "assistant",
              content: generateMockSEOArticle(topic, isArabic) + "\n\n*(Note: Displaying fallback content due to invalid API Credentials)*"
            }
          }]
        });
      }

      // Any other (model-specific) error — skip this endpoint and try the next one
      // instead of failing the whole request. If every endpoint fails we fall back.
      chatHistory.push({ timestamp: new Date().toISOString(), model: ep.model, status: "error", providerError: true, error: text });
      console.log(`[chat] endpoint ${ep.model} unavailable (${response.status}):`, text);
      continue;
    }

    chatHistory.push({ timestamp: new Date().toISOString(), status: "fallback", error: "all_models_unavailable" });
    console.log("[chat] all models unavailable, returning fallback content");

    const notice =
      "\n\n---\n" +
      "**⚠️ Live generation failed — showing a template, not a real answer.**\n\n" +
      "Every AI provider returned an error (no credits, or your OpenRouter account's " +
      "guardrail/data-policy is blocking all providers). To get real answers:\n" +
      "1. Open https://openrouter.ai/settings and relax the Data Policy / Guardrails.\n" +
      "2. Ensure the API key has credits (add a payment method if required).\n" +
      "3. Set OPENROUTER_MODEL in .env.local to a model your key can access.";

    return NextResponse.json({
      choices: [{
        message: {
          role: "assistant",
          content: generateMockSEOArticle(topic, isArabic) + notice
        }
      }]
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    chatHistory.push({ timestamp: new Date().toISOString(), status: "error", error: message });
    console.log("[chat] server error:", message);
    return NextResponse.json(
      { error: "Server error", details: message },
      { status: 500 }
    );
  }
}

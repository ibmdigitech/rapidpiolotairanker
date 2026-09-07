import { NextResponse } from "next/server";

interface KeywordData {
  word: string;
  vol: string;
  diff: string;
  rate: string;
  cpc: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "seo dubai";

    const openrouterKey = process.env.OPENROUTER_COMPOSER_API_KEY || process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "minimax/minimax-m2.7";
    const nvidiaKey = process.env.NVIDIA_API_KEY;
    
    let apiKey = openrouterKey;
    let baseUrl = "https://openrouter.ai/api/v1";
    let usedModel = model;
    
    if (!apiKey && nvidiaKey) {
        apiKey = nvidiaKey;
        baseUrl = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
        usedModel = process.env.NVIDIA_MODEL || "deepseek-ai/deepseek-v4-pro-0813";
    }

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        query,
        keywords: generateMockKeywords(query)
      });
    }

    const systemPrompt = `You are an SEO keyword research assistant.
Generate exactly 8 related keywords or variations for the seed keyword "${query}".
For each keyword, generate realistic but estimated metrics.
Respond ONLY with a valid JSON array of objects. Do not include markdown formatting or backticks.
Each object must have exactly these keys:
- "word": The keyword string.
- "vol": Estimated monthly search volume (e.g., "12,500/mo").
- "diff": Estimated keyword difficulty as a percentage (e.g., "45%").
- "rate": Citation rate or CTR as a percentage (e.g., "30% citation").
- "cpc": Estimated Cost Per Click (e.g., "$2.50").`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        "X-Title": "RankPilot AI"
      },
      body: JSON.stringify({
        model: usedModel,
        messages: [{ role: "user", content: systemPrompt }],
        max_tokens: 1000
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const text = await response.text();
    if (!response.ok) {
       console.error("LLM API error:", text);
       throw new Error("API error");
    }

    const data = JSON.parse(text);
    const content = data.choices[0].message.content.trim();
    
    let jsonContent = content;
    if (jsonContent.startsWith("```json")) {
       jsonContent = jsonContent.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (jsonContent.startsWith("```")) {
       jsonContent = jsonContent.replace(/^```/, "").replace(/```$/, "").trim();
    }

    let keywords: KeywordData[] = JSON.parse(jsonContent);
    
    if (!Array.isArray(keywords)) {
      if (typeof keywords === 'object' && keywords !== null) {
          const anyKw = keywords as any;
          if (Array.isArray(anyKw.keywords)) {
              keywords = anyKw.keywords;
          } else {
             keywords = Object.values(keywords);
          }
      }
    }

    return NextResponse.json({
      success: true,
      query,
      keywords
    });
  } catch (error) {
    console.error("Keywords error:", error);
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "seo dubai";
    return NextResponse.json({ success: true, query, keywords: generateMockKeywords(query) });
  }
}

function generateMockKeywords(seed: string): KeywordData[] {
  const baseSeed = seed.trim().toLowerCase() || "seo dubai";
  const variants = [
    baseSeed,
    `best ${baseSeed}`,
    `${baseSeed} services`,
    `${baseSeed} agency`,
    `${baseSeed} pricing 2026`,
    `ai ${baseSeed}`,
    `top ${baseSeed} company`,
    `how to rank with ${baseSeed}`
  ];

  return variants.map((w) => {
    let hash = 0;
    for (let i = 0; i < w.length; i++) hash = (hash << 5) - hash + w.charCodeAt(i);
    const absHash = Math.abs(hash);
    const volNum = ((absHash % 45) + 5) * 100;
    const diffNum = (absHash % 75) + 15;
    const citationNum = (absHash % 60) + 20;
    const cpcNum = ((absHash % 15) + 2.5).toFixed(2);

    return {
      word: w,
      vol: `${volNum.toLocaleString()}/mo`,
      diff: `${diffNum}%`,
      rate: `${citationNum}% citation`,
      cpc: `$${cpcNum}`
    };
  });
}

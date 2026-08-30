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
    const query = searchParams.get("q") || "";

    // Simulated algorithmic keyword metrics generator based on keyword characteristics
    const generateKeywords = (seed: string): KeywordData[] => {
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
        // Deterministic hash based on string
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
    };

    const keywords = generateKeywords(query);

    return NextResponse.json({
      success: true,
      query,
      keywords
    });
  } catch (error) {
    console.error("Keywords error:", error);
    return NextResponse.json({ error: "Failed to generate keywords" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface FaqItem {
  question: string;
  answer: string;
}

interface SchemaRequestBody {
  items?: FaqItem[];
  topic?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SchemaRequestBody;
    const items = body.items || [];

    if (!items.length) {
      return NextResponse.json(
        { error: "No FAQ items provided" },
        { status: 400 }
      );
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };

    return NextResponse.json({ schema });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Server error", details: message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://rankpilot.ai";

const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard
Disallow: /login
Disallow: /signup

Sitemap: ${baseUrl}/sitemap.xml
`;

export function GET() {
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}

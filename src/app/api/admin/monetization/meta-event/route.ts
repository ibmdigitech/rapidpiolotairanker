import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, eventData, pixelId, accessToken } = body;

    if (!pixelId || !accessToken) {
      return NextResponse.json({ error: "Missing pixelId or accessToken" }, { status: 400 });
    }

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: eventName || "PageView",
              event_time: Math.floor(Date.now() / 1000),
              ...eventData,
              user_data: {
                client_ip_address: request.headers.get("x-forwarded-for") || undefined,
                client_user_agent: request.headers.get("user-agent") || undefined,
              },
            },
          ],
          access_token: accessToken,
        }),
      }
    );

    const result = await response.json();
    return NextResponse.json(result, { status: response.ok ? 200 : response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

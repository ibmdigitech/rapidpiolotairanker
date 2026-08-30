import { NextResponse } from "next/server";
import { chatHistory } from "../chat/route";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ history: chatHistory });
}

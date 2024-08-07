import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET(req: NextRequest) {
  const threadId = req.nextUrl.searchParams.get("threadId");
  const limit = req.nextUrl.searchParams.get("limit");
  const limitNo = limit ? parseInt(limit) : 100;
  if (!threadId || typeof threadId !== "string")
    return NextResponse.json({ message: "Invalid thread id" }, { status: 400 });

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const response = await openai.beta.threads.messages.list(threadId, {
      limit: limitNo,
    });

    return NextResponse.json({ messages: response.data });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

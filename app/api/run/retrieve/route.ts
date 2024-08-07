import { NextRequest, NextResponse} from "next/server";
import OpenAI from "openai";

export async function GET(req: NextRequest){
    const threadId = req.nextUrl.searchParams.get('threadId');
    const runId = req.nextUrl.searchParams.get('runId');
    if (!threadId || typeof(threadId) !== "string") return NextResponse.json({message:"No thread id provided"},{status:400});
    if (!runId || typeof(runId) !== "string") return NextResponse.json({message:"No run id provided"},{status:400});

    const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});

    try {
        const run = await openai.beta.threads.runs.retrieve(threadId, runId);
        return NextResponse.json({run: run});
    } catch (error) {
        NextResponse.json({error: error},{status:500})
    }

}
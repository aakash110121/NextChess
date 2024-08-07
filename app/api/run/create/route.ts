import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req:NextRequest){
    const {threadId, assistantId, additionalInstructions} = await req.json();

    if(!threadId || typeof(threadId) !== 'string') return NextResponse.json({message: "No thread provided"},{status:400});
    if(!assistantId || typeof(assistantId) !== 'string') return NextResponse.json({message: "No assistant provided"},{status:400});
    if(additionalInstructions && typeof(additionalInstructions) != 'string') return NextResponse.json({message:'Wrong additional instructions format'}, {status:400})

    const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
    
    try {
        const run = await openai.beta.threads.runs.create(threadId,
        {
            assistant_id: assistantId,
            additional_instructions: additionalInstructions ? additionalInstructions : '',
            max_completion_tokens: 120,
        });

        // console.log({run: run});

        return NextResponse.json({run: run});
    } catch (error) {
        return NextResponse.json({message: error}, {status:500});
    }
}
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest){
   const {message, threadId, fen, moveNumber, evaluation} = await req.json();
   
   if(!message || typeof(message) !== "string") 
    return NextResponse.json({message: "Invalid message"},{status:400});
   
   if(!threadId || typeof(threadId) !== "string") 
    return NextResponse.json({message: "Invalid thread id"},{status:400});
   // console.log("METADATA: ", fen, " ", moveNumber, " ", evaluation);
   const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
   try {
    const threadMessage = await openai.beta.threads.messages.create(threadId,{
        role: "user",
        content: message,
        metadata: {
            fen:fen,
            moveNumber:String(moveNumber),
            evaluation:String(evaluation),
        }
    });

    return NextResponse.json({message: threadMessage});
   } catch (error) {
    // console.log("ERRROR: ",error);
    return NextResponse.json({message: 'Error'}, {status: 500})
   }

   
}
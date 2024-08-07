import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(){
      const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
       
      try {
        const thread = await openai.beta.threads.create();
        return NextResponse.json({thread:thread});
      } catch (error) {
        return NextResponse.json({message: `An error occured ${error}`}, {status:400});
      }
}
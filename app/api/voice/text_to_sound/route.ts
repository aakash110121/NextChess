import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";


export async function GET(req:NextRequest){
      const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
      const text = req.nextUrl.searchParams.get('text');
      const voice = req.nextUrl.searchParams.get('voice');

      if(!text || typeof(text)!=='string') return NextResponse.json({error:'No text provided'});
      if(!voice) return NextResponse.json({error:'No voice provided'});
      if(["alloy", "echo", "fable", "onyx", "nova", "shimmer"].includes(voice) == false) return NextResponse.json({error:'Incorrect voice name'});

      try {
        const response = await openai.audio.speech.create({
            model:'tts-1',
            //@ts-ignore We've already checked if the voice is one of the offered voices ('alloy','echo', etc...);
            voice:voice,
            input:text
        })
        
        const audioData = await response.arrayBuffer();
        return NextResponse.json(Buffer.from(audioData));
        
      } catch (error) {
        return NextResponse.json({message: `An error occured ${error}`}, {status:400});
      }
}
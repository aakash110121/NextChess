import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/auth/FirebaseCredentials';
import { millisecondsToText } from "@/lib/calculateMilliseconds";
import { MAX_NUMBER_UNFINISHED_GAMES } from "@/appLimits";

export async function POST(req:NextRequest){
      const {userId} = await req.json();
      if(!userId || typeof(userId) !== 'string') return NextResponse.json({message: "No user id provided"},{status:400});
      
      
      const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
       
      try {
        const thread = await openai.beta.threads.create();
        return NextResponse.json({thread:thread});
      } catch (error) {
        return NextResponse.json({message: `An error occured ${error}`}, {status:400});
      }
}
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/auth/FirebaseCredentials';
import { millisecondsToText } from "@/lib/calculateMilliseconds";
import { MAX_NUMBER_UNFINISHED_GAMES } from "@/appLimits";

export async function POST(req:NextRequest){
      const {userId} = await req.json();
      if(!userId || typeof(userId) !== 'string') return NextResponse.json({message: "No user id provided"},{status:400});
      
      const userRef = doc(db, "UserProfile", userId);
      let userData = null;
      
      try {
         const profile = await getDoc(userRef);
         userData = profile.data();
      } catch {
        return NextResponse.json({error: "Error trying to retrieve user"}, {status:400});
      }

      if(userData?.hasOwnProperty('NotFinishedGames') && userData?.NotFinishedGames>=MAX_NUMBER_UNFINISHED_GAMES){
          return NextResponse.json({error:"To many unfinished games", text: "To many incompleted games"}, {status:403});
      }

      if(!userData?.subscription && userData?.lastGameCreated){
          const currentTime = new Date().getTime();
          const MILLISECONDS_IN_TWO_DAYS = 2 * 24 * 60 * 60 * 1000; // Number of milliseconds in 2 days
          if(currentTime-userData?.lastGameCreated<MILLISECONDS_IN_TWO_DAYS){
            return NextResponse.json(
              { message: "Less than 2 days since last attempt", text: millisecondsToText(currentTime-userData?.lastGameCreated) },
              { status: 402 }
             );
          }
      }

      const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
       
      try {
        const thread = await openai.beta.threads.create();
        if(!userData?.subscription){
          await setDoc(userRef, {
            lastGameCreated: new Date().getTime(),
            ...(userData?.hasOwnProperty("NotFinishedGames") ? { NotFinishedGames: userData.NotFinishedGames+1 } : {NotFinishedGames: 1}),
          }, {
            merge:true,
          })
        }
        else{
          await setDoc(userRef, {
            ...(userData?.hasOwnProperty("NotFinishedGames") ? { NotFinishedGames: userData.NotFinishedGames+1 } : {NotFinishedGames: 1}),
          }, {
            merge:true,
          })
        }
        return NextResponse.json({thread:thread});
      } catch (error) {
        return NextResponse.json({message: `An error occured ${error}`}, {status:400});
      }
}
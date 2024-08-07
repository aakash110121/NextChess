import { account_overview } from "@/utils/AssistantCreationFunctions/account_overview";
import { createChatAssistantPromptNewMay24 } from "@/utils/AssistantCreationFunctions/create_custom_assistant_new";
import { getChesscomStatsv2 } from "@/utils/AssistantCreationFunctions/getChesscomStatsv2";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET(req: NextRequest, res:NextResponse){
    // console.log('Received a request with the following search parameters:', Array.from(req.nextUrl.searchParams.entries()));

  // Extract the 'username' parameter from the query string
    const username_chess_com = req.nextUrl.searchParams.get('username');
    // console.log(`Retrieving chess statistics for the user.`);
    
    if (!username_chess_com) {
        console.error('No username provided. Exiting with an error response.');
        throw new Error(`No username provided!`);
    }

    let AccOverview = req.nextUrl.searchParams.get('acc_overview');
    if(!AccOverview){
        console.error('No overview string provided...');
    }

  const idToken = process.env.OPENAI_API_KEY;
  // console.log('Retrieved API Key from environment variables:', idToken ? `API Key: ${idToken}` : 'API Key not available');

  if (!idToken) {
    console.error('No API Key provided. Exiting with an error response.');
    throw new Error(`No API Key provided!`);
  }

  const openai = new OpenAI({apiKey:idToken});
   try{
    const stats = await getChesscomStatsv2(username_chess_com); 
    if (stats?.error) {
      const error_msg = `Error in getChesscomStatsv2: ${stats.error}`;
      throw new Error(error_msg);
    }
  
    //dont need this since we will get rating from playing assistant creation

   //const user_avg_rating = Math.round(Math.max(
   //   parseFloat(stats.chess_rapid_last_rating),
   //    parseFloat(stats.chess_blitz_last_rating),
   //   parseFloat(stats.chess_bullet_last_rating)
   // ) / 100) * 100;
      
    if(!AccOverview){
        AccOverview = await account_overview(username_chess_com);
    }
    // Generating account overview text
    // console.log(`Generating account overview for ${username_chess_com}.`);
    const chessalyze_text = `\n\n\n#####Account analysis details for ${username_chess_com}'s Chess.com account: \n${AccOverview}`;
    // console.log(`Account overview generated for ${username_chess_com}.`);

    // Creating a custom assistant
    // console.log(`Creating custom assistant for ${username_chess_com}.`);
    const instruction = createChatAssistantPromptNewMay24(username_chess_com, stats, chessalyze_text);
    // console.log("WHOLE INSTRUCTION \n :",instruction);
    try {
      
        const assistant = await openai.beta.assistants.create({
          instructions: instruction,
          name: `Chessy | ${username_chess_com}'s personal chess chat coach`,
          model:'gpt-4o'  
        });
    
        // console.log(assistant);
    
        return NextResponse.json({assistant: assistant.id, instructions: instruction});
      } catch (e) {
        // console.log(e);
        return NextResponse.json({ error: e });
      }
  } catch (error) {
    console.error('Error occurred during fetch operation or processing response:', error);
    return NextResponse.json({ error: `Fetch or processing error: ${error}` });
  }
}
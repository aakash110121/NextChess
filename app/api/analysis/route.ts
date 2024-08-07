import { NextRequest, NextResponse } from "next/server";
import { analyzeChessMoveV3 } from "@/lib/messagePrompt";


export async function GET(req: any) {
  // Logging all search parameters for clarity
  // // console.log('Received a request with the following search parameters:', Array.from(req.nextUrl.searchParams.entries()));

  // Extract the 'username' parameter from the query string
  const { searchParams } = new URL(req.url);
  const input_data = decodeURIComponent(searchParams.get('input_data') || '');
  const after_last_move_stockfish_str = searchParams.get('after_last_move_stockfish') || '{}';
  const after_second_to_last_move_stockfish_str = searchParams.get('after_second_to_last_move_stockfish') || '{}';
  
  const after_last_move_stockfish = JSON.parse(decodeURIComponent(after_last_move_stockfish_str));
  const after_second_to_last_move_stockfish = JSON.parse(decodeURIComponent(after_second_to_last_move_stockfish_str));

  console.log("Input data: ", input_data);
  console.log("STOCKFISH 1: ", after_second_to_last_move_stockfish_str);
  console.log("STOCKFISH 2: ", after_last_move_stockfish);
  // Log the actual value of 'username', or indicate its absence
  
  // Check if the 'username' parameter is provided
  if (!input_data) {
    console.error('No input data provided. Exiting with an error response.');
    return NextResponse.json({ error: 'No username provided' }, { status: 400 });
  }

  // Retrieving and logging the API key or its absence

  // console.log('Initiating fetch request to the external API.');
  const response = await analyzeChessMoveV3(input_data, 
        after_last_move_stockfish, 
        after_second_to_last_move_stockfish,
        true, true, true, true, true, true, true, true, true, true, true, true);

      // Log the successful JSON response with its content for better debugging
  // console.log('Successfully received and parsed the JSON response:');
  // console.log("INPUT DATA: ", input_data)
  // console.log("AFTER LAST MOVE STOCKFISH: ", after_last_move_stockfish);
  // console.log("AFTER SEC TO L M STOCKFISH: ", after_second_to_last_move_stockfish)

  return NextResponse.json(response);
}
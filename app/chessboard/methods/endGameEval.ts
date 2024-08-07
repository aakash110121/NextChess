//-----------------NOT IN USE-----------------------------------

import { Chess } from "chess.js";

async function get_stockfish_evaluation(gameFen: string){
    // console.log("Getting stockfish score for the best move on board ", gameFen, " ...");
    const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(gameFen)}&depth=8`, {
      method: 'GET',
      cache: 'no-store'
    });

    if (response.ok) {
        const { success, evaluation, mate } = await response.json();
        // console.log("Response v1: ", evaluation);
        if (success) {
          if(mate){
            if (typeof(mate) === "string") {
              // If myValue is a string, parse it to a number
              return parseFloat(mate)*1000;
            } else if(typeof(mate)==='number') {
              // If myValue is already a number, use it directly
              return mate*1000;
            }
          }
          return evaluation;
        } else { 
          return null;
        }
        
      } else {

        console.error(`Error: ${response.statusText}`);
        return null;
      }
}

const get_tailwind_string = (evaluation: any) => {
   if(!evaluation){
    return 'bg-white';
   }

   if (evaluation >= -0.2) {
    // console.log("Move classification: excellent");
    return 'bg-[#850F8D]'
   } else if (evaluation < -0.2 && evaluation >= -1) {
    // console.log("Move classification: good");
    return 'bg-[#06D001]'
  } else if (evaluation < -1 && evaluation >= -2.5) {
    // console.log("Move classification: inaccuracy");
    return 'bg-[#FFDB00]'
  } else if (evaluation < -2.5 && evaluation >= -4.5) {
    // console.log("Move classification: mistake");
    return 'bg-[#CF0000]'
  } else {
    // console.log("Move classification: blunder");
    return 'bg-black'
   }
}

async function get_move_evaluation(beforeMoveFen: string, afterMoveFen: string){
   // console.log("bef move fen: ", beforeMoveFen);
   const moveTurnColor = beforeMoveFen.split(' ')[1]
   const evalBeforeMove = await get_stockfish_evaluation(beforeMoveFen);
   const evalAfterMove = await get_stockfish_evaluation(afterMoveFen);
   let pointsGained = null;
   if(evalBeforeMove && evalAfterMove){
    pointsGained = moveTurnColor == 'w' ? evalAfterMove - evalBeforeMove : evalBeforeMove - evalAfterMove;
   }
   return pointsGained;
}

export async function analyze_user_moves(fen_array:string[], user_color:string){
    const timeStart = Date.now();
    let startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    let evaluationByMoveArray=[];
    if(user_color=='w'){
        for(let i=0; i<fen_array.length; i++){
            if(i%2==0){
                if(i==0){
                    const evaluation= await get_move_evaluation(startingFen, fen_array[0]);
                    evaluationByMoveArray.push(get_tailwind_string(evaluation));
                } 
                else if(i==fen_array.length-1){ //STOCKFISH WONT WORK FOR CHECKMATE FEN
                    evaluationByMoveArray.push(get_tailwind_string(-0.5));
                }
                else{
                    const evaluation = await get_move_evaluation(fen_array[i-1], fen_array[i]);
                    evaluationByMoveArray.push(get_tailwind_string(evaluation));
                }
            }
        }
    }
    else{
        for(let i=0; i<fen_array.length; i++){
          if(i%2==1){
               if(i==fen_array.length-1){ //STOCKFISH WONT WORK FOR CHECKMATE FEN
                 evaluationByMoveArray.push(get_tailwind_string(-0.5));
               }
               else{
               const evaluation =await get_move_evaluation(fen_array[i-1], fen_array[i]);
               evaluationByMoveArray.push(get_tailwind_string(evaluation));
               }
           }
        }
    }
    const timeEnd = Date.now() - timeStart;
    // console.log(`It took ${timeEnd/1000} seconds to execute this no1 analysis function`);

    // console.log("Evaluation by move: ", evaluationByMoveArray.map(evaluation=>evaluation).join(', '))
    return evaluationByMoveArray;
}
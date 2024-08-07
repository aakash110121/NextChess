import { Chess } from "chess.js";


const get_tailwind_string = (evaluation: any) => {
   if(typeof(evaluation)!=='number'){
    console.log("NOT NUMBER EVAL: ",evaluation);
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

function getMoveEval(move_eval: any){
  // console.log("MOVE EVAL: ", move_eval);
  if(move_eval.mate){
    if (typeof(move_eval.mate) === "string") {
      // If myValue is a string, parse it to a number
      return parseFloat(move_eval.mate)*1000;
    } else if(typeof(move_eval.mate)==='number') {
      // If myValue is already a number, use it directly
      return move_eval.mate*1000;
    }
  }
  else return move_eval.evaluation;
}

function get_move_evaluation(before_move_eval: any, after_move_eval: any, user_color:string){
   const evalBeforeMove = getMoveEval(before_move_eval);
   const evalAfterMove = getMoveEval(after_move_eval);
   let pointsGained = null;
   // console.log("HERE WE ARE: ", evalBeforeMove, " ", evalAfterMove);
    if(evalBeforeMove>=1000 && evalAfterMove>=1000){ //WHITE CONTINUES MATING SEQUENCE
      if(user_color=='w'){
        pointsGained=-0.2;
      }
      else{
        pointsGained=-0.5;
      }
    }
    else if(evalBeforeMove<=-1000 && evalAfterMove<=-1000){ //BLACK CONTINUES MATING SEQUENCE
      if(user_color=='w'){
        pointsGained=-0.5;
      }
      else{
        pointsGained=-0.2;
      }
    }
    else if(evalBeforeMove<=-1000 && evalAfterMove>-1000){ //BLACK FALLS OUT OF A MATING SEQUENCE
      if(user_color=='w'){
        pointsGained=10;
      }
      else{
        pointsGained=-10;
      }
    }
    else if(evalBeforeMove>=1000 && evalAfterMove<1000){//WHITE FALLS OUT OF A MATING SEQUENCE
      if(user_color=='w'){
        pointsGained=-10;
      }
      else{
        pointsGained=10;
      }
    }
    else if(evalAfterMove<=-1000){ //BLACK ENTERS MATING SEQUENCE
      console.log("BLACK ENTERS MATING SEQUENCE");
       if(user_color=="w"){
        pointsGained=-10;
       }
       else{
        pointsGained=10;
       }
    }
    else if(evalAfterMove>=1000){ //WHITE ENTERS MATING SEQUENCE
      console.log("WHITE ENTERS MATING SEQUENCE");
      if(user_color=="w"){
        pointsGained=10;
       }
       else{
        pointsGained=-10;
       }
    }
    else if(typeof(evalBeforeMove)=='number' && typeof(evalAfterMove)=='number'){
      pointsGained = user_color == 'w' ? evalAfterMove - evalBeforeMove : evalBeforeMove - evalAfterMove;
    }

   
   return pointsGained;
}

export async function analyze_user_moves(stockfish_data:any[], user_color:string, fenArray:string[], movesPlayed: string[]){
    const fenStrings = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', ...fenArray];
    const timeStart = Date.now();
    let starting_eval = {bestmove: 'e2e4', mate: null, continuation: "e2e4 e7e6 c2c4 c7c5 g1f3 d8c7 d2d4 c5d4 f3d4 g8f6 b1c3 b8c6", evaluation: 0.66};
    let evaluationByMoveArray=[];
    let movesEval = [];
    let stockfishData = stockfish_data;
    // console.log("stockfish data: ", stockfish_data);
    if(user_color == 'w'){
      stockfishData = [starting_eval, ...stockfishData];
    }
    // console.log("Stockfish DATA: ", stockfishData);
    const listOfObjects:any[] = [];
    for(let i=0; i<stockfishData.length; i++){
      if(stockfishData.length-1==i){
        // console.log("FINAL FEN DOESNT HAVE AN EVALUATION: ", fenStrings[i]);
        //listOfObjects.push({FEN_pre_move: fenArray[i], stockfish_analysis: 'No stockfish data since this', move_played: })
        //movesEval.push(0.0);
        //evaluationByMoveArray.push(get_tailwind_string(-0.5));
      }
      else{
           const evaluation =get_move_evaluation(stockfishData[i], stockfishData[i+1], i%2==0? 'w' : 'b');
           listOfObjects.push({FEN_pre_move: fenStrings[i], stockfish_analysis: stockfishData[i], move_played: movesPlayed[i], move_eval: evaluation})
           movesEval.push(evaluation);
           evaluationByMoveArray.push(get_tailwind_string(evaluation));
           if(get_tailwind_string(evaluation) == 'bg-white'){
            console.log("MOVE EVAL: ", evaluation);
            console.log("STOCKFISH PRE: ", stockfishData[i]);
            console.log("STOCKFISH POST: ", stockfishData[i+1]);
           }
      }
    }
    evaluationByMoveArray = evaluationByMoveArray.filter((itm: any, idx:number)=>user_color=='w' ? idx%2==0 : idx%2!==0)
    const timeEnd = Date.now() - timeStart;
    // console.log(`It took ${timeEnd/1000} seconds to execute this no1 analysis function`);
    // console.log("LIST OF MOVE OBJECTS: \n", listOfObjects);
    // console.log("Evaluation by move: ", movesEval.filter((itm: any, idx:number)=>user_color=='w' ? idx%2==0 : idx%2!==0).join(', '))
    return evaluationByMoveArray;
}


//ELO CALCULATOR

interface CPLResult {
  acpl: number,
  nMoves: number,
}

function computeCpl(stockfish_data:any[], user_color:string): CPLResult {
  let starting_eval = {bestmove: 'e2e4', mate: null, continuation: "e2e4 e7e6 c2c4 c7c5 g1f3 d8c7 d2d4 c5d4 f3d4 g8f6 b1c3 b8c6", evaluation: 0.66};
  let stockfishData = stockfish_data;
  if(user_color == 'w'){
    stockfishData = [starting_eval, ...stockfishData];
  }
  
  let movesEval:number[] = [];
  for(let i=0; i<stockfishData.length; i++){
    if(stockfishData.length-1==i){
      // console.log("FINAL FEN DOESNT HAVE AN EVALUATION: ", fenStrings[i]);
      //listOfObjects.push({FEN_pre_move: fenArray[i], stockfish_analysis: 'No stockfish data since this', move_played: })
      //movesEval.push(0.0);
      //evaluationByMoveArray.push(get_tailwind_string(-0.5));
    }
    else{
         const evaluation =get_move_evaluation(stockfishData[i], stockfishData[i+1], i%2==0? 'w' : 'b');
         if(evaluation && (evaluation>100 || evaluation<-100)){
          console.log("EVAL = ", evaluation, "\n");
          console.log("EVAL > 100 ", stockfishData[i], "\n", stockfishData[i+1]);
         }
         movesEval.push(evaluation ? evaluation*100 : 0);
    }
  }

  movesEval = movesEval.filter((itm: any, idx:number)=>user_color=='w' ? idx%2==0 : idx%2!==0);
  console.log("MOVES EVALUATIONS ARR: ", movesEval);
  console.log("MOVES EVAL SUM: ", movesEval.reduce((a,b)=>a+b,0));
  console.log("AVERAGE CPL : ", movesEval.reduce((a,b)=>a+b,0)/movesEval.length);
  let averageCplPlayer = Math.ceil(movesEval.reduce((a, b) => a+b, 0) / movesEval.length)
  averageCplPlayer = -averageCplPlayer;
  console.log("AVERAGE CPL PLAYER: ", averageCplPlayer);
  return {acpl: averageCplPlayer, nMoves: movesEval.length}
}

export function estimateElo(stockfish_data: any[], user_color: string): number {
  const {acpl, nMoves} = computeCpl(stockfish_data, user_color);
  if (acpl > 500) {
      return 100;
  }

  const e = 2.71828;
  const estimate = 3000 * (Math.pow(e, -0.01 * acpl)) * (Math.sqrt(nMoves / 50));
  const estELO = Math.ceil(estimate / 100) * 100;
  console.log("ESTIMATED ELO: ", estELO);
  return estELO;
}
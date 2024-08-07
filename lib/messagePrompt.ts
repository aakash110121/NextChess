import { Chess, Color, Move, Square, validateFen } from "chess.js";
import { chess_openings_library } from "@/lib/openings_library";
import axios from "axios";
import {Chess as ChessTemp} from './chessClass'
import Board from "@/components/Board";

export function build_prompt(fen: string, pgn: string, print_output: string, question: string, prompt_template: string){
let prompt = "###Task: Analyze the given chess position in the pgn by following the step-by-step process below and directly answer the question with supporting rationale.\n\n";
    prompt+= `###PGN: ${pgn}\n\n`;
    prompt+= `###Question: ${question}\n\n`;
    //prompt+= `${prompt_template}\n\n`;
    prompt += "###Step-by-step analysis: Follow the decision-making process outlined below, utilizing the provided position analysis details below:\n\n"
    
    prompt += "###1. Assess and understand the position:\n"
    prompt += "   - Review the 'concise_state' to understand the current board state.\n"
    prompt += "   - Check the 'pawn_structure' to evaluate pawn weaknesses and strengths.\n"
    prompt += "   - Consider the 'control' to understand which side controls key squares and files.\n\n"
    prompt += "   - Consider the 'evaluation' to gauge the overall assessment of the position.\n"

    prompt += "###2. Identify areas of tension, threats, and opportunities:\n"
    prompt += "   - Assess the 'tension' to identify potential threats and opportunities for the relevant peices.\n"
    prompt += "   - Utilize the 'mobility' to understand space advantages and potential options for dealing with tension / escaping threats.\n"

    prompt += "###3. Evaluate the best move and understand the rationale based on all of the provided analyses:\n"
    prompt += "   - Review the 'best_move_analysis' to understand the classification and reasoning behind the best move.\n"
    prompt += "   - Compare the 'best_move' with the played move using the 'move_comparison' field.\n"

    prompt += "###4. Provide a response that directly answers the users question with supporting rationale:\n"
    prompt += "   - Combine the insights from the position assessment, threats, opportunities, and best move evaluation\n"
    prompt += "   - Address the user directly, using phrases like 'You' and 'Your rook on a8.'\n"
    prompt += "   - Answer format: After following the comprehensive decision-making process based on the question, provide a clear, accurate, 2-3 sentence answer that directly answers the question and provides logical supporting rationale."
    prompt+= `###Position analysis details:\n${print_output}\n\n`;

    return prompt;
}

const PieceDict = {
    p:'Pawn',
    b:'Bishop',
    n:'Knight',
    r:'Rook',
    q:'Queen',
    k:'King',
} 

export function fen_to_board_state_concise(fen:string){
    const piece_symbols: { [key: string]: string }= {
      'r': 'black rooks', 
      'n': 'black knights',
      'b': 'black bishops',
      'q': 'black queens',
      'k': 'black king',
      'p': 'black pawns',
      'R': 'white rooks',
      'N': 'white knights',
      'B': 'white bishops',
      'Q': 'white queens',
      'K': 'white king',
      'P': 'white pawns',
    }

    if (!fen || fen.split(' ')[0].split('/').length !== 8){
        return "Invalid FEN: incorrect board layout. ";
    }

    let piece_counts: { [key: string]: number } = {};
    const descriptions: { [key: string]: string[] } = {};
    Object.values(piece_symbols).forEach((value: string) =>{
       piece_counts[value] = 0;
       descriptions[value] = [];
    });

    // Process each square on the board.
    fen.split(' ')[0].split('/').forEach((row, rowIndex) => {
        let colIndex = 0;
        for (const char of row) {
            if (!isNaN(parseInt(char))) {
                colIndex += parseInt(char); // Skip empty squares.
            } else if (char in piece_symbols) {
                const pieceName = piece_symbols[char];
                const position = String.fromCharCode(97 + colIndex) + (8 - rowIndex).toString();
                piece_counts[pieceName]++;
                descriptions[pieceName].push(position);
                colIndex++;
            } else {
                return "Invalid FEN: Contains invalid characters.";
            }
        }
    });

    // Construct the description string.
    const descriptionParts: string[] = ["# Chess Board state by square:"];

    // Separate descriptions for black and white pieces.
    ["black", "white"].forEach(color => {
        descriptionParts.push(`## ${color.charAt(0).toUpperCase() + color.slice(1)} pieces:`);
        Object.entries(piece_symbols).forEach(([piece, name]) => {
            if (name.includes(color) && descriptions[name].length > 0) {
                const positions = descriptions[name].sort((a, b) => (a[1] === b[1] ? a[0].localeCompare(b[0]) : a[1].localeCompare(b[1]))).join(', ');
                const count = piece_counts[name];
                const pieceDescription = count > 1 ? `${count} ${name}` : name.slice(0, -1);
                descriptionParts.push(`- ${pieceDescription.charAt(0).toUpperCase() + pieceDescription.slice(1)} on ${positions}`);
            }
        });
    });

    return descriptionParts.join('\n');
}

export function fen_to_board_state_long(fen:string){
    const piece_symbols: { [key: string]: string }= {
        'r': 'black rooks', 
        'n': 'black knights',
        'b': 'black bishops',
        'q': 'black queens',
        'k': 'black king',
        'p': 'black pawns',
        'R': 'white rooks',
        'N': 'white knights',
        'B': 'white bishops',
        'Q': 'white queens',
        'K': 'white king',
        'P': 'white pawns',
        '.': 'no piece',
      }
  
    if (!fen || fen.split(' ')[0].split('/').length !== 8){
          return "Invalid FEN: incorrect board layout. ";
    }

    let piece_counts: { [key: string]: number } = {};
    const descriptions: { [key: string]: string[] } = {};
   
    Object.values(piece_symbols).forEach((value: string) =>{
       piece_counts[value] = 0;
       descriptions[value] = [];
    });

   // Validate FEN structure
   const parts = fen.split(' ');
   if (!fen || parts[0].split('/').length !== 8) {
       return "Invalid FEN: Incorrect board layout.";
   }

   // Initialize the description list
   const descriptionParts: string[] = ["# Board state: The chess board state at this position by square:"];

   // Parse the FEN string to describe each square
   const rows = parts[0].split('/');
   rows.forEach((row, rowIndex) => {
       let expandedRow = '';
       for (const char of row) {
           if (!isNaN(Number(char))) {
               expandedRow += '.'.repeat(Number(char));  // Replace numbers with dots for empty squares
           } else {
               expandedRow += char;
           }
       }
       for (let colIndex = 0; colIndex < expandedRow.length; colIndex++) {
           const pieceSymbol = expandedRow[colIndex];
           const pieceName = piece_symbols[pieceSymbol];
           const squareName = String.fromCharCode(97 + colIndex) + (8 - rowIndex).toString();
           descriptionParts.push(`##${squareName}: ${pieceName}`);
       }
   });

   return descriptionParts.join('\n');

}

function formatItemList(items: any[]): string {
    // console.log(`Formatting item list: ${items}`);
    if (items.length === 0) {
        // console.log("List is empty, returning empty string");
        return "";
    }

    if (items.length === 1) {
        if (Array.isArray(items[0])) {
            const [piece, square] = items[0];
            // console.log(`List has only one item: ${piece} on ${square}, returning ${piece} on ${square}`);
            return `${piece} on ${square}`;
        } else {
            // console.log(`List has only one item: ${items[0]}, returning ${items[0]}`);
            return items[0];
        }
    }

    const formattedItems = items.map(item => {
        if (Array.isArray(item)) {
            const [piece, square] = item;
            return `${piece} on ${square}`;
        } else {
            return item;
        }
    });

    if (formattedItems.length === 2) {
        // console.log(`Formatted items: ${formattedItems[0]} and ${formattedItems[1]}`);
        return `${formattedItems[0]} and ${formattedItems[1]}`;
    }

    // console.log(`Formatted items: ${formattedItems.slice(0, -1).join(', ')}, and ${formattedItems[formattedItems.length - 1]}`);
    return `${formattedItems.slice(0, -1).join(', ')}, and ${formattedItems[formattedItems.length - 1]}`;
}

export async function get_best_move(game: Chess){
    //const game = new Chess(gameFen);
    const gameFen = game.fen();
    // console.log("Getting best move for board ", gameFen, " ...");
    const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(gameFen)}&depth=13&mode=bestmove`, {
      method: 'GET',
      cache: 'no-store'
    });

    if (response.ok) {
        const { success, bestmove } = await response.json();
        const data = bestmove;
        // console.log("Response v1: ", data);
        if (success) {
          const bestMoveForPrompt = data.split(' ')[1];
          return bestMoveForPrompt;
    
        } else { 
          return game.moves({verbose:true})[0].lan;
        }
        
      } else {

        console.error(`Error: ${response.statusText}`);
        return game.moves({verbose:true})[0].lan;
      }
}

export async function get_stockfish_evaluation(gameFen: string){
    const game = new Chess(gameFen);
    // console.log("Getting stockfish score for the best move on board ", game.fen(), " ...");
    const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(game.fen())}&depth=13`, {
      method: 'GET',
      cache: 'no-store'
    });

    if (response.ok) {
        const { success, evaluation } = await response.json();
        const data = evaluation;
        // console.log("Response v1: ", data);
        if (success) {
          return `Eval: ${evaluation}`;
        } else { 
          return null;
        }
        
      } else {

        console.error(`Error: ${response.statusText}`);
        return null;
      }
}

export function get_board_pgn_from_history(history:string[]){
    let pgnArray = "";
    if(history){
        history.forEach((value: string, idx: number) => { 
          if(idx % 2 == 0){
            pgnArray+=`${idx>0 ? idx/2+1 : 1}. `;
          }
          if(idx+1 == history.length){
          pgnArray+=`${value}`;
          }
          else pgnArray+=`${value} `;
        })
    }
    return pgnArray;
}

function get_board_pgn(game:Chess){
    const history = game.history();
    let pgnArray = "";
    if(history){
        history.forEach((value: string, idx: number) => { 
          if(idx % 2 == 0){
            pgnArray+=`${idx>0 ? idx/2+1 : 1}. `;
          }
          if(idx+1 == history.length){
          pgnArray+=`${value}`;
          }
          else pgnArray+=`${value} `;
        })
    }
    return pgnArray;
}

function is_an_opening(pgnArray:string, return_name_and_desc:boolean=true){
   const opening = chess_openings_library.find(element => element.pgn == pgnArray);
   if(return_name_and_desc){
    if (!opening) {
        // console.log("No matching opening found");
        return {opening_name: null, opening_description: null}
    }
    else{
        // console.log(`Found opening: ${opening.name}`);
        return {opening_name: opening.name, opening_description: opening.name}
    }
   }
   else{
    if(!opening){
        // console.log("No matching opening found");
        return false;
    }
    else{
        // console.log("Matching opening found");
        return true;
    }
   }
}



async function evaluate(game: Chess, returnMateN: boolean = false) {
 

    try {
        const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(game.fen())}&depth=13`, {
          method: 'GET',
          cache: 'no-store'
        });
    
        if (response.ok) {
            const { success, evaluation, mate } = await response.json();
            const data = evaluation;
            // console.log("Response v1: ", data);
            if (mate) {
             if(typeof(mate) == 'string'){
                {/*const n = Math.abs(parseInt(mate));
                if(game.turn()=='w'){
                    return returnMateN ? [-10000, n] : [-10000];
                }
                else {
                    return returnMateN ? [10000, n] : [10000];
                }*/}
                const n = parseInt(mate);
                if(n<0){
                  return returnMateN ? {score:-10000, mateIn:-1*n} : {score: -10000}
                }
                else{
                  return returnMateN ? {score: 10000, mateIn: n} : {score:10000}
                }
             }
             else {
                // console.log(`Unexpected 'mate' value: ${mate}`);
                return returnMateN ? {score: 0, mateIn: 0} : {score:0};
             }
            } else {
                let score:number = evaluation;
                return returnMateN ? {score:score, mateIn:0} : {score:score};
            }
            
         } else {
    
            // console.log(`Error: Received status code ${response.status}`);
            return returnMateN ? {score:0, mateIn:0} : {score:0};
        }
    } catch (error) {
        // console.log(`Failed to parse API response: ${error}`);
        return returnMateN ? {score:0, mateIn:0} : {score:0};
    }
  }

async function calculate_points_gained_by_move(game: Chess, move: any, ...kwargs: any[]) {
    // console.log(`Calculating points gained by move ${move}...`);
  
    const previousScore = (await evaluate(game)).score;
    // console.log(`Previous score: ${previousScore}`);
  
    const positionAfterMove = new Chess(game.fen());
    // console.log(`Creating a copy of the board: ${game.fen()}`);
    const newMove = positionAfterMove.move(move);
    // console.log(`Pushed move ${newMove.san}, new position: ${positionAfterMove.fen()}`);
  
    const results = await evaluate(positionAfterMove, true);
    const {score: currentScore, mateIn} = results;
    // console.log(`Current score: ${currentScore}, mate in ${mateIn} moves`);
  
    let pointsGained: number;
  
     //<<prompt_optimization>> I WAS CONFUSED BY THIS ONE, I THOUGHT IT WASNT QUITE ACCURATE BEFORE SO I MADE SOME CHANGES HERE
     //I THINK THE PROBLEM COULD BE THAT IN THE ORIGINAL CODE EVERYTHING'S VIEWED FROM THE WHITE's PERSPECTIVE
        if (previousScore !== 10000 && currentScore === 10000) {
            // console.log(`White mates in ${mateIn} moves`);
            return {mateIn, class:`white mates ${mateIn}`};
        } else if (previousScore === 10000 && currentScore === 10000) {
            // console.log(`White continues checkmate sequence, Black gets mated in ${mateIn} moves`);
            return {mateIn, class:`white continues mate ${mateIn}`}
        } else if (previousScore === 10000 && currentScore !== 10000) {
            // console.log("White lost a checkmate sequence");
            return {mateIn, class:`white lost mate`}
        } else if (previousScore !== -10000 && currentScore === -10000) {
            // console.log(`Black mates in ${mateIn} moves`);
            return {mateIn, class:`black mates ${mateIn}`}
        } else if (previousScore === -10000 && currentScore === -10000) {
           // console.log(`Black continues checkmate sequence, White gets mated in ${mateIn} moves`);
           return {mateIn, class:`black continues mate ${mateIn}`}
        } else if (previousScore === -10000 && currentScore !== -10000) {
            // console.log(`Black mates in ${mateIn} moves`);
            return {mateIn, class:`black lost mate`}
        }
  
        pointsGained = game.turn() == 'w' ? currentScore - previousScore : previousScore - currentScore; //THIS
        // console.log(`Points gained: ${pointsGained}`);
  
  
    return pointsGained;
  }

function calculate_score(stockfish_data:any, returnMateN:boolean= false){
   
    if (stockfish_data.mate) {
      if (typeof stockfish_data.mate == "string") {
        const n = parseInt(stockfish_data.mate);
        if (n < 0) {
           return returnMateN ? {score:-10000, mateIn:-1*n} : {score: -10000}
        } else {
            return returnMateN ? {score:10000, mateIn:1*n} : {score: 10000}
        }
      } else {
        // console.log(`Unexpected 'mate' value: ${stockfish_data.mate}`);
        return returnMateN ? {score:0, mateIn:0} : {score: 0}
      }
    } else {
        return returnMateN ? {score:stockfish_data.evaluation, mateIn:null} : {score: stockfish_data.evaluation}
    }
    
}
//SAME AS 'calculate_points_gained_by_move' EXCEPT IT DOESNT CALL STOCKFISH API BUT USES ALREADY EXISTING DATA
function calculate_points_gained(pre_move_data: any, post_move_data:any, move:string, game:Chess){
    // console.log(`Calculating points gained by move ${move}...`);
    const preScore = calculate_score(pre_move_data);
    const postScore = calculate_score(post_move_data, true);
  
    
    // console.log(`Previous score: ${preScore.score}`);
  

    const {score:previousScore} = preScore;
    const {score: currentScore, mateIn} = postScore;
    // console.log(`Current score: ${currentScore}, mate in ${mateIn} moves`);
  
    let pointsGained: number;
  
     //<<prompt_optimization>> I WAS CONFUSED BY THIS ONE, I THOUGHT IT WASNT QUITE ACCURATE BEFORE SO I MADE SOME CHANGES HERE
     //I THINK THE PROBLEM COULD BE THAT IN THE ORIGINAL CODE EVERYTHING'S VIEWED FROM THE WHITE's PERSPECTIVE
        if (previousScore !== 10000 && currentScore === 10000) {
            // console.log(`White mates in ${mateIn} moves`);
            return {mateIn, class:`white mates ${mateIn}`};
        } else if (previousScore === 10000 && currentScore === 10000) {
            // console.log(`White continues checkmate sequence, Black gets mated in ${mateIn} moves`);
            return {mateIn, class:`white continues mate ${mateIn}`}
        } else if (previousScore === 10000 && currentScore !== 10000) {
            // console.log("White lost a checkmate sequence");
            return {mateIn, class:`white lost mate`}
        } else if (previousScore !== -10000 && currentScore === -10000) {
            // console.log(`Black mates in ${mateIn} moves`);
            return {mateIn, class:`black mates ${mateIn}`}
        } else if (previousScore === -10000 && currentScore === -10000) {
           // console.log(`Black continues checkmate sequence, White gets mated in ${mateIn} moves`);
           return {mateIn, class:`black continues mate ${mateIn}`}
        } else if (previousScore === -10000 && currentScore !== -10000) {
            // console.log(`Black mates in ${mateIn} moves`);
            return {mateIn, class:`black lost mate`}
        }
  
        pointsGained = game.turn() == 'w' ? currentScore - previousScore : previousScore - currentScore; //THIS
        // console.log(`Points gained: ${pointsGained}`);
  
  
    return pointsGained;
}

function classify_move(game: Chess, move: any, pre_move_data:any, post_move_data:any) {
    // console.log(`Classifying move ${move}...`);

    const pointsGained = calculate_points_gained(pre_move_data, post_move_data, move, game);
    // console.log(`Points gained: ${pointsGained}`);

    if (typeof(pointsGained) !== 'number') {
        // console.log(`Move classification: ${pointsGained}`);
        //<<prompt_optimization>> I MADE A CHANGE HERE JUST SO WE CAN EASIER DIFERENTIATE BETWEEN THE WHITE/BLACK MATE SITUATION
        // quite redundant put im putting it for clarity (comment from OC)
        if (pointsGained.class.includes('white mates')) {
            return {score:pointsGained.mateIn, class: pointsGained.class};
        } else if (pointsGained.class.includes('white continues mate')) {
            
            return {score:pointsGained.mateIn, class: pointsGained.class};
        } else if (pointsGained.class.includes('white lost mate')) {
            return {score:pointsGained.mateIn, class: pointsGained.class};
        } else if (pointsGained.class.includes('black mates')) {
            return {score:pointsGained.mateIn, class: pointsGained.class};
        } else if (pointsGained.class.includes('black continues mate')) {
            return {score:pointsGained.mateIn, class: pointsGained.class};
        } else if (pointsGained.class.includes('black lost mate')) {
            return {score:pointsGained.mateIn, class: pointsGained.class};
        }
        else return {score:pointsGained.mateIn, class: pointsGained.class};
    }

    //<<prompt_optimization>> I'VE MADE A CHANGE HERE CAUSE EVALUATION NUMBERS THAT ARE RETURNED FROM STOCKFISH ARE 100x SMALLER THAN EXPECTED IN OC

    if (pointsGained >= -0.2) {
        // console.log("Move classification: excellent");
        return {score:pointsGained, class: 'excellent'};
    } else if (pointsGained < -0.2 && pointsGained >= -1) {
        // console.log("Move classification: good");
        return {score:pointsGained, class: 'good'};
    } else if (pointsGained < -1 && pointsGained >= -2.5) {
        // console.log("Move classification: inaccuracy");
        return {score:pointsGained, class: 'inaccuracy'}
    } else if (pointsGained < -2.5 && pointsGained >= -4.5) {
        // console.log("Move classification: mistake");
        return {score:pointsGained, class: 'mistake'}
    } else {
        // console.log("Move classification: blunder");
        return {score:pointsGained, class: 'blunder'}
    }
}

function is_defended(fen: string, square: Square, by_color: Color, return_list_of_defenders: boolean = false){
    // console.log(`Checking if square ${square} is defended...`);
    const game = new Chess(fen);
    const piece = game.get(square);
    // console.log(`Piece on square: ${piece}`);

    let defenders: boolean;
   
    defenders = game.isAttacked(square, by_color);
   
    if(defenders){
        // console.log("Square is defended");
    }
    else // console.log("Square is not defended");
    return defenders;
}


//CHECKING IF THE PROVIED SQUARE CAN BE ATTACKED, AND RETURNS ALL THE MOVES THAT CAN ATTACK IT
//IT WILL SEARCH FOR AND RETURN ONLY THE VALID MOVES FROM THE CURRENT STATE AND CURRENT TURN

function get_defenders(game: Chess, square: Square) {    
    const moves = game.moves({verbose:true});
    const defenderMoves = moves.filter((move)=>move.to == square);
    return defenderMoves; 
}

function get_attackers(fen: string, square: Square, attackedBy: Color) {
   const newGame = new ChessTemp(fen);
   const squares = newGame.attackers(square, attackedBy);
   return squares;
}

//<<prompt_optimization>> WE DONT HAVE 'is_pinned' BUILT IN FUNCTION IN JS LIBRARY SO I COME UP WITH THIS, NEEDS CHECKING
function is_pinned(fenStr: string, square: Square, color?: Color) {
    const game = new Chess(fenStr);
    if(game.isCheck()){
        return false;
    }
    game.remove(square);
    return game.isCheck();
}

function is_possible_trade(game: Chess, move: any): string | boolean {
    // console.log(`Checking if move ${move} is a possible trade...`);
    const gameCopy = new Chess(game.fen());
    const playMove = gameCopy.move(move);
    if (playMove?.captured) {
        // console.log("The move is a capture");
        const capturedPiece = playMove.captured;
        const capturedSquare = playMove.to;
        const capturingPiece = playMove.piece;
        const capturingSquare = playMove.from;
        
        if (get_defenders(gameCopy, capturedSquare).length>0) {
            // console.log(`The captured ${capturedPiece} on ${capturedSquare} is defended by the opponent`);
            if (capturedPiece == capturingPiece) {
                // console.log(`The ${capturingPiece} on ${capturingSquare} and the ${capturedPiece} on ${capturedSquare} are of the same type`);
                return `The ${PieceDict[capturingPiece]} on ${capturingSquare} for the ${PieceDict[capturedPiece]} on ${capturedSquare}`;
            } else if (capturedPiece === 'n' && capturingPiece === 'b') {
                // console.log(`The captured ${capturedPiece} on ${capturedSquare} is a Knight, and the capturing ${capturingPiece} on ${capturingSquare} is a Bishop`);
                return `The ${PieceDict[capturingPiece]} on ${capturingSquare} for the ${PieceDict[capturedPiece]} on ${capturedSquare}`;
            } else if (capturedPiece === 'b' && capturingPiece === 'n') {
                // console.log(`The captured ${capturedPiece} on ${capturedSquare} is a Bishop, and the capturing ${capturingPiece} on ${capturingSquare} is a Knight`);
                return `The ${PieceDict[capturingPiece]} on ${capturingSquare} for the ${PieceDict[capturedPiece]} on ${capturedSquare}`;
            } else {
                // console.log("The captured piece is not of the same type or a Knight/Bishop pair");
                return false;
            }
        } else {
            // console.log("The captured piece is not defended by the opponent");
            return false;
        }
    } else {
        //<<prompt_optimization>>THIS SHOULD BE REVIEWED AND IMPROVED... DOESNT MAKE MUCH SENSE
        // console.log("The move is not a capture");
        const attackedSquare = playMove.to;
        //const attackedSquareName = chess.squareToString(attackedSquare);
        const attackingPiece = playMove.piece;
        const attackingSquare = playMove.from;
        const attackers = get_defenders(gameCopy, attackedSquare); //ALL THE MOVES OPPONENT CAN MAKE TO EAT OUR PIECE
        const defenders = get_attackers(gameCopy.fen(), attackedSquare, game.turn()); //RETURNS ALL THE SQUARES OUR LAST MOVE IS PROTECTED/DEFENDED FROM
        //const attackers = board.attackers(!board.turn(), attackedSquare);
        // console.log(`Attackers of the square ${attackedSquare} by the opponent: ${attackers.map(s => s.from).join(', ')}`);
        if(attackers.length>0 && defenders.length==0){
            return `The square ${attackedSquare} is not defended by the player, opponent can capture piece ${attackingPiece}`;
        }

        if (attackers.length > 0) {
            for (const attackingSquareOpponent of attackers) { 
                if (defenders.length>0) {
                    // console.log(`The square ${attackedSquare} is defended by the player`);
                    const attackedPiece = attackingSquareOpponent.piece;
                    const attackingSquareOpponentName = attackingSquareOpponent.from;
                    if (attackedPiece === attackingPiece) {
                        // console.log(`The attacking ${attackedPiece} on ${attackingSquareOpponentName} and the moving ${attackingPiece} on ${attackingSquare} are of the same type`);
                        if (!is_pinned(gameCopy.fen(), attackingSquareOpponent.from, gameCopy.turn())) { //ISNT NECESSARY HERE CAUSE WE ALREADY HAVE ONLY THE ALLOWED MOVES
                            // console.log(`The attacking ${attackedPiece} on ${attackingSquareOpponentName} is not pinned`);
                            return `The ${attackingPiece} on ${attackingSquare} for the ${attackedPiece} on ${attackingSquareOpponentName}`;
                        }
                    } else if (attackedPiece === 'n' && attackingPiece === 'b') {
                        // console.log(`The attacking ${attackedPiece} on ${attackingSquareOpponentName} is a Knight, and the moving ${attackingPiece} on ${attackingSquare} is a Bishop`);
                        return `The ${attackingPiece} on ${attackingSquare} for the ${attackedPiece} on ${attackingSquareOpponentName}`;
                    } else if (attackedPiece === 'b' && attackingPiece === 'n') {
                        // console.log(`The attacking ${attackedPiece} on ${attackingSquareOpponentName} is a Bishop, and the moving ${attackingPiece} on ${attackingSquare} is a Knight`);
                        return `The ${attackingPiece} on ${attackingSquare} for the ${attackedPiece} on ${attackingSquareOpponentName}`;
                    }
                } else {
                    // console.log(`The square ${attackingSquareOpponent.to} is not defended by the player`);
                    return `The ${attackingPiece} on ${attackingSquare} for the opponent's piece on ${attackingSquareOpponent.from}`;
                }
            }
        }

        // console.log("No attacking pieces found, not a possible trade");
        return false;
    }
}

function get_king_square(fen: string, color: 'w' | 'b'): string | null {
    const rows = fen.split(' ')[0].split('/');
    const king = color === 'w' ? 'K' : 'k';
  
    const files = 'abcdefgh';
  
    for (let rank = 0; rank < 8; rank++) {
        let fileIndex = 0;
        for (const char of rows[rank]) {
            if (char >= '1' && char <= '8') {
                fileIndex += parseInt(char);
            } else {
                if (char === king) {
                    const file = files[fileIndex];
                    const rankNum = 8 - rank;
                    return `${file}${rankNum}`;
                }
                fileIndex++;
            }
        }
    }
    return null;
  }
  



function move_is_discovered_check(game: Chess, move: any){
    // console.log(`Checking if move ${move} is a discovered check...`);
    const position_after_move = new ChessTemp(game.fen());
    // console.log(`Creating a copy of the board: ${game.fen()}`);
    const moveTo = position_after_move.move(move);
    // console.log(`Pushed move ${move}, new position: ${position_after_move.fen()}`);

    if (position_after_move.inCheck()){
        // console.log("This new position is check");
        const kingSquare = get_king_square(position_after_move.fen(), position_after_move.turn()) as Square;    
        const attackers = position_after_move.attackers(kingSquare, game.turn());
        if(attackers.includes(moveTo.to)){
            // console.log("The king is attacked, not a discovered check")
            return false;
        }
        // console.log("The king is not attacked, it is a discovered check");
        return true;
    }

    // console.log("The position is not a check");
    return false;
}


//<<prompt_optimization>>
//Now it only checks if the piece we moved covers some of the pieces that were hanging
//Additionaly we can change the code to include not only those directly covered by moving piece, but also the ones that are covered by some of discovered pieces
//Also I think this function in the original code is set up incorrectly and needs to be checked and fixed.
function move_defends_hanging_piece(board: Chess, move: any, returnListDefended: boolean = false): boolean | Array<{piece: string, square: string}> {
    // console.log(`Checking if move ${move} defends a hanging piece...`);
    const gameCopy = new ChessTemp(board.fen());
    const moveCopy = gameCopy.move(move);
    if (moveCopy.flags == 'k' || moveCopy.flags == 'q') {
        if (returnListDefended) {
            // console.log("Move is a castling, returning empty list");
            return [];
        }
        // console.log("Move is a castling, returning False");
        return false;
    }

    // console.log(`Creating copy of board: ${board.fen()}`);
    // console.log(`Pushed move ${moveCopy.san}, new position: ${gameCopy.fen()}`);

    const defendedSquares: Array<{piece: string, square: string}> = [];

    let defended_squares = gameCopy.targeting(moveCopy.to, moveCopy.color);
    if(typeof(defended_squares)=='boolean'){
       if(returnListDefended){
        return defendedSquares;
       }
       else{
        return false;
       }
    }
    

    defended_squares = defended_squares.filter(sq=>gameCopy.get(sq).color === moveCopy.color); //returns all the squares with the pieces of the same color as piece we moved on it, basically all the pieces backed by the piece moved in the last move
     
    for (let defender of defended_squares) {
        // console.log(`Checking if ${defender} is a defended hanging piece...`);
        let defendedPiece = gameCopy.get(defender);
            
            //attacked by opponent                          //not defended by its own bolor
        if (board.isAttacked(defender, gameCopy.turn()) && !board.isAttacked(defender, board.turn())) {
                // console.log(`The ${defendedPiece.type} on ${defender} was hanging and now defended by the ${moveCopy.piece} on ${moveCopy.to}`);
                defendedSquares.push({piece:defendedPiece.type, square:defender});
        }
        
    }

    if (returnListDefended) {
        // console.log(`Returning list of defended pieces and squares: ${defendedSquares}`);
        return defendedSquares;
    }

    if (defendedSquares.length > 0) {
        // console.log("Move defends a hanging piece");
        return true;
    } else {
        // console.log("Move does not defend a hanging piece");
        return false;
    }
}

function piece_eval(piece:string){
    let value= 0;
    switch(piece){
        case 'p':{
          value=1;
          break;
        }
        case 'b':{
          value=3;
          break;
        }
        case 'n':{
          value=3;
          break;
        }
        case 'r':{
          value=5;
          break;
        }
        case 'q':{
          value=9;
          break;
        }
    }

    return value;
}

function piece_dict(piece:string){
    let value= 'king';
    switch(piece){
        case 'p':{
          value='pawn';
          break;
        }
        case 'b':{
          value='bishop';
          break;
        }
        case 'n':{
          value='knight';
          break;
        }
        case 'r':{
          value='rook';
          break;
        }
        case 'q':{
          value='queen';
          break;
        }
        case 'k':{
          value='king';
          break;
        }
    }

    return value;
}

//<<prompt_optimization>> I havent changed anything here but its not 100% accurate and there's space for improvement...
//i.e. lets say we move pawn and it attacks opponent's bishop and king... bishop can eat the pawn, but the pawn is backed by queen so it passes the defenders check
//and the function would return this move as forking, whereas its not effective at all since we can lose the queen (higher value defender)
//so it may be forking technically, but essentialy totally ineffective one, and as such can be confusing as an instruction both for AI assistant or player   
function is_forking(fen: string, square: Square, return_forked_squares:boolean=false){
    const chess = new ChessTemp(fen);
    const chessReg = new Chess(fen);
    // console.log(`Checking if ${square} is forking...`);
    let forkedSquares: Square[] = [];

    const ourPiece = chess.get(square);
    const squareCanBeCapturedBy = ourPiece.color == 'b' ? 'w' : 'b';
    // console.log(`Square can be captured by: ${squareCanBeCapturedBy == 'b' ? 'black' : 'white'}`);

    let targetings = chess.targeting(square, ourPiece.color);
    if(targetings){
       targetings = targetings.filter(target => chess.get(target).color==chess.turn());
    }
    const attackers = chess.attackers(square, squareCanBeCapturedBy);
    if (attackers && attackers.length>0) {
        // console.log(`${square} is attacked by ${squareCanBeCapturedBy}`);

        if (get_attackers(chess.fen(), square, ourPiece.color).length<1) { //checking for defenders
            // console.log(`${square} is not defended by ${!squareCanBeCapturedBy}`);

            if (return_forked_squares) {
                // console.log("Returning empty list as the forking piece can be captured");
                return [];
            }
            // console.log("The forking piece can be captured, returning False");
            return false;
        }
    }

    if (targetings) {
      for (const target of targetings) {
        const attackedPiece = chess.get(target);
        if (!is_defended(chessReg.fen(), target, attackedPiece.color)) {
          forkedSquares.push(target);
          // console.log(`Added ${target} to forked squares`);
        } else {
          if (attackedPiece.type === "k") {
            forkedSquares.push(target);
            // console.log(`Added ${target} to forked squares (king)`);
          } else if (
            piece_eval(attackedPiece.type) > piece_eval(ourPiece.type)
          ) {
            forkedSquares.push(target);
            // console.log( `Added ${target} to forked squares (higher value piece)` );
          }
        }
      }
    }
    if (return_forked_squares) {
        // console.log(`Returning list of forked squares: ${forkedSquares.map(s => s).join(', ')}`);
        return forkedSquares;
    } else {
        if (forkedSquares.length >= 2) {
            // console.log("Square is forking");
            return true;
        } else {
            // console.log("Square is not forking");
            return false;
        }
    }
}

function move_creates_fork(fen: string, move: string, returnForkedSquares: boolean = false) {
    // console.log(`Checking if move ${move} creates a fork...`);
    let boardClone = new Chess(fen);  // Create a copy of the board
    // console.log(`Creating copy of board: ${fen}`);
    const playedMove = boardClone.move(move);  // Push the move to the new board
    // console.log(`Pushed move ${move}, new position: ${boardClone.fen()}`);

    let forkingPiece = playedMove.piece;  // Get the piece at the destination square
    let forkingSquare = playedMove.to;  // Get the destination square

    let forkedSquares = is_forking(boardClone.fen(), forkingSquare, true);  // Get forked squares
    if(typeof(forkedSquares)!=='boolean'){
        // console.log(`Forked squares: ${forkedSquares.map(s => s)}`);
    

        if (forkedSquares.length >= 2) {
          let forkedPieces = forkedSquares.map(s => boardClone.get(s).type);  // Get forked pieces
          // console.log(`Forked pieces: ${forkedPieces.join(', ')}`);
          let forkedPieceNames = forkedPieces.map(p => piece_dict(p));  // Map pieces to names
          // console.log(`Forked piece names: ${forkedPieceNames.join(', ')}`);

           if (returnForkedSquares) {
             // console.log(`Returning forking piece, square, forked pieces and squares`);
             return {forkingPiece, forkingSquare, forkedPieces, forkedSquares};
           }

          // console.log("Fork created");
          return true;
        }
   }  
    // console.log("No fork created");
    return false;
}

function is_hanging(fen: string, square: Square, capturableBy: Color, returnListOfAttackers: boolean = false) {
    // console.log(`Checking if ${square} is hanging...`);
    const board = new ChessTemp(fen);
    const maybeHangingPiece = board.get(square);
    // console.log(`Piece on square: ${maybeHangingPiece.type}`);

        const squareIsDefended = is_defended(board.fen(), square, capturableBy=='w' ? 'b' : 'w');
        // console.log(`Square is defended by ${capturableBy}: ${squareIsDefended}`);

        if (!squareIsDefended) {
            const attackers = board.attackers(square, capturableBy);
            // console.log(`Attackers: ${attackers.map(s => s).join(', ')}`);

            if (attackers.length > 0) {
                if (returnListOfAttackers) {
                    // console.log(`Returning list of attackers: ${attackers}`);
                    return attackers;
                } else {
                    // console.log("Square is hanging");
                    return true;
                }
            } else {
                // console.log("Square is not hanging");
                return false;
            }
        }

    // console.log("Square is not hanging");
    return false;
}


function move_attacks_piece(board: Chess, move: string, returnAttackedPiece: boolean = false) {
    // console.log(`Checking if move ${move} attacks a piece...`);

    const positionAfterMove = new ChessTemp(board.fen());
    // console.log(`Creating a copy of the board: ${board.fen()}`);
    const playMove = positionAfterMove.move(move);
    // console.log(`Pushed move ${playMove.san}, new position: ${positionAfterMove.fen()}`);

    const attackingPiece = playMove.piece;
    const attackingSquare = playMove.to;

    if (is_defended(positionAfterMove.fen(), attackingSquare, playMove.color) || !positionAfterMove.isAttacked(attackingSquare, positionAfterMove.turn())) {
        // console.log(`The square ${attackingSquare} is defended or not attacked by the player`);
        const attackedSquares = positionAfterMove.targeting(playMove.to); 
        if(!attackedSquares) return false;
        const targets = attackedSquares.filter(target => positionAfterMove.get(target).color==positionAfterMove.turn());
        // console.log(`Attacked squares from ${attackingSquare}: ${targets.map(s => s).join(', ')}`);
        for (const target of targets) {
            const targetedPiece = positionAfterMove.get(target);
                if (targetedPiece.type !== 'k') {
                        if (piece_eval(targetedPiece.type) > piece_eval(attackingPiece)) {
                            // console.log(`The ${targetedPiece.type} on ${target} is a higher value piece than the ${attackingPiece} on ${attackingSquare}`);
                            if (returnAttackedPiece) {
                                return {
                                    attackingPiece,
                                    attackingSquare,
                                    targetedPiece,
                                    targetedSquare: target
                                };
                            }
                            return true;
                        } else if (is_hanging(positionAfterMove.fen(), target, playMove.color)) {
                            if (returnAttackedPiece) {
                                return {
                                    attackingPiece,
                                    attackingSquare,
                                    targetedPiece,
                                    targetedSquare: target
                                };
                            }
                            return true;
                        }
                } 
        }
    }

    return false;
}


function move_blocks_check(board: Chess, move: Move): boolean {
    // console.log(`Checking if move ${move.lan} blocks a check...`);

    const game = new ChessTemp(board.fen());
    game.move(move);
    if (board.isCheck() && !move.flags.includes('c')) {
        // console.log("Board is in check and move is not a capture");

        const kingSquare = get_king_square(board.fen(), board.turn()) as Square;
        // console.log(`King is on ${kingSquare}`);
        // console.log(`Creating copy of board: ${board.fen()}`);
        // console.log(`Pushed move ${move.san}, new position: ${game.fen()}`);

        if (game.get(kingSquare)?.type === 'k') {
            // console.log("Move blocks the check");
            return true;
        } else {
            // console.log("Move does not block the check");
            return false;
        }
    } else {
        // console.log("Board is not in check or move is a capture");
        return false;
    }
}

function is_developing_move(board: Chess, move: Move): string | boolean {
    // console.log(`Checking if move ${move.san} is a developing move...`);

    const fromSquare = move.from;
    const toSquare = move.to;
    const gameCopy = new ChessTemp(board.fen());
    gameCopy.move(move.lan);
    const knightSquares = ['b1', 'g1', 'b8', 'g8'];
    const bishopSquares = ['c1', 'f1', 'c8', 'f8'];
    const queenSquares = ['d1', 'd8'];

    const piece = board.get(fromSquare);

    if (knightSquares.includes(fromSquare)) {
        if (piece && piece.type === 'n') {
            // console.log(`Move develops a Knight to ${move.to}`);
            return `Knight to ${move.to}`;
        } else {
            // console.log("Move does not develop a piece");
            return false;
        }
    } else if (bishopSquares.includes(fromSquare)) {
        if (piece && piece.type == 'b') {
            // console.log(`Move develops a Bishop to ${move.to}`);
            return `Bishop to ${move.to}`;
        } else {
            // console.log("Move does not develop a piece");
            return false;
        }
    } else if (queenSquares.includes(fromSquare)) {
        if (piece && piece.type === 'q') {
            // console.log(`Move develops a Queen to ${move.to}`);
            return `Queen to ${move.to}`;
        } else {
            // console.log("Move does not develop a piece");
            return false;
        }
    } else {
        // console.log("Move does not develop a piece");
        return false;
    }
}

function is_fianchetto(board: Chess, move:Move){
    // console.log(`Checking if move ${move.san} is a fianchetto...`);

    if(move.piece=='b'){
        // console.log("The moving piece is a Bishop");
        if(['c1','f1','c8','f8'].includes(move.from)){
            // console.log(`The Bishop is moving from ${move.from}`);
            if(['b2','g2','b7','g7'].includes(move.to)){
                const bishop_color = move.color == 'w' ? 'White' : 'Black';
                // console.log(`The ${bishop_color} Bishop is moving to ${move.to}, which is a fianchetto`);
                return {bishop_color, to_square_name: move.to}
            }
        }
    }

    // console.log("The move is not a fianchetto");
    return false;
}

function move_pins_opponent(board: Chess, move: Move, return_pinned_square: boolean = false){
   // console.log(`Checking if move ${move.san} pins an opponent's piece...`);
   const gameAfterMove = new ChessTemp(board.fen());
   gameAfterMove.move(move.lan);
   
   if (board.isAttacked(move.to, gameAfterMove.turn())){
     // console.log(`The square ${move.to} is attacked by the opponent`);
     if(!is_defended(gameAfterMove.fen(), move.to, move.color)){
        // console.log(`The square ${move.to} is not defended by the player`);
        return false;
     }
   }

   const pinning_piece = move.piece;
   const pinning_square = move.to;
   let pinned_square = null;
   let pinned_to_square = null;
   let pinned_piece = null;

   let possible_pinned_squares = gameAfterMove.targeting(move.to, move.color);
   if(!possible_pinned_squares){
      // console.log("The move does not pin an opponent's piece");
      return false;
   }
   if(typeof(possible_pinned_squares)=='boolean'){
    // console.log("Impossible to determine");
    return false;
   }
   possible_pinned_squares = possible_pinned_squares.filter(square => gameAfterMove.get(square).color == gameAfterMove.turn());
   
   for(const target of possible_pinned_squares){
     pinned_piece = gameAfterMove.get(target as Square);
     if(pinned_piece.type!=='k'){
        if(is_pinned(gameAfterMove.fen(), target as Square, gameAfterMove.turn())){
            pinned_square = target;
            pinned_to_square = get_king_square(gameAfterMove.fen(), gameAfterMove.turn());
            // console.log(`The ${pinned_piece} on ${pinned_square} is pinned to the King on ${pinned_to_square}`);
            break;
        }
     }
   }

   if(return_pinned_square){
    // console.log("Returning pinning piece, pinning square, pinned piece, pinned square, and king square...");
    if(pinned_square){
        pinned_piece = pinned_piece?.type;
        return {pinning_piece, pinning_square, pinned_piece, pinned_square, pinned_to_square}
    }
    else {
        return false;
    }
   }

   if(pinned_square){
    // console.log("The move pins an opponent's piece");
    return true;
   }
   else{
    // console.log("The move does not pin an opponents piece");
    return false;
   }
}

const squaresFourRanks: { [key: string]: number } = {
    a1: 1, a2: 9, b1: 2, b2: 10, c1: 3, c2: 11, d1: 4, d2: 12,
    e1: 5, e2: 13, f1: 6, f2: 14, g1: 7, g2: 15, h1: 8, h2: 16,
    a7: 49, a8: 57, b7: 50, b8: 58, c7: 51, c8: 59, d7: 52, d8: 60,
    e7: 53, e8: 61, f7: 54, f8: 62, g7: 55, g8: 63, h7: 56, h8: 64
  };

  const squaresEntire: { [key: string]: number } = {
    a1: 1,  a2: 9,  a3: 17, a4: 25, a5: 33, a6: 41, a7: 49, a8: 57,
    b1: 2,  b2: 10, b3: 18, b4: 26, b5: 34, b6: 42, b7: 50, b8: 58,
    c1: 3,  c2: 11, c3: 19, c4: 27, c5: 35, c6: 43, c7: 51, c8: 59,
    d1: 4,  d2: 12, d3: 20, d4: 28, d5: 36, d6: 44, d7: 52, d8: 60,
    e1: 5,  e2: 13, e3: 21, e4: 29, e5: 37, e6: 45, e7: 53, e8: 61,
    f1: 6,  f2: 14, f3: 22, f4: 30, f5: 38, f6: 46, f7: 54, f8: 62,
    g1: 7,  g2: 15, g3: 23, g4: 31, g5: 39, g6: 47, g7: 55, g8: 63,
    h1: 8,  h2: 16, h3: 24, h4: 32, h5: 40, h6: 48, h7: 56, h8: 64
  };
  
  function squareToIndex(square: string): number {
    return squaresEntire[square];
  }

function moves_rook_to_open_file(board: Chess, move:Move){
    // console.log(`Checking if move ${move.san} moves a Rook to an open file...`);
      

      // console.log(`Checking if move ${move.san} moves a Rook to an open file...`);
      const fromSquareIndex = squareToIndex(move.from);
      const toSquareIndex = squareToIndex(move.to);
      
      if (move.piece === 'r') {
        // console.log("The moving piece is a Rook");
        if (Object.values(squaresFourRanks).includes(fromSquareIndex)) {
          // console.log("The Rook is moving from the 1st, 2nd, 7th, or 8th rank");
          if (Math.abs(fromSquareIndex - toSquareIndex) < 8) {
            // console.log("The Rook move is horizontal");
            const toSquareName = move.to;
            const fileName = toSquareName[0];
            let numPiecesOnFile = 0;
            
            for (let i = 1; i <= 8; i++) {
              if (board.get(`${fileName}${i}` as Square)) {
                numPiecesOnFile += 1;
              }
            }
            // console.log(`Number of pieces on the file ${fileName}: ${numPiecesOnFile}`);
            
            if (numPiecesOnFile < 3) {
              // console.log(`The Rook is moving to the open ${fileName}-file`);
              return `${fileName}-file`;
            }
          }
        }
      }
    
      // console.log("The move does not move a Rook to an open file");
      return false;
}

function is_endgame(board: Chess): boolean {
    // console.log(`Checking if board ${board.fen()} is an endgame position...`);
    let majorPieces = 0;
    const fen = board.fen();
    for (const p of fen.split(' ')[0]) {
        if (['r', 'b', 'n', 'q'].includes(p.toLowerCase())) {
            majorPieces += 1;
        }
    }
    // console.log(`Number of major pieces on the board: ${majorPieces}`);

    if (majorPieces < 6) {
        // console.log("The position is an endgame");
        return true;
    } else {
        // console.log("The position is not an endgame");
        return false;
    }
}

const W_BACKRANK = ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"];
const B_BACKRANK = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"];

function move_moves_king_off_backrank(board:Chess, move:Move){
    // console.log(`Checking if move ${move.san} moves the king off the back rank...`);
    
    if(move.piece==='k'){
        // console.log("The moving piece is a King");
        const from_square = move.from;
        const to_square = move.to;
        if(move.color=='w'){
            if(W_BACKRANK.includes(from_square) && !W_BACKRANK.includes(to_square)){
               // console.log(`The King from the back rank square ${from_square} is moving off the back rank to ${to_square}`);
               return true;
            }
        }
        else if(move.color=='b'){
            if(B_BACKRANK.includes(from_square) && !B_BACKRANK.includes(to_square)){
               // console.log(`The King from the back rank square ${from_square} is moving off the back rank to ${to_square}`);
               return true;
            }
        }
    }


    // console.log("The move does not move the king off the back rank");
    return false;
}


function move_wins_tempo(board:Chess, move:Move, pre_move_data: any, post_move_data: any){
    // console.log(`Checking if move ${move.san} wins a tempo...`);
    let attacked_data = move_attacks_piece(board, move.lan, true);
    if(!move_attacks_piece(board, move.lan)){
        // console.log("The move does not attack a piece, returning false");
        return false;
    }

    if(typeof(attacked_data)!=='boolean'){
        const {attackingPiece, attackingSquare, targetedPiece, targetedSquare}= attacked_data;
        // console.log(`The ${attackingPiece} on ${attackingSquare} attacks the ${targetedPiece} on ${targetedSquare}`);
        const points_gained = calculate_points_gained(pre_move_data, post_move_data, move.san, board);

        // console.log(`Points gained: ${points_gained}`);
        if(typeof(points_gained) == 'number' && points_gained>0){
           // console.log(`The move wins a tempo by attacking the ${targetedPiece} on ${targetedSquare} with the ${attackingPiece} on ${attackingSquare}`);
           return {attacking_piece: attackingPiece, attacking_square: attackingSquare, attacked_piece: targetedPiece, attacked_square: targetedSquare}
        }
        else {
            // console.log(`Points gained is a string (mate, etc.), returning false`);
            return false;
        }
    }

    // console.log("The move doesn't win a tempo");
    return false;
}

function move_captures_higher_piece(board:Chess, move:Move){
    // console.log(`Checking if move ${move.san} captures a higher value piece`);
    if (move.captured){
       // console.log("The move is a capture");
       if(piece_eval(move.piece)<piece_eval(move.captured)){
        // console.log("The capturing piece is a lower value piece than the captured piece");
        return true;
       }
    }
    // console.log("The move does not capture a higher value piece");
    return false;
}

function move_captures_free_piece(board:Chess, move:Move){
    // console.log(`Checking if move ${move.san} captures a free piece...`);

    if(move.captured){
        // console.log("The move is a capture");
        if(is_hanging(board.fen(), move.to, move.color)){
           // console.log(`The captured piece on ${move.to} is hanging`);
           return true;
        }
    }
    
    // console.log("The move does not capture a free piece");
    return false;
}

function move_is_discovered_check_and_attacks(board:Chess, move:string, return_attacked_squares:boolean=false){
    // console.log(`Checking if move ${move} is a discovered check and attacks pieces...`);
    const BoardAfterMove = new ChessTemp(board.fen());
    // console.log(`Creating a copy of the board: ${board.fen()}`);
    const MovePlayed = BoardAfterMove.move(move);
    // console.log(`Pushed move ${MovePlayed.san}, new position: ${BoardAfterMove.fen()}`);
    
    if(!move_is_discovered_check(board, MovePlayed)){
        if(return_attacked_squares){
            // console.log("Not a discovered check, returnig empty list");
            return [];
        }
        // console.log("Not a discovered check, returning false");
        return false;
    }
    
    

    let attacked_squares= [];
    let targets = BoardAfterMove.targeting(MovePlayed.to, MovePlayed.color);
    if(!targets){
        // console.log("The move doesnt attack any piece");
        return false;
    }

    if(typeof(targets)=='boolean'){
        // console.log("Cannot determine");
        return false;
    }
    
    targets = targets.filter(t=>BoardAfterMove.get(t).color == BoardAfterMove.turn());
    for(const target of targets){
        if(is_hanging(BoardAfterMove.fen(), target as Square, MovePlayed.color)){
            // console.log(`The piece on ${target} is hanging and capturable by the player`);
            attacked_squares.push(target);
        }
        else if(piece_eval(BoardAfterMove.get(target as Square).type)>piece_eval(MovePlayed.piece)){
            // console.log(`The piece on ${target} is a higher value piece than the moving piece`);
            attacked_squares.push(target);
        }
    }

    if(return_attacked_squares){
        // console.log(`Returning list of attacked squares: ${attacked_squares.map(square=>square).join(', ')}`);
        return attacked_squares;
    }
    if(attacked_squares.length>0){
       // console.log("The move attacks pieces");
       return true;
    }
    else{
       // console.log("The move does not attack any pieces");
       return false;
    }
}

///........THIS FUNCTION NEEDS CHECK..........///
function is_trapped(fen:string, square: Square, by: Color){
    const Game = new ChessTemp(fen);
    // console.log(`Checking if the piece on ${square} is trapped by ${by}`);

    if(Game.get(square).type=='k'){
        // console.log("This piece is a king, not trapped");
        return false;
    }

    const attackers = Game.attackers(square, by);
    // console.log(`Attackers of the square ${by}: ${attackers.map(att=>att).join(', ')}`);
    let capturable_by_lower = false;
    
    for(const attackingSquare of attackers){
        if(piece_eval(Game.get(square).type)>piece_eval(Game.get(attackingSquare as Square).type)){
            capturable_by_lower = true;
            // console.log("The piece can be captured by a lower value piece");
            break;
        }
    }

    if (!capturable_by_lower){
        // console.log("The piece cannot be captured by a lower value piece");
        return false;
    }

    let can_be_saved = false;
    // console.log("Checking if the piece can be saved...");

    let movable_squares = Game.targeting(square, Game.get(square).color);

    if(!movable_squares){
        // console.log("The move doesnt attack any piece");
        return false;
    }

    if(typeof(movable_squares)=='boolean'){
        // console.log("Cannot determine");
        return false;
    }

    movable_squares = movable_squares.filter(target => Game.get(target).color!==Game.get(square).color);
    // console.log(`Movable squares for the piece: ${movable_squares.map(sq => sq).join(', ')}`);
    for(const target of movable_squares){
        const attacked_piece = Game.get(target as Square);
        if(!attacked_piece){ 
             // console.log(`Checking if moving to ${target} by ${by} can save the piece`);

             let defending_squares = Game.attackers(target as Square, by);
             if(defending_squares.length==0){
                can_be_saved= true;
                // console.log("The piece can be saved by moving to this square");
                return false;
             }

             for(const defending_square of defending_squares){
                if(Game.get(defending_square as Square).color !== Game.get(square).color){
                    // console.log(`The defending piece on ${defending_square} is an opponents piece`);
                    if(piece_eval(Game.get(defending_square as Square).type)<piece_eval(Game.get(square).type)){
                        if(!is_pinned(Game.fen(), defending_square as Square, by)){ 
                             can_be_saved = false;
                             // console.log("The defending piece is a lower value piece and not pinned, piece cannot be saved");
                        }
                        else{
                            can_be_saved = true;
                            // console.log("The defending piece is pinned, piece can be saved");
                        }
                    }
                    else if(piece_eval(Game.get(defending_square as Square).type) == piece_eval(Game.get(square).type)){
                        if(!is_pinned(Game.fen(), defending_square as Square, by)){
                            let defenders = Game.attackers(defending_square as Square, by == 'w' ? 'b' : 'w');
                            if(defenders.length<=1){
                                can_be_saved = false;
                                // console.log("The defending piece is not pinned and has no other defenders, piece cannot be saved");
                            }
                            else{
                                can_be_saved = true;
                                // console.log("The defending piece is not pinned but has other defenders, piece can be saved");
                            }
                        }
                        else{
                            can_be_saved=true;
                            // console.log("The defending piece is pinned, piece can be saved");
                        }
                    }
                }
             }
        }
        else if(piece_eval(Game.get(target as Square).type) <= piece_eval(Game.get(square).type)){
           // console.log(`Checking if capturing ${target} can save the piece`);
           let defending_squares = Game.attackers(target as Square, by);
           // console.log(`Defending squares of ${target} by ${by}: ${defending_squares.map(sq => sq).join(', ')}`);

           if(defending_squares.length == 0){
              can_be_saved = true;
              // console.log("The piece can be saved by capturing this square");
              return false;
           }

           for(const defending_square of defending_squares){
             if(piece_eval(Game.get(defending_square as Square).type)<piece_eval(Game.get(square).type)){
                if(!is_pinned(Game.fen(), defending_square as Square, by)){
                   // console.log("The defending piece is a lower value piece and not pinned, piece cannot be saved");
                   can_be_saved= false;
                }
                else{
                    can_be_saved= true;
                    // console.log("The defending piece is pinned, piece can be saved");
                    break;
                }
             }
             else if(piece_eval(Game.get(defending_square as Square).type)==piece_eval(Game.get(square).type)){
                if(!is_pinned(Game.fen(), defending_square as Square, by)){
                    const defenders = Game.attackers(defending_square as Square, by == 'w' ? 'b' : 'w');
                    if(defenders.length<=1){
                        can_be_saved=false;
                        // console.log("The defending piece is not pinned and has no other defenders, piece cannot be saved");
                    }
                    else{
                        can_be_saved=true;
                        // console.log("The defending piece is not pinned but has other defenders, piece can be saved");
                        break;
                    }
                 }
                 else{
                     can_be_saved= true;
                     // console.log("The defending piece is pinned, piece can be saved");
                     break;
                 }
             }
             else{
                // console.log("The defending piece is a higher value piece, piece can be saved");
                can_be_saved =true;
                break;
             }
           }
        }
    } 
    
    return !can_be_saved;
}

function move_threatens_mate_sync(board:Chess, move:string, post_move_data:any){
    // console.log(`Checking if move ${move} threatens mate...`);
    const GameCopy = new ChessTemp(board.fen());
    // console.log(`Creating a copy of the board: ${board.fen()}`);
    const movePlayed = GameCopy.move(move);
    // console.log(`Pushed move ${movePlayed.san}, new position: ${GameCopy.fen()}`);
  
    if(GameCopy.isCheck()){
       // console.log("The new position is in check, returning Flase");
       return false;
    }
  
   
      const { mate, continuation} = post_move_data;
      if(mate){
          // console.log("The move threatens mate");
          let nMoves = Math.abs(parseInt(mate));
          // console.log(`Mate in ${nMoves} moves`);
          const mating_moves = continuation;
          // console.log("Mating sequence: ", mating_moves);
  
          return {mate_in: nMoves, mating_moves}
      }
      else return false;
}


async function move_threatens_mate(board:Chess, move:string){
  // console.log(`Checking if move ${move} threatens mate...`);
  const GameCopy = new ChessTemp(board.fen());
  // console.log(`Creating a copy of the board: ${board.fen()}`);
  const movePlayed = GameCopy.move(move);
  // console.log(`Pushed move ${movePlayed.san}, new position: ${GameCopy.fen()}`);

  if(GameCopy.isCheck()){
     // console.log("The new position is in check, returning Flase");
     return false;
  }

  //<<prompt_optimization>> IN THE ORIGINAL (PYTHON CODE) WE'RE PUSHING NULL MOVE HERE BUT IM NOT SURE WHATS THAT FOR
  //Three lines below are code for the best way around that I could come up with for null move (cause we dont have it in .js library), you can remove comment
  //let alterFen = gameCopy.fen().split(' ');
  //alterFen[1] = alterFen[1] === 'w' ? 'b' : 'w';
  //gameCopy.load(alterFen.join(' '),{ skipValidation: true });

  const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(GameCopy.fen())}&depth=13`, {
      method: 'GET',
      cache: 'no-store'
  });
  if(!response.ok){
    // console.log(`Error: Received status code ${response.statusText}`);
    return false;
  }
  
  try{
    const {success, mate, continuation} = await response.json();
    if(mate){
        // console.log("The move threatens mate");
        let nMoves = Math.abs(parseInt(mate));
        // console.log(`Mate in ${nMoves} moves`);
        const mating_moves = continuation;
        // console.log("Mating sequence: ", mating_moves);

        return {mate_in: nMoves, mating_moves}
    }
    else return false;
  }
  catch(err:any){
    // console.log("Failed to parse API response");
    return false;
  }
}

function check_for_hanging_pieces(fen: string, return_list_of_hanging:boolean=false){
    const GameCopy = new ChessTemp(fen);
    // console.log("Checking for hanging pieces");
    let hanging_pieces = [];
    let hanging_pieces_and_attackers:{ [key: string]: Square[] } = {};

    for(const square of Object.keys(squaresEntire)){
        let maybe_hanging_piece = GameCopy.get(square as Square);
        if(maybe_hanging_piece){
            // console.log(`Checking if ${maybe_hanging_piece} on ${square} is hanging...`);
            if(!is_defended(GameCopy.fen(), square as Square, maybe_hanging_piece.color)){
                 const attackers = GameCopy.attackers(square as Square, maybe_hanging_piece.color=='w' ? 'b' : 'w');
                 let attackersStr= attackers.map(att=>att).join(', ');
                 // console.log(`Attackers: ${attackersStr}`);
                 
                 if(attackers.length>0){
                    hanging_pieces_and_attackers[square] = attackers;
                    hanging_pieces.push(square);
                    // console.log(`Added ${square} to hanging pieces`);
                 }
            }
        }
    }

    if(return_list_of_hanging){
        // console.log("Returning list of hanging pieces: ", hanging_pieces);
        return hanging_pieces;
    }
    else{
        // console.log(`Returning dictionary of hanging pieces and attackers: ${hanging_pieces_and_attackers}`);
        return hanging_pieces_and_attackers;
    }
}


function move_hangs_piece(board:Chess, move:Move, return_hanging_squares:boolean=false){
    // console.log(`Checking if move ${move.san} hangs a piece`);
    const GameCopy = new ChessTemp(board.fen());
    // console.log("Creating copy of board");
    GameCopy.move(move.lan);
    // console.log(`Pushed move ${move.san}, new position: ${GameCopy.fen()}`);

    const hanging_before = check_for_hanging_pieces(board.fen(), true);
    // console.log(`Hanging pieces before move: ${hanging_before}`);
    const hanging_after = check_for_hanging_pieces(GameCopy.fen(), true);
    // console.log(`Hanging pieces after move: ${hanging_after}`);

    //<<prompt_optimization>> PIECE CAN BE HANGED ONLY BY ITS OWN COLOR MOVE. In the original code this is overlooked.
    //I've added '&& GameCopy.get(s as Square).color == board.turn()' two lines below to fix that
    if(Array.isArray(hanging_before) && Array.isArray(hanging_after)){
        const newly_hanging = hanging_after.filter(s => !hanging_before.includes(s) && GameCopy.get(s as Square).color == board.turn());
        if(newly_hanging.length>0){
            const hanging_pieces = newly_hanging.map(h=>GameCopy.get(h as Square).type);
            // console.log("Hanging pieces: ", hanging_pieces);
            const hanging_piece_names = hanging_pieces.map(hp=> PieceDict[hp]);
            // console.log("Hanging pieces names: ", hanging_piece_names);
            // console.log("Hanging squares: ", newly_hanging.join(' ,'));
            // console.log("Move hangs a piece");
            return {hanging_piece_names, hanging_square_names: newly_hanging};
        }
        else{
            // console.log("Move does not hang a piece");
            return false;
        }
    }
    else{
        // console.log("Move does not hang a piece");
        return false;
    }
}

function move_traps_opponents_piece(board:Chess, move:Move, return_trapped_squares:boolean=false){
    // console.log(`Checking if move ${move.san} traps an opponents piece...`);
    const GameAfterMove = new ChessTemp(board.fen());
    // console.log(`Creating a copy of the board: ${board.fen()}`);
    GameAfterMove.move(move.lan);
    // console.log(`Pushed move ${move.san}, new position: ${GameAfterMove.fen()}`);

    let trapped_squares = [];
    
    let attacked_squares= [];
    let targets = GameAfterMove.targeting(move.to, move.color);
    if(!targets){
        // console.log("The move doesnt attack any piece");
        return false;
    }

    if(typeof(targets)=='boolean'){
        // console.log("Cannot determine");
        return false;
    }

    targets = targets.filter(target => GameAfterMove.get(target).color==GameAfterMove.turn());
    for(const target in targets){
        const attacked_piece = GameAfterMove.get(target as Square);
        if(attacked_piece){
            // console.log(`The piece on ${target} is an opponent's piece`);
            if(is_trapped(GameAfterMove.fen(), target as Square, move.color)){
                trapped_squares.push(target);
                // console.log(`The piece on ${target} is trapped, added to trapped squares`);
            }
        }
    }
    
    if(return_trapped_squares){
        // console.log(`Returning list of trapped squares: ${trapped_squares.map(trap=>trap).join(', ')}`);
        if(trapped_squares.length>0){
            let trapped_pieces = trapped_squares.map(s => GameAfterMove.get(s as Square).type);
            // console.log(`Trapped pieces: ${trapped_pieces}`);
            let trapped_piece_names = trapped_pieces.map(p => piece_dict(p));
            // console.log(`Trapped pieces names: ${trapped_piece_names}`);
            return {trapped_piece_names, trapped_squares}
        }
        else{
            return false;
        }
    }

    if(trapped_squares.length>0){
        // console.log("The move traps an opponents piece");
        return true;
    }
    else{
        // console.log("Move does not trap an opponents piece");
        return false;
    }
}

function is_possible_sacrifice(board: Chess, move: Move){
   const GameCopy = new ChessTemp(board.fen());
   // console.log(`Checking if move ${move.san} is a possible sacrifice...`);
   
   if(move.piece == 'p'){
    // console.log("The moving piece is a pawn, cannot be a sacrifice");
    return false;
   }

   if(move.captured){
    // console.log("The move is a capture");
    const captured_piece = move.captured;
    const captured_square = move.to;
    const capturing_piece = move.piece;
    const capturing_square = move.from;

    const defending_squares = GameCopy.attackers(captured_square, move.color =='b' ? 'w' : 'b');
    // console.log(`Defending squares of the ${captured_piece} on ${captured_square}: ${defending_squares.map(df=>df).join(', ')}`);

    if(defending_squares.length>0){
        // console.log("The captured piece is defended");

        if(piece_eval(captured_piece)<piece_eval(capturing_piece)){
           // console.log(`The ${captured_piece} on ${captured_square} is a lower value piece than the ${capturing_piece} on ${capturing_square}`);
           for(const defending_square in defending_squares){
             let defending_piece = GameCopy.get(defending_square as Square).type;
             if(piece_eval(defending_piece)<piece_eval(capturing_piece)){
                // console.log(`The ${capturing_piece} on ${capturing_square} can be captured back by the lower value ${defending_piece} on ${defending_square}`);
                return true;
             } 
           }
           // console.log(`All the defending pieces of the ${captured_piece} are higher value than the ${capturing_piece}`);
           return false;
        }
        else{
            // console.log(`The ${captured_piece} on ${captured_square} is an equal or higher value piece than the ${capturing_piece} on ${capturing_square}`);
            return false;
        }
    }
    else{
        // console.log("The captured piece is not defended");
        return false;
    }
   }
   else{
      // console.log("The move is not a capture");
      const attacked_square = move.to;
      const attacking_piece = move.piece;
      const attacking_square= move.from;
      const attackers = GameCopy.attackers(attacked_square, move.color=='w' ? 'b' : 'w');
      // console.log(`Attackers of ${attacked_square} by the opponent: ${attackers.map(att=>att).join(', ')}`);
      if(attackers.length>0){
        for(const attackedFrom in attackers){
            if(GameCopy.attackers(attacked_square, move.color).length>1){
                // console.log(`${attacked_square} is defended by the player`);
                let attacking_piece_opponent = GameCopy.get(attackedFrom as Square).type;
                if(piece_eval(attacking_piece_opponent)<piece_eval(attacking_piece)){
                    // console.log(`The ${attacking_piece} on ${attacking_square} can be captured by the lower value ${attacking_piece_opponent} on ${attackedFrom}`);
                    if(!is_pinned(GameCopy.fen(), attackedFrom as Square, move.color=='w' ? 'b' : 'w')){
                        // console.log(`The ${attacking_piece_opponent} on ${attackedFrom} is not pinned`);
                        return true;
                    }
                }
            }
            else{
                // console.log(`${attacked_square} is not defended by the player`);
                return true;
            }
        }
      }
      // console.log("No attacking pieces found");
      return false;
   }
}

function is_capturable_by_lower_piece(fen: string, square: Square, color: Color){
   // console.log(`Checking if piece on ${square} is capturable by a lower piece of color ${color}`);
   const GameCopy = new ChessTemp(fen);
   const attacker_squares = GameCopy.attackers(square, color);
   // console.log(`Attacker squares of ${square} by ${color}: ${attacker_squares}...`);
   for(const attacker of attacker_squares){
    if(piece_eval(GameCopy.get(attacker).type)<piece_eval(GameCopy.get(square).type)){
       // console.log(`The piece on ${attacker} is a lower value piece that can capture the piece on ${square}`);
       return true;
    }
   }
   // console.log("No lower piece can capture the piece on ", square);
   return false;
}


function check_for_capturable_pieces_by_lower(game:Chess){
    // console.log("Checking for pieces that can be captured by a lower value piece...");
    let capturable_squares= [];

    for(const square of Object.keys(squaresEntire)){
        if(game.get(square as Square)){
            const piece = game.get(square as Square);
            // console.log(`Checking piece on ${square}: ${piece.type}`);
            if(piece.color !== game.turn()){
                if(is_capturable_by_lower_piece(game.fen(), square as Square, game.turn())){
                capturable_squares.push(square);
                // console.log(`The piece on ${square} can be captured by a lower value piece, added to capturable squares`);
                }
            }
        }
    }

    // console.log(`Capturable squares: ${capturable_squares}`);
    return capturable_squares;
}


function move_allows_fork(board:Chess, move:Move, return_forking_moves:boolean=false){
    // console.log(`Checking if move ${move.san} allows a fork...`);

    const forking_moves = [];
    const GameCopy = new ChessTemp(board.fen());
    // console.log("Creating copy of board: ", board.fen());
    GameCopy.move(move.lan);
    // console.log(`Pushed move ${move.san}, new position: ${GameCopy.fen()}`);

    for(const maybe_forking_move of GameCopy.moves({verbose:true})){
        // console.log(`Checking if move ${maybe_forking_move.san} creates a fork...`);
        let forking_data = move_creates_fork(GameCopy.fen(), maybe_forking_move.lan, true);
        if(forking_data){
            if(typeof(forking_data)!=='boolean'){
                const {forkingPiece, forkingSquare, forkedPieces, forkedSquares} = forking_data;
                forking_moves.push({forking_move_lan: maybe_forking_move.lan, ...forking_data});
                // console.log(`Move ${maybe_forking_move.san} creates a fork, added to forking moves`);
            }
        }
    }

    if(return_forking_moves){
        // console.log(`Returning list of forking moves: ${forking_moves.map(fm=>fm)}`);
        return forking_moves
    }

    if(forking_moves.length<1){
        // console.log("No forking moves found");
        return false;
    }

    // console.log("Found forking moves");
    return true;
}

function move_misses_fork(board: Chess, move:Move, return_forking_moves:boolean=false){
    // console.log(`Checking if move ${move.san} misses a fork...`);
    const forking_moves = [];

    for(const maybe_fork_move of board.moves({verbose:true})){
        // console.log(`Checking if move  ${move.san} creates a fork...`);
        if(move_creates_fork(board.fen(), maybe_fork_move.lan, false)){
            forking_moves.push(maybe_fork_move.lan);
            // console.log(`Move ${maybe_fork_move.san} creates a fork, added to forking moves`);
        }
    }

    if(return_forking_moves){
        // console.log(`Returning list of forking moves: ${forking_moves}`);
        return forking_moves;
    }
    
    if(forking_moves.includes(move.lan)){
        // console.log(`Move does not miss a fork`);
        return false;
    }

    // console.log("Move misses a fork");
    return true;
} 

function board_has_pin(board:Chess, return_pin_moves: boolean = false){
    // console.log(`Checking if board ${board.fen} has any pinning moves...`);

    let pin_moves= [];

    for(const moveL of board.moves({verbose: true})){
        // console.log(`Checking if move ${moveL.san} pins an opponents piece...`);
        if(move_pins_opponent(board, moveL)){
            pin_moves.push(moveL);
            // console.log(`Move ${moveL.san} pins an opponents piece, added to pin moves`);
        }
    }

    if(return_pin_moves){
        // console.log(`returning list of pin moves: ${pin_moves}`);
        return pin_moves;
    }

    if(pin_moves.length>0){
        // console.log("The board has pinning moves");
        return true;
    }

    // console.log("the board does not have any pinning movees");
    return false;
}


function move_misses_pin(board: Chess, move: Move, return_pin_move:boolean=false){
    // console.log(`Checking if move ${move.san} misses a pinning move...`);

    let pin_moves = board_has_pin(board, true);
    if(typeof(pin_moves)=='boolean'){
        return pin_moves;
    }

    if(return_pin_move){
        if(typeof(pin_moves)!=='boolean'){
            // console.log(`Pin moves on board: ${pin_moves.map(pin=>pin).join(', ')}`); 
            if(pin_moves.length>0){
                const pin_data = [];
                for(const pin of pin_moves){
                   const pinsOpponent = move_pins_opponent(board, pin, true);
                   if(typeof(pinsOpponent)!=='boolean'){
                    const {pinning_piece, pinning_square, pinned_piece, pinned_square, pinned_to_square} = pinsOpponent;
                    pin_data.push({pin_move: pin.lan, pinning_piece, pinning_square, pinned_piece, pinned_square, pinned_to_square}); 
                   }
                }
                return pin_data;
            }
            // console.log("There are no pin moves on the board");
            return false;
        }
    }

    if(pin_moves.length==0){
        // console.log("There are no pin moves on the board");
        return false;
    }

    else{
        if(pin_moves.includes(move)){
            // console.log("The move does not miss a pin move");
            return false;
        }
        // console.log("The move misses a pin move");
        return true;
    }
}

function move_misses_free_piece(board:Chess, move:Move, return_free_captures:boolean=false){
    // console.log(`Checking if move ${move.san} misses a free piece square...`);
    
    let free_captures= [];

    for(const legal_move of board.moves({verbose:true})){
        if(move_captures_free_piece(board, legal_move)){
            if(legal_move!==move){
              let free_piece = legal_move.captured;
              let free_square = legal_move.to;
              free_captures.push({legal_move: {san:legal_move.san, lan:legal_move.lan}, free_piece, free_square});
              // console.log(`Move ${legal_move.san} captures a free ${free_piece} on ${free_square}, added to free_captures`);
            }
            else{
                // console.log("Played move is the move that captures free piece, returnig empty array (false)");
                free_captures = [];
                break;
            }
        }
    }

    if(return_free_captures){
        // console.log("Returning list of free capture moves: ", free_captures);
        return free_captures;
    }

    if(free_captures.length==0){
        // console.log("No free capture moves found, returning False");
        return false;
    }
    else{
        // console.log("The move misses a free capture move, returning true");
        return true;
    }
}


async function mate_in_n_for(board:Chess){
    // console.log("Checking for mate in n moves for board: ", board.fen());
    
    const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(board.fen())}&depth=13&mode=bestmove`, {
        method: 'GET',
        cache: 'no-store'
      });
  
      if (response.ok) {
          const { success, bestmove } = await response.json();
          const data = bestmove;
          // console.log("Response v1: ", data);
          if (success) {
            const bestMoveForPrompt = data.split(' ')[1];
           // Store the best move calculated at depth 13
            // Continue using the depth according to difficulty level for making the actual move in the game
            return bestMoveForPrompt;
            //setPointer(prevPointer=>prevPointer+1);
          } else { 
            return board.moves({verbose:true})[0].lan;
          }
          
        } else {
  
          console.error(`Error: ${response.statusText}`);
          return board.moves({verbose:true})[0].lan;
        }

}

async function get_best_sequence_and_mate_in_n_for(game:Chess){
    // console.log("Getting best move sequence for board ", game.fen());

    const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(game.fen())}&depth=13&mode=bestmove`, {
        method: 'GET',
        cache: 'no-store'
      });
  
      if (response.ok) {
          const { success, bestmove, continuation, mate } = await response.json();
          const data = bestmove;
          // console.log("Response v1: ", data);
          if (success) {
            const sequence = continuation.split(' ');
            let n=null;
            let losingSide = null;
            if(mate){
               if(typeof(mate) === 'string'){
                 n = Math.abs(parseInt(mate));
                 losingSide = mate.includes('-') ? 'White' : 'Black';
               }
               else {
                 n = Math.abs(mate);
                 losingSide = mate>0 ? 'Black' : 'White';
               }
            }
           // Store the best move calculated at depth 13
            // Continue using the depth according to difficulty level for making the actual move in the game
            // console.log("Best move sequence: ", sequence);
            return {losingSide, n, sequence:[...sequence]};
            //setPointer(prevPointer=>prevPointer+1);
          } else { 
            return {losingSide:null, n:null, sequence:[]};
          }
          
        } else {
  
          console.error(`Error: ${response.statusText}`);
          return {losingSide:null, n:null, sequence:[]};
        }

}




export async function reviewMove(
     game: Chess, 
     move: any, 
     previousReview: string,
     checkIfOpening = false, 
     bestMove:any,
     stockfish_data_prior_move: any,
     stockfish_data_post_move: any,
    ) {
    // console.log(`Reviewing move: ${move}`);

    //const game = new Chess(gameFen);
    const positionAfterMove = new Chess();
    positionAfterMove.loadPgn(get_board_pgn(game));
    // console.log(`Creating a copy of the board: ${game.fen()}`);
    const playMove = positionAfterMove.move(move);
    // console.log(`Pushing the move ${playMove.san} on the copy: ${positionAfterMove.fen()}`);

    let review = '';
    // console.log(`Initializing review string: ${review}`);

    
    //const score = await get_stockfish_evaluation(game.fen());
    const gCpy = new Chess(game.fen());
    const bestMovePlayed = gCpy.move(bestMove);

    //// console.log(`Getting the best move for the position: ${game.san(bestMove)}`);

    if (checkIfOpening) {
        // console.log("Checking if the move is an opening move");
        const openingData = is_an_opening(get_board_pgn(positionAfterMove));
        if(typeof(openingData) == 'object'){
            const {opening_name, opening_description} = openingData;
            if(opening_name){
                let bestMovePlayedSan=bestMovePlayed.san;
                review = `This is a book move in the ${opening_name} opening. `;
                return {review, bestMove, bestMovePlayedSan, moveClass:"book"};
            }
        }
    }

    
    const {score: scoreChange, class: moveClassification} = classify_move(game, move, stockfish_data_prior_move, stockfish_data_post_move);
 
    let moveClass = moveClassification;
    // console.log(`Classifying the move: ${moveClass}`);

    if (['excellent', 'good'].includes(moveClass)) {
        // console.log("The move is classified as excellent or good");

        if (move === bestMove) {
            moveClass = "best";
            // console.log(`The move is the best move, updating classification: ${moveClass}`);
        }
        
        // <<prompt_optimization>> WE NEED TO FIGURE THIS OUT CAUSE ATM THIS PART IS NOT REACHABLE 
        if (['mates', 'mates_continues', 'mated_continues', 'gets_mated', 'lost_mate'].includes(moveClass)) { 
            const n = scoreChange; 
            
            if (moveClass.includes('mates')) {
                const winningSide = game.turn() ? 'White' : 'Black';
                review += `${move} is ${moveClass}, leading to checkmate for ${winningSide} in ${n} moves. `;
            } else if (moveClass.includes('mated')) {
                const losingSide = game.turn() ? 'White' : 'Black';
                review += `${playMove.san} is ${moveClass}, leading to ${losingSide} getting mated in ${n} moves. `;
            } else {
                review += `${playMove.san} is ${moveClass}, losing a checkmate sequence. `;
            }
        } else {
            if (moveClass === 'excellent') {
                review += `${playMove.san} is an excellent move, gaining ${scoreChange} centipawns. `;
            } else if (moveClass === 'good') {
                review += `${playMove.san} is a good move, gaining ${scoreChange} centipawns. `;
            }

            const tradeData = is_possible_trade(game, move);
            if (tradeData && !move_is_discovered_check(game, move)) {       
                // console.log("The move is a possible trade and not a discovered check");
                review += `This move offers a trade of ${tradeData}. `; 
            }

            const defendedData = move_defends_hanging_piece(game, move, true);
            if (typeof(defendedData)!=='boolean' && defendedData.length > 0) {
                review += `This defends the hanging ${defendedData.map((item, idx)=>(piece_dict(item.piece)+' on '+item.square)).join(',')}. `
            }

           

            const forkingData = move_creates_fork(game.fen(), move, true);
            if (forkingData) {
                if(typeof(forkingData)!=='boolean'){
                  const {forkingPiece, forkingSquare, forkedPieces, forkedSquares} = forkingData;
                  review += `This creates a fork with the ${forkingPiece} on ${forkingSquare}, threatening the ${formatItemList(forkedSquares.map(s => [piece_dict(positionAfterMove.get(s).type), s]))}. `;
                }
            } else {
                const attackedData = move_attacks_piece(game, playMove.lan, true);
                if (attackedData) {
                    if(typeof(attackedData)!=='boolean'){
                      const {attackingPiece, attackingSquare, targetedPiece, targetedSquare} = attackedData;
                      review += `This move attacks the ${targetedPiece} on ${targetedSquare} with the ${attackingPiece} on ${attackingSquare}. `;
                    }
                }
            }

            const blockCheckData = move_blocks_check(game, playMove);
            if (blockCheckData) {
                //const [blocksCheck, blockingPiece, blockingSquare] = blockCheckData;
                review += `This blocks the check with the ${playMove.piece} on ${get_king_square(game.fen(), game.turn())}. `;
            }

            const developingData = is_developing_move(game, playMove);
            if (developingData) {
                review += `This develops the ${developingData}. `;
            }

            const fianchettoData = is_fianchetto(game, playMove);
            if (fianchettoData) {
                const {bishop_color, to_square_name} = fianchettoData;
                review += `This fianchettos the ${bishop_color} Bishop on the ${to_square_name} square. `;
            }

            const pinData = move_pins_opponent(game, playMove, true);
            if (pinData) {
                if(typeof(pinData)=='boolean'){
                  review+= 'This move pins the opponent piece to the King';
                }
                else{
                  const {pinning_piece, pinning_square, pinned_piece, pinned_square, pinned_to_square} = pinData;
                  review += `This pins the ${PieceDict[pinned_piece!]} on ${pinned_square} to the King on ${pinned_to_square} with the ${PieceDict[pinning_piece]} on ${pinning_square}. `;
                }
            }

            const openFileData = moves_rook_to_open_file(game, playMove);
            if (openFileData) {
                review += `This moves the Rook to the open ${openFileData}. `;
            }

            if (is_endgame(game)) {
                // console.log("The position is an endgame");
                if (move_moves_king_off_backrank(game, playMove)) {
                    // console.log("The move moves the king off the back rank");
                    review += "By moving the king off the back rank, the risk of back rank mate threats is reduced and the king's safety is improved. ";
                }
            }

            const tempoGainedData = move_wins_tempo(game, playMove, stockfish_data_prior_move, stockfish_data_post_move);
            if (tempoGainedData) {
                const {attacking_piece, attacking_square, attacked_piece, attacked_square} = tempoGainedData;
                review += `This wins a tempo by attacking the ${attacked_piece} on ${attacked_square} with the ${attacking_piece} on ${attacking_square}. `;
            }

            if (!previousReview.includes('trade')) {
                // console.log("The previous review did not mention a trade");
                if (move_captures_higher_piece(game, playMove)) {
                    // console.log("The move captures a higher value piece");
                    review += `This captures a higher value piece. `;
                }

                if (!previousReview.includes('higher value piece')) {
                    // console.log("The previous review did not mention capturing a higher value piece");
                    if (move_captures_free_piece(game, playMove)) {
                        const pieceType = piece_dict(playMove.captured!);
                        // console.log(`The move captures a free ${pieceType}`);
                        review += `This captures a free ${pieceType}. `;
                    }
                }
            }
            
            const discoveredCheckAndAttacksData = move_is_discovered_check_and_attacks(game, playMove.lan, true);
            if (discoveredCheckAndAttacksData) {
                if(typeof(discoveredCheckAndAttacksData)=='boolean'){
                   review+= "This creates a discovered check whilst attacking hanging or pieces of higher rank";
                }
                else if(discoveredCheckAndAttacksData.length>0){
                    review += `This creates a discovered check whilst attacking ${formatItemList(discoveredCheckAndAttacksData.map(s =>
                    [piece_dict(game.get(s as Square).type), s]))}. `;
                 }
            }

            const trappedData = move_traps_opponents_piece(game, playMove, true);
            if (trappedData) {
                if(typeof(trappedData)=='boolean'){
                    review += `This move traps the opponents piece`;
                }
                else if(trappedData.trapped_squares.length>0){
                    const {trapped_piece_names, trapped_squares} = trappedData;
                    review += `This traps the ${trapped_squares.map((s:string, idx:number)=>(trapped_piece_names[idx]+' on '+ s)).join(', ')}`;
                }   
            }

            if (is_possible_sacrifice(game, playMove)) {
                // console.log("The move is a possible sacrifice");
                moveClass = 'brilliant';
                // console.log(`Updating move classification to brilliant: ${moveClass}`);
                review = review.replace('best', 'brilliant');
                review = review.replace('good', 'brilliant');
                review = review.replace('excellent', 'brilliant');
                review += `This sacrifices the ${PieceDict[playMove.piece]} on ${playMove.from}. `;
            }

            const mateThreatData = move_threatens_mate_sync(game, playMove.lan, stockfish_data_post_move);
            //THIS CAN BE IMPROVED CAUSE NOW IT WOULD WRITE OUT THE MESSAGE REGARDLES WHETHER THE PLAYER OR HIS OPPONENT CAN DELIVER MATE IN x MOVES
            if (mateThreatData) {
                const {mate_in, mating_moves} = mateThreatData;
                if(mate_in){
                 review += `This creates a checkmate threat. Mate can be delivered in ${mate_in} moves with the sequence: ${mating_moves}. `; 
                }
            }
        }
    } else if (['inaccuracy', 'mistake', 'blunder'].includes(moveClass)) {
        // console.log("The move is classified as an inaccuracy, mistake, or blunder");
        if (moveClass === 'inaccuracy') {
            review += `${playMove.san} is an inaccuracy, losing ${-scoreChange!} centipawns. `;
        } else if (moveClass === 'mistake') {
            review += `${playMove.san} is a mistake, losing ${-scoreChange!} centipawns. `;
        } else {
            review += `${playMove.san} is a blunder, losing ${-scoreChange!} centipawns. `;
        }

        const hangingData = move_hangs_piece(game, playMove, true);
        if (hangingData) {
            const {hanging_piece_names, hanging_square_names} = hangingData;
            review += `This move leaves the ${hanging_square_names.map((sq, idx)=> hanging_piece_names[idx]+' on '+sq).join(', ')} hanging. `;
        }

        let capturablePiecesByLower = check_for_capturable_pieces_by_lower(positionAfterMove);
        if(hangingData){
          capturablePiecesByLower = capturablePiecesByLower.filter(s => !hangingData.hanging_square_names.includes(s));
        }
        
        const tradeData= is_possible_trade(game, playMove.lan);
        if (capturablePiecesByLower.length > 0 && !positionAfterMove.isCheck() && !tradeData) {
            // console.log("The move allows pieces to be captured by lower value pieces, is not a check, and is not a trade");
            const capturableItems = capturablePiecesByLower.map(s => [piece_dict(positionAfterMove.get(s as Square).type), s]);
            review += `A ${formatItemList(capturableItems)} can be captured by a lower value piece. `;
        }

        const forkingData = move_allows_fork(game, playMove, true);
        if (forkingData) {
            if(typeof(forkingData)!=='boolean'){
                forkingData.forEach(({forking_move_lan, forkingPiece, forkingSquare, forkedPieces, forkedSquares}) => {
                    review += `This allows the opponent's ${forkingPiece} on ${forkingSquare} to fork the ${formatItemList(forkedPieces.map((piece, i) => [piece, forkedSquares[i]]))} with ${forking_move_lan}. `;
                });
            }
        }

        const missedForks = move_misses_fork(game, playMove, true);
        if(typeof(missedForks)!=='boolean'){
            if (missedForks.includes(bestMove) && playMove.lan !== bestMove) {
                // console.log("The best move was a missed fork");
                review += `There was a missed fork with ${bestMove}. `;
            }
        }
        

        const pinMissedData = move_misses_pin(game, playMove, true);
        if (pinMissedData) {
            if(typeof(pinMissedData)!=='boolean'){
            pinMissedData.forEach(({pin_move, pinning_piece, pinning_square, pinned_piece, pinned_square, pinned_to_square}) => {
                review += `This misses the chance to pin the ${PieceDict[pinned_piece!]} on ${pinned_square} to the ${pinned_to_square} with the ${PieceDict[pinning_piece]} on ${pinning_square} by playing ${pin_move}. `;
            });
            }
        }

        const freeCaptureData = move_misses_free_piece(game, playMove, true);
        if (freeCaptureData && typeof(freeCaptureData)!=='boolean') {
            freeCaptureData.forEach(({legal_move, free_piece, free_square}) => {
                if (bestMove === legal_move.lan && playMove.lan !== bestMove) {
                    // console.log("The best move was a missed free capture");
                    review += `An opportunity to take the ${free_piece} on ${free_square} by playing ${legal_move.san} was lost. `;
                }
            });
        }
 
        //const letsOpponentPlayMove = await get_best_move(positionAfterMove);
        const letsOpponentPlayMove = stockfish_data_post_move.bestmove;
        // console.log(`Getting the best move for the opponent: ${letsOpponentPlayMove}`);

        const GameWithOpponentPlay = new ChessTemp(positionAfterMove.fen());
        const opponentsMove = GameWithOpponentPlay.move(letsOpponentPlayMove);
        const isThreatingMate = move_threatens_mate_sync(game, playMove.lan, stockfish_data_post_move);

        if (isThreatingMate) {
            // console.log("The best move threatens a checkmate");
            review += "This misses an opportunity to create a checkmate threat. ";
        }
         
        
        const attackedPiece = move_attacks_piece(game, bestMove, true);
        if (attackedPiece && typeof(attackedPiece)!=='boolean') {
            const {attackingPiece, attackingSquare, targetedPiece, targetedSquare} = attackedPiece;
            review += `A chance to attack the ${targetedPiece} on ${targetedSquare} with the ${attackingPiece} on ${attackingSquare} using ${bestMove} was missed. `;
        }

        const isPieceAttacked = move_attacks_piece(positionAfterMove, letsOpponentPlayMove);
        if (isPieceAttacked) {
            // console.log("The opponent's best move attacks a piece");
            review += `This permits the opponent to attack a piece. `;
        }

        const attackedData = move_is_discovered_check_and_attacks(positionAfterMove, letsOpponentPlayMove, true);
        if (attackedData && typeof(attackedData)!=='boolean' && attackedData.length>0) {
            review += `This lets the opponent win ${formatItemList(attackedData.map(s => [piece_dict(positionAfterMove.get(s as Square).type), s]))} from a discovered check. `;
        }

        const missedAttackedData = move_is_discovered_check_and_attacks(game, bestMove, true);
        if (missedAttackedData && typeof(missedAttackedData)!=='boolean' && missedAttackedData.length>0) {
            review += `This loses a chance to attack ${missedAttackedData.map((square) => (PieceDict[game.get(square as Square).type]+' on '+square)).join(', ')} from a discovered check. `;
        }

        if (!attackedData) {
            const trappedData = move_traps_opponents_piece(positionAfterMove, opponentsMove, true);
            if (trappedData && typeof(trappedData) !== 'boolean' && trappedData.trapped_squares.length>0) {
                review += `This allows ${trappedData.trapped_squares.map((square, idx) => (trappedData.trapped_piece_names[idx]+' on '+square)).join(', ')} to be trapped. `;
            }
        }
        const missedTrappedData = move_traps_opponents_piece(game, bestMovePlayed, true);
        if (missedTrappedData && typeof(missedTrappedData) !== 'boolean') {
            review += `This loses a chance to trap ${missedTrappedData.trapped_squares.map((square, idx) => (missedTrappedData.trapped_piece_names[idx]+' on '+square)).join(', ')}. `;
        }

        if (await move_wins_tempo(positionAfterMove, opponentsMove, stockfish_data_prior_move, stockfish_data_post_move)) {
            // console.log("The opponent's best move wins a tempo");
            review += `The opponent can win a tempo. `;
        }

        review += `The opponent can play ${opponentsMove.san}. `;
        // console.log(`Final review: ${review}`);
    } else if (moveClass.includes('continues mate')) {
        let losingSide = moveClass.includes('white') ? 'Black' : 'White';
        //const losingSide = game.turn() ? 'w' : 'b';
        // console.log(`${losingSide} will still get checkmated`);
        review += `${playMove.san} is good, but ${losingSide} will still get checkmated. ${losingSide} gets mated in ${scoreChange}.`;
        // console.log(`Updated review: ${review}`);
        if (move === bestMove) {
            moveClass = "best";
            // console.log(`Updating move classification to best: ${moveClass}`);
        } else {
            moveClass = 'good';
            // console.log(`Updating move classification to good: ${moveClass}`);
        }
    } else if (moveClass.includes('gets mated')) {
        const losingSide = game.turn() ? 'White' : 'Black';
        // console.log(`${losingSide} gets mated`);
        const letsOpponentPlayMove = stockfish_data_post_move.bestmove;
        review += `The opponent can play ${letsOpponentPlayMove}. `;
        review += `${playMove.san} is a blunder and allows checkmate. ${losingSide} gets mated in ${scoreChange}.`;
        // console.log(`Updated review: ${review}`);

        moveClass = 'blunder';
        // console.log(`Updating move classification to blunder: ${moveClass}`);
    } else if (moveClass.includes('lost mate')) {
        const letsOpponentPlayMove = stockfish_data_post_move.bestmove;
        // console.log(`Getting the best move for the opponent: ${letsOpponentPlayMove}`);
        review += `This loses the checkmate sequence. The opponent can play ${letsOpponentPlayMove}. `;
        // console.log(`Updated review: ${review}`);
        moveClass = 'blunder';
        // console.log(`Updating move classification to blunder: ${moveClass}`);
    } else if (moveClass.includes('mates')) {
        const n = scoreChange;
        // console.log(`Getting the number of moves to mate: ${n}`);
        if (n) {
            // console.log("Player is continuing checkmate sequence");

            const previousN = parseInt(previousReview.split(' ').pop() || '0', 10);
            if (n <= previousN) {
                // console.log("Player is one move less away from mating");
                const winningSide = game.turn() === 'w' ? 'White' : 'Black';
                // console.log(`${winningSide} is the winning side`);
                if (n === 0) {
                    review += `Checkmate!`;
                    // console.log(`Updated review: ${review}`);
                } else {
                    review += `${playMove.san} continues the checkmate sequence. ${winningSide} gets mated in ${n}.`;
                    // console.log(`Updated review: ${review}`);
                }
            } else {
                const winningSide = game.turn() == 'w' ? 'White' : 'Black';
                // console.log(`${winningSide} is the winning side`);
                review += `${playMove.san} is good, but there was a faster way to checkmate. ${winningSide} gets mated in ${n}.`;
                // console.log(`Updated review: ${review}`);
                moveClass = 'good';
                // console.log(`Updating move classification to good: ${moveClass}`);
            }

            if (move === bestMove) {
                moveClass = "best";
                // console.log(`Updating move classification to best: ${moveClass}`);
            }
        }
    }

    //const {losingSide, n: numberOfMoves, sequence:bestSequence} = await get_best_sequence_and_mate_in_n_for(game);
    let losingSide = null;
    let numberOfMoves = null;
    let bestSequence:any[] = [];
    if(stockfish_data_post_move.mate){
        if(typeof(stockfish_data_post_move.mate) === 'string'){
          numberOfMoves = Math.abs(parseInt(stockfish_data_post_move.mate));
          losingSide = stockfish_data_post_move.mate.includes('-') ? 'White' : 'Black';
        }
        else {
          numberOfMoves = Math.abs(stockfish_data_post_move.mate);
          losingSide = stockfish_data_post_move.mate>0 ? 'Black' : 'White';
        }
     }
     bestSequence = stockfish_data_post_move.continuation.split(' ');
    if (bestSequence.length > 0) {
        review += `The best continuation from this position would be ${bestSequence.map(m => m).slice(0,6).join(' ')}. `;
    } else {
        review += `No clear continuation from this position. `;
    }

    if (numberOfMoves !== null) {
        review += `${losingSide} gets checkmated in ${numberOfMoves} moves with the sequence: ${bestSequence}. `;
    }

    // console.log(`Final move classification: ${moveClass}`);
    let bestMovePlayedSan = bestMovePlayed.san;
    return {moveClass, review, bestMove, bestMovePlayedSan};
}

interface ChessMoveAnalysis {
    input_data: string | string[],
    concise_board_state: any,
    detailed_board_state: any,
    semanticized_state: any,
    attackers_of_squares: any,
    pawn_structure_analysis: any,
    stockfish_analysis: any, 
    best_move_analysis: any,
    previous_move_analysis: any, 
    piece_development_analysis: any,
    tension_analysis: any,
    mobility_analysis: any,
    control_analysis: any 
}

interface AnalysisResults {
    [key: string]: any;
}
  
interface AnalysisTimes {
   [key: string]: number;
}
  

async function call_stockfish_api(fen:string, depth:number){
    // console.log("Getting stockfish info for ", fen);

    const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(fen)}&depth=${depth}&mode=bestmove`, {
        method: 'GET',
        cache: 'no-store'
      });
  
      if (response.ok) {
          const { success, bestmove, evaluation, continuation, mate } = await response.json();
          if (success) {
            const bestmoveExtracted = bestmove.split(' ')[1];
            // Continue using the depth according to difficulty level for making the actual move in the game
            return {bestmove: bestmoveExtracted, evaluation, continuation, mate};
            //setPointer(prevPointer=>prevPointer+1);
          } else { 
            return false;
          }
          
        } else {
  
          console.error(`Error: ${response.statusText}`);
          return false;
        }
}

function semanticize_stockfish_eval(evaluationScore: number | null): string {
    if (evaluationScore === null) {
        return "No evaluation score available.";
    }

    const score = evaluationScore;
    let advantage: string;

    if (score > 0) {
        advantage = "White";
    } else if (score < 0) {
        advantage = "Black";
    } else {
        return "The position is equal.";
    }

    const scoreAbs = Math.abs(score);
    let magnitude: string;

    if (scoreAbs < 1) {
        magnitude = "slight";
    } else if (scoreAbs < 3) {
        magnitude = "moderate";
    } else if (scoreAbs < 5) {
        magnitude = "significant";
    } else {
        magnitude = "decisive";
    }

    return `${advantage} has a ${magnitude} advantage (Score: ${score.toFixed(2)}).`;
}

function describe_move(moveObj: Move): string {
    const fromSquare: string = moveObj.from;
    const toSquare: string = moveObj.to;

    const piece = moveObj.piece;
    const pieceNames: { [key: string]: string } = {
        'r': 'Rook',
        'n': 'Knight',
        'b': 'Bishop',
        'q': 'Queen',
        'k': 'King',
        'p': 'Pawn'
    };
    const pieceName: string = piece ? pieceNames[piece] : 'Pawn';

    const capture = moveObj.captured;
    const captureIndicator: string = capture ? `captures ${pieceNames[capture]} on` : 'to';

    return `${pieceName} on ${fromSquare} ${captureIndicator} ${toSquare}`;
}

const chessboardAllSquares:Square[] = [
    "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8",
    "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8",
    "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8",
    "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8",
    "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8",
    "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8",
    "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8",
    "h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8"
]

function analyze_pawn_structure(fen: string): string {
    const board = new Chess(fen);

    function pawnStructure(pawns: Square[], color: Color, opponentColor: Color){
        const doubled: string[] = [];
        const isolated: string[] = [];
        const passed: string[] = [];
        const fileOccurrences: { [key: string]: number } = {
          a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0,
        };
        const fileNumExpressions: {[key: string]: number} = {
            a: 0, b:1, c:2, d:3, e:4, f:5, g:6, h:7,
        }

        const pawnPositions = pawns;

        // Count pawns on each file to identify doubled pawns
        for (const pawn of pawns) {
            const file = pawn[0];
            fileOccurrences[file] += 1;
        }

        for (const pawn of pawns) {
            const file = pawn[0];

            // Doubled Pawns
            if (fileOccurrences[file] > 1) {
                doubled.push(pawn);
            }

            // Isolated Pawns
            let isolatedFlag = true;
            for (let adjFile = Math.max(0, fileNumExpressions[file] - 1); adjFile <= Math.min(7, fileNumExpressions[file] + 1); adjFile++) {
                if (fileOccurrences[adjFile] > 0 && adjFile !== fileNumExpressions[file]) {
                    isolatedFlag = false;
                    break;
                }
            }
            if (isolatedFlag) {
                isolated.push(pawn);
            }

            // Passed Pawns
            let passedFlag = true;
            for (let rank = 1; rank < 8; rank++) {
                const targetSquare = file+rank;
                if (board.get(targetSquare as Square) && board.get(targetSquare as Square).color === opponentColor) {
                    passedFlag = false;
                    break;
                }
            }
            if (passedFlag) {
                passed.push(pawn);
            }
        }

        return {pawnPositions, doubled, isolated, passed};
    }

    const whitePawns:Square[] = [];
    const blackPawns:Square[] = [];
     chessboardAllSquares.map(sq => {
        const piece = board.get(sq);
        if(piece.type=='p'){
            if(piece.color=='w'){
                whitePawns.push(sq);
            }
            else blackPawns.push(sq);
        }
    });


    const whiteFeatures = pawnStructure(whitePawns, 'w', 'b');
    const blackFeatures = pawnStructure(blackPawns, 'b', 'w');

    function formatOutput(color: string, features:{
        pawnPositions: string[];
        doubled: string[];
        isolated: string[];
        passed: string[];
    }): string {
        const labels = ["Positions", "Doubled", "Isolated", "Passed"];
        const values = [features.pawnPositions, features.doubled, features.isolated, features.passed];
        return labels.map((label, i) => `- ${label}: ${values[i].join(', ') || 'None'}`).join('\n');
    }

    let result = "## White Pawns\n" + formatOutput("White", whiteFeatures);
    result += "\n## Black Pawns\n" + formatOutput("Black", blackFeatures);

    return result;
}

interface DevelopmentResult {
    white_development: number;
    black_development: number;
    white_undeveloped_pieces: string[];
    black_undeveloped_pieces: string[];
}

export function get_tension_long(board: Chess): {
    whiteTensionSentences: string[];
    blackTensionSentences: string[];
} {
    // console.log(`Getting tension for board: ${board.fen()}`);
    const whiteTensionInfo: any[] = [];
    const blackTensionInfo: any[] = [];
    const gameCopy = new ChessTemp(board.fen());
    // Calculate tension for the current side to move
    for (const move of gameCopy.moves({verbose:true})) {
        if (move.captured) {
            const attacker = move.from;
            const defender = move.to;
            const attackerColor = move.color === 'w' ? 'White' : 'Black';
            const attackerPiece = PieceDict[move.piece];
            const defenderColor = attackerColor === "Black" ? 'White' : 'Black';
            const defenderPiece = PieceDict[move.captured];
            const attackerValue = piece_eval(move.piece);
            const defenderValue = piece_eval(move.captured);
            const capturableByLower = attackerValue < defenderValue ? 1 : attackerValue>defenderValue ? 2 : 3;

            const tensionInfo = {
                attackerSquare: attacker,
                attackerPiece: attackerPiece,
                attackerColor: attackerColor,
                attackerValue: attackerValue,
                defenderSquare: defender,
                defenderPiece: defenderPiece,
                defenderColor: defenderColor,
                defenderValue: defenderValue,
                capturableByLower: capturableByLower
            };

            if (move.color === "w") {
                whiteTensionInfo.push(tensionInfo);
            } else {
                blackTensionInfo.push(tensionInfo);
            }
        }
    }

    // Make a null move to switch the turn
    //board.move(chess.NULL_MOVE);
    //WE DONT HAVE NULL MOVE IN Chess.js library SO I WILL TRY TO USE A WAY AROUND BY ALTERING FEN AND CHANGE 'w' to 'b' and VICE VERSA

    let alterFen = gameCopy.fen().split(' ');
    alterFen[1] = alterFen[1] === 'w' ? 'b' : 'w';
     
    gameCopy.load(alterFen.join(' '),{ skipValidation: true });

    // Calculate tension for the other side
    for (const move of gameCopy.moves({verbose:true})) {
        if (move.captured) {
            const attacker = move.from;
            const defender = move.to;
            const attackerColor = move.color === 'w' ? 'White' : 'Black';
            const attackerPiece = PieceDict[move.piece];
            const defenderColor = attackerColor === "Black" ? 'White' : 'Black';
            const defenderPiece = PieceDict[move.captured];
            const attackerValue = piece_eval(move.piece);
            const defenderValue = piece_eval(move.captured);
            const capturableByLower = attackerValue < defenderValue ? 1 : attackerValue>defenderValue ? 2 : 3;

            const tensionInfo = {
                attackerSquare: attacker,
                attackerPiece: attackerPiece,
                attackerColor: attackerColor,
                attackerValue: attackerValue,
                defenderSquare: defender,
                defenderPiece: defenderPiece,
                defenderColor: defenderColor,
                defenderValue: defenderValue,
                capturableByLower: capturableByLower
            };

            if (move.color === "w") {
                whiteTensionInfo.push(tensionInfo);
            } else {
                blackTensionInfo.push(tensionInfo);
            }
        }
    }

    // Undo the null move to restore the original turn

    const whiteTensionSentences: string[] = [];
    const blackTensionSentences: string[] = [];
    for (const tension of whiteTensionInfo) {
        let sentence = `${tension.attackerColor}'s ${tension.attackerPiece} on ${tension.attackerSquare} is attacking ${tension.defenderColor}'s ${tension.defenderPiece} on ${tension.defenderSquare}. `;
        sentence += tension.capturableByLower == 1
            ? `The ${tension.defenderPiece} is worth more than the ${tension.attackerPiece}.`
            : tension.capturableByLower==2 ? `The ${tension.attackerPiece} is worth more than the ${tension.defenderPiece}.` :
            `The attacker ${tension.attackerPiece} has the same value as the defender ${tension.defenderPiece}.`;
        whiteTensionSentences.push(sentence);
    }
    for (const tension of blackTensionInfo) {
        let sentence = `${tension.attackerColor}'s ${tension.attackerPiece} on ${tension.attackerSquare} is attacking ${tension.defenderColor}'s ${tension.defenderPiece} on ${tension.defenderSquare}. `;
        sentence += tension.capturableByLower == 1
        ? `The ${tension.defenderPiece} is worth more than the ${tension.attackerPiece}.`
        : tension.capturableByLower==2 ? `The ${tension.attackerPiece} is worth more than the ${tension.defenderPiece}.` :
        `The attacker ${tension.attackerPiece} has the same value as the defender ${tension.defenderPiece}.`;
        blackTensionSentences.push(sentence);
    }

    // console.log(`White tension sentences: ${whiteTensionSentences}`);
    // console.log(`Black tension sentences: ${blackTensionSentences}`);

    return {
        whiteTensionSentences: whiteTensionSentences,
        blackTensionSentences: blackTensionSentences
    };
}


//<<prompt_optimization>> I THINK HERE WAS A LOGICAL MISTAKE IN THE ORIGINAL CODE SO I ADJUSTED IT - THIS NEEDS CHECKING
function get_development_long(board: Chess): DevelopmentResult {
    // console.log(`Getting development for board: ${board.fen()}`);
    let whiteDev = 0;
    let blackDev = 0;
    const whiteUndevelopedPieces: string[] = [];
    const blackUndevelopedPieces: string[] = [];

    const whiteRookSquares: Square[] = ["a1", "h1"];
    const whiteKnightSquares: Square[] = ["b1", "g1"];
    const whiteBishopSquares: Square[] = ["c1", "f1"];

    for (const square of whiteRookSquares) {
        if (board.get(square)?.type == 'r') { // Logical operator in OC is !==
            whiteDev += 1;
            whiteUndevelopedPieces.push(`Rook on ${square}`);
            // console.log(`White rook on ${square} is not developed, incrementing whiteDev`);
        }
    }

    for (const square of whiteKnightSquares) {
        if (board.get(square)?.type == 'n') { // Logical operator in OC is !==
            whiteDev += 1;
            whiteUndevelopedPieces.push(`Knight on ${square}`);
            // console.log(`White knight on ${square} is not developed, incrementing whiteDev`);
        }
    }

    for (const square of whiteBishopSquares) {
        if (board.get(square)?.type == 'b') { // Logical operator in OC is !==
            whiteDev += 1;
            whiteUndevelopedPieces.push(`Bishop on ${square}`);
            // console.log(`White bishop on ${square} is not developed, incrementing whiteDev`);
        }
    }

    if (board.get("d1")?.type == 'q') {
        whiteDev += 1;
        whiteUndevelopedPieces.push("Queen");
        // console.log("White queen is not developed, incrementing whiteDev");
    }

    const blackRookSquares: Square[] = ["a8", "h8"];
    const blackKnightSquares: Square[] = ["b8", "g8"];
    const blackBishopSquares: Square[] = ["c8", "f8"];

    for (const square of blackRookSquares) {
        if (board.get(square)?.type == 'r') {
            blackDev += 1;
            blackUndevelopedPieces.push(`Rook on ${square}`);
            // console.log(`Black rook on ${square} is not developed, incrementing blackDev`);
        }
    }

    for (const square of blackKnightSquares) {
        if (board.get(square)?.type == 'n') {
            blackDev += 1;
            blackUndevelopedPieces.push(`Knight on ${square}`);
            // console.log(`Black knight on ${square} is not developed, incrementing blackDev`);
        }
    }

    for (const square of blackBishopSquares) {
        if (board.get(square)?.type == 'b') {
            blackDev += 1;
            blackUndevelopedPieces.push(`Bishop on ${square}`);
            // console.log(`Black bishop on ${square} is not developed, incrementing blackDev`);
        }
    }

    if (board.get("d8")?.type == 'q') {
        blackDev += 1;
        blackUndevelopedPieces.push("Queen");
        // console.log("Black queen is not developed, incrementing blackDev");
    }

    // console.log(`White development score: ${whiteDev}`);
    // console.log(`Black development score: ${blackDev}`);

    return {
        white_development: whiteDev,
        black_development: blackDev,
        white_undeveloped_pieces: whiteUndevelopedPieces,
        black_undeveloped_pieces: blackUndevelopedPieces
    };
}


//<<prompt_optimization>>THINK THE ORIGINAL CODE LOGIC HERE IS A BIT OFF SO I FIXED IT... NEEDS CHECKING
function get_mobility_long(board:Chess){
    // console.log("Getting mobility for board: ",board.fen());
    let white_mobility = 0;
    let black_mobility = 0;
    const white_mobility_squares = [];
    const black_mobility_squares = [];

    const gameCopy = new ChessTemp(board.fen());

    // Calculate mobility for White
    //<<prompt_optimization>> Logic problem was here, and in the similar function below (but also might be just differences between Python and typescript library)
    //it goes throught all the possible moves, and all of them can be only with white pieces or only with black pieces depending on which color has a turn.
    //In the original code it's assumed that its always white's turn so in this fist for loop it only collects White mobility moves, then plays null move and collects
    //black mobility moves. 
    for (const move of gameCopy.moves({verbose:true})) {
        const piece = move.piece;
        const pieceColor = move.color === "w" ? 'White' : 'Black';
        const squareFrom = move.from;
        const squareTo = move.to;
        if (move.color === "w") {
            white_mobility++;
            white_mobility_squares.push(`${squareFrom} to ${squareTo}`);
            // console.log(`White mobility move: ${squareFrom} to ${squareTo}`);
        }
        else{
            black_mobility++;
            black_mobility_squares.push(`${squareFrom} to ${squareTo}`);
            // console.log(`Black mobility move: ${squareFrom} to ${squareTo}`);
        }
    }

    // Make a null move to switch the turn to Black
    //board.push(chess.NULL_MOVE);
    let alterFen = gameCopy.fen().split(' ');
    alterFen[1] = alterFen[1] === 'w' ? 'b' : 'w';
     
    gameCopy.load(alterFen.join(' '),{ skipValidation: true });

    // Calculate mobility for Black
    for (const move of gameCopy.moves({verbose:true})) {
        const piece = move.piece;
        const pieceColor = move.color === "w" ? 'White' : 'Black';
        const squareFrom = move.from;
        const squareTo = move.to;
        if (move.color === "w") {
            white_mobility++;
            white_mobility_squares.push(`${squareFrom} to ${squareTo}`);
            // console.log(`White mobility move: ${squareFrom} to ${squareTo}`);
        }
        else{
            black_mobility++;
            black_mobility_squares.push(`${squareFrom} to ${squareTo}`);
            // console.log(`Black mobility move: ${squareFrom} to ${squareTo}`);
        }
    }

    // Undo the null move to restore the original turn
    let alterFenBack = gameCopy.fen().split(' ');
    alterFen[1] = alterFen[1] === 'w' ? 'b' : 'w';
    gameCopy.load(alterFenBack.join(' '),{ skipValidation: true });

    let mobilityContext = '';
    if (white_mobility > black_mobility) {
        mobilityContext = `White has more mobility on the board than Black. White can make ${white_mobility} moves, while Black can make only ${black_mobility} moves.`;
    } else if (black_mobility > white_mobility) {
        mobilityContext = `Black has more mobility on the board than White. Black can make ${black_mobility} moves, while White can make only ${white_mobility} moves.`;
    } else {
        mobilityContext = `Both sides have equal mobility, with each side being able to make ${white_mobility} moves.`;
    }
    // console.log(`Mobility context: ${mobilityContext}`);

    const tensionMobilitySentences: string[] = [];
    // console.log('Initialized tensionMobilitySentences list');
    const tensionInfo = get_tension_long(board); 

    for (const tension of [...tensionInfo.whiteTensionSentences, ...tensionInfo.blackTensionSentences]) {
        const attackerSquare = tension.split("'s ")[1].split(" on ")[1].split(" is attacking ")[0];
        // console.log(`Attacker square: ${attackerSquare}`);
        const piece = board.get(attackerSquare as Square);
        const targets = gameCopy.targeting(attackerSquare as Square, piece.color);
        const mobility = targets ? targets.filter((sq:Square) => gameCopy.get(sq).color!==piece.color).length : 0;
        const sentence = `The ${PieceDict[piece.type]} on ${attackerSquare} involved in the tension has ${mobility} potential moves. It can move to the 
        following squares: ${targets ? targets.filter((sq:Square) => gameCopy.get(sq).color!==piece.color).join(', ') : 'None'}.`;
        // console.log(`Tension mobility sentence: ${sentence}`);
        tensionMobilitySentences.push(sentence);
    }

    return {
        whiteMobility: white_mobility,
        blackMobility: black_mobility,
        mobilityContext: mobilityContext,
        tensionMobilitySentences: tensionMobilitySentences
    };
}

function get_control_long(board: Chess) {
    // console.log(`Getting control for board: ${board.fen()}`);

    let white_control = 0;
    let black_control = 0;
    const white_control_pieces = [];

    // console.log("Initialized whitee control pieces list");
    const black_control_pieces = [];
    // console.log("Initialized black_control_pieces list");

    const gameCopy = new ChessTemp(board.fen()); //so we can check for targets (attacks)
    for(const square of chessboardAllSquares){
        // console.log(`Checking square: ${square}`);
        const piece = board.get(square);
        if(piece){
            const piece_color = piece.color == 'w' ? "White" : "Black";
            const piece_name = PieceDict[piece.type];
            const targets = gameCopy.targeting(square, piece.color);
            const control = targets ? targets.filter((sq: Square) => gameCopy.get(sq).color!==piece.color) : [];
            const controlSize = control.length;
            // console.log(`${piece_color}'s ${piece_name} on ${square} controls ${controlSize} squares`);
            if(piece.color=='w'){
                white_control+=controlSize;
                white_control_pieces.push(`${piece_color}'s ${piece_name} on ${square}`);
            }
            else{
                black_control+=controlSize;
                black_control_pieces.push(`${piece_color}'s ${piece_name} on ${square}`);
            }
        }
    }

    let control_context = "";
    if (white_control > black_control) {
        control_context = `White has more control over the board than Black. White controls ${white_control} squares, with key pieces being ${white_control_pieces.slice(0, 3).join(', ')}. Black controls ${black_control} squares.`;
    } else if (black_control > white_control) {
        control_context = `Black has more control over the board than White. Black controls ${black_control} squares, with key pieces being ${black_control_pieces.slice(0, 3).join(', ')}. White controls ${white_control} squares.`;
    } else {
        control_context = `Both sides have equal control over the board, controlling ${white_control} squares each.`;
    }

    return{
        white_control,
        black_control,
        control_context,
    }
}


export async function analyzeChessMoveV3(
    input_data: string,
    after_last_move_stockfish: {evaluation: any, mate: any, continuation: any, bestmove: any},
    after_second_to_last_move_stockfish: {evaluation: any, mate: any, continuation: any, bestmove: any},
    concise_board_state: boolean = false,
    detailed_board_state: boolean = false,
    semanticized_state: boolean = false,
    attackers_of_squares: boolean = false,
    pawn_structure_analysis: boolean = false,
    stockfish_analysis: boolean = false,
    best_move_analysis: boolean = false,
    previous_move_analysis: boolean = false,
    piece_development_analysis: boolean = false,
    tension_analysis: boolean = false,
    mobility_analysis: boolean = false,
    control_analysis: boolean = false,
) {
    const game = new Chess();
    let analysis_results:AnalysisResults = {};
    let print_output = "";
    let analysis_times:AnalysisTimes = {};
    let fen = '';
    if(typeof(input_data) == 'string') {
        if(validateFen(input_data).ok){
         game.load(input_data);
        }
        else{
         game.loadPgn(input_data);
        }
    }
    
     
    const GameClone = new Chess(game.fen());
    const bstMvPlay = GameClone.move(after_last_move_stockfish.bestmove);
    let after_best_next_move_play_stockfish = null;
    if(!GameClone.isGameOver()){
     after_best_next_move_play_stockfish = await call_stockfish_api(GameClone.fen(), 13);
    }
    if(concise_board_state){
       const start_time = (new Date()).getTime();
       const concise_state = fen_to_board_state_concise(game.fen());
       analysis_results['concise_state'] = concise_state;
       analysis_times['concise_board_state'] = (new Date()).getTime() - start_time;
    }
    if (detailed_board_state) {
        let start_time = (new Date()).getTime();
        let detailedState = fen_to_board_state_long(game.fen());
        analysis_results['detailed_state'] = detailedState;
        analysis_times['detailed_board_state'] = (new Date()).getTime() - start_time;
      }
    if (concise_board_state) {
        const start_time = Date.now();
        const concise_state = fen_to_board_state_concise(game.fen());
        analysis_results['concise_state'] = concise_state;
        analysis_times['concise_board_state'] = (Date.now() - start_time) / 1000;
    }
    if (detailed_board_state) {
        const start_time = Date.now();
        const detailed_state = fen_to_board_state_long(game.fen());
        analysis_results['detailed_state'] = detailed_state;
        analysis_times['detailed_board_state'] = (Date.now() - start_time) / 1000;
    }
    try {
        if (best_move_analysis || previous_move_analysis) {
            const start_time = Date.now();
            let previous_review = '';
            let check_if_opening = false;

            if (previous_move_analysis && game.history().length > 0) {
                const makeCopy = new Chess();
                makeCopy.loadPgn(get_board_pgn(game));
                const last_move = makeCopy.undo();
                const last_move_san = last_move?.san;
                const {review, bestMove, bestMovePlayedSan, moveClass} =await reviewMove(makeCopy, last_move, previous_review, check_if_opening, after_second_to_last_move_stockfish.bestmove, after_second_to_last_move_stockfish, after_last_move_stockfish);
                analysis_results['previous_move_analysis'] = {
                    review,
                    bestMove,
                    bestMovePlayedSan,
                    moveClass,
                    previous_move: last_move_san
                };
            }
            if (best_move_analysis && after_best_next_move_play_stockfish) {
                
                const  {review, bestMove, bestMovePlayedSan, moveClass}  = await reviewMove(game, after_last_move_stockfish.bestmove, previous_review, check_if_opening, after_last_move_stockfish.bestmove, after_last_move_stockfish, after_best_next_move_play_stockfish);
                analysis_results['best_move_analysis'] = {
                    review,
                    bestMove,
                    bestMovePlayedSan,
                    moveClass,
                };
                //This doesnt make sense for in our use case cause best_move_analysis is to analyze the possible user's best next move
                //This is to compare played move with best move, so we can move it to the previous_move_analysis and this would compere and store the information
                //Whether the computer played best move or not...
                {/*if (previous_move_analysis && game.history().length > 0) {
                    const last_move = game.undo();
                    const last_move_san = last_move?.san;
                    game.move(last_move_san!);
                    if (last_move_san !== bestMovePlayedSan) {
                        analysis_results['move_comparison'] = `The played move (${last_move_san}) differs from the best move (${bestMovePlayedSan}).`;
                    } else {
                        analysis_results['move_comparison'] = `The played move (${last_move_san}) matches the best move (${bestMovePlayedSan}).`;
                    }
                }*/}
            }
            analysis_times['move_analysis'] = (Date.now() - start_time) / 1000;
        }
    } catch (e) {
        console.error(`Error in move analysis: ${e}`);
        analysis_results['move_analysis'] = { error: e };
    }

    try {
        if (stockfish_analysis) {
            const start_time = Date.now();
            const depth = 13;
            const modes = ['evaluation', 'bestmove', 'lines'];
            const stockfish_output = after_last_move_stockfish;
            console.log("PASS 9");
            for (const mode of modes) {
                

                if (stockfish_output) {
                    if (mode === 'evaluation') {
                        const evaluation_score = stockfish_output.evaluation;
                        analysis_results['evaluation'] = semanticize_stockfish_eval(evaluation_score);
                    } else if (mode === 'bestmove') {
                        let bestmove = stockfish_output.bestmove || 'No best move data';
                        if (bestmove !== 'No best move data') {
                            const gameCpyy = new Chess(game.fen());
                            const bestMove = gameCpyy.move(stockfish_output.bestmove);
                            analysis_results['bestmove'] = describe_move(bestMove);
                        } else {
                            analysis_results['bestmove'] = 'No best move data';
                        }
                    } else if (mode === 'lines') {
                        const line_moves = stockfish_output.continuation?.split(' ') || [];
                        analysis_results['lines'] = [];

                        const line_board = new Chess(game.fen());

                        for (const move of line_moves) {
                            //if line_board.turn() === 'w' continue;
                            const LineBoardMove = line_board.move(move);
                            if (LineBoardMove) {
                                const described_move = describe_move(LineBoardMove);
                                analysis_results['lines'].push(described_move);
                            } else {
                                analysis_results['lines'].push(`Illegal move: ${move}`);
                                break;
                            }
                        }
                    }
                } else {
                    analysis_results[mode] = `Error in ${mode} analysis: 'Unknown error with stockfish'`;
                }
            }
            analysis_times['stockfish_analysis'] = (Date.now() - start_time) / 1000;
        }
    } catch (e) {
        console.error(`Error in Stockfish analysis: ${e}`);
        analysis_results['stockfish_analysis'] = { error: e };
    }

    if (pawn_structure_analysis) {
        const start_time = Date.now();
        const pawn_structure = analyze_pawn_structure(game.fen());
        analysis_results['pawn_structure'] = pawn_structure;
        analysis_times['pawn_structure_analysis'] = (Date.now() - start_time) / 1000;
    }

    try {
        if (piece_development_analysis) {
            const start_time = Date.now();
            const development_result = get_development_long(game);
            analysis_results['piece_development'] = development_result;
            analysis_times['piece_development_analysis'] = (Date.now() - start_time) / 1000;
        }
    } catch (e) {
        console.error(`Error in piece development analysis: ${e}`);
        analysis_results['piece_development'] = { error: e };
    }

    try {
        if (tension_analysis) {
            const start_time = Date.now();
            const tension_result = get_tension_long(game);
            analysis_results['tension'] = tension_result;
            analysis_times['tension_analysis'] = (Date.now() - start_time) / 1000;
        }
    } catch (e) {
        console.error(`Error in tension analysis: ${e}`);
        analysis_results['tension'] = { error: e };
    }

    try {
        if (mobility_analysis) {
            const start_time = Date.now();
            const mobility_result = get_mobility_long(game);
            analysis_results['mobility'] = mobility_result;
            analysis_times['mobility_analysis'] = (Date.now() - start_time) / 1000;
        }
    } catch (e) {
        console.error(`Error in mobility analysis: ${e}`);
        analysis_results['mobility'] = { error: e };
    }

    try {
        if (control_analysis) {
            const start_time = Date.now();
            const control_result = get_control_long(game);
            analysis_results['control'] = control_result;
            analysis_times['control_analysis'] = (Date.now() - start_time) / 1000;
        }
    } catch (e) {
        console.error(`Error in control analysis: ${e}`);
        analysis_results['control'] = { error: e };
    }

    try {
        if (attackers_of_squares) {
            const start_time = Date.now();
            let attackers: { [key: string]: any } = {};
            chessboardAllSquares.forEach(square => {
                const piece = game.get(square);
                const byColor = piece.color == 'w' ? 'b' : 'w';
                if (piece) {
                    attackers[square] = get_attackers(game.fen(), square, byColor);
                }
            });
            analysis_results['attackers'] = attackers;
            analysis_times['attackers_of_squares'] = (Date.now() - start_time) / 1000;
        }
    } catch (e) {
        console.error(`Error in attackers of squares analysis: ${e}`);
        analysis_results['attackers'] = { error: e};
    }

    try {
        if (analysis_results['threats']) {
            const threats = check_for_threats_long(game, after_last_move_stockfish); 
            analysis_results['threats'] = threats;
        }
    } catch (e) {
        console.error(`Error in threats analysis: ${e}`);
        analysis_results['threats'] = { error: e };
    }

    print_output = "=".repeat(50) + "\n";
    print_output += "Chess Game Analysis Results\n";
    print_output += "=".repeat(50) + "\n";

    Object.keys(analysis_results).forEach(key => {
        print_output += `${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:\n`;
        if (typeof analysis_results[key] === 'object') {
            Object.keys(analysis_results[key]).forEach(sub_key => {
                print_output += `  - ${sub_key.charAt(0).toUpperCase() + sub_key.slice(1).replace(/_/g, ' ')}: ${analysis_results[key][sub_key]}\n`;
            });
        } else {
            print_output += `  - ${analysis_results[key]}\n`;
        }
        print_output += "\n";
    });

    print_output += "=".repeat(50) + "\n";

    return { analysis_results, print_output };
}

//<<prompt_optimization>> IN The original code, take_turns is false by default which, in short, means that the function would call stockfish API
//for each move (0 to moves_ahead), which is imo completely unnecessary since stockfish returns 'continuation' array of best moves one after another
//and it would slow down the execution of this function by moves_ahead times
function check_for_threats_long(board:Chess, current_fen_stockfish_analyisis:any, moves_ahead:number=2, take_turns:boolean=true, by_opponent:boolean=true){
    // console.log(`Checking for threats on board: ${board.fen()}`);
    if(board.isCheck()){
        throw new Error('Board is in the state of check right now');
    }
    // console.log("Board is not in check");
    const threat_moves = [];
    const opponent_color = board.turn() == 'w' ? 'White' : 'Black';
    
    if(!current_fen_stockfish_analyisis){
        throw new Error('Error with stockfish API');
    }
    const {continuation, bestmove} = current_fen_stockfish_analyisis;
    const gameCopy = new ChessTemp(board.fen());
    if(take_turns){
        // console.log("Taking turns mode");
        const pv_moves = continuation.split(' ');
        for(let i=0; i<moves_ahead; i++){
          const move = gameCopy.move(pv_moves[i]);
          threat_moves.push({
            san: move.san,
            lan: move.lan,
          })
        }
    }

    return threat_moves;
}


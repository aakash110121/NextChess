import { Chess } from "chess.js";

export default function getFENnSAN(movesArray:string[]){
   const chessGame = new Chess();
   const fenArray = [];
   const mArray= [];
   for(var i=0; i<movesArray.length; i++){
    const move = chessGame.move(movesArray[i]);
    // console.log("FEN IS: ", chessGame.fen());
    // console.log("MOVE IS: ", move.san);
    fenArray.push(chessGame.fen());
    mArray.push(move.san);
   }
   // console.log("FEN ARRAY: ", fenArray);
   // console.log("MOVES ARRAY: ", mArray);
   return {fenArray: [...fenArray], sanArray: [...mArray]}
}
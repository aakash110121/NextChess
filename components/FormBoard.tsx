import { Chess, Piece, Square } from "chess.js";
import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { IoMdArrowBack } from "react-icons/io";
import { FaSave } from "react-icons/fa";
import { IoSaveOutline } from "react-icons/io5";
import { MdOutlineRestartAlt } from "react-icons/md";


interface ModalProps{
    movesArray: string[],
    setMovesArray: (newMovesArray: string[]) => void,
    fenStringsArray: string[],
    setFenStringsArray: (newFenArray: string[]) => void,
    handleCloseCustomPositionModal: (option: number) => void,
}


const FormBoard: React.FC<ModalProps> = ({movesArray, setMovesArray, fenStringsArray, setFenStringsArray, handleCloseCustomPositionModal}) => {
    const [chess,setGame] = useState(new Chess());

    useEffect(()=>{
      console.log("TU SMO... array is: ", fenStringsArray);
      if(fenStringsArray.length>0){
        chess.load(fenStringsArray[fenStringsArray.length-1]);
      }
    },[])

    const handleReset = ()=>{
        setFenStringsArray([]);
        setMovesArray([]);
        chess.reset();
    }
    
    const handleMove = async ({ sourceSquare, targetSquare, piece }: { sourceSquare: string, targetSquare: string, piece: any }) => {
        if(chess.isGameOver()) return;
        try {
          const isPromotion = chess.get(sourceSquare as Square)?.type === 'p' && (targetSquare as Square).endsWith('8') || (targetSquare as Square).endsWith('1');
          const move = chess.move({
            from: sourceSquare as Square,
            to: targetSquare as Square,
            ...(isPromotion && { promotion: 'q' }) // Automatically promote pawns to queen
          });
      
          if (move) {
              setMovesArray([...movesArray, move.san]);
              setFenStringsArray([...fenStringsArray, chess.fen()]);
            }
            // Use a fixed depth of 13 for fetching the best move for the prompt
          }
         catch (error) {
          console.error("Caught an error during move:", error);
        }
      };
    
      function onDrop(sourceSquare:Square, targetSquare:Square, piece:any) {
        handleMove({sourceSquare, targetSquare, piece});
        return true;
      }
    return(
        <div className="w-full max-w-[400px] p-2 md:p-4 shadow-md rounded-md bg-white">
          <div className="flex items-center mb-3 text-[18px] space-x-1">
            <IoMdArrowBack  onClick={()=>handleCloseCustomPositionModal(1)} className="h-6 w-6 cursor-pointer"/>
            <p className="">Custom Position</p>
          </div>
          <div className="w-full aspect-square max-w-[400px] m-auto">
            <Chessboard
                  id="board"
                  position={fenStringsArray.length>0 ? fenStringsArray[fenStringsArray.length-1] : 'start'}
                  onPieceDrop={onDrop}
            />
          </div>
          <div className="flex flex-wrap gap-x-1 mt-3 gap-y-1 text-white">
             <div onClick={()=>handleCloseCustomPositionModal(2)} className="grow min-w-[180px] cursor-pointer py-3 bg-green-600 flex justify-center items-center rounded-lg gap-x-1">
                Save
                <IoSaveOutline />
             </div>
             <div onClick={()=>handleReset()} className="grow min-w-[180px] cursor-pointer py-3 bg-orange-500 flex justify-center items-center rounded-lg gap-x-1">
                Reset
                <MdOutlineRestartAlt className="w-[22px] h-[22px]"/>
            </div>
          </div>
        </div>
    )
}

export default FormBoard;
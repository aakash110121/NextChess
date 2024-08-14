import PGNNotation from "@/app/history/methods/PGNNotation";
import { FC } from "react";
import { Chessboard } from "react-chessboard";


interface ItemProps{
    //setGameChange: (newGame: Chess) => void;
    fenString: string | null,
    handleLoadGame: (gameId:string) => void,
    color: string,
    difficultyLevel: string,
    gameId: string,
    chessName: string,
    isCompleted: string[] | null,
    positions: string[],
    chessyPersonality: string,
 }


const HistoryItem: React.FC<ItemProps> = (
    {fenString,
     handleLoadGame,
     gameId,
     color,
     difficultyLevel,
     chessName,
     isCompleted,
     positions,
     chessyPersonality
    }
) => {

    return (
      <div
        className="rounded-sm p-1 flex
        cursor-pointer font-medium text-[16px]  rounded-[5px] bg-[#F3F5F8] px-2 py-2  font-medium text-black"
      >
        <div
          onClick={() => handleLoadGame(gameId)}
          className="h-[120px] relative cursor-pointer w-[100px]"
        >
          <Chessboard
            id="board"
            position={
              fenString
                ? fenString
                : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            }
            boardWidth={100}
            boardOrientation={
              color == "Black" ? "black" : color == "White" ? "white" : "white"
            }
            arePiecesDraggable={false}
          />
          <div className="absolute top-0 w-full h-full z-20 cursor-pointer"></div>
        </div>
        <section className="w-full text-gray-800 grid grid-rows-2 px-4 ">
          <div className="row-span-1 gap-x-4 flex flex-wrap">
            <span className="font-semibold">Level: {difficultyLevel}</span>
          </div>
          <div className="row-span-1 gap-x-4 flex flex-wrap">
            <span className="font-semibold">Personality: {chessyPersonality}</span>
          </div>
          <div className="row-span-1 flex flex-col">
            <span className="text-[15px] font-medium align-bottom">
              {chessName} vs. Chessy
            </span>
          </div>
          <div className="row-span-1 gap-x-4 flex flex-wrap  items-center align-top">
           {isCompleted ? (
              <span
                className={`${
                  isCompleted[1] == "d"
                    ? "text-yellow-600"
                    : isCompleted[1] == "w"
                    ? "text-green-700"
                    : "text-red-700"
                }
                align-top`}
              >
                {isCompleted[0]}
              </span>
            ) : (
              <span className="text-yellow-400">Not finished yet...</span>
            )}
          </div>
          <div className="row-span-1 flex items-end truncate">
            <span>
              {positions?.length>0
                ? PGNNotation(positions).split(" ").slice(0, 9).join(" ") +
                  " ... " +
                  (
                    Math.floor(positions.length / 2) +
                    (positions.length % 2)
                  ).toString()
                : 0}{" "}
              moves
            </span>
          </div>
        </section>
      </div>
    );
}

export default HistoryItem;
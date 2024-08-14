import React, { useEffect, useState, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Move, Square } from "chess.js";
import { MdNavigateNext } from "react-icons/md";
import { MdSkipNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { MdSkipPrevious } from "react-icons/md";
import { BsPlay } from "react-icons/bs";
import { useMediaQuery } from 'react-responsive';
import { Arrow, Piece } from "react-chessboard/dist/chessboard/types";
import { FaBell, FaMicrophone, FaSearch, FaStop, FaUser } from "react-icons/fa";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { MdArrowForwardIos } from "react-icons/md";
import { BsFillSendFill } from "react-icons/bs";
import SubscriptionAlert from "./SubscriptionAlert";
import { PieceIcon } from "@/lib/piecesContainer";
import EvaluationCalculator from "@/app/chessboard/methods/evaluationCalculator";
import CapturedArray from "@/app/chessboard/methods/CapturedArray";
import { IoOptions } from "react-icons/io5";
import { FaRegThumbsUp, FaRegThumbsDown, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import ChessviaFavicon from "@/public/Chessvia-Favicon.png";
import ChessviaFaviconBlack from "@/public/Chessvia-Favicon-Black.png";
//import ChessviaFaviconWhite from "@/public/Chessvia-Favicon-White.png";



const boardPieces = {
  P: { name: 'White Pawn', url: '/chessPieces/WhitePawn.svg' },
  R: { name: 'White Rook', url: '/chessPieces/WhiteRook.svg' },
  N: { name: 'White Knight', url: '/chessPieces/WhiteKnight.svg' },
  B: { name: 'White Bishop', url: '/chessPieces/WhiteBishop.svg' },
  Q: { name: 'White Queen', url: '/chessPieces/WhiteQueen.svg' },
  p: { name: 'Black Pawn', url: '/chessPieces/BlackPawn.svg' },
  r: { name: 'Black Rook', url: '/chessPieces/BlackRook.svg' },
  n: { name: 'Black Knight', url: '/chessPieces/BlackKnight.svg' },
  b: { name: 'Black Bishop', url: '/chessPieces/BlackBishop.svg' },
  q: { name: 'Black Queen', url: '/chessPieces/BlackQueen.svg' },
}

interface GameProps {
  //setGameChange: (newGame: Chess) => void;
  fenString: string,
  handleMove: ({ sourceSquare, targetSquare, piece }: { sourceSquare: string; targetSquare: string; piece: string; }) => Promise<void>,
  movesArray: string[],
  switchRecording: () => void;
  recording: boolean;
  goToFirstMove: () => void;
  goToLastMove: () => void;
  goToPreviousMove: () => void;
  goToNextMove: () => void;
  playFromPosition: () => void;
  setPosition: (no: number) => void;
  currentPositionIndex: number;
  userColor: string;
  chess: Chess,
  chessName: string,
  messages: string[],
  hintArrow: Arrow | null,
  hintSquare: Square | null,
  hint: () => Promise<void>,
  isRunResolved: boolean,
  createMessage: (transcript: string, threadId: string) => Promise<void>,
  gameId: string,
  isGameCompleted: boolean,
  subscribed: boolean,
  settings: any,
  quickPlay: () => Promise<void>,
  resignTheGame: () => Promise<void>,
  chessyVoiceSound: string,
  handleChessyVoiceSound: () => void,
  displayCaptured: string,
  handleDisplayCaptured: () => void,
  userMovesAnalysis: any,
  handleVote: (index: number, option:string) => Promise<void>,
  responseReviewsCollection: {id: string, rating: string}[],
  chessyComment: string,
  isPlayingAudio: boolean,
}

const Board: React.FC<GameProps> = ({
  fenString,
  handleMove,
  goToFirstMove,
  goToLastMove,
  goToPreviousMove,
  goToNextMove,
  playFromPosition,
  movesArray,
  setPosition,
  currentPositionIndex,
  userColor,
  switchRecording,
  recording,
  chess,
  chessName,
  messages,
  hintArrow,
  hintSquare,
  hint,
  isRunResolved,
  gameId,
  createMessage,
  isGameCompleted,
  subscribed,
  settings,
  quickPlay,
  resignTheGame,
  chessyVoiceSound,
  handleChessyVoiceSound,
  displayCaptured,
  handleDisplayCaptured,
  userMovesAnalysis,
  handleVote,
  responseReviewsCollection,
  chessyComment,
  isPlayingAudio
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<number>(0);

  const isDesktop = useMediaQuery({
    query: '(max-width: 1224px)'
  })

  const isDesktopBig = useMediaQuery({
    query: '(max-width: 1550px)'
  });

  const isDesktopMid = useMediaQuery({
    query: '(max-width: 900px)'
  });


  const isMobile = useMediaQuery({
    query: '(max-width: 600px)'
  });

  const isSmallMobile = useMediaQuery({
    query: '(max-width: 430px)'
  });

  let boardWidth = 700;

  if (isSmallMobile) {
    boardWidth = 350;
  } else if (isMobile) {
    boardWidth = 400;
  } else if (isDesktopMid) { // Corrected syntax
    boardWidth = 450; // Corrected assignment
  } else if (isDesktopBig) {
    boardWidth = 600;
  }


  useEffect(() => {
    setIsLoading(false);
  }, []);

  const r = useRouter();

  const [isDropDown, setIsDropDown] = useState(false);

  function onDrop(sourceSquare: Square, targetSquare: Square, piece: Piece) {
    {/*const move = {
      from: sourceSquare,
      to: targetSquare,
      piece: piece
    };*/}
    if (isGameCompleted) return false;
    let childToRemove = document.getElementById("childElement");
    if (childToRemove && childToRemove.parentNode) {
      childToRemove.parentNode.removeChild(childToRemove);
      setSelectedSquare('');
    }
    handleMove({ sourceSquare, targetSquare, piece });
    return true;
  }

  const [capturedArray, setCapturedArray] = useState<string[]>([]);

  useEffect(() => {
    if (fenString.length > 0) {
      const capturedArr = Array.from(CapturedArray(fenString.split(' ')[0])) || [];
      setCapturedArray(capturedArr);
      const totalSum = capturedArr.reduce((accumulator, pie) => {
        if ((userColor == "White" && pie === pie.toUpperCase()) || (userColor == "Black" && pie === pie.toLowerCase())) {
          return accumulator - EvaluationCalculator(pie.toLowerCase());
        } else {
          return accumulator + EvaluationCalculator(pie.toLowerCase());
        }
      }, 0);
      setEvaluation(totalSum);
    }
  }, [fenString])

  const [inProcess, setInProcess] = useState(false);
  async function handleQuickPlay() {
    setInProcess(true);
    await quickPlay();
    setInProcess(false);
  }
  /*useEffect(() => {
    const handleKeyDown = (event:any) => {
      switch (event.key) {
        case "ArrowLeft":
          goToPreviousMove(currentPositionIndex - 1);
          break;
        case "ArrowRight":
          goToNextMove();
          break;
        default:
          break;
      }
    };
    document.body.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPositionIndex, goToNextMove, goToPreviousMove]);*/


  function scrollToBottom() {
    //@ts-ignore
    if (document.getElementById('movesBox') && document.getElementById('movesBox').scrollHeight > document.getElementById('movesBox').clientHeight) {
      //@ts-ignore
      document.getElementById('movesBox').scrollTop = document.getElementById('movesBox').scrollHeight;
    }
  }
  function scrollToBottomMessages() {
    //@ts-ignore
    if (document.getElementById('conversationBox') && document.getElementById('conversationBox').scrollHeight > document.getElementById('conversationBox').clientHeight) {
      //@ts-ignore
      document.getElementById('conversationBox').scrollTop = document.getElementById('conversationBox').scrollHeight;
    }
  }
  useEffect(() => {
    scrollToBottom();
  }, [movesArray])

  //<div data-square-color="white" data-square="a1" style="background-color: rgb(240,217,181);"></div> 
  useEffect(() => {
    scrollToBottomMessages();
  }, [messages])

  const isSmallScr = useMediaQuery({
    query: '(max-width: 768px)'
  })


  const [selectedSquare, setSelectedSquare] = useState('');
  const customSquareStyles = (piece: Piece, square: Square) => {
    // Example: Change color of square 'e4' to green
    if (userColor == 'White' && piece[0] == 'b') return;
    if (userColor == 'Black' && piece[0] == 'w') return;
    if (!square) return;
    let childToRemove = document.getElementById("childElement");
    if (childToRemove && childToRemove.parentNode) {
      childToRemove.parentNode.removeChild(childToRemove);
    }
    if (selectedSquare == square) {
      setSelectedSquare('');
    }
    else {
      const childElement = document.createElement("div");
      childElement.style.position = "absolute";
      childElement.style.width = "100%";
      childElement.style.height = "100%";
      childElement.style.top = "0px";
      childElement.style.backgroundColor = "#d5c81c77";
      childElement.id = "childElement";
      setSelectedSquare(square);
      let element = document.querySelector<HTMLElement>(
        `[data-square='${square}']`
      );
      if (element) {
        element.style.position = "relative";
        element.append(childElement);
      }

    }
  };


  const [hintOption, setHintOption] = useState(1);

  useEffect(() => {
    if (hintOption == 1) {
      let hintSquareElement = document.getElementById("hintSquareElement");
      if (hintSquareElement && hintSquareElement.parentNode) {
        hintSquareElement.parentNode.removeChild(hintSquareElement);
      } else {
        if (!hintSquare) return;
        const hintSquareElement = document.createElement("div");
        hintSquareElement.style.position = "absolute";
        hintSquareElement.style.width = "100%";
        hintSquareElement.style.height = "100%";
        hintSquareElement.style.top = "0px";
        hintSquareElement.style.backgroundColor = "#850E3560";
        hintSquareElement.id = "hintSquareElement";
        let element = document.querySelector<HTMLElement>(
          `[data-square='${hintSquare}']`
        );
        if (element) {
          element.style.position = "relative";
          element.append(hintSquareElement);
        }
      }
    }
    if (hintOption == 2) {
      let hintSquareElement = document.getElementById("hintSquareElement");
      if (hintSquareElement && hintSquareElement.parentNode) {
        hintSquareElement.parentNode.removeChild(hintSquareElement);
      }
    }
  }, [hintSquare, hintOption])

  const [inputText, setInputText] = useState('');

  const handleCreateTextMessage = () => {
    if (!inputText || inputText.length < 1) return;
    createMessage(inputText, gameId);
    setInputText('');
    return;
  }

  const [dropDownActive, setDropDownActive] = useState(false);
  const toggleDropDown = () => {
    setDropDownActive((prevDropDown) => !prevDropDown);
  }

  const [selectedPiece, setSelectedPiece] = useState<null | { piece: Piece, square: Square }>(null);
  const handleSelectPiece = (piece: Piece, square: Square) => {
    if (userColor[0].toLowerCase() == piece[0]) {
      setSelectedPiece({ piece: piece, square: square });
    }
  }

  const handleOnSquareClick = (square: Square, piece: Piece | undefined) => {
    if (selectedPiece == null) return;
    if (selectedPiece.piece == piece) {
      setSelectedPiece(null);
      return;
    }
    onDrop(selectedPiece.square, square, selectedPiece.piece);
    setSelectedPiece(null);
  }
  const [settingsMenu, setSettingsMenu] = useState(false);
  const [newGameMenu, setNewGameMenu] = useState(false);
  const [continueLaterDD, setContinueLaterDD] = useState(false);
  const [hintDD, setHintDD] = useState(false);
  const handleKeypress = (e: any) => {
    // It's triggering by pressing the enter key
    if (e.keyCode == 13 && !e.shiftKey) {
      handleCreateTextMessage();
    }
  };

  const resignAndStartNewGame = async () => {
    await resignTheGame();
    r.push('/form');
  }

  useEffect(() => {
    if (isGameCompleted) {
      setNewGameMenu(false);
    }
  }, [isGameCompleted])

  useEffect(() => {
    const chatBubble = document.querySelector('.dynamic-chat-bubble');
    if (chatBubble && movesArray.length > 0) {
      chatBubble.classList.remove('hidden');
      setTimeout(() => {
        chatBubble.classList.add('hidden');
      }, 3000);
    }
  }, [movesArray]);

  function extractQuestion(text: string): string | null {
    if(!text.includes('###')) return text;
    const questionRegex = /###Question:\s*([\s\S]*?)###Step-by-step analysis/;
    const match = text.match(questionRegex);
    return match ? match[1].trim() : null;
  }

  const [evalTypologyExpanded, setEvalTypologyExpanded] = useState(true);
  const [moveEvalVisible, setMoveEvalVisible] = useState(true);
  
  return (
    <div className="lg:flex pb-10 lg:pb-0 px-2 m-auto chess-baord">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-white">Loading Chessboard...</p>
        </div>
      ) : (
        <>
          <div
            className={`relative flex justify-center md:text-center max-w-[${boardWidth}px] max-h-[${boardWidth}px] rounded-[5px] border border-stroke bg-white p-7 shadow-default`}
          >
            {" "}
            {/* Centering for md and below */}
            {(chess.isGameOver() || isGameCompleted) && (currentPositionIndex == movesArray.length) && (
              <div className="absolute top-0 w-full h-full z-10 flex justify-center items-center bg-[#000000b3] rounded-[5px]">
                <div className="w-[95%] p-2  text-black flex flex-col items-center justify-between rounded-[5px] border border-stroke bg-white p-7 shadow-default">
                  <Image
                    src="/chessvia.png"
                    alt="chessviaLogo"
                    width={200}
                    height={200}
                    className="w-[30%]"
                  ></Image>
                  
                  {(chess.isDraw() ||
                    chess.isInsufficientMaterial() ||
                    chess.isThreefoldRepetition()) && (
                      <div className="flex flex-col py-4">
                        <span className="font-bold text-[22px] text-yellow-600">
                          DRAW
                        </span>
                        <span className="text-[18px] text-yellow-700">
                          {chess.isThreefoldRepetition()
                            ? "By treefold repetition"
                            : chess.isInsufficientMaterial()
                              ? "By insufficient material"
                              : chess.isStalemate()
                                ? "By stalemate"
                                : "By draw"}
                        </span>
                      </div>
                    )}
                  {chess.isCheckmate() &&
                    !chess.isStalemate() &&
                    ((chess.turn() == "w" && userColor == "White") ||
                      (chess.turn() == "b" && userColor == "Black") ? (
                      <div className="flex flex-col py-4">
                        <span className="font-bold text-[22px] text-red-700">
                          YOU LOST
                        </span>
                        <span className="text-[18px] text-red-800">
                          By checkmate
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col py-4">
                        <span className="font-bold text-[22px] text-green-700">
                          YOU WON
                        </span>
                        <span className="text-[18px] text-green-800">
                          By checkmate
                        </span>
                      </div>
                    ))}
                  {!chess.isGameOver() && isGameCompleted && currentPositionIndex == movesArray.length && (
                    <div className="flex flex-col py-4">
                      <span className="font-bold text-[22px] text-red-700">
                        YOU LOST
                      </span>
                      <span className="text-[18px] text-red-800">
                        By resignation
                      </span>
                    </div>
                  )}
                  <div className="w-full grid grid-rows-4 sm:grid-rows-2 sm:grid-flow-col gap-2 px-2">
                    <button
                      disabled={inProcess}
                      onClick={() => {
                        setInProcess(true);
                        r.push("/form");
                      }}
                      className="w-full  rounded-lg  text-white transition duration-200 bg-[#124429] hover:bg-[#16281e] font-semibold text-[20px] py-4 mx-auto"
                    >
                      New Game
                    </button>
                    <button
                      disabled={inProcess}
                      onClick={() => {console.log("...")}}
                      className="w-full  rounded-lg  text-white transition duration-200 bg-[#124429] hover:bg-[#16281e] font-semibold text-[20px] py-4 mx-auto"
                    >
                      Review Game
                    </button>
                    <button
                      disabled={inProcess}
                      onClick={() => handleQuickPlay()}
                      className="w-full  rounded-lg   text-white transition duration-200 bg-[#124429] hover:bg-[#16281e] font-semibold text-[20px] py-4 mx-auto"
                    >
                      Quickplay
                    </button>
                    <button
                      disabled={inProcess}
                      onClick={() => {
                        setInProcess(true);
                        r.push("/home");
                      }}
                      className="w-full  rounded-lg  text-white transition duration-200 bg-[#124429] hover:bg-[#16281e] font-semibold text-[20px] py-4 mx-auto"
                    >
                      Home
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div>
              {displayCaptured && displayCaptured == "visible" && (
                <div className="h-[20px] md:h-[22px] lg:h-[25px] flex">
                  {userColor == "White" &&
                    capturedArray.map(
                      (item: any, idx: number) =>
                        item[0] === item.toUpperCase() && (
                          <Image
                            key={idx}
                            //@ts-ignore
                            src={`${boardPieces[`${item}`].url}`}
                            height={10}
                            width={10}
                            alt={`piece${idx}`}
                            className="h-full w-auto"
                          ></Image>
                        )
                    )}
                  {userColor == "Black" &&
                    capturedArray.map(
                      (item: any, idx: number) =>
                        item === item.toLowerCase() && (
                          <Image
                            key={idx}
                            //@ts-ignore
                            src={`${boardPieces[`${item}`].url}`}
                            height={10}
                            width={10}
                            alt={`piece${idx}`}
                            className="h-full w-auto"
                          ></Image>
                        )
                    )}
                  {evaluation < 0 ? (
                    <div className="flex items-center">
                      <p>+</p> {-evaluation}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )}
              <div className="flex justify-center">
                <Chessboard
                  id="board"
                  position={fenString}
                  onPieceDrop={onDrop}
                  onSquareClick={(square: Square, piece: Piece | undefined) =>
                    handleOnSquareClick(square, piece)
                  }
                  boardWidth={boardWidth}
                  customDarkSquareStyle={{
                    background: settings.boardColor.darkSquares,
                  }}
                  customLightSquareStyle={{
                    background: settings.boardColor.lightSquares,
                  }}
                  onPieceDragBegin={(piece: Piece, square: Square) => {
                    customSquareStyles(piece, square);
                    setSelectedPiece(null);
                  }}
                  onPieceClick={(piece: Piece, square: Square) => {
                    customSquareStyles(piece, square);
                    handleSelectPiece(piece, square);
                  }}
                  boardOrientation={
                    userColor == "Black"
                      ? "black"
                      : userColor == "White"
                        ? "white"
                        : "white"
                  }
                  customArrows={
                    hintArrow && hintOption == 2 ? [hintArrow] : [["a2", "a2"]]
                  }
                  arePiecesDraggable={isGameCompleted ? false : true}
                />
              </div>
              {displayCaptured && displayCaptured == "visible" && (
                <div>
                  {userColor == "White" ? (
                    <div className="h-[20px] md:h-[22px] lg:h-[25px] flex">
                      {capturedArray.map(
                        (item: any, idx: number) =>
                          item === item.toLowerCase() && (
                            <Image
                              key={idx}
                              //@ts-ignore
                              src={`${boardPieces[`${item}`].url}`}
                              height={10}
                              width={10}
                              alt={`piece${idx}`}
                              className="h-full w-auto"
                            ></Image>
                          )
                      )}
                      {evaluation > 0 ? (
                        <div className="flex items-center">
                          <p>+</p> {evaluation}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : (
                    <div className="h-[20px] md:h-[22px] lg:h-[25px] flex">
                      {capturedArray.map(
                        (item: any, idx: number) =>
                          item === item.toUpperCase() && (
                            <Image
                              key={idx}
                              //@ts-ignore
                              src={`${boardPieces[`${item}`].url}`}
                              height={10}
                              width={10}
                              alt={`piece${idx}`}
                              className="h-full w-auto"
                            ></Image>
                          )
                      )}
                      {evaluation > 0 ? (
                        <div className="flex items-center">
                          <p>+</p> {evaluation}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={`lg:h-[${boardWidth}px] flex flex-col `}>
               {/* Moved section */}
               <section className="flex items-center justify-between w-full bg-transparent p-1 lg:w-[500px] lg:ml-[10px] mb-0 mt-6">
              <div className="flex items-center space-x-2 relative">
                <div className="h-12 w-12 rounded-full transform scale-x-[-1] bg-white p-3">
                  <Image
                    height={40}
                    width={40}
                    src={ChessviaFavicon}
                    alt="Chessy"
                    className="h-full w-full object-contain"
                  />
                </div>
{/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                {/* Updated chat bubble with inline animation and arrow */}
                <div className="absolute left-[50px] top-1  bg-gray-200 p-2 rounded-xl text-sm animate-[fadeIn_0.3s_ease-in-out] shadow-md">
                  { isPlayingAudio?  <div id="wave" className="wave-container hidden">
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                  </div> :
                    <div className="w-[220px] lg:w-[400px]"><p>{chessyComment}</p></div>}
                  {/* Added arrow */}
                  <div className="absolute w-2 h-3 bg-gray-200 rotate-45 -left-1.5 top-4"></div>
                </div>
              </div>
            </section>

        {/* Chat container */}
        <div className="lg:ml-[10px] w-full p-1 lg:w-[500px] lg:flex lg:flex-col lg:grow bg-[#124429] mb-[4px] mt-1 lg:mt-3 rounded-[5px] p-7 shadow-default">
          <section
            id="conversationBox"
            className="w-full flex flex-col h-[260px] lg:grow mt-2 space-y-2 overflow-auto bg-[#eeeed2] border border-gray-500 rounded-lg"
          >
            <div className="relative">
              {messages &&
                messages.map((msg: any, idx: number) =>
                  msg.role === 'assistant' ? (
                    <div key={idx} className="px-2 py-2">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-transparent transform scale-x-[-1] p-0.3">
                          <Image
                            src={ChessviaFaviconBlack}
                            alt="usr"
                            height={400}
                            width={376}
                            className="h-full w-full object-cover rounded-md"
                          />
                        </div>
                        {/* Update assistant message styling */}
                        <div className="text-sm p-5 w-[75%] bg-gradient-to-br from-[#769656] to-[#5d7a43] text-slate-100 rounded-lg relative shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-[fadeIn_0.3s_ease-in-out]">
                          <p className="break-words">
                            {msg.content[0].text.value}
                          </p>
                          {/* Visible arrow */}
                          <div className="absolute w-4 h-4 bg-[#769656] rotate-45 -left-2 top-4"></div>
                          <div className="w-full flex justify-end space-x-2 pt-1">
                            {responseReviewsCollection.some(obj => obj.id === msg.id && obj.rating === 'good') 
                              ? <FaThumbsUp className="w-4 h-4 cursor-pointer text-green-600" />
                              : <FaRegThumbsUp onClick={() => handleVote(idx, 'good')} className="w-4 h-4 cursor-pointer" />
                            }
                            {responseReviewsCollection.some(obj => obj.id === msg.id && obj.rating === 'bad')
                              ? <FaThumbsDown className="w-4 h-4 cursor-pointer text-red-500" />
                              : <FaRegThumbsDown onClick={() => handleVote(idx, 'bad')} className="w-4 h-4 cursor-pointer" />
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={idx} className="px-2 py-2">
                      <div className="flex gap-3 justify-end">
                        {/* Update user message styling with visible arrow */}
                        <div className="text-sm p-5 w-[75%] bg-[#eeeed2] text-gray-700 rounded-lg relative border border-[#124429] shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-[fadeIn_0.3s_ease-in-out]">
                          <p>{extractQuestion(msg.content[0].text.value)}</p>
                          {/* Visible arrow */}
                          <div className="absolute w-4 h-4 bg-[#eeeed2] rotate-45 -right-2 top-4 border-t border-r border-[#124429]"></div>
                        </div>
                        <div className="w-12 h-12 bg-transparent p-0.3">
                          <Image
                            src={ChessviaFavicon}
                            alt="usr"
                            height={400}
                            width={376}
                            className="h-full w-full object-cover rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  )
                )
              }
            </div>
          </section>

              {!isGameCompleted && (
              <section className="flex h-[44px] px-0 py-1 bg-transparent text-white mb-1 mt-2">
                <div className="rounded-full w-[85%] bg-transparent border-gray-500 border-[1px] text-white flex items-center px-4">
                <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="h-full outline-none grow bg-white/0 text-white w-full placeholder-gray-200"
                    onKeyDown={handleKeypress}
                    placeholder="Send Chessy a message..."
                  />
                    {/* Add hover effect to send icon */}
                    <BsFillSendFill
                      onClick={handleCreateTextMessage}
                      className="w-6 h-6 text-white cursor-pointer hover:text-green-300 transition-colors duration-200" 
                    />
                </div>
                <div className="flex justify-center items-center w-[15%] pl-2">
                  <div className="relative group">
                    {/* Ensure consistent hover effect for microphone button */}
                    <button
                      onClick={() => {
                        if (subscribed) {
                          switchRecording();
                        }
                      }}
                      className="p-2 rounded-full bg-[#124429] hover:bg-[#1a5c38] transition duration-300"
                      aria-label="Start/Stop recording"
                    >
                      {recording ? (
                        <FaStop className="w-5 h-5 text-red-500" />
                      ) : (
                        <FaMicrophone className="w-5 h-5 text-white hover:text-green-300 transition-colors duration-200" />
                      )}
                    </button>
                    {!subscribed && <SubscriptionAlert />}
                  </div>
                </div>
              </section>

              )}
              {isGameCompleted ? <div className="h-[40px] space-x-2 pt-2 relative w-full bg-[#EEEEEE]">
                  <div className={`absolute w-full ${evalTypologyExpanded ? "h-[200px]" : "h-[40px]"} bottom-0 bg-[#EEEEEE]`}>
                    <div onClick={()=>setEvalTypologyExpanded(prevExpanded=>!prevExpanded)} className={`w-[60px] h-[30px] cursor-pointer absolute rounded-t-[20px] -top-[30px] bg-[#EEEEEE] flex items-center justify-center`}>
                      {evalTypologyExpanded ? <IoIosArrowDown className=""/> : <IoIosArrowUp />}
                    </div>
                    <div className="p-2 flex w-full justify-between">
                      <p className="font-semibold">EVALUATION</p>
                      <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            checked={moveEvalVisible} // Connect the React state to the input
                            onChange={() => setMoveEvalVisible(prevVisible=>!prevVisible)} // Toggle the state on change
                          />
                          <div
                            className="relative w-9 h-5 bg-gray-200 
                        peer-focus:outline-none peer-focus:ring-4
                        peer-focus:ring-green-300 rounded-full 
                         peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                          peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white
                           after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-[#3e924b]"
                          ></div>
                        </label>
                    </div>
                    {evalTypologyExpanded && <div className="w-full flex justify-center">
                      <div className="w-full max-w-[350px] flex flex-wrap gap-3 pt-5">
                        <div className="w-[100px] flex justify-evenly items-center">
                          <div className="h-[36px] w-[16px] bg-[#850F8D] border-[1px] border-black/20"></div>
                          <p>Ecellent</p>
                        </div>
                        <div className="w-[100px] flex justify-evenly items-center">
                          <div className="h-[36px] w-[16px] bg-[#06D001] border-[1px] border-black/20"></div>
                          <p>Good</p>
                        </div>
                        <div className="w-[100px] flex justify-evenly items-center">
                          <div className="h-[36px] w-[16px] bg-[#FFDB00] border-[1px] border-black/20"></div>
                          <p>Inaccuracy</p>
                        </div>
                        <div className="w-[100px] flex justify-evenly items-center">
                          <div className="h-[36px] w-[16px] bg-[#CF0000] border-[1px] border-black/20"></div>
                          <p>Mistake</p>
                        </div>
                        <div className="w-[100px] flex justify-evenly items-center">
                          <div className="h-[36px] w-[16px] bg-black border-[1px] border-black/20"></div>
                          <p>Blunder</p>
                        </div>
                      </div>
                    </div>}
                  </div>
              </div> : 
              <section className="flex  space-x-2 pt-2 relative">
                <button className="relative w-1/3 bg-[#124429] text-white rounded-sm border-[1px] border-white/30">
                  <div className="flex justify-between w-full items-center h-full">
                    <div
                      onClick={() => hint()}
                      className="p-2 sm:p-3 grow text-start tracking-wide text-sm sm:text-sm"
                    >
                      <p className="text-xs sm:text-sm">Hint: {hintOption == 1 ? "Piece" : "Arrow"}</p>
                    </div>
                    <div
                      className="pr-2 sm:pr-3  h-full flex items-center justify-center rounded-r-sm"
                      onClick={() => setHintDD((prevHintDD) => !prevHintDD)}
                    >
                      <MdArrowForwardIos
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${hintDD ? "rotate-90" : ""} transition duration-200`}
                      />
                    </div>
                  </div>
                  {hintDD && (
                    <ul className="absolute w-full flex flex-col items-start gap-y-1 bg-green-800 p-2 rounded-sm text-start z-30 top-9 before:absolute before:content-[''] before:w-3 before:h-3 before:bg-green-800 before:rotate-45 before:right-1 before:-top-[3px]">
                      {[
                        { option: 1, name: "Piece" },
                        { option: 2, name: "Arrow" },
                      ].map((option: { option: number; name: string }, idx: number) => (
                        <li
                          key={idx}
                          onClick={() => {
                            setHintOption(option.option);
                            setHintDD(false);
                          }}
                          className="hover:bg-green-900 border-[1px] z-10 border-white/40 transition duration-200 p-2 w-full rounded-md"
                        >
                          <span className="text-start text-wrap text-white text-xs sm:text-sm">
                            {option.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </button>

                <button
                  onClick={() => setIsDropDown((prevDropDown) => !prevDropDown)}
                  className="relative w-1/3 bg-[#124429] text-white flex justify-between px-2 sm:px-3 items-center gap-x-1 sm:gap-x-2 rounded-sm border-[1px] border-white/30"
                >
                  <p className="tracking-wide text-xs sm:text-sm">Ask Chessy</p>
                  <MdArrowForwardIos className={`w-3 h-3 sm:w-4 sm:h-4 ${isDropDown ? "rotate-90" : ""} transition duration-200`} />
                  {isDropDown && settings.predefinedQuestions.length > 0 && (
                    <ul
                      id="predefinedQuestionsElement"
                      className="absolute left-0 z-40 w-[280px] min-h-[20px] max-h-[230px] p-2 top-9 overflow-y-auto overflow-x-hidden flex flex-col items-start gap-y-1 text-white text-start bg-green-800
                        rounded-sm before:absolute before:content-[''] before:w-3 before:h-3 before:bg-green-800 before:rotate-45 before:right-1 before:-top-[3px]"
                    >
                      {settings.predefinedQuestions.map((question: string, idx: number) => (
                        <li
                          key={idx}
                          onClick={() => createMessage(question, gameId)}
                          className="bg-green-800 transition duration-200 hover:bg-green-900 border-[1px] border-white/40 shadow-sm shadow-[#124429] rounded-md p-2 w-full"
                        >
                          <span className="text-start text-wrap text-xs sm:text-sm">{question}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (!isGameCompleted) {
                      setNewGameMenu((prevGameMenu) => !prevGameMenu);
                    }
                  }}
                  className="relative w-1/3 bg-[#124429] text-white flex justify-between px-2 sm:px-3 items-center gap-x-1 sm:gap-x-2 rounded-sm border-[1px] border-white/30"
                >
                  <p className="tracking-wide text-xs sm:text-sm">Game</p>
                  <MdArrowForwardIos className={`w-3 h-3 sm:w-4 sm:h-4 ${newGameMenu ? "rotate-90" : ""} transition duration-200`} />
                  {newGameMenu && (
                    <ul className="absolute z-30 text-white w-[240px] top-9 right-0 bg-green-800 p-2 before:absolute before:content-[''] before:w-3 before:h-3 before:bg-green-800 before:rotate-45 before:right-1 before:-top-[3px] rounded-sm space-y-2">
                      <li className="flex gap-x-5 items-center justify-between ">
                        <button
                          disabled={isGameCompleted}
                          onClick={() => resignTheGame()}
                          className="px-2 text-white bg-green-800 hover:bg-green-900 rounded-md w-full py-2 gap-x-3 border-[1px] border-white/40 shadow-sm shadow-green-900 text-xs sm:text-sm"
                        >
                          Resign Game
                        </button>
                      </li>
                      <li className="flex gap-x-5 items-center justify-between">
                        <button
                          disabled={isGameCompleted}
                          onClick={() => r.push("/home")}
                          className="px-2 text-white bg-green-800 hover:bg-green-900 rounded-md w-full py-2 gap-x-3 border-[1px] border-white/40 shadow-sm shadow-green-900 text-xs sm:text-sm"
                        >
                          Continue Later
                        </button>
                      </li>
                      <li className="flex gap-x-5 items-center justify-between">
                        <button
                          disabled={isGameCompleted}
                          onClick={() => r.push("/form")}
                          className="px-2 text-white bg-green-800 hover:bg-green-900 rounded-md w-full py-2 gap-x-3 border-[1px] border-white/40 shadow-sm shadow-green-900 text-xs sm:text-sm"
                        >
                          Continue Later & New Game
                        </button>
                      </li>
                      <li className="flex gap-x-5 items-center justify-between">
                        <button
                          disabled={inProcess || isGameCompleted}
                          onClick={handleQuickPlay}
                          className="px-2 text-white bg-green-800 hover:bg-green-900 rounded-md w-full py-2 gap-x-3 border-[1px] border-white/40 shadow-sm shadow-green-900 text-xs sm:text-sm"
                        >
                          Continue Later & Quickplay
                        </button>
                      </li>
                    </ul>
                  )}
                </button>
              </section>
              }
              {" "}
              {/*BUTTONS*/}
            </div>
            <div
              className={`lg:ml-[10px] bg-black/80 border-[#212121] mt-5 w-full lg:w-[500px] flex flex-col justify-between rounded-[5px] border border-stroke p-7 shadow-default
             `}
            >
              <div className="w-full">
                <div className="flex w-full justify-end px-2 py-1 bg-[#212121] relative">
                  <IoOptions
                    onClick={() => setSettingsMenu((prevSet) => !prevSet)}
                    className="w-5 h-5 lg:w-6 lg:h-6 text-white cursor-pointer"
                  ></IoOptions>
                  {settingsMenu && (
                    <ul
                      className="absolute top-7 lg:top-8 bg-white shadow-md shadow-black/30 px-4 py-4 before:absolute before:content-[''] before:w-3 before:h-3
                     before:bg-white before:rotate-45 before:right-1 before:-top-[3px] rounded-md space-y-2 z-50"
                    >
                      <li className="flex gap-x-5 items-center">
                        <p>Display Captured Pieces</p>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            checked={displayCaptured == "visible"} // Connect the React state to the input
                            onChange={() => handleDisplayCaptured()} // Toggle the state on change
                          />
                          <div
                            className="relative w-9 h-5 bg-gray-200 
                        peer-focus:outline-none 
                          rounded-full 
                         peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                          peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white
                           after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-[#124429]"
                          ></div>
                        </label>
                      </li>
                      <li className="flex justify-between items-center w-full ">
                        <p>Chessy Speaks</p>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            checked={chessyVoiceSound == "on"} // Connect the React state to the input
                            onChange={() => handleChessyVoiceSound()} // Toggle the state on change
                          />
                          <div
                            className="relative w-9 h-5 bg-gray-200 
                        peer-focus:outline-none 
                         rounded-full 
                         peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                          peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white
                           after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-[#124429]"
                          ></div>
                        </label>
                      </li>
                    </ul>
                  )}
                </div>
                <div
                  id="movesBox"
                  className="grid grid-cols-7 w-full max-h-[141px] lg:max-h-[148px] overflow-auto"
                >
                  <ul className="col-span-1 flex flex-col">
                    {movesArray &&
                      movesArray.map(
                        (mve: string, idx: number) =>
                          idx % 2 == 0 && (
                            <li
                              key={idx}
                              className="h-[30px] bg-black/20 w-full flex justify-center items-center text-white"
                            >
                              {idx + 1 - idx / 2}.
                            </li>
                          )
                      )}
                  </ul>
                  <ul className="col-span-6 grid grid-cols-2 grid-flow-row">
                    {movesArray &&
                      movesArray.map((move: string, index: number) => (
                        <li
                          key={index}
                          className="col-span-1 text-center h-[30px] p-1"
                        >
                          <button
                            className={`text-gray-200 transition ease-in-out text-center w-full h-full relative ${
                              index === currentPositionIndex - 1
                                ? "bg-[#dea94141] rounded-md "
                                : ""
                            } `}
                            onClick={() => {
                              setPosition(index + 1);
                            }}
                          >
                            <div
                              className={`absolute left-0 w-[6px] h-[100%] 
                                ${
                                  (userColor == 'White' &&
                                    userMovesAnalysis.length > 0 &&
                                    index % 2 == 0) &&
                                  moveEvalVisible &&
                                  userMovesAnalysis[index === 0 ? 0 : index / 2]
                                }
                                ${
                                  (userColor == 'Black' &&
                                    userMovesAnalysis.length > 0 &&
                                    index % 2 == 1) &&
                                  moveEvalVisible &&
                                  userMovesAnalysis[Math.floor(index / 2)]
                                }`}
                            ></div>
                            {settings.notation == "text" ? (
                              move
                            ) : ["N", "B", "Q", "K", "R"].includes(move[0]) ? (
                              <div className="flex items-center justify-center h-full">
                                {PieceIcon(move[0], index % 2 == 0 ? 0 : 1)}
                                {move.slice(1)}
                              </div>
                            ) : (
                              move
                            )}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              <div className="w-full flex rounded-b-sm justify-center items-center px-10 bg-[#212121] py-1">
                <button
                  onClick={goToFirstMove}
                  className={`mx-2 px-2 py-2 bg-[#393E46] text-white rounded ${isDesktopBig ? "px-2 py-2 " : "px-2 py-2 mx-2"
                    }`}
                >
                  <MdSkipPrevious className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goToPreviousMove()}
                  className={`mx-2 px-2 py-2 bg-[#393E46] text-white rounded ${isDesktopBig ? "px-2 py-2 " : "px-2 py-2 mx-2"
                    }`}
                >
                  <GrFormPrevious />
                </button>
                <button
                  className={`mx-2 px-2 py-2 bg-[#393E46] text-white rounded ${isDesktopBig ? "px-2 py-2 " : "px-2 py-2 mx-2"
                    }`}
                >
                  {/* {isPlaying ? 'Pause' : 'Play'} */}
                  <BsPlay onClick={() => playFromPosition()} />
                </button>
                <button
                  onClick={goToNextMove}
                  className={`mx-2 px-2 py-2 bg-[#393E46] text-white rounded ${isDesktopBig ? "px-2 py-2 " : "px-2 py-2 mx-2"
                    }`}
                >
                  <MdNavigateNext />
                </button>
                <button
                  onClick={goToLastMove}
                  className={`mx-2 px-2 py-2 bg-[#393E46] text-white rounded ${isDesktopBig ? "px-2 py-2 " : "px-2 py-2 mx-2"
                    }`}
                >
                  <MdSkipNext />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

}

export default Board;
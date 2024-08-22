"use client";

import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Chess, Move, Square } from 'chess.js';
import { arrayUnion, doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db, auth } from '@/utils/auth/FirebaseCredentials';
import Webcam from "react-webcam";
import { v4 as uuid } from "uuid";
import axios from 'axios';
import { Message as MessageFile } from 'openai/resources/beta/threads/messages';
import Board from '@/components/Board';
import VerbalDescription from './methods/verbalDescription';
import PGNNotation from './methods/PGNNotation';
import { useRouter } from 'next/navigation';
import turnLetterToWord from './methods/turnLetterToWord';
import calculateDepth from './methods/depthCalculator';
import { Arrow } from 'react-chessboard/dist/chessboard/types';
import MobileSidebar from './components/MobileSidebar';
import { RxHamburgerMenu } from "react-icons/rx";
import { analyzeChessMoveV3, build_prompt, get_board_pgn_from_history } from '../../lib/messagePrompt';
import { analyze_user_moves, estimateElo } from './methods/postGameEvaluation';
import Swal from 'sweetalert2';
import SubscriptionTrialModal from '@/components/SubscriptionTrial';
import PointsGained from './methods/PointsGained';
import { difficult } from '../form/data';
import { MAX_HINTS_PER_GAME } from '@/appLimits';
import { axiosInstance } from '@/services/base-http.service';
import PricingTable from '@/components/PricingTable'

interface AnalysisResult {
  ok: boolean;
  success: boolean;
  statusText: string | null;
  bestmove: string | null;
  mate: number | null;
  continuation: string | null;
  evaluation: number | null;
  json(): {
    ok: boolean;
    success: boolean;
    bestmove: string | null;
    mate: number | null;
    continuation: string | null;
    evaluation: number | null;
  };
}

interface StockfishInstance {
  postMessage(message: string): void;
  addMessageListener(callback: (line: string) => void): void;
}

declare function Stockfish(params: { wasmBinary: ArrayBuffer }): Promise<StockfishInstance>;
  
const mp3MovesRecordings = [
    { name: 'Recording 2', url: '/chessSounds/move-self.mp3' },
    { name: 'Recording 1', url: '/chessSounds/capture.mp3' },
    { name: 'Check', url: '/chessSounds/move-check.mp3'},
    { name: 'Game over', url: '/chessSounds/game-end.mp3'},
]


export const helpLvl = [
  {
    id: 1,
    name: "Only a little bit of support",
    description: "",
    difficulty: "Easy",
  },
  {
    id: 2,
    name: "A lot of support",
    description: "",
    difficulty: "Med",
  },
  {
    id: 3,
    name: "I want Chessy to tell me EVERYTHING!",
    description: "",
    difficulty: "Hard",
  },
];


const chessyPersonalityObject: { [key: string]: string } = {
  "Roasty Chessy": "you need to lightly jest with me while still teaching me.",
  "Grandmaster Chessy": "you need to prioritize teaching me like your own son.",
  "Hustler Chessy": "you will just hustle me and talk trash the entire time - no help",
}


const ChessboardClient2 = ({session, gameId, game, user, subscription, settings, lout}:any) => {
  const [chess,setGame] = useState(new Chess());
  const [depth, setDepth] = useState(calculateDepth(user.ELO || user.rating || 1000, game.difficultyLevel));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const readingOngoing = useRef(false);
  const [fenStringsArray, setFenStringsArray] = useState<string[]>([]); 
  const computerMoveLoading = useRef(false);
  const router = useRouter();
  const [hintArrow, setHintArrow] = useState<Arrow | null>(null);
  const [hintSquare, setHintSquare] = useState<Square | null>(null);
  const [isGameCompleted, setIsGameCompleted] = useState<boolean>(game.isCompleted? true : false);
  const [chessyVoiceSound, setChessyVoiceSound] = useState<string>(settings.chessyVoiceSound ? settings.chessyVoiceSound : 'on');
  const [displayCaptured, setDisplayCaptured] = useState(settings.capturedPiecesVisibility ? settings.capturedPiecesVisibility : 'visible');
  const [userMovesAnalysis, setUserMovesAnalysis] = useState(game.userMovesAnalysis || []);
  const [stockfishData, setStockfishData] = useState<any[]>(game.stockfishAnalysis || []);
  const [hintsLeft, setHintsLeft] = useState(game.hintsLeft || MAX_HINTS_PER_GAME);
  const [responseReviewsCollection, setResponseReviewsCollection] = useState<{id: string, rating: string}[]>(game.responseReviews || [])

  const [isRunResolved, setIsRunResolved] = useState(true);

  const [movesArray, setMovesArray] = useState<string[]>([]);

  const [supportsWasm, setSupportsWasm] = useState(false);
  const [stockfishWasmStatus, setStockfishWasmStatus] = useState<string>('INIT')
  const [stockfishWasm, setStockfishWasm] = useState<any | null>(null);
  const [stockfishWasmBestMoveDepth, setStockfishWasmBestMoveDepth] = useState<number>(13);

  const handleChessyVoiceSound = ()=>{
    if(chessyVoiceSound == 'off'){
      setChessyVoiceSound('on');
    }
    else setChessyVoiceSound('off')
  }

  const handleDisplayCaptured = ()=>{
    if(displayCaptured=='visible'){
      setDisplayCaptured('hidden');
    }
    else setDisplayCaptured('visible');
  }
  //this will be pointing to the current move lets say, so that if user go back to some of previous positions
  //and starts playing from there, so that the app can update the movesArray, and fenArray accordingly...
  //pointer = 0 is starting position and pointer-1 is the index of last element in moves array (-1 means no elements in array)
  const [pointer, setPointer] = useState<number>(0); 
  const [messages, setMessages] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  
  const [computersTurn, setComputersTurn] = useState(false);

  const [responseError, setResponseError] = useState<{status:number, additional:string} | null>(null)

  //POSSIBLE INFINITE LOOP IF stockfish is down for some reason... 
  async function getBestMoveFromStockfishv2(d:any, fenStr?: string, timeout: number=3000):Promise<Response|AnalysisResult>{
    let fen_string = fenStr || chess.fen();

    if (stockfishWasmStatus === 'PROCESSING' || stockfishWasmStatus === 'READY') {
      // Helper function to wait until Stockfish WASM status is 'READY'
      // const waitForReady = (interval: number = 100): Promise<void> => {
      //   return new Promise((resolve) => {
      //       const checkStatus = () => {
      //         if (stockfishWasmStatus === 'READY') {
      //           resolve();
      //         } else {
      //           setTimeout(checkStatus, interval);
      //         }
      //       };
      //       checkStatus();
      //   });
      // };

      // If Stockfish WASM is not ready, wait for it to become ready
      // if (stockfishWasmStatus === 'PROCESSING') {
      //   await waitForReady();
      // }

      // Now that Stockfish WASM is ready, send the command and analyze the position
      if (stockfishWasmStatus === 'READY') {
        setStockfishWasmStatus('PROCESSING');
        return stockfishWasmAnalyzePosition(d, fen_string);
      }
    }
    
    try{
      const bestMove = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(fen_string)}&depth=${d}&mode=bestmove`, {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(timeout),
      });
      return bestMove;
    }
    catch(error:any){
      return getBestMoveFromStockfishv2(d, fen_string, timeout+500);
    }
  }
  

  async function saveMyMove(fenArray:string[], sanArray:string[], analysisArray: any[]){
    const userCurrentGameRef = doc(db, "Game", gameId);
    // console.log("FEN: \n", fenArray,"\nSAN: \n", sanArray, "\nANALYSIS: \n", analysisArray);
    try {
        await setDoc(
            userCurrentGameRef,
            {
              positions:[...sanArray],
              fenArray:[...fenArray],
              stockfishAnalysis:[...analysisArray],
              hintsLeft:hintsLeft,
            },
            { merge: true }
        );
      } catch(error) {

         // console.log("ERROR saving move", error);
      }
  }

  async function analysisAfterMove(fen: string){
    const response = await getBestMoveFromStockfishv2(13, fen);
    if (response.ok) {
          const { success, bestmove, mate, continuation, evaluation } = await response.json();
          if (success) {
            const bestMoveForPrompt = bestmove.split(' ')[1];
           // Store the best move calculated at depth 13
            // Continue using the depth according to difficulty level for making the actual move in the game
            return {bestmove: bestMoveForPrompt, mate:mate, continuation:continuation, evaluation:evaluation};
            //setPointer(prevPointer=>prevPointer+1);
          } else { 
            return {bestmove:chess.moves({verbose:true})[0].lan, mate:null, continuation:'',evaluation:0.2};
          }
          
    } else {
          console.error(`Error: ${response.statusText}`);
          return {bestmove:chess.moves({verbose:true})[0].lan, mate:null, continuation:'',evaluation:0.2};
    }
  }
  
  //THIS FUNCTION RETURNS ENTIRE STOCKFISH ANALYSIS FOR THE CURRENT FEN POSITION (BEFORE COMPUTERS MOVE) + MOVE TO PLAY (best move or random move)
  async function getMoveForComputer() {
    // console.log("DEPTH IS: ", depth);
    let randomMove = false;

    //CHECK IF COMPUTER WOULD PLAY RANDOM OR STOCKFISH BEST MOVE
    if (depth[1] < 1.0) {
      const pick = Math.floor(Math.random() * 100) + 1;
      if (pick >= depth[1] * 100) {
        randomMove = true;
      }
    }

    //GETTING COMPLETE STOCKFISH ANALYSIS FOR CURRENT FEN POSITION (evaluation, best next move, continuation, mate)
    let completeAnalysis: {
      bestmove: any;
      mate: any;
      continuation: any;
      evaluation: any;
    } = { bestmove: null, mate: null, continuation: null, evaluation: null };
    const response = await getBestMoveFromStockfishv2(13);
    if (response.ok) {
      const { success, bestmove, mate, continuation, evaluation } =
        await response.json();
      if (success) {
        const bestMoveForPrompt = bestmove.split(" ")[1];
        // Store the best move calculated at depth 13
        // Continue using the depth according to difficulty level for making the actual move in the game
        completeAnalysis = {
          bestmove: bestMoveForPrompt,
          mate: mate,
          continuation: continuation,
          evaluation: evaluation,
        };
        //setPointer(prevPointer=>prevPointer+1);
      } else {
        completeAnalysis = {
          bestmove: chess.moves({ verbose: true })[0].lan,
          mate: null,
          continuation: "",
          evaluation: 0.2,
        };
      }
    } else {
      console.error(`Error: ${response.statusText}`);
      completeAnalysis = {
        bestmove: chess.moves({ verbose: true })[0].lan,
        mate: null,
        continuation: "",
        evaluation: 0.2,
      };
    }

    if (randomMove) {
      // console.log("THIS IS A RANDOM MOVE!!!");
      const possibleMoves = chess.moves({ verbose: true });
      const pickRand = Math.floor(Math.random() * possibleMoves.length);
      return { move: possibleMoves[pickRand].lan, analysis: completeAnalysis };
    } else {
      const compMove = await getBestMoveFromStockfishv2(
        depth[0] ? depth[0] : 13
      );
      if (response.ok) {
        const { success, bestmove } = await compMove.json();
        if (success) {
          const bestMoveForPrompt = bestmove.split(" ")[1];
          // Store the best move calculated at depth 13
          // Continue using the depth according to difficulty level for making the actual move in the game
          return { move: bestMoveForPrompt, analysis: completeAnalysis };
          //setPointer(prevPointer=>prevPointer+1);
        } else {
          return {
            move: completeAnalysis.bestmove,
            analysis: completeAnalysis,
          };
        }
      } else {
        console.error(`Error: ${response.statusText}`);
        return { move: completeAnalysis.bestmove, analysis: completeAnalysis };
      }
    }
  }

  const hint = async () =>{
    // console.log(chess.turn());
    // console.log(game.userColor[0].toLowerCase());
     if(hintsLeft<=0) return;
     if(chess.turn() != game.userColor[0].toLowerCase()) return;
     const response = await getBestMoveFromStockfishv2(13);
     if (response.ok) {
      //@ts-ignore
      const { success, bestmove } = await response.json();
      const data = bestmove;
      if (success) {
        const bestMoveForPrompt = data.split(' ')[1];
        const bestMove = bestMoveForPrompt.slice(0,2); //first part of best move string, contains two chars that symbolize current position of the piece
        const bestMove2 = bestMoveForPrompt.slice(2); //second part of best move string, two chars that symbolize square where piece should be moved to
        //@ts-ignore
        //setArrow([bestMove as Square, bestMove2 as Square, '#FF0000']);
        setHintArrow([bestMove as Square, bestMove2 as Square, '#FF0000']);
        setHintSquare(bestMove as Square);
        setHintsLeft((crtHint:any)=>crtHint-1);
      } else {
        console.error("Failed to get the best move from Stockfish.");
      }
    } else {
      console.error(`Error: ${response.statusText}`);
    }  
  }

   useEffect(() => {
    router.refresh();

    const setUpGame = async () => {
      if (game.positions && game.fenArray) {
        setFenStringsArray(game.fenArray);
        setMovesArray(game.positions);
        setPointer(game.fenArray.length);
        chess.loadPgn(PGNNotation(game.positions));
        await fetchMessages(100);
      }
    };
    setUpGame();
    const chessGame = new Chess(game?.fenArray[game.fenArray.length-1] ? game?.fenArray[game.fenArray.length-1] : undefined);
    setComputersTurn((game.userColor == 'White' && chessGame.turn()=='b') || (game.userColor == 'Black' && chessGame.turn()=='w') ? true : false);
    {/*if (subscr.allowedUsageTime !== "Unlimited") {
      const subscrRef = doc(db, "Subscription", subscr.id);
      
      const interval = setInterval(async () => {
        await setDoc(subscrRef,{
          allowedUsageTime:decrement(-1),
      })
      }, 60000);
    }*/}
   }, []);


 {/* useEffect(()=>{
    const handleSpacebar = async (event: KeyboardEvent) => {
      if (event.code === 'Space') {
       switchRecording();
      }
    };
    window.addEventListener('keydown', handleSpacebar);
    return () => {
      window.removeEventListener('keydown', handleSpacebar);
    };
  },[isRecording])*/}

  {/*useEffect(() => {
    const autoTranscribe = async () => {
       // console.log("AUTO TRANSCRIBE!");
      if (!isRecording && recordedChunks.length > 0) {
        await handleTranscribe();
        setRecordedChunks([]); // Clear recorded chunks after transcription
      }
    };
    autoTranscribe();
  }, [isRecording, recordedChunks.length]);
  */}
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      audioChunksRef.current = [];
      handleTranscribe(audioBlob); // Call transcription after stopping recording
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const [chessyComment, setChessyComment] = useState<string>('Hey, let\'s  play');

  const stockfishPlayMove = async () =>{
    if(!computersTurn) return;
    if(chess.isGameOver()) return;
    if(computerMoveLoading.current == true) return;
    if((game.userColor=='White' && chess.turn()=='w') || (game.userColor=='Black' && chess.turn()=='b')){
      setComputersTurn(false);
      return;
    }
    setHintArrow(null);
    setHintSquare(null);
    computerMoveLoading.current= true;
    if(fenStringsArray.length<1){
        setChessyComment("OK, let\'s  start!");
    }
    else{
        setChessyComment("Hmm...");
    }
    const moveForPrompt = await getMoveForComputer();
    const {move, analysis} = moveForPrompt;
    if(stockfishData.length>0){
         if(!stockfishData[stockfishData.length-1].mate && analysis.mate){
          setChessyComment("Bad move! Who told you to play that?"); //When user enters mate sequence (to get mated)
         }
         else if(stockfishData[stockfishData.length-1].mate && analysis.mate){
          setChessyComment("Well, that\'s  a decent play...") //When mating sequence continues (regardless of whos going to mate)
         }
         else if(stockfishData[stockfishData.length-1].evaluation && analysis.evaluation){
          const pointsGained = game.userColor[0].toLowerCase() == 'w' ? analysis.evaluation - stockfishData[stockfishData.length-1].evaluation : stockfishData[stockfishData.length-1].evaluation - analysis.evaluation;
          if(pointsGained>=-0.2){
            setChessyComment("That was an excellent move!");
          }
          else if(pointsGained>=-1){
            setChessyComment("That was a good move!");
          }
          else if(pointsGained>=-2.5){
            setChessyComment("That was a bad move!");
          }
          else{
            setChessyComment("That was a terrible move!");
          }
        }
         else{
          //writing this block just in order to spot error.
          //if I get the previous logic right this part of code will never be executed,
          console.log("Stockfish pre: ", stockfishData[stockfishData.length-1]);
          console.log("Stockfish post: ", analysis.mate); 
          setChessyComment("Hmm, this is weird...");
         } 
    }
    
    const GameCopy = new Chess(chess.fen());
    GameCopy.move(move);
    let afterMoveAnalysis;
    if(GameCopy.isGameOver()){
      setChessyComment("Check mate!")
      afterMoveAnalysis =  {bestmove:chess.moves({verbose:true})[0].lan, mate:chess.turn()=='w' ? -1 : 1, continuation:'',evaluation:0.2}
    } 
    else {
      afterMoveAnalysis= await analysisAfterMove(GameCopy.fen());
    }
    setChessyComment(prevChessyCom=>prevChessyCom+` I\'m gonna play ${move}`);
    makeMove(move, [analysis,afterMoveAnalysis]);
    setComputersTurn(false);
    computerMoveLoading.current=false;
  }

  const handleMove = async ({ sourceSquare, targetSquare, piece }: { sourceSquare: string, targetSquare: string, piece: string }) => {
    if((chess.turn()=='w' && game.userColor=='Black') || (chess.turn()=='b' && game.userColor=='White')) return;
    if(chess.isGameOver()) return;
    try {
      const isPromotion = chess.get(sourceSquare as Square)?.type === 'p' && (targetSquare as Square).endsWith('8') || (targetSquare as Square).endsWith('1');
      const move = chess.move({
        from: sourceSquare as Square,
        to: targetSquare as Square,
        ...(isPromotion && { promotion: 'q' }) // Automatically promote pawns to queen
      });
  
      if (move) {
        //setFen(chess.fen());
        //let moveString = (move.color == 'w') ? move.piece.toUpperCase()+move.to : move.piece+move.to;
        //// console.log("Mve strg:", move);
      
        if(chess.isGameOver()){
          setChessyComment("Well done! Better player won, congrats!");
          playMoveSound('gameOverSound');
          if(chess.isCheckmate()){
            setStockfishData(prevData=>[...prevData, {bestmove:null, mate:chess.turn()=='w' ? -1 : 1, continuation:'',evaluation:0.2}]);
          }
          else{
            setStockfishData(prevData=>[...prevData, {bestmove:null, mate:chess.turn()=='w' ? -1 : 1, continuation:'',evaluation:0.5}]);
          }
        }
        else if(chess.isCheck()){
          playMoveSound('checkSound');
        }
        else if(move.captured){
          playMoveSound('captureSound');
        }
        else playMoveSound('moveSound');

        if(pointer==fenStringsArray.length){
          setMovesArray([...movesArray, move.san]);
          setFenStringsArray([...fenStringsArray, chess.fen()]);
          setPointer(prevPointer=>prevPointer+1);
        }
        else{
          setMovesArray([...movesArray.slice(0,pointer), move.san]);
          setFenStringsArray([...fenStringsArray.slice(0, pointer), chess.fen()]);
          setPointer(prevPointer=>prevPointer+1);
        }
        // Use a fixed depth of 13 for fetching the best move for the prompt
        setComputersTurn(true);
    
      }
    } catch (error) {
      console.error("Caught an error during move:", error);
    }
  };
 
  useEffect(()=>{
    if(computersTurn) stockfishPlayMove();
  },[computersTurn])
 
  

  const makeMove = (moveString: string, analysisArray: any[]) => {
    const move = chess.move(moveString);
    if (move) {
      if(chess.isGameOver()){
        playMoveSound('gameOverSound');
      }
      else if(chess.isCheck()){
        playMoveSound('checkSound');
      }
      else if(move.captured){
        playMoveSound('captureSound');
      }
      else playMoveSound('moveSound');

      if(pointer==fenStringsArray.length){
        setMovesArray([...movesArray, move.san]);
        setFenStringsArray([...fenStringsArray, chess.fen()]);
        setStockfishData(prevData=>[...prevData, ...analysisArray]);
        setPointer(prevPointer=>prevPointer+1);
        saveMyMove([...fenStringsArray, chess.fen()], [...movesArray, move.san], [...stockfishData, ...analysisArray]);
      }
      else {         //If user continued game from some of the previous positions
        setMovesArray([...movesArray.slice(0,pointer), move.san]); //updating moves array so that we cut out all the moves played after the point from which user wanted to continue the game and adding the last move played
        setFenStringsArray([...fenStringsArray.slice(0, pointer), chess.fen()]); //same as above but for array of fen positions
        setPointer(prevPointer=>prevPointer+1);
        setStockfishData(prevData=>[...prevData.slice(0, Math.floor(pointer/2)), ...analysisArray]);
        saveMyMove([...fenStringsArray.slice(0, pointer), chess.fen()], [...movesArray.slice(0, pointer), move.san], [...stockfishData.slice(0, Math.floor(pointer/2)), ...analysisArray]); //stockfishData.slice part needs to be fixed
      }
    }
  };

  /*const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (webcamRef.current) {
        webcamRef.current.stream?.getTracks().forEach(track => track.stop());
      }
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };*/

  const handleTranscribe = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', audioBlob);
    const transcribeTimeStart = performance.now();
    try {
      setIsRunResolved(false);
      const transcribeResponse = await axiosInstance({
        url:'/api/transcribe',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const transcribeTime = performance.now() - transcribeTimeStart;

      // Assuming `gameId` and `db` are available in your context
      const latenciesRef = doc(db, "Latencies", gameId);
      console.log("TRANSCRIBE STATUS: ", transcribeResponse.status);
      if (transcribeResponse.status==200) {
        const transcribeResult = transcribeResponse.data;
        createMessage(transcribeResult, gameId);
        await setDoc(
          latenciesRef,
          {
            transcribeTime: arrayUnion(transcribeTime+'   '+(new Date).toUTCString()),
          },
          { merge: true }
        );
      } else {
        console.error('Transcription failed');
        setIsRunResolved(true);
      }
    } catch (error) {
      console.error('Error transcribing the audio:', error);
      setIsRunResolved(true);
    }
  };
  {/* const handleTranscribe = async () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const convertVideoStart = performance.now();
      const audioBlob = await convertVideoToAudio(blob);
      const convertVideoEnd = performance.now();
      if (!audioBlob) {
        console.error('Failed to convert video to audio.');
        return;
      }
      const formData = new FormData();
      formData.append('file', audioBlob);
      const transcribeTimeStart = performance.now();
      try {
        setIsRunResolved(false);
        const transcribeResponse = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData
        });
        const transcribeTime = performance.now()-transcribeTimeStart;
        const latenciesRef = doc(db, "Latencies", gameId);
        if (transcribeResponse.ok) {
          const transcribeResult = await transcribeResponse.json();
          //generateResponse(transcribeResult.transcript);
          
          createMessage(transcribeResult, gameId);
          await setDoc(
            latenciesRef,
            {
              convertVideoTime:arrayUnion(convertVideoEnd-convertVideoStart),
              transcribeTime:transcribeTime,
            },
            { merge: true }
          );
        } else {
          console.error('Transcription failed');
          setIsRunResolved(true);
        }
      } catch (error) {
        setIsRunResolved(true);
        console.error('Error transcribing the audio:', error);
      }
    }
  }; */}

  {/*const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
    }
  }, []);*/}

 

  //AFTER RUN IS COMPLETED, THIS FUNCTION WILL FETCH THE WHOLE CHAT AND THEN SET MESSAGES TO FETCHED ARRAY
  const fetchMessages = async (limitNumber:number) =>{
      if(!gameId) return;
      if(readingOngoing.current) return;
      readingOngoing.current = true;
      const latenciesRef = doc(db, "Latencies", gameId);
      const startTime = performance.now();
        
      try{
        await axiosInstance({
          method:'GET',
          url:'/api/message/list',
          params:{
            threadId:gameId,
            limit:limitNumber,
          }
        }).then((res:any)=>{
          let newMessages = res.data.messages;
          // console.log(newMessages);
          //SORTING SO THAT THE LAST MESSAGE COMES AT LAST PLACE
          newMessages = newMessages.sort(
            (a:MessageFile, b:MessageFile) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
          // console.log(newMessages);
          setMessages((prevMessages:any)=>[...prevMessages,...newMessages]);
          if(limitNumber==1 && newMessages[0]?.role=="assistant" && chessyVoiceSound=='on'){
              playAudio(newMessages[0].content.at(0).text.value);
          }
        })
      }
      catch(error){
        // console.log("error", error);
        readingOngoing.current= false;
      }
      finally{
        const endTime = performance.now();
        const execTime = endTime-startTime;
        await setDoc(
          latenciesRef,
          {
            fetchingMessages:arrayUnion(limitNumber==1 ? execTime.toString()+'   '+(new Date).toUTCString() : 'All '+execTime.toString()),
          },
          { merge: true }
        );
      }
  }


  //AFTER RUN IS CREATED THIS FUNCTION WILL BE RETRIEVING RUN EVERY 0.5 SEC UNTILL THE FETCH STATUS IS 
  //ONE OF THE RESOLVED OPTIONS. IF ITS SUCCESSFULLY COMPLETED THEN THE FUNCTION WILL CALL fetchMessages() function
  const recordRunExecTime = async (execTime:number) =>{
    const latenciesRef = doc(db, "Latencies", gameId);
    await setDoc(
      latenciesRef,
      {
        runExecuteTime: arrayUnion(execTime+'   '+(new Date).toUTCString()),
      },
      { merge: true }
    );
  }

  const lastMessageTime= useRef<any>(null);

  const intervalRef = useRef<NodeJS.Timer | null>();
  const usageTimeTracker = () => {
    if(Object.keys(subscription).length==0) return;
    if(subscription.allowedUsageTime=='Unlimited') return;
    const timeNow = Math.floor(Date.now()/1000);
    lastMessageTime.current = timeNow;
    if(intervalRef.current) return;
    const subscrRef = doc(db, "Subscription", subscription.id)
    intervalRef.current = setInterval(async()=>{
      const doc = await setDoc(subscrRef,{
        allowedUsageTime:increment(-60),
      },{merge:true})
      const getDocRef = await getDoc(subscrRef);
      // console.log(getDocRef?.data());
      if(getDocRef?.data()?.allowedUsageTime<=0){
        if(intervalRef.current) clearInterval(intervalRef.current);
        router.refresh();
      }
      if(Math.floor(Date.now()/1000)-lastMessageTime.current>=600){
        if(intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 60000)
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const createPolling = async (runId:string)=>{
    if (!gameId) return;
    const startTime = performance.now();
    let shouldPull= true;
    let errNum = 0;
    while(shouldPull){
      try {
        const response = await axiosInstance({
          method:'GET',
          url:'/api/run/retrieve',
          params:{
            threadId: gameId,
            runId: runId,
          }
        })

        const latestRunInfo = response.data.run;

        
        if(
          ["failed","succeeded","canceled","completed"].includes(latestRunInfo.status)
        ){
          // console.log("STATUS IS: ", latestRunInfo.status);
          // console.log("RUN: ", latestRunInfo);
          const endTime = performance.now();
          const execTime = endTime - startTime;
          recordRunExecTime(execTime);
          fetchMessages(1);
          setIsRunResolved(true);
          shouldPull=false;
        }
      } catch (error) {
       // console.log(error);
       errNum+=1;
      }

      if (errNum>2){
        shouldPull=false;
      }

      await sleep(100);
    }
  }

  const createRun = async () => {
    if(!gameId || !game.assistantId) return;

   //const bestMovePerStockfish = await getBestMove();
    
    const ChessPersonality = (game.chessyPersonality == 'Roasty Chessy') ? 'You have to lightly jest with me while still teaching me' :
                             (game.chessyPersonality == 'Grandmaster Chessy') ? 'You have to prioritize teaching me like your own son.' :
                             (game.chessyPesronality == 'Hustler Chessy') ? 'You have to just hussle me and talk trash the entire time - no help.' :
                             'Just help';
   
    const PGNpositions = PGNNotation(movesArray);
    const positionsDescription = VerbalDescription(chess.fen());
    //SINCE WE CANT GIVE SOME GENERAL INSTRUCTIONS IN THREAD (FOR EACH CHAT/GAME), THE BEST WAY TO DO IT IS BY PROVIDING ADDITIONAL INSTRUCTIONS IN EACH RUN
    const initialSystemPrompt = `
    ###Chessy, you are in a chess coaching session with your student. The game parameters, current game state, and chess position insights are as follows:\n \n 
  
    ###Game Parameters:\n 
    #Your personality for this game: '${game.chessyPersonality}' (This means ${ChessPersonality})\n 
    #Level of assistance you will provide: ${game.helpLevel}\n 
  
    ###Game State:
    #Game state in PGN format: ${PGNpositions} \n 
    #Game state in FEN format: ${chess.fen()}\n 

    ###Chess Position Insights:\n 
    #Stockfish recommended best move for this position: \n 
  
    ### Instructions:\n 
    ##Your primary goal is to tailor the chess experience based on the user's preferences, ensuring both a competitive and educational game. Specifically, you should:\n 
    #Strategically use the PGN notation and Stockfish recommendations in your explanations.\n 
    #Provide insights and assistance in line with the user's chosen level of help and directly related to their question\n 
    `;

   
    //SINCE WE CANT GIVE SOME GENERAL INSTRUCTIONS IN THREAD (FOR EACH CHAT/GAME), THE BEST WAY TO DO IT IS BY PROVIDING ADDITIONAL INSTRUCTIONS IN EACH RUN
    const additionalInstructions = `
    ###Chessy, you are in a chess coaching session with your student. Tailor your responses based on the game parameters, current game state, and chess position insights are as follows:\n \n 
    ###Game Parameters:\n      
    #Your personality for this game: ${game.chessyPersonality}, that means ${ChessPersonality}.\n
    #Level of assistance you will provide: ${game.helpLevel}.\n 


    ###Game State:
    #Game state in PGN format: ${PGNpositions} \n 
    #Game state in FEN format: ${chess.fen()}\n 

    ###Chess Position Insights:\n 
    #Best move per stokfish: .\n
    `

    const startTime = performance.now();
    const latenciesRef = doc(db, "Latencies", gameId)
    try {

     const res= await axiosInstance({
       url:'/api/run/create',
       method:'POST',
       data:{
         assistantId: game.assistantId,
         threadId: gameId,
       }
      })
     
    
     if(res) createPolling(res.data?.run.id);


     const endTime = performance.now();
     const execTime = endTime-startTime;
     await setDoc(
       latenciesRef,
       {
         createRun:arrayUnion(execTime+'   '+(new Date).toUTCString()),
       },
       { merge: true }
     );
    } catch (error) {
     
    }
 }

  const [isPlayingAudio, setIsPlaying] = useState(false);

  const playAudio = async (textToSpeak: string) => {
  
    try {
      const audioBuffer = await axiosInstance({
        url: '/api/voice/text_to_sound',
        method: 'GET',
        params: {
          text: textToSpeak,
          voice: settings.assistantVoice.id,
        },
      });
      setIsPlaying(true);
      const buffer = Buffer.from(audioBuffer.data.data); // Ensure it's a Buffer
      const blob = new Blob([buffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
  
      const audio = new Audio(url);
      audio.play();
     
      // Listen for when the audio ends
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url); // Clean up the URL object
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };



  const createMessage = async (transcript: string, threadId: string) => {
    if(!gameId) return;
    if(!isRunResolved) return;
    if(Object.keys(subscription).length==0) return;
    if(subscription.allowedUsageTime<=0) return;
    readingOngoing.current=false;
    setIsRunResolved(false);
    const messageObject = {
      id: "msg_abc123",
      object: "thread.message",
      created_at: 1713226573,
      assistant_id: null,
      thread_id: "thread_abc123",
      run_id: null,
      role: "user",
      content: [
        {
          type: "text",
          text: {
            value: transcript,
            annotations: []
          }
        }
      ],
      attachments: [],
      metadata: {}
    }
    setMessages([...messages, messageObject]);
    //const PGNstring = PGNNotation(movesArray);
    //const positionsDescription = VerbalDescription(chess.fen());
    //const bestMovePerStockfish = await getBestMove();
    //// console.log(transcript);
    //const message = `
    // ${transcript}|\n
    // I play with ${game.userColor} pieces. \n
    // Here is PGN Notation string to help you: ${PGNstring}.\n
     //Positions of pieces on the table:\n ${positionsDescription}\n
    // Best move per stockfish: ${bestMovePerStockfish}
    // `
    const chessPgnFromHistory = get_board_pgn_from_history(chess.history());
    const analysisStartTime = performance.now();
    //const {analysis_results, print_output} = await analyzeChessMoveV3(
     // chessPgnFromHistory, stockfishData[stockfishData.length-1], stockfishData[stockfishData.length-2],
     //true, true, true, true, true, true, true, true, true, true, true, true 
   // )

   //helpLevel and chessyPersonality could be in conflict, ie help level could be "Tell me EVERYTHING" 
   //and chessyPersonality could be: "you will just hustle me and talk trash the entire time - no help"
   const initialInstructions: string = `
     ### Chessy, you are in a chess coaching session with your student. Tailor your responses based on the game parameters, PGN game state, and Position analysis details are as follows:\n\n
     ### Game Parameters:\n
     # Your personality for this game: ${game.chessyPersonality}, that means ${chessyPersonalityObject[game.chessyPersonality]}.\n
     # Level of assistance you will provide: ${game.helpLevel}.\n
   `;
    const {analysis_results, print_output} = await processPrompt(chessPgnFromHistory, stockfishData[stockfishData.length-1], stockfishData[stockfishData.length-2]);
    const analysisDuration = performance.now()-analysisStartTime;
    //console.log("ANALYSIS DURATION: ", analysisDuration);
    // console.log("ANALYSIS RESULTS: ", analysis_results);
    const message = initialInstructions + build_prompt(chess.fen(), chessPgnFromHistory, print_output, transcript, 'Template already in build prompt');
    //const message = `${transcript}\nBoard Description: "${fen}"\nBest Move according to Stockfish: "${bestMove}"`
    //const metadata = `Positions in Fortsyth-Edvards Notation: ${fen}`
    // console.log("MESSAGE: ", message);
    const latenciesRef = doc(db, "Latencies", gameId);
    const startTime = performance.now();
    //const message = transcript;
  
    try {
      const response = await axiosInstance({
         url: '/api/message/create',
         method: 'POST',
         data:{
           message: message,
           threadId: threadId,
           fen: fenStringsArray[fenStringsArray.length-1], 
           moveNumber: movesArray.length, 
           evaluation: stockfishData.length>0? stockfishData[stockfishData.length-1].evaluation : null,
         }
      });
      const mmsgg= response.data.message;
      try {
        setMessages([...messages, mmsgg])
        // console.log(mmsgg);
        usageTimeTracker();
        createRun();
        setIsRunResolved(false)
      } catch (error) {
        // console.log(error);
        setIsRunResolved(true);
      }
      
      if(chess.fen()===fenStringsArray[fenStringsArray.length-1]){
        const userCurrentGameRef = doc(db, "Game", gameId);
    
          await setDoc(
              userCurrentGameRef,
              {
                positions:movesArray,
                fenArray:fenStringsArray,
              },
              { merge: true }
          );
      }
      //return response.data?.message.id;
   } catch (error) {
      console.error("Message creation failed:", error);
      setIsRunResolved(true);
      throw error;
   } finally {
      const endTime = performance.now();
      const execTime = endTime-startTime;
      await setDoc(
        latenciesRef,
        {
          creatingMessage:arrayUnion(execTime+'   '+(new Date).toUTCString()),
        },
        { merge: true }
      );
   }
  }

  type CalcWidthFunction = (obj: any) => number;
  const calcWidthFunct:CalcWidthFunction = (obj:any) => {
    let width = obj.screenWidth < 560 ? obj.screenWidth-40 : 560
    return width
  }

  const goToLastMove = ()=>{
    if(computerMoveLoading.current) return;
    chess.load(fenStringsArray[fenStringsArray.length-1]);
    setPointer(fenStringsArray.length);
  }

  const goToFirstMove = () =>{
    if(computerMoveLoading.current) return;
    chess.reset();
    setPointer(0);
  }

  const goToPreviousMove=()=>{
    if(computerMoveLoading.current) return;
    if(chess.fen()=='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') return;
    // console.log(fenStringsArray);
    // console.log("Pointer: ", pointer);
    if(pointer-2<0){
      chess.reset();
    }
    else chess.load(fenStringsArray[pointer-2]);
    setPointer(prevPointer=>prevPointer-1);

  }

  const goToNextMove = () => {
    if(computerMoveLoading.current) return;
    if(chess.fen()==fenStringsArray[fenStringsArray.length-1]) return;
    chess.load(fenStringsArray[pointer])
    setPointer(prevPointer=>prevPointer+1);
  }

  const setPosition = (no: number) => {
    if(no<1 || no>fenStringsArray.length) return;
    setPointer(no);
    chess.load(fenStringsArray[no-1]);
  }

  const playFromPosition = () => {
    if(computerMoveLoading.current){
      return;
    }
    if(game.userColor=='White' && pointer%2==0){
       return;
    } //if user is white and pointer%2 == 0 that means it's his (user's) move, not computers
    if(game.userColor=='Black' && pointer%2==1){
      return;
    } //similar as above
    setComputersTurn(true);
  }


  const switchRecording = ()=>{
    if(!isRunResolved) {
      // console.log("You cant create new propmt while the last one isn't resolved yet") 
      return;  
   };
    if(!isRecording) startRecording();
    else stopRecording();
  }

  const gameOverLogic = async ()=>{
     if(!chess.isGameOver()) return;
     if(game.isCompleted) return;
     const userCurrentGameRef = doc(db, "Game", gameId);
     const userRef = doc(db, "UserProfile", user.id);
     const wayOfEnd = 
     chess.isStalemate() ? ['Draw by stalemate', 'd'] : 
     chess.isThreefoldRepetition() ? ['Draw by repetition', 'd'] : 
     chess.isInsufficientMaterial() ? ['Draw by insufficient material', 'd'] : 
     chess.isDraw() ? 'Draw' : (chess.turn()=='w' && game.userColor == 'White' || chess.turn()=='b' && game.userColor=='Black') ? ['You lost by checkmate', 'l'] :
    ['You won by checkmate','w'];
    let newElo = null;
    
    if(user.hasOwnProperty("ELO")){
      let diff = difficult.find((itm: {
           id: number;
           name: string;
           description: string;
           difficulty: string;
       }) => itm.name === game.difficultyLevel)?.id;

       if(!diff){
         console.log("Something wrong with difficulty id");
         diff=1;
       }
      
       let gameRes = 'd';
       if(chess.isCheckmate()){
          if((chess.turn()=='b' && game.userColor=='Black') || (chess.turn()=='w' && game.userColor=='White')){
             gameRes='l';
          }
          else if((chess.turn()=='w' && game.userColor=='Black') || (chess.turn()=='b' && game.userColor=='White')){
             gameRes='w';
          }
       }
      const toAdd = PointsGained(diff, gameRes);
      console.log("Points gained: ", toAdd);
      newElo = user.ELO + toAdd;
    }
    else{
      if(stockfishData.length>0){
        newElo = estimateElo(stockfishData, game.userColor[0].toLowerCase());
        newElo = Math.ceil(newElo*0.2)+Math.ceil(user.rating*0.8);
        console.log("FINALIZED ELO: ", newElo);
      }
    }

    try {
     await setDoc(
         userCurrentGameRef,
         {
           isCompleted:wayOfEnd,
           positions:movesArray,
           fenArray:fenStringsArray,
           stockfishAnalysis:stockfishData,
           ratingBefore: user.ELO || user.rating || 100,
           ratingAfter: newElo,
           endTime: Math.floor((new Date).getTime()/1000)
         },
         { merge: true }
     );
     await setDoc(
      userRef,
      {
        ELO: newElo,
        NotFinishedGames: increment(-1),
      },
      { merge: true }
     );
     setIsGameCompleted(true);
    } catch(err:any) {
       console.log("ERROR: ", err);
    }

  }

  const resignTheGame = async () =>{
    if(isGameCompleted) return;
    const userCurrentGameRef = doc(db, "Game", gameId);
    const wayOfEnd = ['You lost by resignation', 'l'];
    const userRef = doc(db, "UserProfile", user.id);
    const ratingAfter = user.hasOwnProperty('ELO') ? user.ELO-10 : user.rating-10;
    try {
      setIsGameCompleted(true);
      await setDoc(
          userCurrentGameRef,
          {
            isCompleted:wayOfEnd,
            positions:movesArray,
            fenArray:fenStringsArray,
            stockfishAnalysis:stockfishData,
            ratingBefore: user.ELO || user.rating || 100,
            ratingAfter: ratingAfter || 100,
            endTime: Math.floor((new Date).getTime()/1000)
          },
          { merge: true }
      );
      await setDoc(
        userRef,
        {
          ELO: ratingAfter || 100,
          NotFinishedGames: increment(-1),
        },
        { merge: true }
       );
     } catch {
      setIsGameCompleted(false);
     }
  }

  const analyzeUserMoves= async() =>{
    const evalArray = await analyze_user_moves(stockfishData, game.userColor[0].toLowerCase(), fenStringsArray, movesArray);
    setUserMovesAnalysis(evalArray);
  }

  useEffect(()=>{
    if(chess.isGameOver()) {
      gameOverLogic();
      if(stockfishData.length>0){
        analyzeUserMoves();
      }
    }
  }, [chess.isGameOver()])

  const getBestMove = async ()=>{
    const response = await getBestMoveFromStockfishv2(13);
    if (response.ok) {
      const { success, bestmove } = await response.json();
      const data = bestmove;
      if (success) {
        const bestMoveForPrompt = data.split(' ')[1];
        const bestMove = bestMoveForPrompt.slice(0,2); //first part of best move string, contains two chars that symbolize current position of the piece
        const bestMove2 = bestMoveForPrompt.slice(2); //second part of best move string, two chars that symbolize square where piece should be moved to
        const piece = chess.get(bestMove as Square); //getting piece from the square (so we know the name of the piece we need to move)
        const pieceWord = turnLetterToWord(piece.type); //translating piece type (which is letter i.e. p,q,k,b,r...) to word (i.e pawn, qeen, king)
        const finalString=`${pieceWord} from ${bestMove} to ${bestMove2}`; //forming string that would be sent to assistant (i.e pawn from c2 to c4)
        return finalString;
      } else {
        console.error("Failed to get the best move from Stockfish.");
        return 'Undefined';
      }
    } else {
      console.error(`Error: ${response.statusText}`);
      return 'Undefined';
    }
     //// console.log("Best move per stockfish: ", bestMovePerStockfish);
  }

  const playMoveSound = (voice:string) => {
    let audio= null;
    switch(voice){
      case 'moveSound':{
         if (settings.moveSound && settings.moveSound !== 'No sound') {
            audio = new Audio(`/chessSounds/${settings.moveSound}`)
            
         }
         break;
      }
      case 'captureSound':{
        if (settings.captureSound && settings.captureSound !== 'No sound') {
          audio = new Audio(`/chessSounds/${settings.captureSound}`)
          
       } 
       break;
      }
      case 'checkSound':{
        if (settings.checkSound && settings.checkSound !== 'No sound') {
          audio = new Audio(`/chessSounds/${settings.checkSound}`)
          
       }
       break;
      }
      case 'gameOverSound':{
        audio = new Audio(mp3MovesRecordings[3].url);
        break;
      }

    }
  
    if(audio)
      audio.play();
 }


 const createThread = async () => {
  try {
     const response = await axiosInstance({
        url: '/api/thread/create',
        method: 'POST',
        data:{
          userId: user.id
        },
        headers: {
          "Content-Type": "application/json",
        },
     });
     return response.data?.thread.id;
  } catch (error) {
     console.error("Thread creation failed:", error);
     throw error;
  }
}

 async function quickPlay(){
  
  try {
    const threadId = await createThread();
    //// console.log(threadId)
    const userCurrentGameRef = doc(db, "Game", threadId);
    const date = new Date();
    await setDoc(
        userCurrentGameRef,
        {
          userId: user.id,
          assistantId: game.assistantId,
          difficultyLevel: game.difficultyLevel,
          chessyPersonality: game.chessyPersonality,
          userColor: game.userColor,
          helpLevel: game.helpLevel,
          hintsLeft: MAX_HINTS_PER_GAME,
          timeCreated: date.getTime(),
          positions:[],
          fenArray:[],
        },
        { merge: true }
    );

    const userProfileRef = doc(db, "UserProfile", user.id);
    await setDoc(
      userProfileRef,
      {
        userCurrentGame: threadId,
      },
      { merge: true }
    );
    location.reload();
  } catch (error:any) {
    console.log("ERROR IS: ", error);
      if(error?.response?.status == 402){
          setResponseError({status:402, additional: error.response.data.text})
      }
      if(error?.response?.status == 403){
        Swal.fire({
          position: "bottom-end",
          icon: "error",
          title: error.response.data.text,
          showConfirmButton: false,
          timer: 2500
        });
      }
  }

 }

 const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
   

 const toggleComponentVisibility = () => {
   setIsMobileMenuVisible(!isMobileMenuVisible);
 };

 async function handleVote(index:number, option:string){

  const targetedMessage = messages[index];
  if(responseReviewsCollection.some(obj => obj.id === targetedMessage.id)){
    return;
  }
  const responseReviewRef = doc(db, "ResponseReview", targetedMessage.id);
  setResponseReviewsCollection(prevCollection=>[...prevCollection, {id:targetedMessage.id, rating:option}]);
  try {
    await setDoc(
        responseReviewRef,
        {
          rating: option,
          userId: user.id,
          email: user.email,
          chessComAcc: user.chessName,
          gameId: gameId,
          assistantId: game.assistantId,
          chessyPersonality: game.chessyPersonality,
          userColor: game.userColor,
          helpLevel: game.helpLevel,
          userMessage: messages[index-1].content[0].text.value,
          assistantResponse: targetedMessage.content[0].text.value,
          fen: messages[index-1].metadata.fen,
          moveNumber: messages[index-1].metadata.moveNumber,
          evaluation: messages[index-1].metadata.evaluation,
        },
        { merge: true }
    );

    const userProfileRef = doc(db, "UserProfile", user.id);
    await setDoc(
      userProfileRef,
      {
         responseReviews: arrayUnion(targetedMessage.id),
      },
      { merge: true }
    );

    const gameRef = doc(db, "Game", gameId);
    await setDoc(
      gameRef,
      {
         responseReviews: arrayUnion({id:targetedMessage.id, rating:option}),
      },
      { merge: true }
    );
    Swal.fire({
      position: "bottom-end",
      icon: "success",
      width: 300,
      text: "Your review has been saved",
      showConfirmButton: false,
      timer: 1000
    });
  } catch (error) {
      // console.log(error);
      setResponseReviewsCollection(prevCollection=>prevCollection.slice(0,-1));
  }
 }

 async function processPrompt(input_data:string, after_last_move_stockfish:any, after_second_to_last_move_stockfish:any) {
  const query = new URLSearchParams({
    input_data: encodeURIComponent(input_data),
    after_last_move_stockfish: encodeURIComponent(JSON.stringify(after_last_move_stockfish)),
    after_second_to_last_move_stockfish: encodeURIComponent(JSON.stringify(after_second_to_last_move_stockfish)),
  }).toString();

  const response = await fetch(`/api/analysis?${query}`, {
    method: 'GET',
  });

  const data = await response.json();
  // console.log("DATA RESPONSEEEE :...------------------------------------", data);
  return data;
}

  // Helper function to check if WASM is supported by the user's browser
  function wasmSupported(): boolean {
    if (typeof WebAssembly !== "object") return false;
    const source = Uint8Array.from([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 7, 8,
      1, 4, 116, 101, 115, 116, 0, 0, 10, 15, 1, 13, 0, 65, 0, 253, 17, 65, 0,
      253, 17, 253, 186, 1, 11,
    ]);
    if (
      typeof WebAssembly.validate !== "function" ||
      !WebAssembly.validate(source)
    )
      return false;
    if (typeof Atomics !== "object") return false;
    if (typeof SharedArrayBuffer !== "function") return false;
    return true;
  }
 
  // Setup stockFishWasm
  useEffect(() => {
    const loadWasmAndStockfish = async () => {
      if (wasmSupported()) {
        setSupportsWasm(true);

        // Load Stockfish with WebAssembly threads support
        const stockfishScript = document.createElement('script');
        stockfishScript.src = '/stockfish/stockfish.js';
        
        stockfishScript.onload = async () => {
          setStockfishWasmStatus("LOADING");
          let stockfishInstance = null;

          try {
            // Fetch WebAssembly binary
            const wasmResponse = await fetch('/stockfish/stockfish.wasm');
            if (wasmResponse.ok) {
              const wasmArrayBuffer = await wasmResponse.arrayBuffer();
              
              // Load Stockfish with the instantiated WebAssembly module
              stockfishInstance = await Stockfish({ wasmBinary: wasmArrayBuffer });
              setStockfishWasmStatus('SUCCESS');

              setStockfishWasm(stockfishInstance);
              setStockfishWasmStatus('READY');
            } else {
              setStockfishWasmStatus('FAILED');
            }
          } catch (error) {
            setStockfishWasmStatus('FAILED');
            console.error('Error loading Stockfish WebAssembly:', error);
          }
        };

        document.body.appendChild(stockfishScript);

        return () => {
          document.body.removeChild(stockfishScript);
        };
      } else {
        setSupportsWasm(false);
      }
    };

    loadWasmAndStockfish();
  }, []);

  function processStockfishOutput(line: string, analysisResult: any) {
    // Match evaluation score in centipawns (cp) or mate (mate)
    const scoreMatch = line.match(/score\scp\s+(-?\d+|mate\s+\d+)/);
    if (scoreMatch) {
        if (scoreMatch[1].startsWith('mate')) {
            // Extract mate information
            analysisResult.mate = parseInt(scoreMatch[1].replace('mate ', ''), 10);
            analysisResult.evaluation = null; // Mate value overrides evaluation
        } else {
            // Extract evaluation in centipawns and convert to pawns
            analysisResult.evaluation = parseInt(scoreMatch[1], 10) / 100;
            analysisResult.mate = null;
        }
    }

    // Extract principal variation (pv) - the best move continuation
    const pvMatch = line.match(/pv\s+(.+)/);
    if (pvMatch) {
        analysisResult.continuation = pvMatch[1];
    }
    
    // Match best move
    const bestMoveMatch = line.match(/bestmove\s+(\w+)/);
    if (bestMoveMatch) {
        // Extract the best move
        analysisResult.bestmove = line;
    }
  }

  async function stockfishWasmAnalyzePosition(depth: number, fen: string):Promise<AnalysisResult> {
    let analysisResult = {
      ok: false,
      success: false,
      statusText: null,
      bestmove: null,
      mate: null,
      continuation: null,
      evaluation: null,
      json: function() {
        // Return the result in a structure compatible with API responses
        return {
            ok: this.ok,
            success: this.success,
            statusText: this.statusText,
            bestmove: this.bestmove,
            mate: this.mate,
            continuation: this.continuation,
            evaluation: this.evaluation
        };
      }
    };

    return new Promise((resolve, reject) => {
      const onMessage = (line: string) => {
        if( line.includes(` depth ${depth} `) ){
          processStockfishOutput(line, analysisResult);
        }
        if(line.startsWith('bestmove')){
          processStockfishOutput(line, analysisResult);
          analysisResult.ok = true;
          analysisResult.success = true;
          resolve(analysisResult);
          setStockfishWasmStatus('READY');
          
          // Clean up listener after analysis is done
          stockfishWasm.removeMessageListener(onMessage);
        }
      };

      stockfishWasm.addMessageListener(onMessage);
      
      stockfishWasm.postMessage(`position fen ${fen}`);
      stockfishWasm.postMessage(`go depth ${depth}`);
    });
  }

  return (
    //className "flex justify-center align-center"
    <div className="relative w-full overflow-x-auto">
      {
        responseError && responseError.status == 402 && 
        <PricingTable userId={user.id} text={responseError.additional} trial={!user.hasOwnProperty('subscription')} subscription={{}}/>
      }
      <section
        id="learnmoreNavbar"
        className={` bg-[#124429] h-[48px] sticky md:hidden z-[50] top-0 left-0 right-0 px-4  py-[8px]  justify-center transform-all transition ease-in-out duration-1000`}
      >
        <svg
          style={{ filter: "contrast(125%) brightness(110%)" }}
          className="absolute w-full h-[48px] left-0 right-0 top-0 bottom-0 z-0 opacity-[35%]"
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".7"
              numOctaves="3"
              stitchTiles="stitch"
            ></feTurbulence>
            <feColorMatrix type="saturate" values="0"></feColorMatrix>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)"></rect>
        </svg>
        <div className="absolute w-full h-[48px] top-[6px]">
          <RxHamburgerMenu
            onClick={() => toggleComponentVisibility()}
            className="h-[36px] w-[36px]  text-white hover:bg-white/30 transition-all duration-300 cursor-pointer p-1 rounded-full"
          />
        </div>
      </section>
      {isMobileMenuVisible && (
        <MobileSidebar
          toggleComponentVisibility={toggleComponentVisibility}
          lout={lout}
        ></MobileSidebar>
      )}
      <div className="w-full lg:flex pt-4">
        <Board
          fenString={chess.fen()}
          handleMove={handleMove}
          goToLastMove={goToLastMove}
          goToFirstMove={goToFirstMove}
          goToPreviousMove={goToPreviousMove}
          goToNextMove={goToNextMove}
          movesArray={movesArray}
          currentPositionIndex={pointer}
          setPosition={setPosition}
          playFromPosition={playFromPosition}
          userColor={game.userColor}
          recording={isRecording}
          switchRecording={switchRecording}
          chessName={user.chessName}
          chess={chess}
          messages={messages}
          hintArrow={hintArrow}
          hintSquare={hintSquare}
          hint={hint}
          isRunResolved={isRunResolved}
          gameId={gameId}
          createMessage={createMessage}
          isGameCompleted={isGameCompleted}
          subscribed={
            subscription &&
            (subscription.allowedUsageTime > 0 ||
              subscription.allowedUsageTime == "Unlimited")
          }
          settings={settings}
          quickPlay={quickPlay}
          resignTheGame={resignTheGame}
          chessyVoiceSound={chessyVoiceSound}
          handleChessyVoiceSound={handleChessyVoiceSound}
          displayCaptured={displayCaptured}
          handleDisplayCaptured={handleDisplayCaptured}
          userMovesAnalysis={userMovesAnalysis}
          handleVote={handleVote}
          responseReviewsCollection={responseReviewsCollection}
          chessyComment={chessyComment}
          isPlayingAudio={isPlayingAudio}
        />
      </div>
    </div>
  );
};

export default ChessboardClient2;
"use client";
import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '@/utils/auth/FirebaseCredentials';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from "uuid";
import axios from 'axios';
import UserStatesContext from '../context/userStates';
import { helpLvl, difficult, style, colors, openings} from './data';
import UsernameInput from '@/components/UsernameInput';
import { AnimatePresence, motion } from "framer-motion";
import { RadioGroup } from "@headlessui/react";
import Link from 'next/link';
import LoadingClient from '../loadingClient';
import { MdNorthWest } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import { FaChessKnight } from "react-icons/fa6";
import { FaRegChessKnight } from "react-icons/fa6";
import { BiSolidChess } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import getFENnSAN from './methods/getFENnSAN';
import FormBoard from '@/components/FormBoard';
import SubscriptionCodeInput from '@/components/SubscriptionCodeInput';
import { SubscriptionCodes } from '@/lib/subscriptionCodes';
import { subscriptionTiers } from '@/lib/subscriptionTiers';
import { json } from 'stream/consumers';
import Image from 'next/image'
import mockup3 from '@/public/images/mockup3.png'; // Import the image
import SubscriptionTrialModal from '@/components/SubscriptionTrial';
import Swal from 'sweetalert2';
import { axiosInstance } from '@/services/base-http.service';
import PricingTable from '@/components/PricingTable';

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

export default function UserInputPage({session, userProfile}:any) {
  const [difficultyLevel, setDifficultyLevel] = useState(difficult[0]); // Default to 'Effortless'
  const [chessyPersonality, setChessyPersonality] = useState(style[0]); // Default to 'Roasty Chessy'
  const [helpLevel, setHelpLevel] = useState(helpLvl[0]); // Default to 'Lot'
  const [chessComUsername, setChessComUsername] = useState<boolean>(!userProfile? false : (userProfile.chessComUsername ? true : false)); // check if chess.com acc already entered
  const [chessComUsernameText, setChessComUsernameText] = useState<string>(''); // Added field for chess.com username
  const [lastGameId, setLastGameId] = useState<string>('');
  const [lichessUsernameText, setLichessUsernameText] = useState<string>('')
  //const [subCode, setSubCode] = useState<string>('');
  const [step, setStep] = useState(!userProfile ? 0 : (userProfile.chessComUsername ? 1 : 0));
  const [userColor, setUserColor] = useState(colors[0]);
  const [responseError, setResponseError] = useState<{status:number, additional:string} | null>(null);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  const [loadingGame, setLoadingGame] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const isMediumScr = useMediaQuery({
    query: '(max-width: 768px)'
  });
  const isSmallScr = useMediaQuery({
    query: '(max-width: 568px)'
  });
  const [movesArray, setMovesArray] = useState<string[]>([]);
  const [fenStringsArray, setFenStringsArray] = useState<string[]>([]);
  const [selectedOpening, setSelectedOpening] = useState(0);
  const [openingDropDownActive, setOpeningDropDownActive] = useState(false);

  const [supportsWasm, setSupportsWasm] = useState(false);
  const [stockfishWasmStatus, setStockfishWasmStatus] = useState<string>('INIT')
  const [stockfishWasm, setStockfishWasm] = useState<any | null>(null);
  const [stockfishWasmBestMoveDepth, setStockfishWasmBestMoveDepth] = useState<number>(13);

  function handleSelectOpening(idx:number){
      setSelectedOpening(idx);
      setOpeningDropDownActive(false);
      if(idx!==0){
        getFENnSAN(openings[idx-1].movesArray);
      }
  }
  const [customPositionDisplayActive, setCPDA] = useState(false);
  function handleCustomPosition(){
     setCPDA(true);
     setSelectedOpening(-1);
     setOpeningDropDownActive(false);
  }

  const sendWelcomeEmail = async (usernameChess:string) => {
      const userEmail = session.user.email || '';
      
      try {
        const response = await axiosInstance({
           url: '/api/brevo/send',
           method: 'POST',
           data:{
              userEmail: userEmail,
              chessUser: usernameChess,
           }
        });
      } catch (error:any) {
       console.log("Error sending mail!");
      }
  }

  const handleCloseCustomPositionModal=(option:number)=>{
    setCPDA(false);
    if(option==1){
      setSelectedOpening(0);
    }
    else if(fenStringsArray.length==0){
      setSelectedOpening(0);
    }
  }
  
  //const handleSubCodeError = (text:string) =>{
    //setChessSubCodeError((prevState:any) => ({
    //  ...prevState,
    //  subCodeError: text,
    //}))
 // }
 const [chess_subcode_error, setChessSubCodeError] = useState({chessNameErr:''})
 const handleChessNameError = (text:string) =>{
    setChessSubCodeError((prevState:any) => ({
      ...prevState,
      chessNameErr: text,
  }))
 }
  {/*const createSubscription = async(code: string) =>{
     const subId = 'sub_'+uuid().slice(0,18);
     // console.log("SUB ID: ", subId);
     //@ts-ignore
     const subscriptionTierId = SubscriptionCodes.hasOwnProperty(parseInt(code)) ? SubscriptionCodes[parseInt(code)] : null;
     // console.log("Sub tier id is: ", subscriptionTierId);
     if(!subscriptionTierId && subscriptionTierId!==0) {
      handleSubCodeError('Incorrect code!');
      return null;
    }
    const subTier = subscriptionTiers[subscriptionTierId];
    const subscriptionRef = doc(db, "Subscription", subId);
    try{
       await setDoc(subscriptionRef,{
        ...subTier,
        userId: user?.uid,
       })
    }
    catch(error){
       handleSubCodeError('Subscription creation failed. Please reload the page and try again!');
       return null;
    }
     return subId;
  }*/}
  //const [chess_subcode_error, setChessSubCodeError] = useState({chessNameErr:'', subCodeError:''})
 
  const createChessNameAndAssistant = async ()=>{
    if(chessComUsername) return;
    if(!chessComUsernameText) {
      handleChessNameError('You have to enter Chess.com username');
      return;
    };
    if(!user) return;
    //if(!subCode) {
      //handleSubCodeError('You need to enter subscription code (40000)');
      //return;
    //}
    //const subscriptionId = await createSubscription(subCode);
    //if(!subscriptionId){
      //return;
    //}
    setStep(1);
    const asstnt = await createAssistant(chessComUsernameText);
    if(!asstnt){
        setStep(0);
        return;
    }
    
    // console.log("ASSISTANT ID: ", asstnt.assistant.assistant_id);
    // console.log("ASSISTANT INFO: ", asstnt.assistant.acc_overview);
    sendWelcomeEmail(chessComUsernameText);
    const chatAssistant = await createChatAssistant(chessComUsernameText,asstnt.assistant.acc_overview);
    // console.log(`CHAT ASSISTANT INFO AND INSTRUTIONS: \n ${chatAssistant.assistant} \n INSTRUCTIONS: ${chatAssistant.instructions}`);
    const userProfileRef = doc(db, "UserProfile", user.uid);
    try {
        await setDoc(
            userProfileRef,
            {
              chessComUsername: chessComUsernameText,
              assistantId: asstnt.assistant.assistant_id,
              rating: asstnt.assistant.rating,
              //subscription: subscriptionId,
              chatAssistant: chatAssistant?.assistant ? chatAssistant.assistant : null,
            },
            { merge: true }
        );
        setChessComUsername(true);
    } catch (error) {
        setChessComUsername(false);
        setStep(0);
    }
  }
  useEffect(()=>{
    if(!session) router.push('/login')
    // console.log("STEP: ", step);
    // console.log("UPr: ",userProfile);
    setUser(session.user);
  },[])
  
  useEffect(()=>{
    // console.log(user);
    if(user) {
      checkUsersLastGame();
    };
  },[user])
  
  const createThread = async () => {
    try {
       const response = await axiosInstance({
          url: '/api/thread/create',
          method: 'POST',
          data:{
            userId: session.user.uid,
          }
       });
       return response.data?.thread.id;
    } catch (error:any) {
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
      return error;
   }
 }
 const getUsersProfileData = async () => {
  if(!user) throw new Error('Unauthenticated');
  const docRef = doc(db, "UserProfile", user.uid);
  const userProfile = await getDoc(docRef);
  return userProfile.data();
 }
 const checkUsersLastGame = async () => {
  try {
    const profileData = await getUsersProfileData();
    if(!profileData?.userCurrentGame) {setLastGameId('')}
    else setLastGameId(profileData.userCurrentGame);
  }
  catch(error){
    // console.log(error);
  }
 }
  const checkChessProfileAdded = async () => {
    try {
      const profileData = await getUsersProfileData();
      if(!profileData?.chessComUsername){
        setChessComUsername(false);
      } 
      else setChessComUsername(profileData?.chessComUsername);
    } catch (error) {
      // console.log(error);
    }
  }

  async function createAssistant(username:string) {
    try {
       const response = await axiosInstance({
          url: `/api/assistant/create?username=${encodeURIComponent(username)}`,
          method: 'GET',
       });
       // console.log(response)
       return response.data;
    } catch (error) {
       console.error("Assistant creation failed:", error);
       throw error;
    }
 }


 //POSSIBLE INFINITE LOOP IF stockfish is down for some reason... 
 async function getBestMoveFromStockfishv2(fenStr: string):Promise<Response|AnalysisResult>{
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
        return stockfishWasmAnalyzePosition(13, fenStr);
      }
    }

    try{
      const bestMove = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(fenStr)}&depth=13&mode=bestmove`, {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
      });
      return bestMove;
    }
    catch(error:any){
      return getBestMoveFromStockfishv2(fenStr);
    }
 }

 async function stockfishAnalysis(fenStr: string) {
  const response = await getBestMoveFromStockfishv2(fenStr);
  if (response.ok) {
    const { success, bestmove, mate, continuation, evaluation } =
      await response.json();
    if (success) {
      const bestMoveForPrompt = bestmove.split(" ")[1];
      // Store the best move calculated at depth 13
      // Continue using the depth according to difficulty level for making the actual move in the game
      return {
        bestmove: bestMoveForPrompt,
        mate: mate,
        continuation: continuation,
        evaluation: evaluation,
      };
      //setPointer(prevPointer=>prevPointer+1);
    } else {
      return { bestmove: "", mate: null, continuation: "", evaluation: 0.2 };
    }
  } else {
    console.error(`Error: ${response.statusText}`);
    return { bestmove: "", mate: null, continuation: "", evaluation: 0.2 };
  }
 }


 async function createChatAssistant(username:string, acc_overview:string) {
  try {
     const response = await axiosInstance({
        url: `/api/chat_assistant/create?username=${encodeURIComponent(username)}&acc_overview=${encodeURIComponent(acc_overview)}`,
        method: 'GET',
     });
     // console.log(response)
     return response.data;
  } catch (error) {
     console.error("Assistant creation failed:", error);
     throw error;
  }
}

  const handleSaveData = async () => {
    if(loadingGame) return;
    setLoadingGame(true);
    if (!user) {
      console.error("No user logged in");
      setLoadingGame(false);
      return;
    }
    const assistantId = await getUsersProfileData();
    if(assistantId?.assistantId){
        try {
          const threadId = await createThread();
          //// console.log(threadId)
          const gameId = threadId;
          let sanArray:string[] = [];
          let fenArray:string[] = [];
          let stockfishData: any[] = [];
          if(selectedOpening>0){
              const result = getFENnSAN(openings[selectedOpening-1].movesArray);
              sanArray = [...result.sanArray];
              fenArray = [...result.fenArray];
              for(let i=0; i<fenArray.length; i++){
                if(userColor.name == 'Black' && i==0){
                  stockfishData.push({bestmove: 'e2e4', mate: null, continuation: "e2e4 e7e6 c2c4 c7c5 g1f3 d8c7 d2d4 c5d4 f3d4 g8f6 b1c3 b8c6", evaluation: 0.66});
                }
                if(i<fenArray.length-1 || (userColor.name=='Black' && fenArray.length%2==1) || (userColor.name=='White' && fenArray.length%2==0)){
                  const analysisData = await stockfishAnalysis(fenArray[i]);
                  const {bestmove, mate, evaluation, continuation} = analysisData;
                  stockfishData.push({bestmove, mate, evaluation, continuation});
                }
              }
          }
          if(selectedOpening==-1){
            // console.log("U SNIMANJU: \n",[...movesArray],"\n", [...fenStringsArray]);
            for(let i=0; i<fenStringsArray.length; i++){
              if(userColor.name == 'Black' && i==0){
                stockfishData.push({bestmove: 'e2e4', mate: null, continuation: "e2e4 e7e6 c2c4 c7c5 g1f3 d8c7 d2d4 c5d4 f3d4 g8f6 b1c3 b8c6", evaluation: 0.66});
              }
              if(i<fenStringsArray.length-1 || (userColor.name=='Black' && fenStringsArray.length%2==1) || (userColor.name=='White' && fenStringsArray.length%2==0)){
                const analysisData = await stockfishAnalysis(fenStringsArray[i]);
                const {bestmove, mate, evaluation, continuation} = analysisData;
                stockfishData.push({bestmove, mate, evaluation, continuation});
              }
            }
          }
          const userCurrentGameRef = doc(db, "Game", gameId);
          const date = new Date();
          await setDoc(
              userCurrentGameRef,
              {
                userId: user.uid,
                assistantId: assistantId?.assistantId,
                difficultyLevel: difficultyLevel.name,
                chessyPersonality: chessyPersonality.name,
                userColor: userColor.name,
                helpLevel: helpLevel.name,
                timeCreated: date.getTime(),
                positions:selectedOpening == -1 ? [...movesArray] : [...sanArray],
                fenArray: selectedOpening == -1 ? [...fenStringsArray] : [...fenArray],
                stockfishAnalysis: stockfishData
              },
              { merge: true }
          );
          const userProfileRef = doc(db, "UserProfile", user.uid);
          await setDoc(
            userProfileRef,
            {
              userCurrentGame: gameId,
            },
            { merge: true }
          );
          router.push('/chessboard');
        } catch (error) {
            // console.log(error);
        }
    }
    else{
        setInterval(handleSaveData, 1500);
    }
  };
  //NOT IN FUNCTION YET
  /*const loadTheLastGame = async () => {
     if(!lastGameId || lastGameId.length==0 || !user) return;
     const docRef = doc(db, "Game", lastGameId);
     const lastGame = await getDoc(docRef);
     const lastGameData = lastGame.data();
     if(!lastGameData) {
      setLastGameId('');
      return;
     };
     if (lastGameData) {
       setAssistantId(lastGameData.assistantId);
       setCrtUserId(lastGameData.userId);
       setCurrentGameId(lastGame.id);
       setDifficultyLevelCtx(lastGameData.difficultyLevel);
       setChessyPersonalityCtx(lastGameData.chessyPersonality);
       setHelpLevelCtx(lastGameData.chessyPersonality);
       setCrtUserId(user.uid);
       router.push('/chessboard')
     }
     
  }*/
  // Handler for updating temporary usernames
  const onUsernamesChange = ({ chessComUsername, lichessUsername }: { chessComUsername: string, lichessUsername: string }) => {
    handleChessNameError('');
    setChessComUsernameText(chessComUsername);
    setLichessUsernameText(lichessUsername);
  };
  {/*const onCodeChange = (code: string) =>{
    handleSubCodeError('');
    setSubCode(code);
  }*/}

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
    <AnimatePresence>
      {responseError && responseError.status == 402 &&
       <PricingTable userId={session.user.uid} text={responseError.additional} trial={!userProfile.hasOwnProperty('subscription')} subscription={{}}/>
       }
      {step === 6 ? (
        <LoadingClient loadingText={"Saving data"}></LoadingClient>
      ) : (
        <div className="flex flex-col md:flex-row w-full md:overflow-hidden">
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.25, ease: [0.23, 1, 0.32, 1] }}
            className="absolute w-full md:w-1/2 top-0 h-[60px] flex flex-row justify-between"
          ></motion.p>
          <div
            className={`w-full ${
              isMediumScr ? "h-screen" : ""
            } min-h-[60vh] md:w-1/2 md:h-screen flex flex-col px-4 pt-2 pb-8 md:px-0 md:py-2 bg-[#FCFCFC] justify-center`}
          >
            <div className="h-full w-full items-center justify-center flex flex-col">
              {!chessComUsername && step == 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  key="step-4"
                  transition={{
                    duration: 0.95,
                    ease: [0.165, 0.84, 0.44, 1],
                  }}
                  className="max-w-xl mx-auto px-4"
                >
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-[#1E2B3A]">
                    Welcome to ChessviaAI! Please enter your username so we can create your personal AI Chess Coach.
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                    Your account will be AI-analyzed to provide the most personalized experience This is optional
                    but recommended for better coaching from your new coach Chessy.
                  </p>
                  <div>
                    <UsernameInput
                      name_error={chess_subcode_error.chessNameErr}
                      onUsernamesChange={onUsernamesChange}
                    />
                  </div>
                  {/*
                  //<div className="mt-2">
                  //  <SubscriptionCodeInput
                  //    code_error={chess_subcode_error.subCodeError}
                  //    onCodeChange={onCodeChange}
                  // ></SubscriptionCodeInput>
                  // </div>
                  */}
                  <div className="flex gap-[15px] justify-end mt-8">
                    <div>
                      <button
                        onClick={() => {
                          createChessNameAndAssistant();
                        }}
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 flex items-center justify-center bg-[#124429] text-white hover:bg-[#f5f7f9] hover:text-[#124429] border border-[#124429] no-underline active:scale-95 w-[120px]"
                        style={{
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <span> Continue </span>
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.75 6.75L19.25 12L13.75 17.25"
                            stroke="#FFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 12H4.75"
                            stroke="#FFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : step === 1 ? (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  key="step-1"
                  transition={{
                    duration: 0.95,
                    ease: [0.165, 0.84, 0.44, 1],
                  }}
                  className="max-w-xl mx-auto px-4"
                >
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1E2B3A]">
                      1. Select a personality for Chessy
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                    Choose whoever makes you feel comfortable. You can always
                    switch to another one!
                  </p>
                  <div>
                    <RadioGroup
                      value={chessyPersonality}
                      onChange={setChessyPersonality}
                    >
                      <RadioGroup.Label className="sr-only">
                        Server size
                      </RadioGroup.Label>
                      <div className="space-y-4">
                        {style.map((style: any, index: number) => (
                          <RadioGroup.Option
                            key={style.name}
                            value={style}
                            className={({ checked, active }) =>
                              classNames(
                                checked
                                  ? "border-transparent"
                                  : "border-gray-300",
                                active
                                  ? "border-[#124429] ring-2 ring-[#DFF6EA]"
                                  : "",
                                "relative cursor-pointer rounded-lg border bg-white px-6 py-2 shadow-sm focus:outline-none flex justify-between"
                              )
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <span className="flex items-center">
                                  <span className="flex flex-col text-sm">
                                    <RadioGroup.Label
                                      as="span"
                                      className="font-medium text-gray-900"
                                    >
                                      {style.name}
                                    </RadioGroup.Label>
                                    <RadioGroup.Description
                                      as="span"
                                      className="text-gray-500"
                                    >
                                      <span className="block">
                                        {style.description}
                                      </span>
                                    </RadioGroup.Description>
                                  </span>
                                </span>
                                <span className="text-gray-500">
                                  {index === 0 && (
                                    <img
                                      src="/chessy/Chessvia-Favicon-Gold.png"
                                      alt="Gold Favicon"
                                      className="w-[48px] h-auto"
                                    />
                                  )}
                                  {index === 1 && (
                                    <img
                                      src="/chessy/Chessvia-Favicon-Green.png"
                                      alt="Green Favicon"
                                      className="w-[48px] h-auto"
                                    />
                                  )}
                                  {index === 2 && (
                                    <img
                                      src="/chessy/Chessvia-Favicon-Silver.png"
                                      alt="Silver Favicon"
                                      className="w-[48px] h-auto"
                                    />
                                  )}
                                </span>
                                <span
                                  className={classNames(
                                    active ? "border" : "border-[1.5px]",
                                    checked
                                      ? "border-[#124429]"
                                      : "border-transparent",
                                    "pointer-events-none absolute -inset-px rounded-lg"
                                  )}
                                  aria-hidden="true"
                                />
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex gap-[15px] justify-end mt-8">
                    <div>
                      <Link
                        href="/"
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold flex items-center justify-center bg-[#f5f7f9] text-[#124429] no-underline active:scale-95 border-[1px] border-[#124429] transition-all duration-100 hover:bg-[#124429] hover:text-white w-[120px] min-w-[120px]"
                        style={{
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          transition:
                            "background-color 300ms ease-in-out, color 300ms ease-in-out",
                        }}
                      >
                        Back to home
                      </Link>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setStep(2);
                        }}
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 flex items-center justify-center bg-[#124429] text-white border border-[#124429] hover:bg-white hover:text-[#124429] no-underline flex gap-x-2 active:scale-95 w-[120px] min-w-[120px]"
                        style={{
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <span>Continue</span>
                        <svg
                          className="w-5 h-5 stroke-current transition-colors duration-300"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.75 6.75L19.25 12L13.75 17.25"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 12H4.75"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : step === 2 ? (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  key="step-2"
                  transition={{
                    duration: 0.95,
                    ease: [0.165, 0.84, 0.44, 1],
                  }}
                  className="max-w-xl mx-auto px-4"
                >
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1E2B3A]">
                                          2. Select a difficulty for Chessy
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                    This difficulty will be relative to your online Chess
                    rating. Choose a difficulty to continue.
                  </p>
                  <div>
                    <RadioGroup
                      value={difficultyLevel}
                      onChange={setDifficultyLevel}
                    >
                      <RadioGroup.Label className="sr-only">
                        Server size
                      </RadioGroup.Label>
                      <div className="space-y-4">
                        {difficult.map((difficult: any) => (
                          <RadioGroup.Option
                            key={difficult.name}
                            value={difficult}
                            className={({ checked, active }) =>
                              classNames(
                                checked
                                  ? "border-transparent"
                                  : "border-gray-300",
                                active
                                  ? "border-[#124429] ring-2 ring-[#DFF6EA]"
                                  : "",
                                "relative cursor-pointer rounded-lg border bg-white px-6 py-2 shadow-sm focus:outline-none flex justify-between"
                              )
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <span className="flex items-center">
                                  <span className="flex flex-col text-sm">
                                    <RadioGroup.Label
                                      as="span"
                                      className="font-medium text-gray-900"
                                    >
                                      {difficult.name}
                                    </RadioGroup.Label>
                                    <RadioGroup.Description
                                      as="span"
                                      className="text-gray-500"
                                    >
                                      <span className="block">
                                        {difficult.description}
                                      </span>
                                    </RadioGroup.Description>
                                  </span>
                                </span>
                                <RadioGroup.Description
                                  as="span"
                                  className="flex text-sm ml-4 mt-0 flex-col text-right items-end justify-center"
                                >
                                  <span className="text-gray-500">
                                    {difficult.difficulty === "Easy" ? (
                                      <svg
                                        className="h-full w-[22px]"
                                        viewBox="0 0 28 25"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          x="0"
                                          y="17"
                                          width="4"
                                          height="8"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="6"
                                          y="13"
                                          width="4"
                                          height="12"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="12"
                                          y="9"
                                          width="4"
                                          height="16"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                        <rect
                                          x="18"
                                          y="5"
                                          width="4"
                                          height="20"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                        <rect
                                          x="24"
                                          y="1"
                                          width="4"
                                          height="24"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                      </svg>
                                    ) : difficult.difficulty === "Med" ? (
                                      <svg
                                        className="h-full w-[22px]"
                                        viewBox="0 0 28 25"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          x="0"
                                          y="17"
                                          width="4"
                                          height="8"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="6"
                                          y="13"
                                          width="4"
                                          height="12"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="12"
                                          y="9"
                                          width="4"
                                          height="16"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="18"
                                          y="5"
                                          width="4"
                                          height="20"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                        <rect
                                          x="24"
                                          y="1"
                                          width="4"
                                          height="24"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                      </svg>
                                    ) : difficult.difficulty ===
                                      "Effortless" ? (
                                      <svg
                                        className="h-full w-[22px]"
                                        viewBox="0 0 28 25"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          x="0"
                                          y="17"
                                          width="4"
                                          height="8"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="6"
                                          y="13"
                                          width="4"
                                          height="12"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                        <rect
                                          x="12"
                                          y="9"
                                          width="4"
                                          height="16"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                        <rect
                                          x="18"
                                          y="5"
                                          width="4"
                                          height="20"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                        <rect
                                          x="24"
                                          y="1"
                                          width="4"
                                          height="24"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                      </svg>
                                    ) : difficult.difficulty === "Extreme" ? (
                                      <svg
                                        className="h-full w-[22px]"
                                        viewBox="0 0 28 25"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          x="0"
                                          y="17"
                                          width="4"
                                          height="8"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="6"
                                          y="13"
                                          width="4"
                                          height="12"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="12"
                                          y="9"
                                          width="4"
                                          height="16"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="18"
                                          y="5"
                                          width="4"
                                          height="20"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="24"
                                          y="1"
                                          width="4"
                                          height="24"
                                          rx="1"
                                          fill="#124429"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="h-full w-[22px]"
                                        viewBox="0 0 28 25"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          x="0"
                                          y="17"
                                          width="4"
                                          height="8"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="6"
                                          y="13"
                                          width="4"
                                          height="12"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="12"
                                          y="9"
                                          width="4"
                                          height="16"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="18"
                                          y="5"
                                          width="4"
                                          height="20"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="24"
                                          y="1"
                                          width="4"
                                          height="24"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                      </svg>
                                    )}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {difficult.difficulty}
                                  </span>
                                </RadioGroup.Description>
                                <span
                                  className={classNames(
                                    active ? "border" : "border-[1.5px]",
                                    checked
                                      ? "border-[#124429]"
                                      : "border-transparent",
                                    "pointer-events-none absolute -inset-px rounded-lg"
                                  )}
                                  aria-hidden="true"
                                />
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex gap-[15px] justify-end mt-8">
                    <div>
                      <button
                        onClick={() => setStep(1)}
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] hover:bg-[#124429] hover:text-white border border-[#124429] no-underline active:scale-95 w-[120px] min-w-[120px]"
                        style={{
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        Previous step
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => setStep(3)}
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 flex items-center justify-center bg-[#124429] text-white hover:bg-[#f5f7f9] hover:text-[#1E2B3A] border border-[#124429] no-underline active:scale-95 w-[120px] min-w-[120px]"
                        style={{
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <span>Continue</span>
                        <svg
                          className="w-5 h-5 stroke-current transition-colors duration-300"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.75 6.75L19.25 12L13.75 17.25"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 12H4.75"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : step === 3 ? (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  key="step-3"
                  transition={{
                    duration: 0.95,
                    ease: [0.165, 0.84, 0.44, 1],
                  }}
                  className="max-w-lg mx-auto px-4"
                >
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1E2B3A]">
                    3. Select your level of help
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                    This will influence how helpful Chessy&apos;s replies are. Don&apos;t worry, you can always nicely ask him to be more helpful.
                  </p>
                  <div>
                    <RadioGroup value={helpLevel} onChange={setHelpLevel}>
                      <RadioGroup.Label className="sr-only">
                        Server size
                      </RadioGroup.Label>
                      <div className="space-y-4">
                        {helpLvl.map((hLvl: any) => (
                          <RadioGroup.Option
                            key={hLvl.name}
                            value={hLvl}
                            className={({ checked, active }) =>
                              classNames(
                                checked
                                  ? "border-transparent"
                                  : "border-gray-300",
                                active
                                  ? "border-[#124429] ring-2 ring-[#DFF6EA]"
                                  : "",
                                "relative cursor-pointer rounded-lg border bg-white px-6 py-2 shadow-sm focus:outline-none flex justify-between"
                              )
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <span className="flex items-center">
                                  <span className="flex flex-col text-sm">
                                    <RadioGroup.Label
                                      as="span"
                                      className="font-medium text-gray-900"
                                    >
                                      {hLvl.name}
                                    </RadioGroup.Label>
                                    <RadioGroup.Description
                                      as="span"
                                      className="text-gray-500"
                                    >
                                      <span className="block">
                                        {hLvl.description}
                                      </span>
                                    </RadioGroup.Description>
                                  </span>
                                </span>
                                <RadioGroup.Description
                                  as="span"
                                  className="flex text-sm ml-4 mt-0 flex-col text-right items-center justify-center"
                                >
                                  <span className="text-gray-500">
                                    {hLvl.difficulty === "Easy" ? (
                                      <svg
                                        className="h-full w-[16px]"
                                        viewBox="0 0 22 25"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          y="13.1309"
                                          width="6"
                                          height="11"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="8"
                                          y="8.13086"
                                          width="6"
                                          height="16"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                        <rect
                                          x="16"
                                          y="0.130859"
                                          width="6"
                                          height="24"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                      </svg>
                                    ) : hLvl.difficulty === "Med" ? (
                                      <svg
                                        className="h-full w-[16px]"
                                        viewBox="0 0 22 25"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          y="13.1309"
                                          width="6"
                                          height="11"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="8"
                                          y="8.13086"
                                          width="6"
                                          height="16"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="16"
                                          y="0.130859"
                                          width="6"
                                          height="24"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="h-full w-[16px]"
                                        viewBox="0 0 22 25"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          y="13.1309"
                                          width="6"
                                          height="11"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="8"
                                          y="8.13086"
                                          width="6"
                                          height="16"
                                          rx="1"
                                          fill="#124429"
                                        />
                                        <rect
                                          x="16"
                                          y="0.130859"
                                          width="6"
                                          height="24"
                                          rx="1"
                                          fill="#124429"
                                        />
                                      </svg>
                                    )}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {hLvl.difficulty}
                                  </span>
                                </RadioGroup.Description>
                                <span
                                  className={classNames(
                                    active ? "border" : "border-[1.5px]",
                                    checked
                                      ? "border-[#124429]"
                                      : "border-transparent",
                                    "pointer-events-none absolute -inset-px rounded-lg"
                                  )}
                                  aria-hidden="true"
                                />
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex gap-[15px] justify-end mt-8">
                    <div>
                      <button
                        onClick={() => setStep(2)}
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] hover:bg-[#124429] hover:text-white border border-[#1E2B3A] no-underline active:scale-95 w-[120px]"
                        style={{
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        Previous step
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => setStep(4)}
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 flex items-center justify-center bg-[#124429] text-white hover:bg-[#f5f7f9] hover:text-[#1E2B3A] border border-[#124429] no-underline active:scale-95 w-[120px]"
                        style={{
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <span>Continue</span>
                        <svg
                          className="w-5 h-5 stroke-current"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.75 6.75L19.25 12L13.75 17.25"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 12H4.75"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : step === 4 ? (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  key="step-4"
                  transition={{
                    duration: 0.95,
                    ease: [0.165, 0.84, 0.44, 1],
                  }}
                  className="max-w-lg mx-auto px-4"
                >
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1E2B3A]">
                    4. Select white or black
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                    Do you want to be on the offensive or the defense? You can always switch in your next game.
                  </p>
                  <div>
                    <RadioGroup value={userColor} onChange={setUserColor}>
                      <RadioGroup.Label className="sr-only">
                        Server size
                      </RadioGroup.Label>
                      <div className="space-y-4">
                        {colors.map((clr: any) => (
                          <RadioGroup.Option
                            key={clr.name}
                            value={clr}
                            className={({ checked, active }) =>
                              classNames(
                                checked
                                  ? "border-transparent"
                                  : "border-gray-300",
                                active
                                  ? "border-[#124429] ring-2 ring-[#DFF6EA]"
                                  : "",
                                "relative cursor-pointer rounded-lg border bg-white px-6 py-[6px] shadow-sm focus:outline-none flex justify-between"
                              )
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <span className="flex items-center">
                                  <span className="flex flex-col text-sm">
                                    <RadioGroup.Label
                                      as="span"
                                      className="font-medium text-gray-900"
                                    >
                                      {clr.name}
                                    </RadioGroup.Label>
                                    <RadioGroup.Description
                                      as="span"
                                      className="text-gray-500"
                                    >
                                      <span className="block"></span>
                                    </RadioGroup.Description>
                                  </span>
                                </span>
                                <RadioGroup.Description
                                  as="span"
                                  className="flex text-sm ml-4 mt-0 flex-col text-right items-center justify-center"
                                >
                                  <span className="text-gray-500">
                                    {/* White Horse */}
                                    {clr.name === "Black" && (
                                      <div className="bg-black border-[1px] border-black p-2 rounded">
                                        <img
                                          src="/chessy/Favicon_white.png"
                                          alt="White Horse"
                                          className="h-[24px] w-[24px]"
                                        />
                                      </div>
                                    )}
                                    {/* Black Horse */}
                                    {clr.name === "White" && (
                                      <div className="border-[1px] border-black p-2 rounded">
                                        <img
                                          src="/chessy/Chessvia-Favicon-Black.png"
                                          alt="Black Horse"
                                          className="h-[24px] w-[24px]"
                                        />
                                      </div>
                                    )}
                                  </span>
                                </RadioGroup.Description>
                                <span
                                  className={classNames(
                                    active ? "border" : "border-[1.5px]",
                                    checked
                                      ? "border-[#124429]"
                                      : "border-transparent",
                                    "pointer-events-none absolute -inset-px rounded-lg"
                                  )}
                                  aria-hidden="true"
                                />
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex gap-[15px] justify-end mt-8">
                    <div>
                      <button
                        onClick={() => setStep(3)}
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] hover:bg-[#124429] hover:text-white border border-[#1E2B3A] no-underline active:scale-95 w-[120px]"
                        style={{
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        Previous step
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => setStep(5)}
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 flex items-center justify-center bg-[#124429] text-white hover:bg-[#f5f7f9] hover:text-[#1E2B3A] border border-[#124429] no-underline active:scale-95 w-[120px]"
                        style={{
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <span>Continue</span>
                        <svg
                          className="w-5 h-5 stroke-current"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.75 6.75L19.25 12L13.75 17.25"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 12H4.75"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : step === 5 ? (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  key="step-4"
                  transition={{
                    duration: 0.95,
                    ease: [0.165, 0.84, 0.44, 1],
                  }}
                  className="max-w-lg mx-auto px-4"
                >
                  {customPositionDisplayActive && (
                    <div className="fixed top-0 right-0 left-0 bottom-0 z-50 bg-[#89a6a620] flex justify-center items-center">
                      <FormBoard
                        movesArray={movesArray}
                        setMovesArray={setMovesArray}
                        setFenStringsArray={setFenStringsArray}
                        fenStringsArray={fenStringsArray}
                        handleCloseCustomPositionModal={
                          handleCloseCustomPositionModal
                        }
                      ></FormBoard>
                    </div>
                  )}
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1E2B3A]">
                    5. Select an opening position
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                    Here you can choose one of the offered opening positions.
                    Choose a position or Regular Start to jump into the game!
                  </p>
                  <div className="relative">
                    <div
                      onClick={() =>
                        setOpeningDropDownActive((prevDD) => !prevDD)
                      }
                      className="w-full relative cursor-pointer mt-5 rounded-lg border bg-white px-6 py-1 shadow-sm focus:outline-none flex justify-between items-center"
                    >
                      <p className="font-medium text-gray-900">
                        {selectedOpening == 0
                          ? "Regular start"
                          : selectedOpening == -1
                          ? "Custom positions"
                          : openings[selectedOpening - 1].name}
                      </p>
                      <div className="flex items-center space-x-1">
                        {selectedOpening == -1 && (
                          <div className="flex text-[14px] items-center">
                            {movesArray.length > 4 &&
                            movesArray.length % 2 == 0 ? (
                              <p>
                                1. {movesArray[0]}, {movesArray[1]} ...{" "}
                                {movesArray.length / 2}.{" "}
                                {movesArray[movesArray.length - 2]},{" "}
                                {movesArray[movesArray.length - 1]}
                              </p>
                            ) : movesArray.length > 4 &&
                              movesArray.length % 2 == 1 ? (
                              <p>
                                1. {movesArray[0]},{movesArray[1]} ...{" "}
                                {Math.ceil(movesArray.length / 2)}.{" "}
                                {movesArray[movesArray.length - 1]}
                              </p>
                            ) : (
                              <p></p>
                            )}
                          </div>
                        )}
                        <BiSolidChess className="h-10 w-10" />
                        <IoIosArrowDown className="h-5 w-5" />
                      </div>
                    </div>
                    {openingDropDownActive && (
                      <div className="absolute w-full bg-gray-200 space-y-2 max-h-[240px] overflow-y-auto">
                        <div
                          onClick={() => handleSelectOpening(0)}
                          className="px-6 cursor-pointer hover:bg-blue-100 py-4 flex justify-between items-center"
                        >
                          <p>Regular start</p>
                        </div>
                        <div
                          onClick={() => handleCustomPosition()}
                          className="px-6 cursor-pointer hover:bg-blue-100 py-4 flex justify-between items-center"
                        >
                          <p>Custom positions</p>
                        </div>
                        {openings.map((opening: any, idx: number) => (
                          <div
                            onClick={() => handleSelectOpening(idx + 1)}
                            className="px-6 cursor-pointer hover:bg-blue-100 py-4 flex justify-between items-center"
                            key={idx}
                          >
                            <p>{opening.name}</p>
                            <div className="flex space-x-1">
                              {opening.movesArray.map(
                                (mve: string, idx: number) => (
                                  <p key={idx}>{idx%2==0 ? idx+1+'. ' : ''}{mve}</p>
                                )
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-[15px] justify-end mt-8">
                    <div>
                      <button
                        onClick={() => setStep(4)}
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] hover:bg-[#124429] hover:text-white border border-[#1E2B3A] no-underline active:scale-95 w-[120px]"
                        style={{
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        Previous step
                      </button>
                    </div>
                    <div>
                      <button
                        disabled={!chessComUsername}
                        onClick={() => {
                          setStep(6);
                          handleSaveData();
                        }}
                        className={`group rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 flex items-center justify-center ${
                          chessComUsername
                            ? "bg-[#124429] hover:bg-[#f5f7f9] hover:text-[#1E2B3A]"
                            : "bg-gray-400 cursor-not-allowed"
                        } text-white border border-[#124429] no-underline active:scale-95 w-[120px]`}
                        style={{
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {chessComUsername ? (
                          <span>Start game</span>
                        ) : (
                          <span>Getting Chessy ready...</span>
                        )}
                        <svg
                          className="w-5 h-5 stroke-current"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.75 6.75L19.25 12L13.75 17.25"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 12H4.75"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <p>Step 6</p>
              )}
            </div>
          </div>
          <div
            className={`w-full ${
              isMediumScr ? "hidden" : ""
            } h-[40vh] md:w-1/2 md:h-screen bg-[#124429] relative overflow-hidden`}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-[70%] h-auto transform translate-y-[25%]">
                  <Image
                    src={mockup3}
                    alt="Chessvia AI Chess Coach Chessboard"
                    layout="responsive"
                    width={500}
                    height={500}
                    className="z-[1] opacity-[86%]"
                  />
                </div>
              </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
} 

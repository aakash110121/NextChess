"use client";
import {useState, useEffect, useRef} from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { tableColors } from './settingsData';
import { FaRegTrashAlt } from "react-icons/fa";
import { offeredVoices } from './settingsData';
import { offeredSounds } from './settingsData';
import { useMediaQuery } from 'react-responsive';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/utils/auth/FirebaseCredentials";
import Swal from 'sweetalert2';
import { BsFillInfoSquareFill } from "react-icons/bs";
import { BronzeSub, SilverSub, GoldSub, PlatinumSub } from "@/lib/subscriptionPermissions";
import MobileSidebar from '@/components/MobileSidebar';
import { RxHamburgerMenu } from 'react-icons/rx';
import Image from 'next/image';
import { useRouter } from "next/navigation";

const mp3Recordings = {
  alloy: { name: 'Recording 1', url: '/voices/alloy.mp3' },
  echo: { name: 'Recording 2', url: '/voices/echo.mp3' },
  fable: { name: 'Recording 3', url: '/voices/fable.mp3' },
  onyx: { name: 'Recording 4', url: '/voices/onyx.mp3' },
  nova: { name: 'Recording 5', url: '/voices/nova.mp3' },
  shimmer: { name: 'Recording 6', url: '/voices/shimmer.mp3' },
}

interface BoardCol {
  id: number,
  name: string,
  lightSquares: string,
  darkSquares: string,
}

interface TierSpecific {
  play_time: number | string;
  chat_with_chessy: boolean;
  change_board_color: boolean;
  change_assistant_voice: boolean;
  change_predefined_questions: boolean;
  change_notation: boolean;
  change_sound_settings: boolean;
  view_captured_pieces: boolean;
}

interface PageClientProps {
  settings: any;
  user: any;
  lout: any;
  subTier: TierSpecific;
}


export default function PageClient({settings, user, subTier, lout}:PageClientProps){
  
    const [selectedNotation, setSelectedNotation] = useState(settings.notation);
    const [selectedCapturedVisibility, setSelectedCapturedVisibility] = useState(settings.capturedPiecesVisibility || 'visible');
    const [selectedMoveSound, setSelectedMoveSound] = useState(settings.moveSound || offeredSounds[0].sound);
    const [selectedCaptureSound, setSelectedCaptureSound] = useState(settings.captureSound || offeredSounds[1].sound);
    const [selectedCheckSound, setSelectedCheckSound] = useState(settings.checkSound || offeredSounds[2].sound);
    const [selectedVoice, setSelectedVoice] = useState(settings.assistantVoice);
    const [selectedBoard, setSelectedBoard] = useState<BoardCol>(settings.boardColor);
    const [predefinedQuestions, setPredefinedQuestions] = useState(settings.predefinedQuestions);
    const [chessyVoiceSound, setChessyVoiceSound] = useState(settings.chessyVoiceSound || 'on');
    const [upgradePopup, setUpgradePopup] = useState<boolean>(false);
    const [upgradePopupFor, setUpgradePopupFor] = useState<string>('');
    const router = useRouter();

    useEffect(()=>{
       // console.log("Subscription: ", subTier);
    },[])


    const handleSelectVoices = (event:any) => {
        const newVoice = offeredVoices.find((voice)=>voice.id==event.target.value);
        if(!newVoice) return;
        setSelectedVoice(newVoice);
        // console.log("SELECTED VOICE IS: ",selectedVoice);
        playVoice(newVoice.id);
        handleStateChange({assistantVoice:newVoice});
    };
    const handleSelectBoardColor = (event:any) => {
        setSelectedBoard(tableColors[event.target.value-1]);
        handleStateChange({boardColor:tableColors[event.target.value-1]});
    };
    const handleSelectNotation = (event:any) =>{
      setSelectedNotation(event.target.value);
      handleStateChange({notation:event.target.value});
    }
    const handleShowCapturedPieces = (event:any) =>{
      setSelectedCapturedVisibility(event.target.value);
      handleStateChange({capturedPiecesVisibility:event.target.value});
    }
    const handleDeletePredefinedQuestion = (number:number) =>{
      const newPredfQuestions = [...predefinedQuestions.slice(0,number), ...predefinedQuestions.slice(number+1)];
      setPredefinedQuestions(newPredfQuestions);
      handleStateChange({predefinedQuestions:newPredfQuestions});
    }
    const handleSelectMoveSound = (event:any) =>{
      setSelectedMoveSound(event.target.value);
      handleStateChange({moveSound: event.target.value});
      playSound(event.target.value);
    }
    const handleSelectCaptureSound = (event:any) =>{
      setSelectedCaptureSound(event.target.value);
      handleStateChange({captureSound: event.target.value});
      playSound(event.target.value);
    }
    const handleSelectCheckSound = (event:any) =>{
      setSelectedCheckSound(event.target.value);
      handleStateChange({checkSound: event.target.value});
      playSound(event.target.value);
    }
    const handleSelectChessyVoiceSound = (event:any) =>{
      setChessyVoiceSound(event.target.value);
      handleStateChange({chessyVoiceSound: event.target.value});
    }
   

    const [newQuestion,setNewQuestion] = useState('');
    const handleAddPredefinedQuestion = (question:string)=>{
      if(question.length<6 || question.length>120){
        
        return Swal.fire({
          icon: "error",
          title: "Incorrect question length",
          text: "Make sure the question is between 6 and 150 characters",
          timer:2000
        });
      }
      setPredefinedQuestions((prevQuestions:[])=>[question, ...prevQuestions]);
      setNewQuestion('');
      Swal.fire({
        title: "Question added!",
        text: "Save changes by clicking on the Save button",
        icon: "success",
        timer: 1500
      });
    }
    
    const [predefinedQuestionsDD, setPredefinedQuestionsDD] = useState(false);
    const handlePredefinedQuestionsDD = ()=>{
       setPredefinedQuestionsDD(prevDD=>!prevDD);
    }


    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playVoice = (voice:string) => {
       if(audioRef.current){
         audioRef.current.pause();
       } 
       if(soundRef.current){
        soundRef.current.pause();
       }
       if(["alloy", "echo", "fable", "onyx", "nova", "shimmer"].includes(voice) == false) return
       //@ts-ignore
       audioRef.current = new Audio(mp3Recordings[`${voice}`].url);
       audioRef.current.play();
    }

    const soundRef = useRef<HTMLAudioElement | null>(null);
    const playSound = (sound:string) => {
      if(soundRef.current){
        soundRef.current.pause();
      }
      if(audioRef.current){
        audioRef.current.pause();
      }

      soundRef.current = new Audio(`/chessSounds/${sound}`);
      soundRef.current.play();
    }

    const isSmallScr = useMediaQuery({
      query: '(max-width: 500px)'
    })

    const initialState = {
      notation: settings.notation,
      capturedPiecesVisibility: settings.capturedPiecesVisibility,
      assistantVoice: settings.assistantVoice,
      boardColor: settings.boardColor,
      predefinedQuestions: settings.predefinedQuestions,
      moveSound: settings.moveSound ? settings.moveSound : offeredSounds[0].sound,
      captureSound: settings.captureSound ? settings.captureSound : offeredSounds[1].sound,
      checkSound: settings.checkSound ? settings.checkSound : offeredSounds[2].sound,
      chessyVoiceSound: settings.chessyVoiceSound ? settings.chessyVoiceSound : 'on',
    };
  
    const [isDirty, setIsDirty] = useState(false);
  
    const handleStateChange = (someValue:any) => {
      const currentState = {
        notation: selectedNotation,
        assistantVoice: selectedVoice,
        boardColor: selectedBoard,
        predefinedQuestions: predefinedQuestions,
        moveSound: selectedMoveSound,
        captureSound: selectedCaptureSound,
        checkSound: selectedCheckSound,
        capturedPiecesVisibility: selectedCapturedVisibility,
        chessyVoiceSound: chessyVoiceSound,
      };

      for(const key in currentState){
        if(key==Object.keys(someValue)[0]){
          //@ts-ignore
          currentState[key] = someValue[key];
          break;
        }
      }
      // console.log("Handle State Change: \n", currentState, "\n\n\n", initialState)
      // Check if any of the current state values differ from the initial state
      const dirtyCheck = JSON.stringify(currentState) !== JSON.stringify(initialState);
  
      setIsDirty(dirtyCheck);
    };

    const handleSaveSettings = async () =>{
      if(!isDirty) return;
      // console.log("user: ", user);
      const settingsRef = doc(db, "BoardSettings", user);
  
      try {
        await setDoc(settingsRef,{
          notation:selectedNotation,
          assistantVoice:selectedVoice,
          boardColor: selectedBoard,
          predefinedQuestions:predefinedQuestions,
          moveSound:selectedMoveSound,
          captureSound:selectedCaptureSound,
          checkSound:selectedCheckSound,
          capturedPiecesVisibility: selectedCapturedVisibility,
          chessyVoiceSound: chessyVoiceSound,
        },{
          merge:true,
        })
        Swal.fire({
          title: "Changes saved!",
          icon: "success",
          timer: 1500
        });
      } catch (error) {
        // console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<a href="#">Why do I have this issue?</a>',
          timer:1500
        });
      }
    }

    const sideAlert = (featureName:keyof typeof BronzeSub) => {
      let supportedTier = 'Platinum';
      if(featureName in BronzeSub){
         if(BronzeSub[featureName]){
            supportedTier='Bronze';
         }
         else if (SilverSub[featureName]){
            supportedTier='Silver';
         }
         else if (GoldSub[featureName]){
            supportedTier='Gold';
         }
         else supportedTier='Platinum';
      }
      return (
        <div className="relative text-white group">
          <BsFillInfoSquareFill className="w-8 h-8 relative text-gray-800" />
          <div
            className="p-2 hidden z-10 group-hover:block w-[200px] rounded-md text-[14px] absolute right-[120%] top-0 bg-gray-800 border-[1px] border-black/30 shadow-md
                    before:absolute before:content-[''] before:w-3 before:h-3 before:bg-gray-800 before:rotate-45 before: before:-right-1 before:shaddow-md before:top-3"
          >
            <p>
              Your subscription tier does not support this feature. This feature
              is supported from {supportedTier} tier.
            </p>
          </div>
        </div>
      );
    };
    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
   

    const toggleComponentVisibility = () => {
      setIsMobileMenuVisible(!isMobileMenuVisible);
    };

    const toggleUpgradePopup = (featureName:keyof typeof BronzeSub) => {
      let supportedTier = 'Platinum';
      if(featureName in BronzeSub){
         if(BronzeSub[featureName]){
            supportedTier='Bronze';
         }
         else if (SilverSub[featureName]){
            supportedTier='Silver';
         }
         else if (GoldSub[featureName]){
            supportedTier='Gold';
         }
         else supportedTier='Platinum';
      }

      setUpgradePopupFor(supportedTier);
      setUpgradePopup(true);
    }

    return (
      <div className="w-full relative md:overflow-hidden">
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
        <div className="w-full h-full min-h-screen px-4 md:px-6 lg:px-10 py-5 overflow-auto">
          <p className="text-[22px] md:text-[25px] lg:text-[28px] text-black font-semibold mb-5">
            Board settings
          </p>
          <div className="flex space-x-10 rounded-[5px] border border-stroke bg-white p-7 shadow-default">
            <div className="space-y-2 w-full max-w-[650px] mt-5 flex-shrink-0 relative">
              {upgradePopup && (
                <div className="absolute top-0 w-full h-full z-10 flex justify-center items-center bg-[#000000b3] rounded-[5px]">
                  <div className="w-[95%]   text-black flex flex-col items-center justify-between rounded-[5px] border border-stroke bg-white p-7 shadow-default">
                    <Image
                      src="/chessvia.png"
                      alt="chessviaLogo"
                      width={200}
                      height={200}
                      className="w-[30%]"
                    ></Image>
                    <div className="flex flex-col py-4 px-2">
                      <span className="text-[18px] text-#000-800 text-center">
                      Your subscription tier does not support this feature. This feature is supported from {upgradePopupFor} tier.
                      </span>
                    </div>
                    <div className="w-full grid grid-rows-2 sm:grid-rows-1 sm:grid-flow-col gap-2 px-2">
                      <button
                        onClick={() => router.push('/pricing')}
                        className="w-full rounded-lg text-white transition duration-200 bg-[#124429] hover:bg-[#16281e] font-semibold text-[20px] py-4 mx-auto"
                      >
                        Upgrade
                      </button>
                      <button
                        onClick={() => {setUpgradePopup(false)}}
                        className="w-full rounded-lg text-white transition duration-200 bg-[#124429] hover:bg-[#16281e] font-semibold text-[20px] py-4 mx-auto"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div
                className={`border-[2px] rounded-[5px] bg-[#F3F5F8] p-3  font-medium text-black mx-auto flex ${
                  isSmallScr
                    ? "flex-col items-start"
                    : "items-center justify-between space-x-4"
                }`}
              >
                <label
                  htmlFor="BoardDropdown"
                  className="text-[16px] md:text-[16px] lg:text-[18px] tracking-wide"
                >
                  Board
                </label>
                <div className="flex items-center w-full max-w-[300px] gap-x-1">
                  <div className="relative w-full max-w-[300px]">
                    {!subTier.change_board_color && (
                      <span
                        className="absolute z-[1] w-full h-full max-w-[300px] p-2 rounded-md focus:outline-none cursor-pointer"
                        onClick={()=>{toggleUpgradePopup('change_board_color')}}
                      ></span>
                    )}
                    <select
                      disabled={!subTier.change_board_color}
                      id="BoardDropdown"
                      className="block w-full max-w-[300px] p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedBoard.id}
                      onChange={handleSelectBoardColor}
                    >
                      {/*<option value="" disabled>
                  -- Select an option --
                  </option>*/}
                      {tableColors.map((table: any, idx: number) => (
                        <option key={idx} value={table.id}>
                          {table.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!subTier.change_board_color &&
                    sideAlert("change_board_color")}
                </div>
              </div>
              <div
                className={`mx-auto flex font-medium border-[2px] rounded-[5px] bg-[#F3F5F8] p-3 ${
                  isSmallScr
                    ? "flex-col items-start"
                    : "items-center justify-between space-x-4"
                }`}
              >
                <label
                  htmlFor="AssistantVoice"
                  className="text-[16px] md:text-[16px] lg:text-[18px] tracking-wide"
                >
                  Assistant voice
                </label>
                <div className="w-full max-w-[300px] flex items-center gap-x-1">
                  <div className="relative w-full max-w-[300px]">
                    {!subTier.change_assistant_voice && (
                      <span
                        className="absolute z-[1] w-full h-full max-w-[300px] p-2 rounded-md focus:outline-none cursor-pointer"
                        onClick={()=>{toggleUpgradePopup('change_assistant_voice')}}
                      ></span>
                    )}
                    <select
                      disabled={!subTier.change_assistant_voice}
                      id="AssistantVoice"
                      className="block w-full max-w-[300px] p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedVoice.id}
                      onChange={handleSelectVoices}
                    >
                      {/*<option value="" disabled>
                  -- Select an option --
                  </option>*/}
                      {offeredVoices.map((voice: any, idx: number) => (
                        <option key={voice.id} value={voice.id}>
                          {voice.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!subTier.change_assistant_voice &&
                    sideAlert("change_assistant_voice")}
                </div>
              </div>
              <div
                className={`mx-auto font-medium flex border-[2px] rounded-[5px] bg-[#F3F5F8] p-3 ${
                  isSmallScr
                    ? "flex-col items-start"
                    : "items-center justify-between space-x-4"
                }`}
              >
                <label
                  htmlFor="PredefinedQuestions"
                  className="text-[16px] md:text-[16px] lg:text-[18px] tracking-wide"
                >
                  Predefined questions
                </label>
                <div className="flex w-full max-w-[300px] items-center gap-x-1">
                  <div className="flex w-full max-w-[300px] relative overflow-hidden">
                    {!subTier.change_predefined_questions && (
                      <span
                        className="absolute z-[1] w-full h-full max-w-[300px] p-2 rounded-md focus:outline-none cursor-pointer"
                        onClick={()=>{toggleUpgradePopup('change_predefined_questions')}}
                      ></span>
                    )}
                    <div className=" rounded-md relative flex justify-center items-center">
                     

                      {/*<option value="" disabled>
                -- Select an option --
                </option>*/}
                      {predefinedQuestionsDD && (
                        <ul className="absolute w-[300px] left-0 top-[43px] bg-[#cdcecb] space-y-2">
                          {predefinedQuestions.map(
                            (question: string, idx: number) => (
                              <li
                                key={idx}
                                className="w-full p-2 px-2 flex border-b-[1px] border-[#18181830]"
                              >
                                <div className="grow break-words">
                                  {question}
                                </div>
                                <div className="text-center px-1 flex items-center">
                                  <FaRegTrashAlt
                                    onClick={() =>
                                      handleDeletePredefinedQuestion(idx)
                                    }
                                    className="w-5 h-5 cursor-pointer"
                                  />
                                </div>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                    <div className="w-full relative">
                    <input
                      disabled={!subTier.change_predefined_questions}
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className={`w-full p-2 pl-7 border bg-white ${!subTier.change_predefined_questions? 'bg-white/50' : ''} border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                      placeholder="Enter text here"
                    />
                     <div className="py-[1px] h-full px-[3px] absolute top-0 left-[1px] flex items-center justify-center">
                        <IoIosArrowDown
                          onClick={() => {
                            if (subTier.change_predefined_questions) {
                              handlePredefinedQuestionsDD();
                            }
                          }}
                          className={`w-5 h-5 bg-white cursor-pointer ${!subTier.change_predefined_questions? 'bg-white/30 cursor-auto' : ''}`}
                        />
                      </div>
                    </div>
                    <div className="py-[1px]">
                      <div
                        onClick={() => {
                          if (subTier.change_predefined_questions)
                            handleAddPredefinedQuestion(newQuestion);
                        }}
                        className={`p-1 h-full cursor-pointer flex justify-center items-center bg-[#124429]
                         text-white ${
                           !subTier.change_predefined_questions
                             ? "bg-green-200 cursor-auto"
                             : ""
                         }`}
                      >
                        Add
                      </div>
                    </div>
                  </div>
                  {!subTier.change_predefined_questions &&
                    sideAlert("change_predefined_questions")}
                </div>
              </div>
              <div
                className={`mx-auto font-medium flex border-[2px] rounded-[5px] bg-[#F3F5F8] p-3 ${
                  isSmallScr
                    ? "flex-col items-start"
                    : "items-center justify-between space-x-4"
                }`}
              >
                <label
                  htmlFor="PiecesNotation"
                  className="text-[16px] md:text-[16px] lg:text-[18px] tracking-wide"
                >
                  Notation
                </label>
                <div className="w-full max-w-[300px] gap-x-1 flex items-center">
                  <div className="relative w-full max-w-[300px]">
                    {!subTier.change_notation && (
                      <span
                        className="absolute z-[1] w-full h-full max-w-[300px] p-2 rounded-md focus:outline-none cursor-pointer"
                        onClick={()=>{toggleUpgradePopup('change_notation')}}
                      ></span>
                    )}
                    <select
                      disabled={!subTier.change_notation}
                      id="PiecesNotation"
                      className="block w-full max-w-[300px] p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedNotation}
                      onChange={handleSelectNotation}
                    >
                      {/*<option value="" disabled>
                  -- Select an option --
                  </option>*/}
                      <option value="text">Text</option>
                      <option value="icon">Icon</option>
                    </select>
                  </div>
                  {!subTier.change_notation && sideAlert("change_notation")}
                </div>
              </div>
              <div
                className={`mx-auto font-medium flex border-[2px] rounded-[5px] bg-[#F3F5F8] p-3 ${
                  isSmallScr
                    ? "flex-col items-start"
                    : "items-center justify-between space-x-4"
                }`}
              >
                <label
                  htmlFor="PiecesNotation"
                  className="text-[16px] md:text-[16px] lg:text-[18px] tracking-wide truncate"
                >
                  View captured pieces
                </label>
                <div className="flex w-full max-w-[300px] gap-x-1 items-center">
                  <div className="relative w-full max-w-[300px]">
                    {!subTier.view_captured_pieces && (
                      <span
                        className="absolute z-[1] w-full h-full max-w-[300px] p-2 rounded-md focus:outline-none cursor-pointer"
                        onClick={()=>{toggleUpgradePopup('view_captured_pieces')}}
                      ></span>
                    )}
                    <select
                      disabled={!subTier.view_captured_pieces}
                      id="PiecesNotation"
                      className="block w-full max-w-[300px] p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedCapturedVisibility}
                      onChange={handleShowCapturedPieces}
                    >
                      {/*<option value="" disabled>
                  -- Select an option --
                  </option>*/}
                      <option value="visible">Visible</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </div>
                  {!subTier.view_captured_pieces &&
                    sideAlert("view_captured_pieces")}
                </div>
              </div>
              <p className="text-[22px] md:text-[25px] lg:text-[28px] text-black font-semibold mb-8">
                Sound settings
              </p>
              <div
                className={`mx-auto font-medium flex border-[2px] rounded-[5px] bg-[#F3F5F8] p-3 ${
                  isSmallScr
                    ? "flex-col items-start"
                    : "items-center justify-between space-x-4"
                }`}
              >
                <label
                  htmlFor="ChessySound"
                  className="text-[16px] md:text-[16px] lg:text-[18px] tracking-wide truncate"
                >
                  View captured pieces
                </label>
                <div className="flex w-full max-w-[300px] gap-x-1 items-center">
                  <select
                    id="ChessySound"
                    className="block w-full max-w-[300px] p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={chessyVoiceSound}
                    onChange={handleSelectChessyVoiceSound}
                  >
                    {/*<option value="" disabled>
                -- Select an option --
                </option>*/}
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </div>
              </div>
              <div
                className={`mx-auto font-medium flex border-[2px] rounded-[5px] bg-[#F3F5F8] p-3 ${
                  isSmallScr
                    ? "flex-col items-start"
                    : "items-center justify-between space-x-4"
                }`}
              >
                <label
                  htmlFor="moveSound"
                  className="text-[16px] md:text-[16px] lg:text-[18px] tracking-wide"
                >
                  Move sound
                </label>
                <div className="w-full max-w-[300px] flex items-center gap-x-1">
                  <div className="relative w-full max-w-[300px]">
                    {!subTier.change_sound_settings && (
                      <span
                        className="absolute z-[1] w-full h-full max-w-[300px] p-2 rounded-md focus:outline-none cursor-pointer"
                        onClick={()=>{toggleUpgradePopup('change_sound_settings')}}
                      ></span>
                    )}
                    <select
                      disabled={!subTier.change_sound_settings}
                      id="moveSound"
                      className="block w-full max-w-[300px] p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedMoveSound}
                      onChange={handleSelectMoveSound}
                    >
                      {/*<option value="" disabled>
                  -- Select an option --
                  </option>*/}
                      {offeredSounds.map((sound: any, idx: number) => (
                        <option key={idx} value={sound.sound}>
                          {sound.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!subTier.change_sound_settings &&
                    sideAlert("change_sound_settings")}
                </div>
              </div>
              <div
                className={`mx-auto font-medium flex border-[2px] rounded-[5px] bg-[#F3F5F8] p-3 ${
                  isSmallScr
                    ? "flex-col items-start"
                    : "items-center justify-between space-x-4"
                }`}
              >
                <label
                  htmlFor="checkSound"
                  className="text-[16px] md:text-[16px] lg:text-[18px] tracking-wide"
                >
                  Captured piece sound
                </label>
                <div className="w-full max-w-[300px] flex items-center gap-x-1">
                  <div className="relative w-full max-w-[300px]">
                    {!subTier.change_sound_settings && (
                      <span
                        className="absolute z-[1] w-full h-full max-w-[300px] p-2 rounded-md focus:outline-none cursor-pointer"
                        onClick={()=>{toggleUpgradePopup('change_sound_settings')}}
                      ></span>
                    )}
                    <select
                      disabled={!subTier.change_sound_settings}
                      id="checkSound"
                      className="block w-full max-w-[300px] p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedCaptureSound}
                      onChange={handleSelectCaptureSound}
                    >
                      {/*<option value="" disabled>
                  -- Select an option --
                  </option>*/}
                      {offeredSounds.map((sound: any, idx: number) => (
                        <option key={idx} value={sound.sound}>
                          {sound.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!subTier.change_sound_settings &&
                    sideAlert("change_sound_settings")}
                </div>
              </div>
              <div
                className={`mx-auto font-medium flex border-[2px] rounded-[5px] bg-[#F3F5F8] p-3 ${
                  isSmallScr
                    ? "flex-col items-start"
                    : "items-center justify-between space-x-4"
                }`}
              >
                <label
                  htmlFor="checkMateSound"
                  className="text-[16px] md:text-[16px] lg:text-[18px] tracking-wide"
                >
                  Check sound
                </label>
                <div className="w-full max-w-[300px] flex items-center gap-x-1">
                  <div className="relative w-full max-w-[300px]">
                    {!subTier.change_sound_settings && (
                      <span
                        className="absolute z-[1] w-full h-full max-w-[300px] p-2 rounded-md focus:outline-none cursor-pointer"
                        onClick={()=>{toggleUpgradePopup('change_sound_settings')}}
                      ></span>
                    )}
                    <select
                      disabled={!subTier.change_sound_settings}
                      id="checkMateSound"
                      className="block w-full max-w-[300px] p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedCheckSound}
                      onChange={handleSelectCheckSound}
                    >
                      {/*<option value="" disabled>
                  -- Select an option --
                  </option>*/}
                      {offeredSounds.map((sound: any, idx: number) => (
                        <option key={idx} value={sound.sound}>
                          {sound.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!subTier.change_sound_settings &&
                    sideAlert("change_sound_settings")}
                </div>
              </div>
            </div>
            <div className="flex-1 flex justify-center items-start pt-5">
              <section
                id="boardDemoElement"
                className="w-full max-w-[65%] aspect-square grid grid-cols-5 grid-rows-5 "
              >
                {Array.from({ length: 25 }, (_, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor:
                        idx % 2 === 0
                          ? selectedBoard.darkSquares
                          : selectedBoard.lightSquares,
                    }}
                    className={`w-full h-full`}
                  ></div>
                ))}
              </section>
            </div>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={!isDirty}
            className={`px-4 py-2 ${
              isDirty ? "bg-[#124429]" : "bg-[#124429]"
            } rounded-md w-full max-w-[260px] text-white mt-10`}
          >
            Save
          </button>
        </div>
      </div>
    );
}
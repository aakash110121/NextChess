'use client'
import { doc, setDoc } from "firebase/firestore";
import { Chessboard } from "react-chessboard";
import { db } from "@/utils/auth/FirebaseCredentials";
import {useRouter} from 'next/navigation';
import { useCallback, useRef, useState, useEffect } from "react";
import Image from 'next/image'
import PGNNotation from "./methods/PGNNotation";
import getMoreGames from "./hooks/loadGames";
import { RxHamburgerMenu } from "react-icons/rx";
import MobileSidebar from "@/components/MobileSidebar";

export default function HistoryClient({gamesArray, session, chessName, lout}:any){
  const [loadingActive, setLoadingActive] = useState(false);
  const [gamesList, setGamesList] = useState([...gamesArray]);
  const router = useRouter();
  
  useEffect(()=>{
    router.refresh();
  },[])
  
  const handleLoadGame= async (id:any)=>{
      if(!id) return;
      setLoadingActive(true);
      const userProfile = doc(db, "UserProfile", session.user.uid);
      try {
        await setDoc(
          userProfile,
          {
            userCurrentGame:id,
          },
          { merge: true }
        );
       router.push('/chessboard');
      } catch (error) {
        // console.log(error);
        setLoadingActive(false);
      }
      
    }
    
    //---------------INFINITE SCROLL LOGIC -------------- //
    const [loading, setLoading] = useState(false);
    const observerr = useRef();
    const [isMore, setIsMore] = useState(true);
    const [startAt, setStartAt] = useState(5);

    const loadGames = async () =>{
         if(loading) return;
         if(!isMore) return;
         if(gamesList.length<startAt) {
            setIsMore(false);
            return;
         }
         setLoading(true);
         const gamesArray =await getMoreGames(gamesList[gamesList.length-1].timeCreated, session.user.uid);
         setGamesList(prevGames=>[...prevGames, ...gamesArray]);
         setStartAt(prevStart=>prevStart+5);
         setLoading(false);
    }

    const lastElementView = useCallback((node:any)=>{
      if(loading) return
      if(!isMore) return
      //@ts-ignore
      if(observerr.current) observerr.current.disconnect()
      //@ts-ignore
      observerr.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting){
         loadGames();
        }
      })
      //@ts-ignore
      if(node) observerr.current.observe(node);
    }, [loading, isMore]);


    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
   

    const toggleComponentVisibility = () => {
      setIsMobileMenuVisible(!isMobileMenuVisible);
    };

    return (
      <div className="w-full relative md:h-screen overflow-auto overflow-x-hidden">
        <section
          id=""
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
       {loadingActive ? <div className="fixed top-0 bottom-0 left-0 right-0 z-20 bg-[#1e39577e] flex flex-col justify-center items-center">
        <Image src='/loadingIcon.png' width={50} height={50} alt='loading' className="animate-spin brightness-200 w-[70px] h-[70px] lg:w-[85px] lg:h-[85px]"></Image>
         <span className="text-[20px] text-white font-semibold">Loading game...</span>
       </div> : <></>}
       <div className="sticky top-12 lg:top-0 w-full bg-gradient-to-b from-gray-100 backdrop-blur-md pt-12 pb-4 z-[20] text-2xl sm:text-3xl font-semibold text-center text-black">Your Game History</div>
        {gamesList ? (
          <section className="relative w-full flex flex-col gap-y-4 p-2 md:px-4 lg:px-6 lg:pb-[100px]">

            {gamesList.map((game: any, idx: number) => (
              (gamesList.length-1 == idx) ?
              <div ref={lastElementView} key={idx} className="rounded-sm p-1 border-[1px] border-black/20 flex
               bg-white shadow-md">
                <div onClick={()=>handleLoadGame(game.gameId)} className="h-[180px] relative cursor-pointer w-[180px]">
                <Chessboard
                  id="board"
                  position={game.fenArray ? game.fenArray[game.fenArray.length-1] : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}
                  boardWidth={180}
                  boardOrientation={
                    game.userColor == "Black"
                      ? "black"
                      : game.userColor == "White"
                      ? "white"
                      : "white"
                  }
                  arePiecesDraggable={false}
                />
                <div className="absolute top-0 w-full h-full z-20 cursor-pointer"></div>
                </div>
                 <section className="w-full text-gray-800 grid grid-rows-5 px-2 max-h-[180px]">
                     <div className="row-span-2 flex flex-col">
                          <span className="font-semibold underline tracking-wide">Game parameters</span>
                          <span className="text-[15px]">Level: {game.difficultyLevel}</span>
                          <span className="text-[15px]">Chessy: {game.chessyPersonality}</span>
                     </div>
                     <div className="row-span-2 flex flex-col justify-center items-center space-y-[2px] ">
                           <span className="text-[15px] font-semibold tracking-wide">{chessName} vs. Computer</span>
                           {game.isCompleted ? 
                           <span className={`tracking-wide font-semibold ${game.isCompleted[1] == 'd' ? 
                           'text-yellow-700' : game.isCompleted[1] == 'w' ? 
                           'text-green-600' : 'text-red-600'}`}>{game.isCompleted[0]}</span> : 
                           <span className="text-yellow-600">Not finished yet...</span>}
                     </div>
                     <div className="row-span-1 flex items-end">
                          <span>
                            {game.positions? (((PGNNotation(game.positions).split(' ')).slice(0, 9)).join(' ')+ ' ... ' + (Math.floor(game.positions.length/2) + game.positions.length%2).toString()) : 0} moves
                          </span>
                     </div>
                 </section>
              </div> :
              <div key={idx} className="rounded-sm p-1 border-[1px] border-black/20 flex
              bg-white shadow-md">
               <div onClick={()=>handleLoadGame(game.gameId)} className="h-[180px] relative cursor-pointer w-[180px]">
               <Chessboard
                 id="board"
                 position={game.fenArray ? game.fenArray[game.fenArray.length-1] : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}
                 boardWidth={180}
                 boardOrientation={
                   game.userColor == "Black"
                     ? "black"
                     : game.userColor == "White"
                     ? "white"
                     : "white"
                 }
                 arePiecesDraggable={false}
               />
               <div className="absolute top-0 w-full h-full z-20 cursor-pointer"></div>
               </div>
                <section className="w-full text-gray-800 grid grid-rows-5 px-2 max-h-[180px]">
                <div className="row-span-2 flex flex-col">
                          <span className="font-semibold underline tracking-wide">Game parameters</span>
                          <span className="text-[15px]">Level: {game.difficultyLevel}</span>
                          <span className="text-[15px]">Chessy: {game.chessyPersonality}</span>
                     </div>
                    <div className="row-span-2 flex flex-col justify-center items-center space-y-[2px] ">
                          <span className="text-[15px] font-semibold tracking-wide">{chessName} vs. Computer</span>
                          {game.isCompleted ? 
                          <span className={`tracking-wide font-semibold ${game.isCompleted[1] == 'd' ? 
                          'text-yellow-700' : game.isCompleted[1] == 'w' ? 
                          'text-green-600' : 'text-red-600'}`}>{game.isCompleted[0]}</span> : 
                          <span className="text-yellow-600">Not finished yet...</span>}
                    </div>
                    <div className="row-span-1 flex items-end">
                         <span>
                           {game.positions? (((PGNNotation(game.positions).split(' ')).slice(0, 9)).join(' ')+ ' ... ' + (Math.floor(game.positions.length/2) + game.positions.length%2).toString()) : 0} moves
                         </span>
                    </div>
                </section>
             </div>
            ))}
           {loading && <div className="w-full flex py-10 justify-center items-center text-[20px]">Loading...</div>}
          </section>
        ) : (
          <section></section>
        )}
      </div>
    );
}
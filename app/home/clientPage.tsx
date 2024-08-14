"use client"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, Title } from "chart.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pie, Line } from 'react-chartjs-2';
import { FcRating } from "react-icons/fc";
import { BiSolidChess } from "react-icons/bi";
import { FaChessBoard, FaChessPawn, FaChessKing, FaHandshake, FaHourglassHalf } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/utils/auth/FirebaseCredentials";
import axios from "axios";
import Image from 'next/image'
import getMoreGames from "../history/hooks/loadGames";
import HistoryItem from "@/components/HistoryItem";
import MobileSidebar from "./components/MobileSidebar";
import { RxHamburgerMenu } from "react-icons/rx";
import { SiStackblitz } from "react-icons/si";
import { IoSettings, IoExtensionPuzzleSharp } from "react-icons/io5";
import { MdHelp } from "react-icons/md";
import SubscriptionTrialModal from "@/components/SubscriptionTrial";
import Swal from "sweetalert2";
import RatingChart from "@/components/RatingChart";
import PieChart from "@/components/PieChart";
import { axiosInstance } from "@/services/base-http.service";
import PricingTable from "@/components/PricingTable";



ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, Title);

export default function HomeClient({ lout, user, gameNumbers, gamesArray, chartPlot }: any) {
  const [responseError, setResponseError] = useState<{status:number, additional: string} | null>(null);
  const router = useRouter();
  const data = {
    labels: [`Wins: ${gameNumbers.won}`, `Loses: ${gameNumbers.lost}`, `Draws: ${gameNumbers.draw}`, `In Progress: ${gameNumbers.inProgress}`],
    datasets: [
      {
        data: [gameNumbers.won, gameNumbers.lost, gameNumbers.draw, gameNumbers.inProgress],
        backgroundColor: ['#7ABA78', '#FF6384', '#FFCE56', '#36A2EB'],
        hoverBackgroundColor: ['#7ABA7', '#FF6384', '#FFCE56', '#36A2EB']
      }
    ]
  };
  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 18 // Adjust font size here
          }
        }
      }
    }
  };
  //GAMES HISTORY
  const [gamesList, setGamesList] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const observerr = useRef();
  const [isMore, setIsMore] = useState(true);
  const [startAt, setStartAt] = useState(5);

  const loadGames = async () => {
    if (loadingHistory) return;
    if (!isMore) return;
    if (gamesList.length < startAt) {
      setIsMore(false);
      return;
    }
    setLoadingHistory(true);
    const gamesArray = await getMoreGames(gamesList[gamesList.length - 1].timeCreated, user.id);
    setGamesList(prevGames => [...prevGames, ...gamesArray]);
    setStartAt(prevStart => prevStart + 5);
    setLoadingHistory(false);
  }




  const handleLoadGame = async (id: any) => {
    if (!id) return;
    //setLoadingActive(true);
    const userProfile = doc(db, "UserProfile", user.id);
    try {
      await setDoc(
        userProfile,
        {
          userCurrentGame: id,
        },
        { merge: true }
      );
      router.push('/chessboard');
    } catch (error) {
      // console.log(error);
      //setLoadingActive(false);
    }

  }

  //--------------------------------------------------------------------------------


  const createThread = async () => {
    try {
      const response = await axiosInstance({
        url: '/api/thread/create',
        method: 'POST',
        data:{
          userId: user.id,
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

  async function Quickplay() {
    const gameRef = doc(db, "Game", user.currentGame)
    const crtGame = await getDoc(gameRef);
    if (!crtGame.exists()) return;
    let threadId = null;
    //// console.log(threadId)
    
    try{
      threadId = await createThread();
    }
    catch(err:any){
      if(err?.response?.status == 402){
        setResponseError({status:402, additional: err.response.data.text})
      }
      if(err?.response?.status == 403){
        Swal.fire({
          position: "bottom-end",
          icon: "error",
          title: err.response.data.text,
          showConfirmButton: false,
          timer: 2500
        });
      }
      return;
    }
    
    const newGameRef = doc(db, "Game", threadId);
    const date = new Date();
    await setDoc(
      newGameRef,
      {
        userId: user.id,
        assistantId: crtGame.data()?.assistantId,
        difficultyLevel: crtGame.data()?.difficultyLevel,
        chessyPersonality: crtGame.data()?.chessyPersonality,
        userColor: crtGame.data()?.userColor,
        helpLevel: crtGame.data()?.helpLevel,
        timeCreated: date.getTime(),
        positions: [],
        fenArray: [],
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

    router.push('/chessboard');
  }

  const containerRef = useRef<HTMLElement | null>(null);
  const [containerClass, setContainerClass] = useState("grid-cols-1");

  useEffect(() => {
    const checkContainerSize = () => {
      const width = containerRef.current?.offsetWidth ? containerRef.current.offsetWidth : 600;
      if (width > 550) {
        setContainerClass("grid-cols-2");
      } else {
        setContainerClass("grid-cols-1");
      }
    };
    // Check on mount and on resize
    checkContainerSize();
    window.addEventListener('resize', checkContainerSize);
    setGamesList([...gamesArray]);

    // console.log("GAMES RESULTS: ", gamesResults);
    // Clean up
    return () => window.removeEventListener('resize', checkContainerSize);
  }, []);

  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);


  const toggleComponentVisibility = () => {
    setIsMobileMenuVisible(!isMobileMenuVisible);
  };

  return (
    <div className="w-full relative md:overflow-auto pt-10">
       {responseError && responseError.status == 402 && 
        //<SubscriptionTrialModal userId={user.id} text={responseError.additional} trial={!user.hasOwnProperty('subscription')}></SubscriptionTrialModal>
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
      <div className="w-full gap-y-3 flex flex-col py-6">
        <div className="w-full px-4 flex justify-center mt-3">
          <div className="flex flex-wrap justify-center w-full max-w-[1200px] gap-4 px-2">
            <div className="flex w-full justify-center gap-4">
              <div className="w-full text-xl md:text-2xl font-semibold text-center">
                Your Profile
              </div>
              <div className="w-full text-xl md:text-2xl font-semibold text-center">
                Shortcuts
              </div>
            </div>
            <div className="flex w-full justify-center gap-4">
              <section className="flex-1 min-w-[350px] rounded-[5px] border border-stroke bg-white p-7 shadow-default">
                <div className="pt-2 flex flex-col gap-2">
                  <div className="w-full relative flex justify-center items-center font-medium text-[16px] border-[2px] rounded-[5px] bg-[#F3F5F8] px-7 py-2  font-medium text-black ">
                    <p className="z-10">Username: {user.chessName}</p>
                  </div>
                  <div className="w-full relative flex justify-center items-center font-medium text-[16px] border-[2px]  rounded-[5px] bg-[#F3F5F8] px-7 py-2  font-medium text-black ">
                    <p className="z-10">Email: {user.email}</p>
                  </div>
                  <div className="w-full  relative flex justify-center items-center font-medium text-[16px] border-[2px]  rounded-[5px] bg-[#F3F5F8] px-7 py-2  font-medium text-black ">
                    <p className="z-10">Subscription: [placeholder]</p>
                  </div>
                  <div className="w-full  relative flex justify-center items-center font-medium text-[16px] border-[2px]  rounded-[5px] bg-[#F3F5F8] px-7 py-2  font-medium text-black ">
                    <p className="z-10">Chessvia ELO: {user?.ELO ? user.ELO : user.rating ? user.rating : 442}</p>
                  </div>
                </div>
              </section>
              <section className="flex-1 min-w-[350px]  rounded-[5px] border border-stroke bg-white p-8 shadow-default">
                <section
                  ref={containerRef}
                  id="HomePageButtonsContainer"
                  className={`flex flex-wrap justify-between max-w-[1200px] gap-4`}
                >
                  <div
                    id="HP-NewGameButton"
                    onClick={() => router.push("/form")}
                    className="w-[48%]  px-[25px] py-[35px]  gap-x-3 relative group rounded-lg bg-[#1c683f] flex justify-center items-center font-medium text-[16px] border-[2px]  rounded-[5px]  text-white cursor-pointer shadow-md " >
                    <div className="HomePageButtonsCover-1"></div>
                    <IoExtensionPuzzleSharp className="h-6 w-6 z-10"></IoExtensionPuzzleSharp>
                    <p className="z-10">New Game</p>
                  </div>
                  <div
                    id="HP-Quickplay"
                    onClick={() => Quickplay()}
                    className="w-[48%]  px-[25px] py-[35px] gap-x-3 relative group rounded-lg bg-[#1c683f] flex justify-center items-center font-medium text-[16px] border-[2px]  rounded-[5px]  text-white cursor-pointer shadow-md "
                  >
                    <div className="HomePageButtonsCover-2"></div>
                    <SiStackblitz className="h-6 w-6 z-10"></SiStackblitz>
                    <p className="z-10">Quickplay</p>
                  </div>
                  <div
                    id="HP-Settings"
                    onClick={() => router.push("/account/board_settings")}
                    className="w-[48%]  px-[25px] py-[35px] gap-x-3 relative group rounded-lg bg-[#1c683f] flex justify-center items-center font-medium text-[16px] border-[2px] rounded-[5px]  text-white cursor-pointer shadow-md "
                  >
                    <div className="HomePageButtonsCover-3"></div>
                    <IoSettings className="h-6 w-6 z-10"></IoSettings>
                    <p className="z-10">Settings</p>
                  </div>
                  <div
                    id="HP-Chat"
                    onClick={() => router.push("/chat")}
                    className="w-[48%]  px-[25px] py-[35px] gap-x-3 relative group rounded-lg bg-[#1c683f] flex justify-center items-center font-medium text-[16px] border-[2px]  rounded-[5px]  text-white cursor-pointer shadow-md "
                  >
                    <div className="HomePageButtonsCover-4"></div>
                    <MdHelp className="h-6 w-6 z-10"></MdHelp>
                    <p className="z-10">Chat with Chessy</p>
                  </div>
                </section>
              </section>
            </div>
          </div>
        </div>
        <div className="w-full px-4 flex justify-center mt-3">
          <div className="flex flex-wrap justify-center w-full max-w-[1200px] gap-4">
            <div className="flex w-full justify-center gap-4 ">
              <section className="flex-1  wide-ft rounded-[5px] border border-stroke bg-white p-7 shadow-default">
                  <div className="w-full flex justify-center px-4 pb-10">
                    <div className="w-full text-xl md:text-2xl font-semibold text-center">
                      Your Stats
                    </div>
                  </div>
                  <div className="w-full flex justify-center">
                    <div className=" w-full max-w-[1200px] ">
                      <div className="w-full flex flex-wrap gap-3">
                        <div className="flex-1 relative py-3   flex items-center justify-center  cursor-pointer font-medium text-[16px] border-[2px]  rounded-[5px] bg-[#F3F5F8] px-7 py-[35px]  font-medium text-black">
                          <FaChessPawn className="h-6 w-6 mr-2" />
                          <p>Won: {gameNumbers.won}</p>
                        </div>
                        <div className="flex-1 relative py-3  flex items-center justify-center cursor-pointer font-medium text-[16px] border-[2px]  rounded-[5px] bg-[#F3F5F8] px-7 py-[35px]  font-medium text-black">
                          <FaHandshake className="h-6 w-6 mr-2" />
                          <p>Draw: {gameNumbers.draw}</p>
                        </div>
                        <div className="flex-1 relative py-3  flex items-center justify-center  cursor-pointer font-medium text-[16px] border-[2px]  rounded-[5px] bg-[#F3F5F8] px-7 py-[35px] font-medium text-black">
                          <FaHourglassHalf className="h-6 w-6 mr-2" />
                          <p>In Progress: {gameNumbers.inProgress}</p>
                        </div>
                      </div>
                    </div>
                  </div>
              </section>
              <section className="flex-1 row-gap-4 wide-st rounded-[5px] border border-stroke bg-white p-7 shadow-default">
                <div className="w-full flex justify-center pb-4 pb-10">
                  <div className="w-full text-xl md:text-2xl font-semibold text-center">
                    Rating Progression
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <div className="w-full max-w-[1200px] flex flex-col md:flex-row justify-center items-center  ">
                    <div className="md:w-2/3"><RatingChart data={chartPlot}></RatingChart></div>
                    <div className="md:w-1/3"><PieChart gameNumbers={gameNumbers}></PieChart></div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        

        <div className="w-full flex justify-center px-4 pt-10">
          <div className="w-full text-center text-xl md:text-2xl font-semibold">
            Your Past Games
          </div>
        </div>
        <div className="w-full flex justify-center px-4">
          <section className="w-full rounded-md flex justify-center flex-col max-w-[1200px]  rounded-[5px] border border-stroke bg-white p-7 shadow-default">
            {gamesList ? (
              <section className="mx-auto w-full flex flex-col gap-y-3">
                {gamesList.map((game: any, idx: number) => (
                  <div key={idx}>
                    <HistoryItem
                      fenString={
                        game.fenArray?.length > 0
                          ? game.fenArray[game.fenArray.length - 1]
                          : null
                      }
                      handleLoadGame={handleLoadGame}
                      color={game.userColor}
                      difficultyLevel={game.difficultyLevel}
                      gameId={game.gameId}
                      chessName={user.chessName}
                      isCompleted={game.isCompleted ? game.isCompleted : null}
                      positions={game.positions ? game.positions : []}
                      chessyPersonality={game.chessyPersonality}
                    ></HistoryItem>
                  </div>
                ))}
                {!loadingHistory && isMore && gamesList.length > 4 && (
                  <div className="w-full flex justify-center items-center text-[18px] pt-4">
                    <button
                      onClick={() => loadGames()}
                      type="button"
                      className="w-full max-w-[180px] py-2 font-medium text-md tracking-wide rounded-full bg-[#1c683f77] text-[#124429] shadow-md"
                    >
                      Load More
                    </button>
                  </div>
                )}
                {loadingHistory && (
                  <div className="w-full flex py-10 justify-center items-center text-[20px]">
                    Loading...
                  </div>
                )}
              </section>
            ) : (
              <></>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
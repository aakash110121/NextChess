'use client'

import { useState } from "react";
import { AccordionData } from "./data/data";
import AccordionContainer from "./components/AccordionContainer";
import { RxHamburgerMenu } from "react-icons/rx";
import MobileSidebar from "./components/MobileSidebar";
import LandingNavBar from "@/components/LandingNavBar";
import { useRouter } from "next/navigation";

export default function ClientPage({lout}:any){
    const [active, setActive] = useState([false, false, false, false, false]);
    const isSomeActive = active.some((element) => element);
    const handleClick = () => {
      isSomeActive
        ? setActive([false, false, false, false,false])
        : setActive([true, true, true, true, true, true]);
    };
    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
    const router = useRouter();

    const toggleComponentVisibility = () => {
      setIsMobileMenuVisible(!isMobileMenuVisible);
    };
    return (
      <div className="w-full md:h-screen relative">
        <section
          id="learnmoreNavbar"
          className={`${!lout ? 'hidden' : ''} bg-[#124429] h-[48px] sticky md:hidden z-[50] top-0 left-0 right-0 px-4  py-[8px]  justify-center transform-all transition ease-in-out duration-1000`}
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
        <div className={`relative grid place-items-center w-full h-full overflow-y-auto `}>
        {!lout && 
         <div className="sticky top-0 w-full z-10 shadow-md shadow-black/30 bg-[#124429] py-[6px] px-4 md:px-6 lg:px-8 flex justify-end items-center">
         <svg
           style={{ filter: "contrast(125%) brightness(110%)" }}
           className="absolute w-full h-[48px] left-0 right-0 top-0 bottom-0 opacity-[35%]"
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
         <div className="flex gap-x-2">
           <button
             onClick={()=>router.push('/login')}
             type="button"
             className="rounded-md text-gray-800 bg-white hover:bg-gray-200 transition duration-300 px-6 py-[6px] font-medium z-10"
           >
             Login
           </button>
           <button
             onClick={()=>router.push('/signup')}
             type="button"
             className="rounded-md text-gray-800 bg-white px-6 py-[6px] hover:bg-gray-200 transition duration-300 font-medium z-10"
           >
             Register
           </button>
         </div>
       </div>}
          <AccordionContainer
            handleClick={handleClick}
            isSomeActive={isSomeActive}
            data={AccordionData}
            turn={active}
            setTurn={setActive}
          />
        </div>
      </div>
    );
}
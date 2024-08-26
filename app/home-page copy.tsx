'use client'
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { gradient } from "@/components/Gradient";
import { useEffect } from "react";
import LandingNavBar from "@/components/LandingNavBar";
import mockup3 from '@/public/images/mockup3.png'; // Import the image
import Image from 'next/image';


export default function HomePage() {
  useEffect(() => {
    gradient.initGradient("#gradient-canvas");

    const shakeButton = () => {
      const button = document.querySelector('.play-button') as HTMLElement | null;
      if (button) {
        button.classList.add('shake-animation');
        setTimeout(() => {
          button.classList.remove('shake-animation');
        }, 500);
      }
    };

    const interval = setInterval(shakeButton, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      <div className="min-h-[100vh] sm:min-h-screen w-screen flex flex-col relative bg-[#F2F3F5] font-inter overflow-hidden">
        <svg
          style={{ filter: "contrast(120%) brightness(120%)" }}
          className="fixed z-[1] w-full h-full opacity-[35%]"
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
        <main className="flex flex-col justify-center h-[90%] mt-10 md:mt-0 static md:fixed w-screen overflow-hidden grid-rows-[1fr_repeat(3,auto)_1fr] z-[80] pt-[30px] pb-[320px] px-4 md:px-20 md:py-0">
          <motion.img
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.95,
              ease: [0.165, 0.84, 0.44, 1],
            }}
            className="block w-[168px] row-start-2 mb-0 md:mb-0"
            src="/chessvia.png"
            alt="Chessvia Logo"
          />

          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.15,
              duration: 0.95,
              ease: [0.165, 0.84, 0.44, 1],
            }}
            className="relative md:ml-[-10px] md:mb-[37px] font-extrabold text-[18vw] md:text-[120px] font-inter text-[#000000] leading-[0.9] tracking-[-2px] z-[80]"
          >
            Meet your <br />
            <span className="text-[#124429]">AI Chess Coach</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.95,
              ease: [0.165, 0.84, 0.44, 1],
            }}
            className="flex flex-col md:flex-row justify-center z-20 mx-0 mb-0 mt-8 md:mt-0 md:mb-[35px] max-w-2xl md:space-x-8"
          >
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <h2 className="flex items-baseline font-semibold text-[#1a2b3b] text-base md:text-lg">
                <span
                  style={{
                    fontSize: "130%",
                    fontWeight: "bold",
                    color: "#124429",
                    verticalAlign: "baseline",
                  }}
                >
                  Chessy&nbsp;&nbsp;
                </span>
              </h2>
              <p className="text-[14px] md:text-[16px] leading-[18px] md:leading-[20px] text-[#1a2b3b] font-normal md:hidden">
                Your personal AI coach and Chess partner, voice-activated and trained on your games
              </p>
              <p className="text-[12px] md:text-[16px] leading-[14px] md:leading-[20px] text-[#1a2b3b] font-normal hidden md:block">
                Your personal AI coach and Chess partner, voice-activated and trained on your games
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="flex items-baseline font-semibold text-[#1a2b3b] text-base md:text-lg">
                <span
                  style={{
                    fontSize: "130%",
                    fontWeight: "bold",
                    color: "#124429",
                    verticalAlign: "baseline",
                  }}
                >
                  Chessy Chat&nbsp;&nbsp;
                </span>
              </h2>
              <p className="text-[14px] md:text-[16px] leading-[18px] md:leading-[20px] text-[#1a2b3b] font-normal md:hidden">
                Chat, learn, and joke around with personalized chatbots trained on your games
              </p>
              <p className="text-[12px] md:text-[16px] leading-[14px] md:leading-[20px] text-[#1a2b3b] font-normal hidden md:block">
                Chat, learn, and joke around with personalized chatbots trained on your games
              </p>
            </div>
          </motion.div>
          <LandingNavBar></LandingNavBar>
          <div className="flex gap-[15px] mt-8 md:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.55,
                duration: 0.55,
                ease: [0.075, 0.82, 0.965, 1],
              }}
            >
              <Link
                href="/learnmore"
                target="_blank"
                className="group rounded-full px-8 py-3 text-[16px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#124429] hover:bg-[#124429] hover:text-white no-underline gap-x-2 active:scale-95 scale-100 duration-75"
                style={{
                  boxShadow: "0 1px 1px #0c192714, 0 3px 3px #0c192724",
                  transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
                  border: "1px solid #124429",
                }}
              >
                Learn More
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.65,
                duration: 0.55,
                ease: [0.075, 0.82, 0.965, 1],
              }}
            >
              <Link
                href="/signup"
                className="group play-button rounded-full px-6 py-3 text-[16px] font-semibold transition-all flex items-center justify-center bg-[#124429] text-white hover:bg-[#124429] hover:text-white no-underline active:scale-100 scale-100 duration-75 relative overflow-hidden"
                style={{
                  boxShadow: "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.setProperty('--pulse-left', '0%');
                  target.style.setProperty('--pulse-speed', '.5s');
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.setProperty('--pulse-left', '-100%');
                  target.style.setProperty('--pulse-speed', '0.3s');
                }}
              >
                <span className="relative z-10 mr-2 font-bold md:hidden">Play</span>
                <span className="relative z-10 mr-2 font-bold hidden md:inline">Play against Chessy</span>
                <svg className="relative z-10 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.75 6.75L19.25 12L13.75 17.25"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:stroke-white"
                  />
                  <path
                    d="M19 12H4.75"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:stroke-white"
                  />
                </svg>
                <span
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black to-black"
                  style={{
                    left: 'var(--pulse-left, -100%)',
                    transition: 'left var(--pulse-speed, 0.1s) var(--pulse-timing, ease-in)',
                  }}
                ></span>
              </Link>
            </motion.div>
          </div>
        </main>

        <div
          className="fixed top-0 right-0 w-[80%] md:w-1/2 h-screen bg-[#1F2B3A]/20 md:block hidden sm:block"
          style={{
            clipPath:
              "polygon(100px 0,100% 0,calc(100% + 225px) 100%, 450px 100%)",
          }}
        ></div>

<motion.canvas
          initial={{
            filter: "blur(0px)",
          }}
          animate={{
            filter: "blur(0px)",
          }}
          transition={{
            duration: 1,
            ease: [0.075, 0.82, 0.965, 1],
          }}
          style={{
            clipPath: "polygon(80px 0,100% 0,calc(100% + 225px) 100%, 400px 100%)",
          }}
          id="gradient-canvas"
          data-transition-in
          className="z-30 fixed top-0 right-[-2px] w-[80%] md:w-1/2 h-screen bg-[#c3e4ff] md:block hidden sm:block"
        ></motion.canvas>

        {/* Mockup Image */}
        <div className="fixed top-[12%] right-[-9%] w-[80%] md:w-1/2 h-screen flex items-center justify-center z-40 md:flex hidden sm:hidden">
          <motion.div
            whileHover={{ scale: 1.7 }}
            transition={{ duration: 0.3 }}
            className="w-[60%] h-auto"
            onHoverStart={() => {
              const button = document.querySelector('.play-button') as HTMLElement | null;
              if (button) {
                button.style.setProperty('--pulse-left', '0%');
                button.style.setProperty('--pulse-speed', '0.5s');
              }
            }}
            onHoverEnd={() => {
              const button = document.querySelector('.play-button') as HTMLElement | null;
              if (button) {
                button.style.setProperty('--pulse-left', '-100%');
                button.style.setProperty('--pulse-speed', '0.3s');
              }
            }}
          >
            <Image
              src={mockup3}
              alt="Chessvia AI Chess Coach Chessboard"
              layout="responsive"
              width={500}
              height={500}
              className="z-[1] opacity-[88%]"
            />
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "../learnmore/learnmore.module.css";

import S1_1on1coaching_new from "../../public/images/S1_1on1coaching_new.png";
import S1_asynchronousservices_new from "../../public/images/S1_asynchronousservices_new.png";
import S1_playerrequests_new from "../../public/images/S1_playerrequests_new.png";
import S2_bulkgamereviews_new from "../../public/images/S2_bulkgamereviews_new.png";
import S2_lichessstudies_new from "../../public/images/S2_lichessstudies_new.png";
import S2_otherservices_new from "../../public/images/S2_otherservices_new.png";
import S2_textreviews_new from "../../public/images/S2_textreviews_new.png";
import S2_videoreviews_new from "../../public/images/S2_videoreviews_new.png";
import S3_choosetimefromcalendar_new from "../../public/images/S3_choosetimefromcalendar_new.png";
import S3_effectivesecure_new from "../../public/images/S3_effectivesecure_new.png";
import S3_selectacoach_new from "../../public/images/S3_selectacoach_new.png";
import S4_filloutform_new from "../../public/images/S4_filloutform_new.png";
import S4_listarequest from "../../public/images/S4_listarequest.png";
import S4_receiveoffers_new from "../../public/images/S4_receiveoffers_new.png";
import S4_selectanoffer_new from "../../public/images/S4_selectanoffer_new.png";
import S5_applytobecomecoach_new from "../../public/images/S5_applytobecomecoach_new.png";
import S5_choosehowpaid_new from "../../public/images/S5_choosehowpaid_new.png";
import S5_createprofile_new from "../../public/images/S5_createprofile_new.png";
import S5_getverified_new from "../../public/images/S5_getverified_new.png";
import S6_affordablepersonalized from "../../public/images/S6_affordablepersonalized.png";
import S6_getreviewedbypro from "../../public/images/S6_getreviewedbypro.png";
import S6_safesecuretrans from "../../public/images/S6_safesecuretrans.png";

import Image from "next/image";
import MobileSidebar from "./components/MobileSidebar";

const LearnMore = ({ lout }: any) => {
  const [scrolled, setScrolled] = useState(false);
  const divRef = useRef(null);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

  const toggleComponentVisibility = () => {
    setIsMobileMenuVisible(!isMobileMenuVisible);
  };

  return (
    <div ref={divRef} className="flex-1 relative md:overflow-auto">
      {isMobileMenuVisible && (
        <MobileSidebar
          toggleComponentVisibility={toggleComponentVisibility}
          lout={lout}
        />
      )}

      {/* About Us Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-[15%] py-16 bg-white-200">
        <div className="w-full md:w-1/3 text-center mb-6 md:mb-0">
          <div className="relative w-60 h-60 mx-auto">
            <div className="absolute inset-0 rounded-full border-8 border-[#124429]"></div>
            <Image
              src="/chessy/Chessvia-Favicon-Gold.png"
              alt="Chessvia Favicon"
              layout="fill"
              objectFit="contain"
              className="rounded-full"
            />
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#124429] mb-4">ABOUT US</h2>
          <p className="text-lg md:text-xl text-gray-700">
            At ChessviaAI, we are revolutionizing chess coaching with a personalized, speaking, multi-modal AI chess coach – Chessy.
            <br /><br />
            Chessy&apos;s brilliance is a combo of training on players&apos; games, custom chess analysis algorithms, and cutting-edge chain of logic prompting mechanisms.
            <br /><br />
            Compared to a human coach, Chessy is significantly cheaper, offers personalized, AI-based learning, and is a whole lot more engaging!
          </p>
        </div>
      </div>

      {/* Let's Face It Section */}
      <div className="px-[15%] py-8 bg-gray-100">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Let&apos;s face it - Chess coaching could be better</h2>
        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-center">
          <div className="flex flex-col w-full md:w-1/4 justify-center text-center items-center  text-gray-800 rounded-[5px] border border-stroke bg-white p-7 shadow-default my-5">
            <Image
              width={160}
              height={160}
              src={S2_bulkgamereviews_new.src}
              alt="Expensive"
            />
            <h4 className="text-xl font-semibold mt-4">Expensive</h4>
            <p className="mt-2">
              Chess coaching costs $25-30 per hour on average, and upwards of $200 for master coaches.
            </p>
          </div>
          <div className="flex flex-col w-full md:w-1/4 justify-center text-center items-center  text-gray-800 rounded-[5px] border border-stroke bg-white p-7 shadow-default my-5">
            <Image
              width={160}
              height={160}
              src={S2_lichessstudies_new.src}
              alt="Impersonalized"
            />
            <h4 className="text-xl font-semibold mt-4">Impersonalized</h4>
            <p className="mt-2">
              Coaching methodologies are decades old and coaches lack deep knowledge of their students.
            </p>
          </div>
          <div className="flex flex-col w-full md:w-1/4 justify-center text-center items-center  text-gray-800 rounded-[5px] border border-stroke bg-white p-7 shadow-default my-5">
            <Image
              width={160}
              height={160}
              src={S2_otherservices_new.src}
              alt="Difficult to schedule"
            />
            <h4 className="text-xl font-semibold mt-4">Difficult to schedule</h4>
            <p className="mt-2">
              Coaches are scattered across multiple sites, time zones, and payment platforms.
            </p>
          </div>
          <div className="flex flex-col w-full md:w-1/4 justify-center text-center items-center  text-gray-800 rounded-[5px] border border-stroke bg-white p-7 shadow-default my-5">
            <Image
              width={160}
              height={160}
              src={S2_textreviews_new.src}
              alt="Not that fun"
            />
            <h4 className="text-xl font-semibold mt-4">Not that fun</h4>
            <p className="mt-2">
              Coaching is repetitive, not adaptive and considered a chore for many players.
            </p>
          </div>
        </div>
      </div>

      {/* So We Created Chessy Section */}
      <div className="px-[15%] py-8 bg-gray-200">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">So we created Chessy - A cheaper, stronger, more personalized AI chess coach</h2>
        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-center">
          <div className="flex flex-col w-full md:w-1/4 justify-center text-center items-center  text-gray-800 rounded-[5px] border border-stroke bg-white p-7 shadow-default my-5">
            <Image
              width={160}
              height={160}
              src={S2_videoreviews_new.src}
              alt=">10x cheaper"
            />
            <h4 className="text-xl font-semibold mt-4">10x cheaper</h4>
            <p className="mt-2">
              Chessy costs as little as ~$2-$3 per coaching hour and provides more value to students.
            </p>
          </div>
          <div className="flex flex-col w-full md:w-1/4 justify-center text-center items-center text-gray-800 rounded-[5px] border border-stroke bg-white p-7 shadow-default my-5">
            <Image
              width={160}
              height={160}
              src={S3_choosetimefromcalendar_new.src}
              alt="AI-personalized"
            />
            <h4 className="text-xl font-semibold mt-4">AI-personalized</h4>
            <p className="mt-2">
              Coaching methodologies are decades old and coaches lack deep knowledge of their students.
            </p>
          </div>
          <div className="flex flex-col w-full md:w-1/4 justify-center text-center items-center  text-gray-800 rounded-[5px] border border-stroke bg-white p-7 shadow-default my-5">
            <Image
              width={160}
              height={160}
              src={S3_effectivesecure_new.src}
              alt="Available on demand"
            />
            <h4 className="text-xl font-semibold mt-4">Available on demand</h4>
            <p className="mt-2">
              Our custom algorithms learn player’s strengths, weaknesses, and play styles in minutes.
            </p>
          </div>
          <div className="flex flex-col w-full md:w-1/4 justify-center text-center items-center  text-gray-800 rounded-[5px] border border-stroke bg-white p-7 shadow-default my-5">
            <Image
              width={160}
              height={160}
              src={S3_selectacoach_new.src}
              alt="A LOT more fun"
            />
            <h4 className="text-xl font-semibold mt-4">A LOT more fun</h4>
            <p className="mt-2">
              Chessy is voice-enabled, customizable, roasty and a blast to play against & learn with.
            </p>
          </div>
        </div>
      </div>

      {/* Chessy is Built Section */}
      <div className="px-[15%] py-8 bg-gray-100">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Chessy is built from the ground up with AI</h2>
        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-center">
          <div className="flex flex-col w-full md:w-1/4 justify-center text-center items-center  text-gray-800 rounded-[5px] border border-stroke bg-white p-7 shadow-default ">
            <Image
              width={160}
              height={160}
              src={S4_filloutform_new.src}
              alt="Play, chat or analyze"
            />
            <h4 className="text-xl font-semibold mt-4">Play, chat or analyze</h4>
            <p className="mt-2">
              Chessy is your personalized AI chess coach. Play games with Chessy, chat with him or just analyze and learn.
            </p>
          </div>
          <div className="flex flex-col w-full md:w-1/4 justify-center text-center items-center  text-gray-800 rounded-[5px] border border-stroke bg-white p-7 shadow-default ">
            <Image
              width={160}
              height={160}
              src={S4_listarequest.src}
              alt="Multi-modal"
            />
            <h4 className="text-xl font-semibold mt-4">Multi-modal</h4>
            <p className="mt-2">
              Built from the ground-up to be multi-modal, Chessy takes in voice, text, or images as input.
            </p>
          </div>
          <div className="flex flex-col w-full md:w-1/4 justify-center text-center items-center rounded-[5px] border border-stroke bg-white p-7 shadow-default my-5text-gray-800">
            <Image
              width={160}
              height={160}
              src={S4_receiveoffers_new.src}
              alt="Real-time AI feedback"
            />
            <h4 className="text-xl font-semibold mt-4">Real-time AI feedback</h4>
            <p className="mt-2">
              Our proprietary AI algorithms analyze your moves live and enable Chessy to understand the position and explain it.
            </p>
          </div>
          <div className="flex flex-col w-full md:w-1/4 justify-center text-center items-center rounded-[5px] border border-stroke bg-white p-7 shadow-default text-gray-800">
            <Image
              width={160}
              height={160}
              src={S4_selectanoffer_new.src}
              alt="Adaptive learning"
            />
            <h4 className="text-xl font-semibold mt-4">Adaptive learning</h4>
            <p className="mt-2">
              Chessy carefully tracks your progress and learnings, tailoring his recommendations to your level and area of need.
            </p>
          </div>
        </div>
      </div>

      {/* What's Next Section */}
      <div className="px-[15%] py-12 bg-gray-200">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">What&apos;s next?</h2>
        <div className="flex flex-col items-center justify-center">
          {/* Placeholder for timeline/roadmap design */}
          <div className="bg-white rounded-lg shadow-lg p-8 w-full text-center">
            <p className="text-lg md:text-xl text-gray-700">Placeholder for timeline/roadmap design</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
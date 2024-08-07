"use client";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { FaBell, FaMicrophone, FaSearch, FaStop, FaUser } from "react-icons/fa";
import { IoArrowForwardOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import UserStatesContext from "@/app/context/userStates";
// export default function ChessboardSidebarRight({isRecording, transcript, response}) {
export default function ChessboardSidebarRight() {
  const {isRecording, setIsRecording} = useContext(UserStatesContext);
  const toggleRecording = () => {
    setIsRecording((prevState) => !prevState);
  };
  return (
    <div>
      <div className="flex flex-row justify-between w-auto mr-5 pt-5 pb-5">
        <div className="bg-white p-3 rounded-full cursor-pointer flex items-center justify-center">
          <IoSearch className="text-xl" />
        </div>
        <div className="bg-white p-3 rounded-full cursor-pointer flex items-center justify-center">
          <IoMdNotificationsOutline className="text-xl" />
        </div>
        <div className="bg-white p-3 rounded-full flex flex-row items-center">
          <Image
            src="/user.jpg"
            alt="User"
            width={32}
            height={40}
            className="rounded-full mr-2"
          />
          <h1 className="ml-2">Sali Meholli</h1>
        </div>
      </div>
      <div className="right-sidebar bg-white h-[85vh] w-[20rem] flex flex-col  mr-5 rounded-3xl p-5">
        {/* <h2>Record a Message</h2>
        {isRecording ? (
          <p>Recording... Press spacebar to stop.</p>
        ) : (
          <p>Press spacebar to start recording.</p>
        )}
        <div>
          <h2>Transcript</h2>
          <p>{transcript}</p>
        </div>
        <div>
          <h2>Generated Response</h2>
          <p>{response}</p>
        </div> */}
        <h2 className="text-orange-400 text-lg">Monthly Revenue</h2>
        <h1 className="text-3xl font-bold">
          Take back <br /> your creative <br /> control
        </h1>
        <p className="text-sm text-gray-400 mt-[10px]">
          The professional platform
        </p>
        <button className=" bottom-5 right-5 bg-orange-400 py-2 px-4 mt-[15px] justify-between text-white rounded-lg flex items-center">
          Get premium now
          <IoArrowForwardOutline className="ml-2" />
        </button>
        <div className="flex flex-col h-screen justify-between border  mt-10 border-gray-300 rounded-md">
          {/* Top Card */}
          <div className="border border-gray-300 rounded-md p-4 shadow-md mb-4">
            <h2 className="text-orange-400 font-bold text-lg">
              Chessvia ChatGPT
            </h2>
            <p>Get the GPT tell you your next move</p>
          </div>

          {/* Bottom Card with Recording */}
          <div className="border border-gray-300 rounded-md p-4  shadow-md">
            {/* Recording Card */}
            <div className="border border-gray-300 rounded-md p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Recording</h2>
                {isRecording ? (
                  <FaStop
                    className="text-red-500 cursor-pointer"
                    onClick={toggleRecording}
                  />
                ) : (
                  <FaMicrophone
                    className="text-green-500 cursor-pointer"
                    onClick={toggleRecording}
                  />
                )}
              </div>
              <p>
                {isRecording
                  ? "Recording..."
                  : "Press the microphone icon to start recording."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client"
import { axiosInstance } from "@/services/base-http.service";
import axios from "axios";
import { useState } from "react";

export default function ClientPage(){

        const [audioUrl, setAudioUrl] = useState(null);
      
        const generateAudio = async (text:string, voice:string) => {
          const audioBuffer = await axiosInstance({
            url: "/api/voice/text_to_sound",
            method: "GET",
            params: {
              text: text,
              voice: voice,
            },
          });

          const buffer = Buffer.from(audioBuffer.data.data); // Ensure it's a Buffer
          const blob = new Blob([buffer], { type: "audio/mpeg" });
          console.log("BFR: ", audioBuffer);
          console.log("DTA: ", audioBuffer.data);

          const url = URL.createObjectURL(blob);

          const audio = new Audio(url);
          const link = document.createElement('a'); // Create a download link
          link.href = url; // Set the Blob URL
          link.download = `${voice}.mp3`; // Name for the download file
          link.click(); // Trigger the download
        };

        const voiceDescriptions = {
            Morgan: `Hello, I'm Morgan. With my calm and steady voice, I'll be your reliable companion throughout the game, helping you navigate the chessboard with confidence. Let's embark on this chess journey together.`,
            Mark: `Hey, I'm Mark. Ready to add some energy to your game? I'll keep you on your toes with my lively commentary and help you make bold moves. Are you ready to take on the challenge?`,
            Robin: `Hi there, I'm Robin. I bring a touch of elegance and clarity to your chess experience. My gentle guidance will help you see the bigger picture and make strategic decisions with confidence. Let's play!`,
            Gabe: `Greetings, I'm Gabe. I have a knack for strategy and enjoy the intricacies of chess. Let me share my insights with you and guide you toward a winning strategy. Shall we begin?`,
            Layla: `Hello, I'm Layla. With a friendly and approachable style, I'll make your chess game fun and engaging. I'll be by your side, offering tips and tricks to help you succeed. Ready to play?`,
            Jessica: `Hi, I'm Jessica. I'm here to make your chess game enjoyable and interactive. With my enthusiastic voice, I'll keep you motivated and inspired. Let's conquer the chessboard together!`,
          };

    return(
        <div className="flex flex-col space-y-2">
            <div onClick={()=>generateAudio(voiceDescriptions.Morgan,'alloy')} className="w-[300px] h-[100px] bg-red-400">NOVA</div>
            <div onClick={()=>generateAudio(voiceDescriptions.Mark,'echo')} className="w-[300px] h-[100px] bg-red-400">NOVA</div>
            <div onClick={()=>generateAudio(voiceDescriptions.Robin,'fable')} className="w-[300px] h-[100px] bg-red-400">NOVA</div>
            <div onClick={()=>generateAudio(voiceDescriptions.Gabe,'onyx')} className="w-[300px] h-[100px] bg-red-400">NOVA</div>
            <div onClick={()=>generateAudio(voiceDescriptions.Layla,'nova')} className="w-[300px] h-[100px] bg-red-400">NOVA</div>
            <div onClick={()=>generateAudio(voiceDescriptions.Jessica,'shimmer')} className="w-[300px] h-[100px] bg-red-400">NOVA</div>
        </div>
    )
}
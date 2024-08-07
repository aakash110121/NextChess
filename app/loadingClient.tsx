'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function LoadingClient({loadingText}:any){
    
    const [dots,setDots] = useState('...');
    useEffect(()=>{
        const loading = setInterval(()=>{
          if(dots.length==3){
            setDots('.');
          }
          else setDots(prevDots=>prevDots+'.');
        },500)
        return()=>clearInterval(loading);
    },[dots])
    return(
    <div className="m-auto w-full h-screen bg-[#EEEEEE] flex justify-center items-center flex-col">
      <Image src='/chessvia.png' alt='chessviaLogo' width={200} height={200} className="w-[30%] max-w-[200px] mb-5"></Image>
      <Image src='/loadingIcon.png' width={50} height={50} alt='loading' className="animate-spin brightness-200 w-[50px] h-[50px] lg:w-[65px] lg:h-[65px]"></Image>
      <span className="text-[20px] text-black"><span className="opacity-0">{dots}</span>{loadingText}<span>{dots}</span></span>
    </div>
    )
}
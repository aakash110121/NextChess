'use client'

import Image from "next/image";
import ChessviaLogo from '@/public/chessvia.png';
import { useState, useEffect, useContext } from "react";
import MobileSiderbar from "./components/MobileSidebar";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import ChatContext from "../context/chatStates";

export default function ChatClient({conversationsList, userData}:any){
    const [noMorePosts, setNoMorePosts] = useState(false);
    
    const {
      setThreads,
      setUser
    } = useContext(ChatContext);

    useEffect(()=>{
      // console.log("CONVERSATIONS LIST: ", conversationsList);
       setThreads([...conversationsList]);
       setUser(userData);
    },[])

    const [isComponentVisible, setIsComponentVisible] = useState(false);
  
  
    const toggleComponentVisibility = () => {
      setIsComponentVisible(!isComponentVisible);
    };

    const getThreads = (stg: any)=>{
        // console.log("Get threads")
        return;
    }
    return (
        <main className="overflow-hidden w-full h-screen relative flex">
        {isComponentVisible ? (
          <MobileSiderbar toggleComponentVisibility={toggleComponentVisibility} />
        ) : null}
        <div className=" hidden flex-shrink-0 bg-white md:flex md:w-[260px] md:flex-col">
          <div className="flex h-full min-h-0 flex-col ">
            <Sidebar/>
          </div>
        </div>
        <Chat toggleComponentVisibility={toggleComponentVisibility} />
      </main>
    );
}
import ChatContext from "@/app/context/chatStates";
import { getSession } from "@/lib/authentication";
import { db } from "@/utils/auth/FirebaseCredentials";
import { user } from "@nextui-org/react";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Message as MessageFile } from "openai/resources/beta/threads/messages";
import React, { useContext } from "react";
import { MdNewspaper, MdAccountCircle, MdSettings, MdReceipt, MdInsights, MdHomeFilled, MdHistory } from "react-icons/md";
import { IoExtensionPuzzleSharp, IoBook } from "react-icons/io5";

import {
  AiOutlineMessage,
  AiOutlinePlus,
  AiOutlineUser,
  AiOutlineSetting,
} from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import { FiMessageSquare } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import Image from 'next/image'
import ChessviaLogo from '@/public/chessvia.png';


const Sidebar = () => {
  const {
    threads,
    setMessages,
    currentThread,
    setCurrentThread,
  } = useContext(ChatContext);

  const router = useRouter();


  const fetchMessages = async (limitNumber:number, thread:string) =>{
    try{
      await axios({
        method:'GET',
        url:'/api/message/list',
        params:{
          threadId:thread,
          limit:limitNumber,
        },
        withCredentials:true,
      }).then((res:any)=>{
        let newMessages = res.data.messages;
        // console.log(newMessages);
        //SORTING SO THAT THE LAST MESSAGE COMES AT LAST PLACE
        newMessages = newMessages.sort(
          (a:MessageFile, b:MessageFile) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
        // console.log(newMessages);
        setMessages([...newMessages]);
      })
    }
    catch(error:any){
      // console.log("error", error);
      if(error?.response?.status && error.response.status == 401){
        console.log("Authentication error");
        router.push('/login');
      }
      console.log("Error: ", error);
    }
}


 const createNewThread= ()=>{
  setCurrentThread(null);
  setMessages([]);
 }

  return (
    <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-gray-800/40">
      <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
        <div className="w-full flex justify-center items-center mt-3 mb-8">
        <Image src={ChessviaLogo} alt="Chessvia Logo" width={210} height={70} className="w-[200px]"/>
        </div>
        <a onClick={()=>createNewThread()} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-gray-800 cursor-pointer 
        text-sm mb-1 flex-shrink-0 border border-gray-800/20">
          <AiOutlinePlus className="h-4 w-4" />
          New chat
        </a>
        <div
          id="sidebarConversationsContainer"
          className="flex-col flex-1 overflow-y-auto border-b border-gray-800/20"
        >
          {threads.map((itm:any, idx:number) => (
            <div onClick={()=>{fetchMessages(100, itm.id); setCurrentThread(itm);}} key={idx} className="flex flex-col gap-y-2 pb-2 text-gray-800 text-sm w-full">
              <a className={`flex py-3 px-3 items-center  relative rounded-md hover:bg-[#2A2B3210] cursor-pointer break-all hover:pr-4 group ${itm.id==currentThread?.id ? 'bg-[#2A2B3210]': ''}`}>
                <FiMessageSquare className="h-4 w-4" />
                <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative pl-1">
                  Chat #{threads.length-idx}
                  <div className={`absolute inset-y-0 right-0 w-10 z-10 bg-gradient-to-l group-hover:from-[#F1F1F2] ${itm.id==currentThread?.id ? 'from-[#F1F1F2]': ''}`}></div>
                </div>
              </a>
            </div>
          ))}
        </div>
       
        <a onClick={()=>router.push('/home')} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-200 transition-colors duration-200 text-black cursor-pointer text-md font-medium">
          <MdHomeFilled className="text-2xl" />
          Home
        </a>
        <a onClick={()=>router.push('/form')} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-200  transition-colors duration-200 text-black cursor-pointer text-md font-medium">
          <IoExtensionPuzzleSharp className="text-2xl" />
          Play
        </a>
        <a onClick={()=>router.push('/history')} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-200 transition-colors duration-200 text-black cursor-pointer text-md font-medium">
          <MdHistory className="text-2xl" />
          History
        </a>
        <a onClick={()=>router.push('/account/board_settings')} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-200 transition-colors duration-200 text-black cursor-pointer text-md font-medium">
          <MdAccountCircle className="text-2xl" />
          Account
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
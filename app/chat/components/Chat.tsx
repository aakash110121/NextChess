import { useContext, useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { BsChevronDown, BsPlusLg } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import Message from "./Message";
import axios from 'axios'
import ChatContext from "@/app/context/chatStates";
import { Message as MessageFile } from "openai/resources/beta/threads/messages";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/utils/auth/FirebaseCredentials";
import Image from 'next/image'
import ChessviaLogo from '@/public/chessvia.png';
import { axiosInstance } from "@/services/base-http.service";

const ChatHeader = () => {
  return (
    <div className="sticky top-0 z-10 flex justify-center bg-white p-2 shadow-md">
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-full overflow-hidden">
          <Image
            src="/chessy/Chessvia-Favicon-Gold.png"
            alt="Chessvia Favicon"
            width={48}
            height={48}
          />
        </div>
        <h1 className="ml-4 text-xl font-semibold">Chessy Chat</h1>
      </div>
    </div>
  );
};



const Chat = (props: any) => {
  const { toggleComponentVisibility } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  const [isChatStarted, setIsChatStarted] = useState(false);

  const {
    threads,
    setThreads,
    messages,
    setMessages,
    currentThread,
    setCurrentThread,
    user,
  } = useContext(ChatContext);

  useEffect(() => {
    // console.log("Messages updated:", messages);
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (currentThread && messages.length > 0 && messages[messages.length - 1].role === 'user') {
      createRun(currentThread.assistant, currentThread.id);
    }
  }, [currentThread]);

  const handleKeypress = (e: any) => {
    if (!message || message.length == 0) return;
    if (isLoading) return;
    if (e.keyCode == 13 && !e.shiftKey) {
      createMessage();
    }
  };

  const handleSendMessage = () => {
    if (!message || message.length == 0) return;
    if (isLoading) return;
    setIsChatStarted(true);
    createMessage();
    // console.log("HERE WE ARE");
  }
  const createNewThread = async () => {
    try {
       const response = await axiosInstance({
          url: '/api/thread/chat_create',
          method: 'POST',
       });
       
       const threadId = response.data?.thread.id;
       const conversationRef = doc(db, "Conversation", threadId);
       await setDoc(conversationRef,
        {
          userId: user.id,
          assistant: user.chatAssistant,
          timeCreated: (new Date).getTime(),
        },
        {
          merge:true,
        }
       )
       setCurrentThread({id:threadId, userId: user.id, assistant: user.chatAssistant});
       setThreads((prevThreads:any)=>[...prevThreads, {id:threadId, userId: user.id, assistant: user.chatAssistant}])
       return {threadId, assistantId:user.chatAssistant};
    } catch (error) {
       console.error("Thread creation failed:", error);
       throw error;
    }
  }

  const createMessage = async () => {
    setIsLoading(true);
    let currentThreadId = currentThread?.id;
    let assistantId = currentThread?.assistant;
    if (!currentThreadId) {
      const result = await createNewThread();
      if (!result) return;
      currentThreadId = result.threadId;
      assistantId = result.assistantId;
    }

    try {
      const response = await axiosInstance({
         url: '/api/message/create',
         method: 'POST',
         data: {
           message: message,
           threadId: currentThreadId,
         }
      });
      // console.log("DATA: ", response.data);
      // console.log(response.data.message.content[0].text.value);
      const mmsgg = response.data.message;

      setMessages((prevMessages: any) => [...prevMessages, mmsgg]);
      createRun(assistantId, currentThreadId);
      setMessage('');
      resetTextareaHeight();
      setIsChatStarted(true); 

    } catch (error) {
      console.error("Message creation failed:", error);
      setIsLoading(false);
      throw error;
    } 
  }

  const fetchMessages = async (limitNumber: number, threadId?: string) => {
    try {
      await axiosInstance({
        method: 'GET',
        url: '/api/message/list',
        params: {
          threadId: currentThread?.id ? currentThread.id : threadId,
          limit: limitNumber,
        },
        withCredentials:true,
      }).then((res: any) => {
        let newMessages = res.data.messages;
        // console.log(newMessages);
        newMessages = newMessages.sort(
          (a: MessageFile, b: MessageFile) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
        // console.log(newMessages);
        setMessages((prevMessages: any) => [...prevMessages, ...newMessages]);
        if (limitNumber == 1 && newMessages[0]?.role == "assistant") {
          // console.log("assistant");
        }
      })
    } catch (error) {
      console.log("error", error);
      setErrorMessage("Fetching messages went wrong. Please reload the page...");
    }
  }

  const createPolling = async (runId: string, threadId: string) => {
    let shouldPull = true;
    while (shouldPull) {
      // console.log("polling...");
      try {
        const response = await axiosInstance({
          method: 'GET',
          url: '/api/run/retrieve',
          params: {
            threadId: threadId,
            runId: runId,
          }
        })

        const latestRunInfo = response.data.run;

        if (
          ["failed", "succeeded", "canceled", "completed"].includes(latestRunInfo.status)
        ) {
          fetchMessages(1, threadId);
          shouldPull = false;
          setIsLoading(false);
        }
      } catch (error) {
        // console.log(error);
      }
    }
  }

  const createRun = async (assistantId: string, currentThreadId: string) => {
    if (!assistantId || !currentThreadId) return;

    try {
      const res = await axiosInstance({
        url: '/api/run/create',
        method: 'POST',
        data: {
          assistantId: assistantId,
          threadId: currentThreadId,
        }
      })

      if (res) createPolling(res.data?.run.id, currentThreadId);

    } catch (error) {
      setErrorMessage("Something went wrong... Please reload the page");
    }
  }

  const adjustHeight = (e: any) => {
    // console.log("Style height: ", e.target.scrollHeight);
    if (e.target.value.length < message.length) {
      e.target.style.height = '24px';
    }
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const textareaRef = useRef<any>();
  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
    }
  };

  const newChat = () => {
    setCurrentThread(null);
    setMessages([]);
    setIsChatStarted(false); // Add this line
  };

  useEffect(() => {
    // console.log("isChatStarted:", isChatStarted);
  }, [isChatStarted]);

  return (
    <div className="flex max-w-full flex-1 flex-col bg-gray-100">
      <div className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-white pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden">
        <button
          type="button"
          className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white "
          onClick={toggleComponentVisibility}
        >
          <span className="sr-only">Open sidebar</span>
          <RxHamburgerMenu className="h-6 w-6 text-black" />
        </button>
        <div className="flex-1 text-center text-base font-normal flex justify-center">
          <Image
            src={ChessviaLogo}
            alt="Chessvia Logo"
            width={210}
            height={70}
            className="w-[150px]"
          />
        </div>
        <button onClick={() => newChat()} type="button" className="px-3">
          <BsPlusLg className="h-6 w-6 text-black" />
        </button>
      </div>
      <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1 pb-20">
        {isChatStarted && <ChatHeader />}
        <div className="flex-1 overflow-hidden">
          <div className="react-scroll-to-bottom--css-ikyem-79elbk h-full">
            <div className="react-scroll-to-bottom--css-ikyem-1n7m0yu">
              {messages.length > 0 ? (
                <div className="flex flex-col items-center text-sm">
                  {messages.map((message: any, index: number) => (
                    <Message key={index} message={message} />
                  ))}
                  <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
                  <div ref={bottomOfChatRef}></div>
                </div>
              ) : null}
              {messages.length === 0 && !isChatStarted ? (
                <div className="py-10 relative w-full flex flex-col h-full">
                  <div className="flex items-center justify-center gap-2">
                    <div className="relative w-full md:w-1/2 lg:w-1/3 xl:w-1/4"></div>
                  </div>

                  <div className="text-2xl sm:text-4xl font-semibold text-center text-black flex flex-col items-center justify-center h-screen">
                    <div className="h-[120px] aspect-square rounded-md relative">
                      <Image
                        src={'/chessy/Chessvia-Favicon-Gold.png'}
                        alt='logo'
                        layout="fill"
                        objectFit="cover"
                        className="opacity-100"
                        quality={100}
                      />
                    </div>
                    <h1>Chessy Chat</h1>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col items-center text-sm"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 md:border-transparent md:bg-vert-light-gradient bg-white md:!bg-transparent pt-2">
          <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
            <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
              {errorMessage ? (
                <div className="mb-2 md:mb-0">
                  <div className="h-full flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
                    <span className="text-red-500 text-sm">{errorMessage}</span>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)]">
                <textarea
                  value={message}
                  tabIndex={0}
                  ref={textareaRef}
                  data-id="root"
                  style={{
                    height: "24px",
                    maxHeight: "200px",
                    overflowY: "hidden",
                  }}
                  placeholder="Send a message..."
                  className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-9 focus:ring-0 focus-visible:ring-0 pl-2 md:pl-0"
                  onChange={(e) => {
                    setMessage(e.target.value);
                    adjustHeight(e);
                  }}
                  onKeyDown={handleKeypress}
                ></textarea>
                <button
                  disabled={isLoading || message?.length === 0}
                  onClick={() => handleSendMessage()}
                  type="button"
                  className="absolute p-1 rounded-md flex items-center justify-center bottom-1.5 md:bottom-2.5 bg-[#124429] disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
                >
                  <FiSend className="h-4 w-4 mr-[2px] mt-[1px] text-white" />
                </button>
              </div>
            </div>
          </form>
          <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 md:px-4 md:pt-3 md:pb-6">
            <span>
              Chessy Chat is here to assist and help you with any questions about your online chess accounts or your Chessvia.AI account.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;


function setThreads(arg0: (prevThreads: any) => any[]) {
  throw new Error("Function not implemented.");
}

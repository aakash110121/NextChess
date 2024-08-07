'use client'
import { Message as MessageFile } from "openai/resources/beta/threads/messages";
import { Thread } from "openai/resources/beta/threads/threads";
import { FC, ReactNode, createContext, useState } from "react";

const ChatContext = createContext<any>(null);

export default ChatContext;

interface Props {
    children: ReactNode
}

export const ChatProvider: FC<Props> = ({children}) => {
    const [threads, setThreads] = useState<any>([]);
    const [messages, setMessages] = useState<MessageFile[]>([]);
    const [currentThread, setCurrentThread] = useState<any>(null);
    const [user,setUser] = useState<any>(null);
    return (
      <ChatContext.Provider
        value={{
          threads,
          setThreads,
          messages,
          setMessages,
          currentThread,
          setCurrentThread,
          user,
          setUser
        }}
      >
        {children}
      </ChatContext.Provider>
    );
}
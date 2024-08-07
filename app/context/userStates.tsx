'use client'
import { FC, ReactNode, createContext, useState } from "react";

const UserStatesContext = createContext<any>(null);

export default UserStatesContext;

interface Props {
    children: ReactNode
}

export const UserStatesProvider: FC<Props> = ({children}) => {
    const [currentGameId, setCurrentGameId] = useState<string | null>();
    const [assistantId, setAssistantId] = useState<string | null>();
    const [crtUserId, setCrtUserId] = useState<string>('');
    const [messages, setMessages] = useState([]);

    const [difficultyLevelCtx, setDifficultyLevelCtx] = useState<any>(null); 
    const [chessyPersonalityCtx, setChessyPersonalityCtx] = useState<any>(null);
    const [helpLevelCtx, setHelpLevelCtx] = useState<any>(null);

    //WAY TO CHECK IF THE APP IS RECORDING, SINCE RECORDING ELEMENT IS NOW SEPARATED FROM CHESSBOARD AND REST OF FUNCTIONALITIES
    const [isRecording, setIsRecording] = useState(false);
    
    const [userColorCtx, setUserColorCtx] = useState<string>('White');
    
    return (
      <UserStatesContext.Provider
        value={{
          currentGameId,
          setCurrentGameId,
          assistantId,
          setAssistantId,
          crtUserId,
          setCrtUserId,
          messages,
          setMessages,
          difficultyLevelCtx,
          setDifficultyLevelCtx,
          chessyPersonalityCtx,
          setChessyPersonalityCtx,
          helpLevelCtx,
          setHelpLevelCtx,
          isRecording,
          setIsRecording,
          setUserColorCtx,
          userColorCtx
        }}
      >
        {children}
      </UserStatesContext.Provider>
    );
}
'use client'
import { Message as MessageFile } from "openai/resources/beta/threads/messages";
import { Thread } from "openai/resources/beta/threads/threads";
import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { style } from "../testPage/data";

const TestContext = createContext<any>(null);

export default TestContext;

interface Props {
    children: ReactNode
}

export const TestProvider: FC<Props> = ({children}) => {
    
    const [PGN_strings_array, set_PGN_strings_array] = useState<string>('');
    const [questions, set_questions] = useState<(string | Blob)[]>([]);
    const [number_of_games, set_number_of_games] = useState<number>(0);
    const [start_active, set_start_active] = useState(false);
    const [reset_active, set_reset_active] = useState(false);
    const [chessy_style, set_chessy_style] = useState(style[0]);
    const [test_title, set_test_title] = useState<string>('');
    const [model, set_model] = useState<string>('gpt-4o');

    useEffect(()=>{
       if(PGN_strings_array.length>0 && questions.length>0  && number_of_games>0 ){
        set_start_active(true);
       } else if (PGN_strings_array.length==0 || questions.length>0 || number_of_games<1 ){
        set_start_active(false);
       }

       if(PGN_strings_array.length>0 || questions.length>0 || number_of_games>0){
        set_reset_active(true);
       }
       else if(PGN_strings_array.length==0 && questions.length==0 && number_of_games<1){
        set_reset_active(false);
       }
    },[PGN_strings_array, questions, number_of_games])
    return (
      <TestContext.Provider
        value={{
          PGN_strings_array,
          set_PGN_strings_array,
          questions, 
          set_questions,
          number_of_games,
          set_number_of_games,
          start_active,
          reset_active,
          chessy_style,
          set_chessy_style,
          test_title,
          set_test_title,
          model,
          set_model,
        }}
      >
        {children}
      </TestContext.Provider>
    );
}
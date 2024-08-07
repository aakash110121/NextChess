import TestContext from "@/app/context/testContext";
import { useContext, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FiDivide, FiSend } from "react-icons/fi";
import { style } from "../data";

interface ModalProps {
  isOpened: boolean,
  handleIsOpened: ()=>void,
  startTest: ()=>void,
}

export default function NewTestModal({isOpened, handleIsOpened, startTest}:ModalProps){
    const {
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
    } = useContext(TestContext)

    const [question, setQuestion] = useState<string>('');
    const [pgnArray, setPgnArray] = useState<string>('');
    const [chessyStyle, setChessyStyle] = useState(style[0]);

    const handleChange = (event:any) => {
      const selectedStyle = style.find(item => item.id === event.target.value);
      setChessyStyle(selectedStyle!);
      set_chessy_style(selectedStyle!);
    };

    function parseChessNotation(notation: string): string[] {
        // Remove everything that ends with a '.'
        let notationClean = notation.replace(/\d+\./g, '');
        
        // Remove everything between curly brackets including curly brackets
        notationClean = notationClean.replace(/\{.*?\}/g, '');

        console.log("NOTATION: ",notationClean);
        
        // Split the notation into individual moves
        let moves = notationClean.split(' ');
        
        // Remove the last element (game result)
        if(['1-0', '0-1', '1/2-1/2'].includes(moves[moves.length-1])){
            moves.pop();
        }
        return moves.filter((item, idx)=>item!=='');;
    }
    
      function handleFormSubmit(){

      }
      const handleSubmit = (e:any) => {
        e.preventDefault();
        // Call the handler function with formData
        handleFormSubmit();
      };

      const adjustHeight = (e: any) => {
        // console.log("Style height: ", e.target.scrollHeight);
        if (e.target.value.length < question.length) {
          e.target.style.height = '24px';
        }
        e.target.style.height = `${e.target.scrollHeight}px`;
      };
    
      const textareaRef = useRef<any>();
      const textareaPgnRef = useRef<any>();
      const resetTextareaHeight = () => {
        if (textareaRef.current) {
          textareaRef.current.style.height = '24px';
        }
      };
      const resetPgnTextareaHeight = () => {
        if (textareaRef.current) {
          textareaRef.current.style.height = '24px';
        }
      };

      function handleSaveQuestion(){
        if (!question || question.length == 0) return;
        set_questions([...questions, question]);
        setQuestion('');
      }

      function handleSavePgn(){
        if (!pgnArray || pgnArray.length == 0) return;
        const movesList = parseChessNotation(pgnArray);
        console.log("MOVES: ", movesList);
        set_PGN_strings_array(pgnArray);
        setPgnArray('');
      }


      function handleReset(){
        console.log("HANDLEEEEEEEE RESEEET!!!");
        set_PGN_strings_array('');
        set_questions([]);
        set_number_of_games(0);
      }

      function handleSave(){
        startTest();
      }

      const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      //const audioUrl = URL.createObjectURL(audioBlob);
      //setAudioURL(audioUrl);
      audioChunksRef.current = [];
      set_questions((prevQ:any)=>[...prevQ, audioBlob]); // Call transcription after stopping recording
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  function handleRecording(){
    if(isRecording){
        stopRecording();
    }
    else{
        startRecording();
    }
  }

  const playAudio = (index: number) => {
    if (questions[index] && questions[index] instanceof Blob) {
      const audioURL = URL.createObjectURL(questions[index]);
      const audio = new Audio(audioURL);
      audio.play();

      // Clean up the URL object after the audio ends
      audio.onended = () => {
        URL.revokeObjectURL(audioURL);
      };
    } else {
      console.error('Audio not found at index:', index);
    }
  };

  function handleChangeModel(event:any){
    set_model(event.target.value);
  }
    return (
      <div className="fixed top-0 right-0 bottom-0 left-0 p-8 bg-white flex">
        <CgClose
          onClick={() => handleIsOpened()}
          className="absolute top-2 right-2 h-6 w-6"
        ></CgClose>
        <div className="flex-1 space-y-4 flex flex-col">
          <label>Enter number of Games</label>
          <input
            className={` w-[200px] py-2 h-[42px] p-2 pl-4 shadow-[0_0_10px_rgba(0,0,0,0.10)] rounded-md border bg-white  border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            type="number"
            value={number_of_games}
            onChange={(e: any) => set_number_of_games(e.target.value)}
          ></input>
          <label htmlFor="chessyStyle">Choose Chessy Personality: </label>
          <select
            id="chessyStyle"
            value={chessyStyle.id}
            onChange={handleChange}
            className=" w-[200px] py-2 h-[42px] p-2 pl-4 shadow-[0_0_10px_rgba(0,0,0,0.10)] rounded-md border bg-white  border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {style.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <label>
            Enter PGN string (Format: 1. e4 d6 2. Nc3 c5 3. d4 cxd4 4. h4 g6 5.
            Qxd4 e5 6. Kd2 exd4 7. Nd5)
          </label>
          <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)]">
            <textarea
              value={pgnArray}
              tabIndex={0}
              ref={textareaPgnRef}
              data-id="root"
              style={{
                height: "24px",
                maxHeight: "200px",
                overflowY: "hidden",
              }}
              placeholder="Enter PNG..."
              className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-9 focus:ring-0 focus-visible:ring-0 pl-2 md:pl-0"
              onChange={(e) => {
                setPgnArray(e.target.value);
                adjustHeight(e);
              }}
            ></textarea>
            <button
              disabled={pgnArray?.length === 0}
              onClick={() => handleSavePgn()}
              type="button"
              className="absolute p-1 rounded-md flex items-center justify-center bottom-1.5 md:bottom-2.5 bg-[#124429] disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
            >
              <FiSend className="h-4 w-4 mr-[2px] mt-[1px] text-white" />
            </button>
          </div>
          <label>Record Sound Question </label>
          <div
            onClick={() => handleRecording()}
            className={`h-[42px] w-[200px] flex items-center cursor-pointer transition-all duration-200 justify-center rounded-md ${
              isRecording ? "bg-red-600" : "bg-green-600"
            } text-white`}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </div>
          <label>Enter textual question</label>
          <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)]">
            <textarea
              value={question}
              tabIndex={0}
              ref={textareaRef}
              data-id="root"
              style={{
                height: "24px",
                maxHeight: "200px",
                overflowY: "hidden",
              }}
              placeholder="Add question..."
              className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-9 focus:ring-0 focus-visible:ring-0 pl-2 md:pl-0"
              onChange={(e) => {
                setQuestion(e.target.value);
                adjustHeight(e);
              }}
            ></textarea>
            <button
              disabled={question?.length === 0}
              onClick={() => handleSaveQuestion()}
              type="button"
              className="absolute p-1 rounded-md flex items-center justify-center bottom-1.5 md:bottom-2.5 bg-[#124429] disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
            >
              <FiSend className="h-4 w-4 mr-[2px] mt-[1px] text-white" />
            </button>
          </div>
        </div>
        <div className=" flex p-4">
          <div className="p-6 rounded-md text-[16px] border-[1px] border-black/30 shadow-md shadow-black/20 text-center w-[350px] h-[600px] flex flex-col gap-y-2">
            <div className="w-full flex">
              <input
                placeholder="Enter Test Title"
                value={test_title}
                onChange={(e) => set_test_title(e.target.value)}
                className="text-2xl px-2 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              ></input>
            </div>
            <div className="w-full text-start pt-2">
               Selected model: 
               <select
                id="gptModel"
                value={model}
                className="bg-white  border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition px-2 ml-2"
                onChange={handleChangeModel}
              >
                {['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'].map((item,idx:number) => (
                  <option key={idx} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full text-start pt-4">
              Number of Games: {number_of_games || 0}
            </div>
            <div className="w-full text-start pt-4">
              Chessy Personality: {chessy_style.name}
            </div>
            <div className="w-full text-start pt-4 flex-col">
              PGN String:
              <div className="text-[14px] break-words max-h-[210px] overflow-auto">
                {PGN_strings_array || ""}
              </div>
            </div>
            <div className="w-full text-start pt-4 flex-col flex-1 overflow-auto">
              Questions Array:
              <div className="text-[14px]">
                <>
                  {questions.map((quest: string | Blob, idx: number) =>
                    quest instanceof Blob ? (
                      <div
                        className="w-full border-[1px] border-black/20 p-2"
                        key={idx}
                      >
                        <div className="p-1">
                          <span>Question {idx + 1}</span>
                        </div>
                        <div className="flex gap-x-1">
                          <div
                            onClick={() => {
                              playAudio(idx);
                            }}
                            className="rounded-md w-1/2 cursor-pointer flex p-1 justify-center items-center text-[16px] bg-green-600 text-white"
                          >
                            Play
                          </div>
                          <div
                            onClick={() => {
                              set_questions(
                                questions.filter(
                                  (q: any, indx: number) => indx !== idx
                                )
                              );
                            }}
                            className="rounded-md w-1/2 cursor-pointer flex p-1 justify-center items-center text-[16px] bg-red-600 text-white"
                          >
                            Delete
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="w-full border-[1px] border-black/20 p-2"
                        key={idx}
                      >
                        <div className="p-1">
                          <span>{quest}</span>
                        </div>
                        <div
                          onClick={() => {
                            set_questions(
                              questions.filter(
                                (q: any, indx: number) => indx !== idx
                              )
                            );
                          }}
                          className="rounded-md cursor-pointer flex p-1 justify-center items-center text-[16px] bg-red-600 text-white"
                        >
                          Delete
                        </div>
                      </div>
                    )
                  )}
                </>
              </div>
            </div>
            <div className="flex gap-x-1">
              <div
                onClick={() => {
                  if (start_active) handleSave();
                }}
                className={`w-1/2 flex p-2 justify-center rounded-md transition duration-200 ${
                  start_active
                    ? "text-white bg-green-600"
                    : "text-white bg-green-100"
                }`}
              >
                Start Test
              </div>
              <div
                onClick={() => {
                  if (reset_active) handleReset();
                }}
                className={`w-1/2 flex p-2 justify-center rounded-md transition duration-200 ${
                  reset_active
                    ? "text-white bg-red-600"
                    : "text-white bg-red-100"
                }`}
              >
                Reset Test
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
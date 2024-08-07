import { SiOpenai } from "react-icons/si";
import { HiUser } from "react-icons/hi";
import { TbCursorText } from "react-icons/tb";
import Image from 'next/image'

const Message = (props: any) => {
  const { message } = props;
  const { role, content } = message;
  //const text = content[0].text;
  const text = content[0].text.value;
  const isUser = role === "user";

  return (
    <div
      className={`group w-full text-gray-800  border-b border-black/10  ${
        isUser ? "" : "bg-gray-50"
      }`}
    >
      <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl flex lg:px-0 m-auto w-full">
        <div className="flex flex-row gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 lg:px-0 m-auto w-full">
        <div className="w-10 flex flex-col relative items-center">
            <div className={`relative h-10 w-10 p-1 rounded-sm bg-black/75 ${isUser? '' : 'bg-white border-black/75 border-[1px] p-[2px]'} text-white flex items-center justify-center text-opacity-100r`}>
              {isUser ? (
                <HiUser className="h-6 w-6 text-white" />
              ) : (
                <Image src='/chessy/Chessvia-Favicon-Gold.png' className="text-white h-full w-full" width={100} height={100} alt='chessyaiFavicon'/>
              )}
            </div>
            <div className="text-xs mt-1 text-black font-medium">
              {isUser ? "You" : "Chessy"}
            </div>
            <div className="text-xs flex items-center justify-center gap-1 absolute left-0 top-2 -ml-4 -translate-x-full group-hover:visible !invisible">
              <button
                disabled
                className="text-gray-300 "
              ></button>
              <span className="flex-grow flex-shrink-0">1 / 1</span>
              <button
                disabled
                className="text-gray-300 "
              ></button>
            </div>
          </div>
          <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
            <div className="flex flex-grow flex-col gap-3">
              <div className="min-h-20 flex flex-col items-start gap-4 whitespace-pre-wrap break-words">
                <div className="markdown prose w-full break-words">
                  {!isUser && text === null ? (
                    <TbCursorText className="h-6 w-6 animate-pulse" />
                  ) : (
                    <p>{text}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
import Image from 'next/image'
import React, { Dispatch, SetStateAction } from 'react'
import down from "../../../public/down.svg";
import Accordion from './Accordion';

type Props = {
    question: string,
    answer: string,
    idx: number
}
interface LayoutProps {
    handleClick: React.MouseEventHandler<HTMLButtonElement>,
    isSomeActive: any,
    turn: boolean[],
    setTurn: Dispatch<SetStateAction<boolean[]>>,
    data: Props[]
}

const AccordionContainer = ({ handleClick, isSomeActive, data, turn, setTurn }: LayoutProps) => {
    return (
        <div className='items-center flex flex-col lg:mt-7 w-full max-w-[1000px] my-5 px-4'>
            <span className='text-5xl md:text-3xl font-semibold text-center mb-4'>
                Frequently Asked Questions
            </span>
            <div className='flex w-full mb-4 justify-end mt-4'>
                <button
                    className="flex items-center border-[1px] border-[#124419] space-x-1 text-sm font-bold lg:text-base lg:space-x-2 py-2 px-4 bg-slate-50"
                    onClick={handleClick}
                >
                    <span className="text-[#124419] min-w-fit text-ellipsis"> {!isSomeActive ? "Open All" : "Close All"}</span>
                    <div
                        className={
                            "relative transition-all ease-in-out duration-200 " +
                            (isSomeActive ? " rotate-180" : "rotate-0")
                        }
                    >
                        <Image src={down} alt="" width={30} height={30} />
                    </div>
                </button>
            </div>

            {data.map((el, i) => {
                return (
                    <div className='w-full' key={"questions" + i}>
                        <Accordion
                            question={el.question}
                            answer={el.answer}
                            turn={turn}
                            setTurn={setTurn}
                            idx={el.idx}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default AccordionContainer
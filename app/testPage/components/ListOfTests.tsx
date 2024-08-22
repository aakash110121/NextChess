import { IoChevronBackOutline } from "react-icons/io5";

export default function ListOfTests({tests, handleOpenTestList}:any){
    const goToTest = (testId:string) => {
        window.open(`https://chessstaging.site/test/${testId}`, '_blank');
    };

   return(
    <div className="fixed bg-white z-[100] w-full h-screen p-4 overflow-auto">
        <IoChevronBackOutline className="w-8 h-8 sticky top-0 bg-white hover-gray-400" onClick={()=>handleOpenTestList()}></IoChevronBackOutline>
        <div className="text-center text-2xl pb-5">Tests</div>
        <div className="w-full flex justify-center">
            <div className="w-full max-w-[800px] space-y-3 overflow-auto">
            {tests.map((itm:any,idx:any)=>(
                <div onClick={()=>{goToTest(itm.test_id)}} key={idx} className="w-full rounded-md shadow-md grid grid-flow-row py-3 border-[1px] border-black/20 px-4 cursor-pointer hover:bg-gray-200">
                     <div className="text-black/70 text-lg">{itm.test_title}</div>
                     <div className="text-black/70 ">Model: {itm?.assistant_model || 'gpt-4o'}</div>
                     <div className="text-black/70 ">Cost: {itm.test_total_cost.toFixed(4)}$</div>
                     <div className="text-black/70 ">Personality: {itm.chessy_personality}</div>
                     <div className="text-black/70 ">Games: {itm.test_total_games}</div>
                     <div className="text-black/70 ">Messages: {itm.test_total_messages}</div>
                </div>
            ))}
            </div>
        </div>
    </div>
   )
}
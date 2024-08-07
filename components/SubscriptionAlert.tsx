import { useRouter } from "next/navigation";
import { LiaCrownSolid } from "react-icons/lia";
export default function SubscriptionAlert(){
  const router = useRouter();
    return (
      <div
        id="GoPremiumComponent"
        className="absolute hidden group-hover:inline -right-1 top-12 w-[300px] rounded-md p-4 bg-[#EEEEEE] before:absolute before:content-[''] before:w-3 before:h-3 before:bg-[#EEEEEE] 
        before:rotate-45 before: before:right-3 before:-top-1 text-black z-50"
      >
        <div className="w-full flex justify-center">
          <LiaCrownSolid
            color="#59089b"
            className="w-6 h-6 "
          />
        </div>
        <div className="w-full text-center text-[22px] font-semibold">
             Upgrade To Premium
        </div>
        <div className="w-full text-center">
             <span>Youve hit your limit. Please chose one of our paid plans to continue with assistant.</span>
        </div>
        <button onClick={()=>{router.push('/pricing')}} className="bg-[#59089b] hover:bg-[#52089b] w-full text-white rounded-md p-3 font-semibold mt-2">Go Premium</button>
      </div>
    );
}
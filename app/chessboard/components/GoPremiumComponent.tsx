import { LiaCrownSolid } from "react-icons/lia";
export default function GoPremiumComponent(){
    return (
      <div
        id="GoPremiumComponent"
        className="h-full w-full bg-white rounded-lg max-w-[760px] py-5"
      >
        <div className="w-full flex justify-center">
          <LiaCrownSolid
            color="#59089b"
            className="w-6 h-6 md:w-8 md:h-8 lg:h-10 lg:w-10"
          />
        </div>
        <div className="w-full text-center text-[22px]">
             Upgrade To Premium
        </div>
        <div className="w-full text-center">
             <span>Youve hit your limit. Please chose one of our paid plans to continue with assistant.</span>
        </div>
      </div>
    );
}
import { Metadata } from "next";
import ChessboardSidebarLeft from "@/components/SidebarLeftAlternative";
import { getSession, logout } from "@/lib/authentication";
import {redirect} from 'next/navigation';
import LandingNavBar from "@/components/LandingNavBar";
import SidebarLeftMobile from "@/components/SidebarLeftMobile";



export default async function ChessboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   
  async function lout(data: FormData) {
    "use server"
     await logout()
     redirect('/');
  }
  
  const session = await getSession();
  if(!session){
    return (
      <>
        <div id="learnmoreLayout" className="w-full h-screen flex-col bg-gray-100">
             {children}
        </div>
      </>
    );
  }
  
  return (
    <>
      <div className="h-screen w-full flex flex-col md:flex-row bg-gray-100 overflow-y-auto md:overflow-hidden overflow-x-hidden ">
          <div className="hidden md:block"><SidebarLeftMobile lout={lout} /></div>
           {children}
      </div>
    </>
  );
}
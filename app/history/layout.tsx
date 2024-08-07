import { Metadata } from "next";
import ChessboardSidebarLeft from "@/components/SidebarLeftAlternative";
import { logout } from "@/lib/authentication";
import {redirect} from 'next/navigation';
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
  return (
    <>
      <div className="h-screen w-full flex flex-col md:flex-row bg-gray-100 overflow-y-auto md:overflow-hidden overflow-x-hidden ">
          <div className="hidden md:block"><SidebarLeftMobile lout={lout} /></div>
           {children}
          {/*<ChessboardSidebarRight
          // isRecording={isRecording}
          // transcript={transcript}
          // response={response}
          />*/}
      </div>
    </>
  );
}

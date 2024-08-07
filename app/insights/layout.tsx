
import { Metadata } from "next";
import ChessboardSidebarLeft from "@/components/Chessboard-sidebar-L";
import { logout } from "@/lib/authentication";
import {redirect} from 'next/navigation';



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
      <div className="h-full w-full bg-gray-200 min-h-screen">
          <ChessboardSidebarLeft lout={lout} />
           {children}
      </div>
    </>
  );
}
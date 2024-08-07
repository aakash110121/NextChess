import { Metadata } from "next";
import ChessboardSidebarLeft from "@/components/SidebarLeftAlternative";
import { logout } from "@/lib/authentication";
import {redirect} from 'next/navigation';
import SidebarLeftMobile from "@/components/SidebarLeftMobile";
import { TestProvider } from "../context/testContext";



export default async function ChessboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   
  return (
    <>
       <TestProvider> 
           {children}
        </TestProvider>  
    </>
  );
}

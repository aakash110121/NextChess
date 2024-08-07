
import { Metadata } from "next";
import ChessboardSidebarLeft from "@/components/Chessboard-sidebar-L";
import { getSession, logout } from "@/lib/authentication";
import {redirect} from 'next/navigation';
import HistoryClient from "./historyClient";
import { db } from "@/utils/auth/FirebaseCredentials";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { parseGames } from "./methods/parseGames";
import { unstable_cache } from "next/cache";

export const dynamic = 'force-dynamic'


export default async function ChessboardLayout(){
    const session = await getSession();
    if (!session) redirect("/login");
    const userProfile = doc(db, "UserProfile", session.user.uid);
    const userProfileSnap = await getDoc(userProfile);
    const chessName = userProfileSnap?.data()?.chessComUsername ? userProfileSnap?.data()?.chessComUsername : 'You';
    
    
    const gamesRef = collection(db, 'Game')
    const searchQuery = query(gamesRef, where("userId", "==", session.user.uid), orderBy('timeCreated', 'desc'), limit(5));
    //2 const gamesList = await parseGames(searchQuery);
    const gamesList = await getDocs(searchQuery);
    //2 const gamesListParsed:any = [...gamesList];
    const gamesListParsed:any = [];
    {gamesList.forEach((doc)=>{
        const data = doc.data();
        const id = doc.id;
       
        //@ts-ignore
        gamesListParsed.push({...data, 'gameId':id});
    })}
    
    async function lout(data: FormData) {
        "use server"
         await logout()
         redirect('/');
      }
    return(
        <HistoryClient gamesArray={gamesListParsed} session={session} chessName={chessName} lout={lout}></HistoryClient>
    )
}
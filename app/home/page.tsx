import { getSession, logout } from "@/lib/authentication";
import { db } from "@/utils/auth/FirebaseCredentials";
import { doc, getDoc, collection, query, where, orderBy, getDocs, count, limit } from "firebase/firestore";
import { redirect } from "next/navigation";
import HomeClient from "./clientPage";

export const dynamic = 'force-dynamic'

const convertTimestamp = (timestamp:number) => {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
};

async function getUserGamesStats(userId: string){
  const gamesRef = collection(db, 'Game')
  const searchQuery = query(
    gamesRef,
    where("userId", "==", userId),
    where("endTime", ">", 0), // Check if endTime exists and is a positive number
    orderBy("endTime", "asc") // Order by endTime from oldest to latest
  );
  const gamesList = await getDocs(searchQuery);
  const chartPlotObject:{endTime: number, ratingAfterGameEnd:number}[]=[];
  gamesList.forEach((doc)=>{
    const data = doc.data();
    //if(chartPlotObject.length==0){
      //chartPlotObject.push({endTime:data.timeCreated/1000, ratingAfterGameEnd: data.ratingBefore || 1000}) //CHART STARTING POINT
    //}
    chartPlotObject.push({endTime: data.endTime, ratingAfterGameEnd: data.ratingAfter})
  })
  return chartPlotObject;
}

async function countUserGames(userId:string) {
    const gamesRef = collection(db, 'Game')
    const searchQuery = query(gamesRef, where("userId", "==", userId));
    const gamesList = await getDocs(searchQuery);

    let numbersObject = {
      played: gamesList.size,
      won:0,
      lost:0,
      draw:0,
      inProgress:0,
    }

    let gamesResults:any = [];

    gamesList.forEach((doc)=>{
      const data = doc.data();
      if(data.isCompleted){
        if(data.isCompleted[1]=='w'){
          numbersObject.won+=1;
          gamesResults.push({status:1, date: convertTimestamp(data.timeCreated)})
        }
        else if(data.isCompleted[1]=='l'){
          numbersObject.lost+=1;
          gamesResults.push({status:-1, date: convertTimestamp(data.timeCreated)})
        }
        else{
          numbersObject.draw+=1;
          gamesResults.push({status:0, date: convertTimestamp(data.timeCreated)})
        }
      }
      else{
        numbersObject.inProgress+=1;
      }
    })

    return {numbersObject, gamesResults};
  }

export default async function HomePage(){
  const session = await getSession();
  if(!session) redirect('/login');
  const userProfile = doc(db, "UserProfile", session.user.uid);
  const userProfileSnap = await getDoc(userProfile);
  const currentGameId = userProfileSnap?.data()?.userCurrentGame;
  if(!currentGameId) {
    redirect('/form');
  }
  const user={
    id:userProfileSnap?.id,
    chessName:userProfileSnap?.data()?.chessComUsername, 
    rating:userProfileSnap?.data()?.rating ? userProfileSnap?.data()?.rating : 1000, 
    email:session.user.email,
    currentGame:currentGameId,
    ...(userProfileSnap?.data()?.hasOwnProperty("subscription") && { subscription: userProfileSnap?.data()?.subscription }),
    ...(userProfileSnap?.data()?.hasOwnProperty("ELO") && { ELO: userProfileSnap?.data()?.ELO })
  };

  const {numbersObject: gameNumbers, gamesResults} = await countUserGames(user.id);
  // console.log("GAMES PLAYED: ", gameNumbers);
  // console.log("GAMES RESULTS: ", gamesResults);

  let subscr:any = {}
  if(user.subscription){
    const subscriptionRef = doc(db, "Subscription", userProfileSnap.data()?.subscription);
    const subscriptionDoc = await getDoc(subscriptionRef);
    subscr = {"id": subscriptionDoc.id, ...subscriptionDoc.data()};
  }

  //if(!subscriptionDoc || Math.floor(Date.now()/1000)>subscriptionDoc.data()?.end || subscriptionDoc.data()?.allowedTime<=0) redirect('/pricing');
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

   const chartPlotObject = await getUserGamesStats(session.user.uid);

    async function lout(data: FormData) {
      "use server"
       await logout()
       redirect('/');
    }
  return(
    <>
      {(session && currentGameId) ?
      
      <HomeClient lout={lout} user={user} gameNumbers={gameNumbers} gamesArray={gamesListParsed} chartPlot={chartPlotObject}></HomeClient> :
      <div>You must be logged in...</div>}
    </>
  )
}
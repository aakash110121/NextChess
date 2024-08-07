
import { db } from '@/utils/auth/FirebaseCredentials';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ClientPage from './clientPage';

export default async function Test({ params }: { params: { id: string } }) {
    if(!params.id){
        return <h1>You need to provide test id</h1>
    }

    const gamesRef = collection(db, 'TestGame');
    const searchQuery = query(gamesRef, where("test_id", "==", params.id));
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
    console.log(params.id);
    return <ClientPage gamesDataList={gamesListParsed}></ClientPage>
  }

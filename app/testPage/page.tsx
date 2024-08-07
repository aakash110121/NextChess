import { getSession, logout } from "@/lib/authentication";
//import ClientFormPage from "./formPage";
import { redirect } from "next/navigation";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/utils/auth/FirebaseCredentials";
import axios from "axios";
import { json } from "stream/consumers";
import baseURL from "@/baseUrl";
import TestPage from "./testPage";


export default async function Account() {
  const session = await getSession();
  const testRef = collection(db, 'Test');
  const searchQuery = query(testRef, orderBy('created_time', 'desc'));

  const testList = await getDocs(searchQuery);
 
  //2 const gamesListParsed:any = [...gamesList];
  const testListParsed:any = [];
  {testList.forEach((doc)=>{
      const data = doc.data();
      const id = doc.id;
      
      //@ts-ignore
      testListParsed.push({...data, 'test_id':id});
  })}
  
 console.log(testListParsed);

  return(
    <>
     {session ? 
     <TestPage userId={session.user.uid} testList={testListParsed}></TestPage> :
     <div>You must be logged in...</div>
     }
    </>
  )
}

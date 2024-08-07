import { getSession } from "@/lib/authentication";
import ChatClient from "./pageClient";
import { redirect } from "next/navigation";
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import { db } from "@/utils/auth/FirebaseCredentials";
import baseUrl from "@/baseUrl";

export const dynamic = 'force-dynamic'

const createChatAssistant = async () =>{
    const chatAssistant = await fetch(`${baseUrl}/api/chat_assistant/create`,{
        method:'GET',
        cache:'no-store',
        headers: {
          'Content-Type': 'application/json' // Specify content type as JSON
        },
      })
    if (!chatAssistant.ok){
        throw Error;
    }

    const assistant = await chatAssistant.json();
    return assistant;
}

export default async function ChatPage(){
    const session = await getSession();
    if(!session) redirect('/login');
    const userProfile = doc(db, "UserProfile", session.user.uid);
    const userProfileSnap = await getDoc(userProfile);
    let userData = userProfileSnap.data();
    userData = {...userData, email: session.user.email, id: session.user.uid}

    if(!userProfileSnap.data()?.chatAssistant){
       const assistant = await createChatAssistant();
       // console.log("ASSISTANT: ", assistant);
       if(assistant.assistant){
        userData = {...userData, chatAssistant: assistant.assistant}
        try {
            await setDoc(
                userProfile,
                {
                  chatAssistant: assistant.assistant,
                },
                { merge: true }
            ); 
        } catch (error) {
          location.reload();
        }
       }
    }
    const conversationsRef = collection(db, "Conversation");
    const searchQuery = query(conversationsRef, where("userId", "==", session.user.uid), orderBy('timeCreated', 'desc'));

    const conversationsList = await getDocs(searchQuery);
    // console.log("conversationsList size: ", conversationsList.size);
    const convosListParsed:any = [];
    {conversationsList.forEach((doc)=>{
        const data = doc.data();
        const id = doc.id;
       
        convosListParsed.push({...data, 'id':id});
    })}
    return(
        <ChatClient conversationsList={convosListParsed} userData={userData}></ChatClient>
    )
}
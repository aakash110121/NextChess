import { getSession, logout } from "@/lib/authentication";
//import ClientFormPage from "./formPage";
import { redirect } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/auth/FirebaseCredentials";
import axios from "axios";
import { json } from "stream/consumers";
import baseURL from "@/baseUrl";
import LearnMore from "./learnmoreClient";

const getUsersProfileData = async (session:any) => {
    const docRef = doc(db, "UserProfile", session.user.uid);
    const userProfile = await getDoc(docRef);
    return userProfile.data();
}

const getUserSubscriptionPlan = async (subscriptionId:any) => {
    const docRef = doc(db, "Subscription", subscriptionId);
    const subscriptionPlan = await getDoc(docRef);
    return subscriptionPlan.data();
}

export default async function Account() {
  const session = await getSession();
  if(!session) {
    return(
      <>
     <LearnMore></LearnMore> 
      </>
    )
  }
  

  const userProfile=await getUsersProfileData(session);

  async function lout(data: FormData) {
    "use server"
     await logout()
     redirect('/');
  }

  return(
    <>
     {session ? 
     <LearnMore lout={lout}></LearnMore> :
     <div>You must be logged in...</div>
     }
    </>
  )
}

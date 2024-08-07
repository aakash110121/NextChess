import { getSession } from "@/lib/authentication";
import UserInputPage from "./formPage";
//import ClientFormPage from "./formPage";
import { redirect } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/auth/FirebaseCredentials";

export default async function FormPage() {
  const session = await getSession();
  // console.log("SESION JE", session);
  if(!session) redirect('/login');

  const getUsersProfileData = async () => {
    const docRef = doc(db, "UserProfile", session.user.uid);
    const userProfile = await getDoc(docRef);
    return userProfile.data();
  }

  const userProfile=await getUsersProfileData();
  return(
    <>
     {session ? 
     <UserInputPage session={session} userProfile={userProfile}></UserInputPage> : 
     <div>You must be logged in...</div>}
    </>
  )
}

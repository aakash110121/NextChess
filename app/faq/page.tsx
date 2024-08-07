import { getSession, logout } from "@/lib/authentication";
//import ClientFormPage from "./formPage";
import { redirect } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/auth/FirebaseCredentials";
import ClientPage from "./clientPage";

export default async function FormPage() {
  const session = await getSession();
  // console.log("SESION JE", session);
  if(!session) {
    return(
      <>
       { 
       <ClientPage/>
       }
      </>
    )
  }

  const getUsersProfileData = async () => {
    const docRef = doc(db, "UserProfile", session.user.uid);
    const userProfile = await getDoc(docRef);
    return userProfile.data();
  }

  const userProfile=await getUsersProfileData();
  async function lout(data: FormData) {
    "use server"
     await logout()
     redirect('/');
  }
  return(
    <>
     {session ? 
     <ClientPage lout={lout}/> : 
     <div>You must be logged in...</div>}
    </>
  )
}

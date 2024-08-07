import PageClient from "./pageClient";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/utils/auth/FirebaseCredentials";
import { getSession, logout } from "@/lib/authentication";
import { redirect } from "next/navigation";
import { predefinedQuestions,offeredVoices, tableColors, offeredSounds } from "./settingsData";
import { NoSubscription, BronzeSub, SilverSub, GoldSub, PlatinumSub } from "@/lib/subscriptionPermissions";

const getUsersProfileData = async (session:any) => {
    const docRef = doc(db, "UserProfile", session.user.uid);
    const userProfile = await getDoc(docRef);
    return userProfile.data();
}

const getUsersBoardSettings = async (userId:any) =>{
    const settingsRef = doc(db, "BoardSettings", userId);
    const settingsDoc = await getDoc(settingsRef);
    if(settingsDoc.exists()) return settingsDoc;
    
    await setDoc(settingsRef,{
        boardColor:tableColors[0],
        predefinedQuestions:[...predefinedQuestions],
        assistantVoice: offeredVoices[0],
        notation:'text',
        capturedPiecesVisibility:'visible',
        moveSound: offeredSounds[0].sound,
        captureSound: offeredSounds[1].sound,
        checkSound: offeredSounds[2].sound,
        chessyVoiceSound: 'on',
    });
    

    const settingsDocNew = await getDoc(settingsRef);
    return settingsDocNew;
}

export default async function Page(){
    const session = await getSession();
    if (!session) redirect('/login');

    const settingsDocument = await getUsersBoardSettings(session.user.uid);
    if (!settingsDocument.exists()){
       logout();
       redirect('/login');
    }
    const userDoc = doc(db, "UserProfile", session.user.uid);
    const user = await getDoc(userDoc);
    let subscriptionTier:any = NoSubscription;
    if(user.data()?.subscription){
        const subscriptionRef = doc(db, "Subscription", user.data()?.subscription);
        const subscriptionDoc = await getDoc(subscriptionRef);
        if(subscriptionDoc.exists()){
            let subTier = subscriptionDoc.data()?.productName || null;
            if(subTier){
                subTier=subTier.split(' ')[1];
                switch(subTier){
                    case 'Bronze': {
                        subscriptionTier = BronzeSub;
                        break;
                    }
                    case 'Silver': {
                        subscriptionTier = SilverSub;
                        break;
                    }
                    case 'Gold': {
                        subscriptionTier = GoldSub;
                        break;
                    }
                    case 'Platinum': {
                        subscriptionTier = PlatinumSub;
                        break;
                    }
                    default: subscriptionTier = NoSubscription;
                }
            }
        }
      }

    // console.log("Your sub tier: ", subscriptionTier);

    const settings = settingsDocument.data();
    async function lout(data: FormData) {
        "use server"
         await logout()
         redirect('/');
      }
    return(
        <PageClient settings={settings} user={session.user.uid} subTier={subscriptionTier} lout={lout}></PageClient>
    )
}
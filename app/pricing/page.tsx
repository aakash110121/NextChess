import { getSession } from "@/lib/authentication";
import PricingTable from "./pageClient";
import { redirect } from "next/navigation";
import { doc,getDoc } from "firebase/firestore";
import { db } from "@/utils/auth/FirebaseCredentials";

export default async function Page(){
    const session = await getSession();
    if (!session) redirect("/login");
    const userProfile = doc(db, "UserProfile", session.user.uid);
    const userProfileSnap = await getDoc(userProfile);
    let subscription:any = {};
    if(userProfileSnap.data()?.subscription) {
      const subscriptionRef = doc(db, "Subscription", userProfileSnap.data()?.subscription)
      subscription = await getDoc(subscriptionRef);
      subscription = {id:subscription.id, ...subscription?.data()};
    }
    //if (userProfileSnap.data()?.activeSubscription) redirect("/form");
    const userId = userProfile.id;
 
    return(
        <PricingTable userId={userId} subscription={subscription || {}}></PricingTable>
    )
}
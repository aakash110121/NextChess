
import { getSession } from "@/lib/authentication";
import PricingClient from "./PricingClient";
import axios from "axios";
import { redirect } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/auth/FirebaseCredentials";
import baseURL from "@/baseUrl";



export default async function Pricing(){
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
 
    const res = await fetch(`${baseURL}/api/stripe/products`,{method:'GET'})
    const data = await res.json();
    console.log("PRODUCTS: ", data);
    // console.log(data);
    //@ts-ignore
    return (
      <PricingClient userId={userId} subscription={subscription || {}} products={data?data : []}></PricingClient>
    );
}
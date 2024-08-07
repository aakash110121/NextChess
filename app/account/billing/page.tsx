import { getSession } from "@/lib/authentication";
//import ClientFormPage from "./formPage";
import { redirect } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/auth/FirebaseCredentials";
import AccountClient from "./pageClient";
import Stripe from "stripe";


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

//const getSubscriptionObject = async (subscriptionId:any) =>{
//  const subscriptionObject = await axios({
//    url:'/api/stripe/retrieve_subscription',
//    data:{
//      subscriptionId:subscriptionId,
//    },
//    method:'POST',
 // })
//}

const getInvoices = async (customerId:any) =>{
  const stripe = new Stripe(process.env.STRIPE_KEY || '');
   try {
    const invoices = await stripe.invoices.list({customer:customerId});
    return invoices;
  } catch (error) {
    return null;
  }
}

const getPaymentMethod = async (customerId: string) =>{
  const stripe = new Stripe(process.env.STRIPE_KEY || '');
    // console.log('Created Stripe instance.');

    try {
        const paymentMethod = await stripe.paymentMethods.list({
            customer:customerId,
            limit:1
        })
        return paymentMethod;
    } catch (error) {
        return null;
    }
}

export default async function Account() {
  const session = await getSession();
  if(!session) redirect('/login');
  
  
  const userProfile=await getUsersProfileData(session);
  const subscriptionPlan=userProfile?.subscription ? await getUserSubscriptionPlan(userProfile.subscription) : {}
  
  let invoices;
  if(userProfile?.customer) {
     invoices = await getInvoices(userProfile?.customer);
  }

  let paymentMethod;
  if(userProfile?.customer) {
    paymentMethod = (await getPaymentMethod(userProfile?.customer))?.data[0];
    if(!paymentMethod){
      paymentMethod=null;
    }
  }
  return(
    <>
     {session ? 
     <AccountClient session={session} userProfile={userProfile} subscription={subscriptionPlan} invoices={invoices ? invoices.data : {}} paymentMethod={paymentMethod}></AccountClient> : 
     <div>You must be logged in...</div>}
    </>
  )
}

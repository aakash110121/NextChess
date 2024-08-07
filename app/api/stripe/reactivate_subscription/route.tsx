import { db } from "@/utils/auth/FirebaseCredentials";
import { doc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request:NextRequest){
  const {subscriptionId, userId} = await request.json();
  if (!subscriptionId) {
    console.error('No subscription id provided. Exiting with an error response.');
    return NextResponse.json({ error: 'No subscription id provided' }, { status: 400 });
  }
  const stripe = new Stripe(process.env.STRIPE_KEY || '');
  let checkSubscriptionMetadata = false;
  try {
    const getSubscription = await stripe.subscriptions.retrieve(
        subscriptionId
    );
    if(getSubscription.metadata.userId==userId && (getSubscription.status == 'active' || getSubscription.status == 'trialing')) {
      checkSubscriptionMetadata=true;
    } 
  } catch (error) {
    NextResponse.json({error: 'Subscription not connected to user or is not active anymore'});
  }
  if(checkSubscriptionMetadata){
    try {
        const subscription = await stripe.subscriptions.update(
            subscriptionId,
            {
              cancel_at_period_end: false,
            }
        );
        const subscriptionRef = doc(db, "Subscription", subscriptionId);
        try {
            const updateSubscriptionDoc = await setDoc(subscriptionRef,{
                cancel_at_period_end:false,
            },
            {merge:true})
            return NextResponse.json(subscription);
        } catch (error) {
            return NextResponse.json({error:error});
        }
      } catch (error) {
        return NextResponse.json(error);
      }
  }
  
 return NextResponse.json({error:'Subscription not connected to user or is not active anymore'});
}
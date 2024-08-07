import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req:NextRequest){
   const {subscriptionId} = await req.json();
   if (!subscriptionId) return NextResponse.json({error:"Subscription id is not provided"}) 
   
   const stripe = new Stripe(process.env.STRIPE_KEY || '');

   try {
    const subscription = await stripe.subscriptions.retrieve(
        subscriptionId,
    )
    return NextResponse.json({subscription});
   } catch (error) {
    return NextResponse.json({error: error});
   }
   
}
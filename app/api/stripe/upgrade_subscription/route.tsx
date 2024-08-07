import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req:NextRequest){
    const {priceId, subscriptionId, immediate} = await req.json();
    const stripe = new Stripe(process.env.STRIPE_KEY || '');

    let itemId;

    try {
       const subscription = await stripe.subscriptions.retrieve(subscriptionId);
       if(subscription){
        itemId = subscription.items.data[0].id;
       }
    } catch (error) {
       return NextResponse.json({error:error});
    }
  
    if(itemId && immediate){
      try {
        await stripe.subscriptions.update(
         subscriptionId,
         {
           items: [
             {
               id: itemId,
               price: priceId,
             },
           ],
           billing_cycle_anchor:'now',
           proration_behavior:'always_invoice',
           trial_end:'now',
         }
       );
       console.log("ITEM ", itemId, " UPDATED!");
       return NextResponse.json({message:'Subscription upgraded successfully (IMMEDIATE)'});
     } catch (error) {
       return NextResponse.json({error:error});
     }
    }
    else if(itemId && !immediate){ 
      try{
        await stripe.subscriptions.update(subscriptionId, {
          items: [{
            id: itemId,
            price: priceId,
          }],
          billing_cycle_anchor: 'unchanged',
          proration_behavior: 'none',
        });
    
        return NextResponse.json({message: 'Subscription upgraded sucessfully!'});
      } catch (err: any) {
        return NextResponse.json({error:err});
      }
    
   }

   return NextResponse.json({message: 'Error retrieving current item id'}, {status:400});
}
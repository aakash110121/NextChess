import Cors from 'micro-cors'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe  from 'stripe'
import { db } from '@/utils/auth/FirebaseCredentials'
import { setDoc, doc, getDoc, increment } from 'firebase/firestore'


const cors = Cors({
    allowMethods: ['POST', 'HEAD']
})

const stripe = new Stripe(process.env.STRIPE_KEY!, {
    typescript:true
})

//const stripe = stripeInit(process.env.STRIPE_KEY!);

{/*export const config = {
    api: {
        bodyParser: false
    }
}*/}

export async function POST(req:any){
  console.log("WEBHOOK!!!");
    const body = await req.text();
    const sig = headers().get("stripe-signature") as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_KEY!;
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      return new NextResponse(`Webhook Error: ${err}`, {
        status: 400,
      });
    }
    
    const stripeVar = new Stripe(process.env.STRIPE_KEY || '');
    console.log("WEBHOOK KEY: ", endpointSecret);
    console.log("WEBHOOK EVENT: ", event);
    console.log("WEBHOOK EVENT TYPE: ", event.type);
   

    switch(event.type){
        case 'customer.subscription.created':
        {
          const subscription = event.data.object as Stripe.Subscription;
          let product;
          const productId = subscription.items.data[0].plan.product
            ? (subscription.items.data[0].plan.product as string)
            : "";
          product = await stripeVar.products.retrieve(productId);

          const subscriptionId = subscription.id;
          const userId = subscription.metadata.userId || "";
          const productName =
            product?.name || subscription.metadata.productName || "";
          const allowedUsageTime =
          productName == 'ChessviaGPT Bronze' ? 7200 : productName == 'ChessviaGPT Silver' ? 18000 : productName == 'ChessviaGPT Gold' ? 43200 : 'Unlimited';

          //@ts-ignore
          const price = subscription.plan.amount;
          
          //@ts-ignore
          const tierId = subscription.plan.product;
          const start = subscription.current_period_start;
          const end = subscription.current_period_end;

          const subscriptionRef = doc(db, "Subscription", subscriptionId);
          const userRef = doc(db, "UserProfile", userId);
      
           try {
             await setDoc(subscriptionRef,{
                 userId:userId,
                 price:price/100,
                 tierId:tierId,
                 start:start,
                 end:end,
                 cancel_at_period_end:false,
                 allowedUsageTime:allowedUsageTime,
                 productName:productName,
                 active:true
             })
             await setDoc(userRef, {
                subscription:subscriptionId,
             },{merge:true})
    
              return NextResponse.json("subscription is not active anymore",{status:200});
            } catch (error) {
              return NextResponse.json("subscription is not active anymore", {status:400});
            }
        }
        //IF THE USER CANCEL THE SUBSCRIPTION, AFTER HIS CURRENT SUBSCRIPTION PERIOD COMES TO THE END STRIPE WOULD TURN THIS SUBSCRIPTION STATUS TO INACTIVE AND
        //THIS EVENT WOULD BE TRIGGERED
        case 'customer.subscription.deleted':
        {
          const subscription = event.data.object;
          const subscriptionId = subscription.id;
          const userId = subscription.metadata.userId || '';
          const subscriptionRef = doc(db, "Subscription", subscriptionId);
          const userRef = doc(db, "UserProfile", userId);
            try {
                await setDoc(
                  subscriptionRef,
                  {
                    active: false,
                  },
                  {
                    merge: true,
                  }
                );
                const profile = await getDoc(userRef);
                if (profile.data()?.subscription == subscriptionId) {
                  await setDoc(
                    userRef,
                    {
                      subscription: null,
                    },
                    {
                      merge: true,
                    }
                  );
                }
                return NextResponse.json("subscription is not active anymore",{status:200});
              } catch (error) {
                return NextResponse.json(error);
              }
        }
        case 'customer.subscription.updated':
        {
          const subscription = event.data.object as Stripe.Subscription;
        
          const subscriptionId = subscription.id;
          const subscriptionRef = doc(db, "Subscription", subscriptionId);
        
            if(event.data.previous_attributes?.cancel_at_period_end === false){
            try {
              await setDoc(
                subscriptionRef,
                {
                  cancel_at_period_end: true,
                },
                {
                  merge: true,
                }
              );
              return NextResponse.json("cancel_at_period_end updated",{status:200});
            } catch (error) {
              return NextResponse.json(error);
            }
           }
           if(event.data.previous_attributes?.cancel_at_period_end === true) {
            try {
              await setDoc(
                subscriptionRef,
                {
                  cancel_at_period_end: false,
                },
                {
                  merge: true,
                }
              );
             
              return NextResponse.json("cancel_at_period_end updated",{status:200});
            } catch (error) {
              return NextResponse.json(error);
            }
           }
           if(event.data.previous_attributes?.items?.data[0].plan.amount){
              try {
                await setDoc(
                  subscriptionRef,
                  {
                    nextPrice:event.data.object.items?.data[0].plan?.amount!/100,
                  },
                  {
                    merge:true
                  }
                )
                return NextResponse.json('Next billing updated',{status:200});
              }
              catch(err){
                return NextResponse.json(err);
              }           
            }
           break;
        }
        case 'invoice.payment_succeeded':
        {
           const invoice = event.data.object as Stripe.Invoice;
           console.log("INVOICE: ", invoice);
           console.log("INVOCIE REASON: ", invoice.billing_reason);
           if(invoice.billing_reason != 'subscription_create'){
              const subscriptionId = invoice.lines.data[0].subscription as string;
              const subscription = await stripeVar.subscriptions.retrieve(subscriptionId);
              const userId = subscription.metadata.userId;
              let remaining = 0;
              const subRef = doc(db, "Subscription", subscriptionId);
              const subDoc = await getDoc(subRef);
              remaining = subDoc.data()?.allowedUsageTime;
              const product = await stripeVar.products.retrieve(invoice.lines.data[invoice.lines.data.length-1].price?.product as string);
              const allowedUsageTime = product.name == 'ChessviaGPT Bronze' ? 7200 : product.name == 'ChessviaGPT Silver' ? 18000 : product.name == 'ChessviaGPT Gold' ? 43200 : 'Unlimited'; 
              if(invoice.billing_reason == 'subscription_update'){
                if(allowedUsageTime!='Unlimited' && typeof(remaining)=='number'){ remaining=remaining + allowedUsageTime }
                try {
                  await setDoc(
                    subRef,
                    {
                      start: subscription.current_period_start,
                      end: subscription.current_period_end,
                      allowedUsageTime: allowedUsageTime=='Unlimited' ? allowedUsageTime : remaining,
                      tierId:invoice.lines.data[invoice.lines.data.length-1].price?.product,
                      productName:product.name,
                      price:invoice.lines.data[invoice.lines.data.length-1].amount/100,
                    },
                    {
                      merge: true,
                    }
                  );
                  return NextResponse.json("New cycle started");
                } catch (error) {
                  // console.log("THIS IS WHERE ERROR's OCCURRING!!!!");
                  // console.log("AND ERROR",error);
                  return NextResponse.json(error);
                }

              }
              try {
                await setDoc(
                  subRef,
                  {
                    start: subscription.current_period_start,
                    end: subscription.current_period_end,
                    allowedUsageTime: allowedUsageTime,
                    tierId:invoice.lines.data[invoice.lines.data.length-1].price?.product,
                    productName:product.name,
                    price:invoice.lines.data[invoice.lines.data.length-1].amount/100,
                  },
                  {
                    merge: true,
                  }
                );
                return NextResponse.json("New cycle started");
              } catch (error) {
                // console.log("ERROR",error);
                return NextResponse.json(error, {status:400});
              }
            }
            break;
        }
        default:{
            // console.log(event.data.previous_attributes);
            break;
        }
    }
    return NextResponse.json(event.data.object,{status:200});
}
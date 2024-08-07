import Stripe from "stripe";
import {NextRequest, NextResponse} from "next/server";

export async function GET(){
   //const {idsArray} = await req.json();
   //console.log(typeof(idsArray));
   //const stringified = JSON.stringify(idsArray);

   const stripe = new Stripe(process.env.STRIPE_KEY || '')
   const products = await stripe.products.list({
    active:true,
    expand:['data.default_price']
   });


   return NextResponse.json(products.data);
}
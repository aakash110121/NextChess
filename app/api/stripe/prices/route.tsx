import Stripe from "stripe";
import {NextResponse} from "next/server";

export async function GET(request:any){
   const stripe = new Stripe(process.env.STRIPE_KEY || '')
   const products = await stripe.prices.list({
    limit:4
   });


   return NextResponse.json(products.data);
}
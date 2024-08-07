import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Stripe from "stripe";

export async function GET(req:NextRequest){
    const customerId = req.nextUrl.searchParams.get('customerId');
   
    // console.log('Extracted customerId from query parameters:', customerId);

    if (!customerId || typeof(customerId) !== "string") {
        console.error("Invalid customerId:", customerId);
        return NextResponse.json({ message: "Invalid customer id" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_KEY || '');
    // console.log('Created Stripe instance.');

    try {
        const paymentMethod = await stripe.paymentMethods.list({
            customer:customerId,
            limit:1
        })
        return NextResponse.json(paymentMethod.data[0]);
    } catch (error) {
        return NextResponse.json({error:error});
    }
}
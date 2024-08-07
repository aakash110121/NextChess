import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Stripe from "stripe";

export async function GET(req:NextRequest){
    const customerId = req.nextUrl.searchParams.get('customerId');
   
    // console.log('Extracted subscriptionId from query parameters:', customerId);

    if (!customerId || typeof(customerId) !== "string") {
        console.error("Invalid subscriptionId:", customerId);
        return NextResponse.json({ message: "Invalid thread id" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_KEY || '');
    // console.log('Created Stripe instance.');

    try {
        const invoices = await stripe.invoices.list({customer:customerId});
        return NextResponse.json(invoices);
    } catch (error) {
        return NextResponse.json({error:error},{status:404});
    }
}
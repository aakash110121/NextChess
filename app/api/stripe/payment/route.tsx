import Stripe from 'stripe';
import {NextResponse, NextRequest} from 'next/server'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/auth/FirebaseCredentials';
import { getSession } from '@/lib/authentication';
import baseURL from '@/baseUrl';

export async function POST (request:any) {
    const userSession = await getSession();

    if(!userSession) return NextResponse.json({error: 'You have to be logged in'}, {status: 400});

    const stripe = new Stripe(process.env.STRIPE_KEY || '');
    const {priceId, userId, productName, trial} = await request.json();
    
    if (!userId || !priceId || !productName) {
        console.error('Required data not provided');
        return NextResponse.json({ error: 'Required data not provided' }, { status: 400 });
    }

    let user;
    const userRef = doc(db, "UserProfile", userId);
    try {
        user = await getDoc(userRef);
        if(user.data()?.subscription){
          return NextResponse.json({error: 'User already has an active subscription plan'},{status:404})
        }
        user = user.data();
    } catch (error) {
        return NextResponse.json({error: 'Error trying to get user from db'}, {status:404})
    }
   
    if(!user?.customer){
        // console.log("The application need to create stripe customer");
        try {
            const timeNow = Math.floor((new Date()).getTime()/1000);
            const testClock = await stripe.testHelpers.testClocks.create({
                frozen_time: timeNow,
                name: 'Annual renewal',
              });

            const customer = await stripe.customers.create({
                email: userSession.user.email,
                test_clock: testClock.id,
            })
            await setDoc(userRef,{
                customer:customer.id,
                testClock: testClock.id,
            },{
                merge:true
            })

            user = {...user, customer:customer.id};
            // console.log("New customer created sucessfully");
        } catch (error) {
            return NextResponse.json({error: 'Customer creation failed'},{status:404});
        }
    }
    const trialEnd = Math.floor(new Date().getTime()/1000) + 60*60*24*2+30; //2 days + 30sec from now!
    const session = await stripe.checkout.sessions.create({
        customer: user.customer,
        line_items:[
            {
            price:priceId,
            quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${baseURL}/chessboard`,
        cancel_url:`${baseURL}/pricing`,
        metadata:{
            userId:userId,
            productName: productName
        },
        subscription_data:{
            metadata:{
                userId:userId,
                productName: productName
            },
            ...(trial && {trial_end: trialEnd})
        }
    })

    return NextResponse.json(session.url)
}

import { refreshSession } from "@/lib/authentication";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const {refresh_token, session_token} = await req.json();
    if(!refresh_token || !session_token){
        return NextResponse.json({error:'No refresh token and/or session token provided'}, {status:401})
    }
    
    const newSession = await refreshSession(session_token, refresh_token);

    if(!newSession){
        return NextResponse.json({error:'Refresh failed'}, {status:401})
    }
     //const response = NextResponse.json({ session: newSession });
    /*response.cookies.set('session', newSession.session, { expires:newSession.expires });*/
    return NextResponse.json({session: newSession});
      //const expires = new Date(Date.now() + 60 * 1000 * 60); //one hour
}
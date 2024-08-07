import { db } from "@/utils/auth/FirebaseCredentials";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const gameId = req.nextUrl.searchParams.get('gameId');
    if(!gameId || typeof(gameId) !== "string")
        return NextResponse.json({message: "Invalid thread id"}, {status:400})

    const gameRef = doc(db, "Game", gameId);
    try {
        const gameDocument = await getDoc(gameRef);
        return NextResponse.json(gameDocument.data());
    } catch (error) {
        return NextResponse.json(error);
    }
   
}
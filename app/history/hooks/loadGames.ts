import { useEffect, useState } from "react";
import axios from 'axios';
import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "@/utils/auth/FirebaseCredentials";


export default async function getMoreGames(startAt: any, userId: any){
    try {
      const gamesRef = collection(db, "Game");
      const searchQuery = query(
        gamesRef,
        where("userId", "==", userId),
        orderBy("timeCreated", "desc"),
        startAfter(startAt),
        limit(5)
      );
      const gamesList = await getDocs(searchQuery);
      const gamesListParsed: any = [];
      gamesList.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;

        gamesListParsed.push({ ...data, gameId: id });
      });
      return gamesListParsed;
    } catch (error) {
      return []
    }
}
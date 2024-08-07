import { redirect } from "next/navigation";
import ChessboardClient2 from "./chessBoard2";
import { getSession, logout } from "@/lib/authentication";
import { db } from "@/utils/auth/FirebaseCredentials";
import {
  DocumentData,
  DocumentReference,
  collection,
  doc,
  getDoc,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  offeredVoices,
  predefinedQuestions,
  tableColors,
} from "./settingsData";
import { parseGame } from "./methods/parseGame";
import baseURL from "@/baseUrl";
import { offeredSounds } from "../account/board_settings/settingsData";

export const dynamic = "force-dynamic";

const getUsersBoardSettings = async (userId: any) => {
  const settingsRef = doc(db, "BoardSettings", userId);
  const settingsDoc = await getDoc(settingsRef);
  if (settingsDoc.exists()) return settingsDoc;

  await setDoc(settingsRef, {
    boardColor: tableColors[0],
    predefinedQuestions: [...predefinedQuestions],
    assistantVoice: offeredVoices[0],
    notation: "text",
    capturedPiecesVisibility: "visible",
    moveSound: offeredSounds[0].sound,
    captureSound: offeredSounds[1].sound,
    checkSound: offeredSounds[2].sound,
    chessyVoiceSound: 'on',
  });

  const settingsDocNew = await getDoc(settingsRef);
  return settingsDocNew;
};


export default async function ChessboardPage2() {
  const session = await getSession();
  if (!session) redirect("/login");
  const userProfile = doc(db, "UserProfile", session.user.uid);
  const userProfileSnap = await getDoc(userProfile);
  const currentGameId = userProfileSnap?.data()?.userCurrentGame;
  if (!currentGameId) redirect("/form");
  const gameDoc = doc(db, "Game", currentGameId);
  const gameRes = await getDoc(gameDoc);
  //const game = await parseGame(gameDoc);
  const game = gameRes.data();
  const user = {
    id: userProfileSnap?.id,
    chessName: userProfileSnap?.data()?.chessComUsername,
    rating: userProfileSnap?.data()?.rating
      ? userProfileSnap?.data()?.rating
      : 1000,
    email: session.user.email,
    ...(userProfileSnap?.data()?.hasOwnProperty("subscription") && { subscription: userProfileSnap?.data()?.subscription }),
    ...(userProfileSnap?.data()?.hasOwnProperty("ELO") && { ELO: userProfileSnap?.data()?.ELO })
  };

  if (!game) redirect("/form");

  let subscr: any = {};
  if (user.subscription) {
    const subscriptionRef = doc(
      db,
      "Subscription",
      userProfileSnap.data()?.subscription
    );
    const subscriptionDoc = await getDoc(subscriptionRef);
    subscr = { id: subscriptionDoc.id, ...subscriptionDoc.data() };
  }

  //if(!subscriptionDoc || Math.floor(Date.now()/1000)>subscriptionDoc.data()?.end || subscriptionDoc.data()?.allowedTime<=0) redirect('/pricing');
  const settingsDocument = await getUsersBoardSettings(session.user.uid);
  if (!settingsDocument.exists()) {
    logout();
    redirect("/login");
  }

  const settings = settingsDocument.data();

  async function lout(data: FormData) {
    "use server"
     await logout()
     redirect('/');
  }

  return (
    <>
      {session && currentGameId && game ? (
        <ChessboardClient2
          session={session}
          gameId={currentGameId}
          game={game}
          user={user}
          subscription={subscr}
          settings={settings}
          lout={lout}
        ></ChessboardClient2>
      ) : (
        <div>You must be logged in...</div>
      )}
    </>
  );
}

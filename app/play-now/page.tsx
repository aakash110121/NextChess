import { Metadata } from "next";
import ChessboardClient from "../chessboard/chessBoard";
import { redirect } from "next/navigation";
import { logout } from "@/lib/authentication";

export const metadata: Metadata = {
  title: 'Play Now | Squsts',
}

export default async function PlayNow() {
  const game = {
    "chessyPersonality": "Grandmaster Chessy",
    "hintsLeft": 10,
    "fenArray": [],
    "helpLevel": "Only a little bit of support",
    "stockfishAnalysis": [],
    "difficultyLevel": "Same level as me",
    "userColor": "White",
    "timeCreated": 1723539090199,
    "positions": []
  };
  
  const settings = {
    "moveSound": "capture.mp3",
    "predefinedQuestions": [
      "What should I do in this position?",
      "What are my long term plans in this position?",
      "What is my opponent threatening in this position?"
    ],
    "boardColor": {
      "lightSquares": "#eeeed2",
      "id": 1,
      "name": "Classic Green",
      "darkSquares": "#769656"
    },
    "captureSound": "capture.mp3",
    "assistantVoice": {
      "id": "alloy",
      "name": "Morgan"
    },
    "capturedPiecesVisibility": "visible",
    "chessyVoiceSound": "on",
    "checkSound": "game-end.mp3",
    "notation": "icon"
  };
  
  const user = {
    "rating": 1000,
    "id": "Sj8pTlyvbkTK2bVesld4uZJCd2p2123",
    "chessName": "Guest",
    "email": "guest@email.com",
  };
  
  async function lout(data: FormData) {
    "use server"
     await logout()
     redirect('/');
  }

  return (
    <>
      {/* Page illustration */}
      <div className="cey85 czd2q czjaw cmhb9 codcr c7k83" aria-hidden="true">
        <svg className="cem1n cimtg cgdju cgk3d c2s69 c83d2 cti3h" width="800" height="502" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="102" r="400" fill="url(#heroglow_paint0_radial)" fillOpacity=".6"></circle>
          <circle cx="209" cy="289" r="170" fill="url(#heroglow_paint1_radial)" fillOpacity=".4"></circle>
          <defs>
            <radialGradient id="heroglow_paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 149 251) scale(315.089)">
              <stop stopColor="#b70000"></stop>
              <stop offset="1" stopColor="#b70000" stopOpacity=".01"></stop>
            </radialGradient>
            <radialGradient id="heroglow_paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 -40 249) scale(133.913)">
              <stop stopColor="#000"></stop>
              <stop offset="1" stopColor="#000" stopOpacity=".01"></stop>
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      <section>
        <div className="czd2q c92f3 cmhb9 c1plj">
            <div className="c1r3i c8lmj cew09 c09hn">
              <ChessboardClient
                gameId={"thread_8j1kdQFB26mucFW6es3Vli2j123"}
                game={game}
                settings={settings}
                user={user}
                subscription={{}}
                lout={lout}
              ></ChessboardClient>
            </div>
          </div>
        </section>

    </>
  );
}

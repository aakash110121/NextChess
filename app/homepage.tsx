import { redirect } from "next/navigation";
import ChessboardClient from "./chessboard/chessBoard";
import { logout } from "@/lib/authentication";

export const dynamic = "force-dynamic";

const game = {
  "chessyPersonality": "Grandmaster Chessy",
  "hintsLeft": 0,
  "fenArray": [
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  ],
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

export default function HomePage() {
  return (
    <>
      <ChessboardClient
        gameId={"thread_8j1kdQFB26mucFW6es3Vli2j123"}
        game={game}
        settings={settings}
        user={user}
        subscription={{}}
        lout={lout}
      ></ChessboardClient>
    </>
  );
}

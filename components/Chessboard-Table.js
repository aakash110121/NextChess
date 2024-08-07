import React from "react";
import dynamic from "next/dynamic";
import { Chessboard } from "react-chessboard";

export default function ChessboardTable({ position, fen, onDrop, width }) {
  // const Chessboard = dynamic(() => import("react-chessboard"), { ssr: false });

  return (
    <div>
      <Chessboard  />
    </div>
  );
}

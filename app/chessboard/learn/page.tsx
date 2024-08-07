"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Chess, Square } from "chess.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/utils/auth/FirebaseCredentials";
import Webcam from "react-webcam";
import { v4 as uuid } from "uuid";
import { AnimatePresence, motion } from "framer-motion";
import ChessboardSidebarLeft from "@/components/Chessboard-sidebar-L";
import ChessboardTable from "@/components/Chessboard-Table";
import ChessboardSidebarRight from "@/components/Chessboard-sidebar-R";
import RootLayout from "@/app/layout";
import ChessboardLayout from "@/app/chessboard/layout";
import Link from "next/link";

const Chessboard = dynamic(() => import("chessboardjsx"), { ssr: false });

const LearnPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-4">Learn</h1>
      <p className="text-lg text-gray-600 mb-8">
        This is a page where you can learn...
      </p>
      <Link href="/dashboard" className="text-blue-600 underline">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default LearnPage;

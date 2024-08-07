"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const Chessboard = dynamic(() => import("chessboardjsx"), { ssr: false });


const PlayPage = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold mb-4">Learn</h1>
        <p className="text-lg text-gray-600 mb-8">
          This is a page where you can play...
        </p>
        <Link href="/dashboard" className="text-blue-600 underline">
          Go to Dashboard
        </Link>
      </div>
    </>
  );
};

export default PlayPage;

"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsArrowLeftShort, BsChevronDown, BsPlusLg } from "react-icons/bs";
import { useState } from "react";
import {
  MdNewspaper, MdAccountCircle, MdSettings, MdReceipt, MdInsights, MdHomeFilled, MdHistory, MdHelp,
  MdOutlineOndemandVideo, MdPriceChange
} from "react-icons/md";
import { IoExtensionPuzzleSharp, IoBook } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMediaQuery } from 'react-responsive';
import { FaHistory } from "react-icons/fa";
import { GiLightBulb } from "react-icons/gi";
import Image from 'next/image';
import { RxHamburgerMenu } from "react-icons/rx";

export default function ChessboardSidebarLeft({ lout, isMobileView = false }: any) {
  const [open, setOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const router = usePathname();

  const Menus = [
    { title: "Home", icon: <MdHomeFilled />, path: "/home" },
    { title: "Play", icon: <IoExtensionPuzzleSharp />, path: "/chessboard" },
    { title: "History", icon: <MdHistory />, path: "/history" },
    { title: "Chat with Chessy", icon: <GiLightBulb />, path: "/chat" },
    { title: "Settings", icon: <MdSettings />, path: "/account/board_settings" },
    { title: "FAQ", icon: <MdHelp />, path: "/faq" },
    { title: "Learn More", icon: <IoBook />, spacing: true, path: "/learnmore", submenu: false, submenuItems: [] },
  ];

  const [isColapsed, setIsColapsed] = useState(false);

  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

  function newChat(){
    console.log("New chat");
  }

  return (
    <div className="flex flex-col bg-gray-100 max-w-full flex-1">
      <div className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-white pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden">
        <button
          type="button"
          className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          onClick={() => setIsMobileMenuVisible(!isMobileMenuVisible)}
        >
          <span className="sr-only">Open sidebar</span>
          <RxHamburgerMenu className="h-6 w-6 text-black" />
        </button>
        <div className="flex-1 text-center text-base font-normal flex justify-center">
          <Image
            src="/chessvia.png"
            alt="Chessvia Logo"
            width={210}
            height={70}
            className="w-[150px]"
          />
        </div>
        <button onClick={() => newChat()} type="button" className="px-3">
          <BsPlusLg className="h-6 w-6 text-black" />
        </button>
      </div>
      <div id="sidebarMenuMain" className={`flex max-h-screen h-full left-0 flex-col z-[80] ${isColapsed ? '' : 'w-[16rem]'} transition duration-300 relative px-5 bg-white shadow-md shadow-black/40`}>
        <div className="relative inline-flex justify-center w-full">
          <AnimatePresence>
            {isColapsed ? (
              <motion.img
                className="w-9 h-9 row-start-1 mb-0 mt-5 duration-300"
                src='/chessy/Chessvia-Favicon-Black.png'
                alt="Chessvia Logo"
              />
            ) : (
              <motion.img
                className="w-[200px] row-start-1 mb-0 mt-5 duration-300"
                src="/chessvia.png"
                alt="Chessvia Logo"
              />
            )}
          </AnimatePresence>
          {!isMobileView && (
            <BsArrowLeftShort
              onClick={() => setIsColapsed(prevColapsed => !prevColapsed)}
              className={`bg-[#292828] text-white shadow-sm shadow-gray-500 text-gray text-3xl absolute -right-[30px] top-6 rounded-md cursor-pointer ${isColapsed && "rotate-180"}`}
            />
          )}
        </div>
        <ul id="MenuPagesContainer" className="flex flex-col mt-[36px] flex-1 overflow-y-auto">
          {Menus.map((menu, index) => (
            <React.Fragment key={index}>
              <Link href={menu.path}>
                <li className={`text-black text-lg flex items-center gap-x-4 p-2 mx-[1px] ${index === 0 ? "mt-2" : "mt-[20px]"} cursor-pointer ${router === menu.path ? "bg-gray-200" : "hover:bg-gray-200"} rounded-md duration-300 text-center ${isColapsed ? 'justify-center' : ''}`}>
                  <span className="text-2xl block float-left">{menu.icon}</span>
                  <span className={`${isColapsed ? 'hidden' : ''} text-base font-medium duration-300`}>{menu.title}</span>
                </li>
              </Link>
            </React.Fragment>
          ))}
        </ul>
        <form className="mt-auto mb-[20px]" action={lout}>
          <button className="flex items-center px-4 rounded-md gap-x-1 text-[#E72929] justify-center w-full mt-2 cursor-pointer py-2 bg-[#FF204E30] hover:bg-[#FF204E] transition duration-200 hover:text-white" style={{ alignItems: "center" }}>
            <FiLogOut className="text-xl" />
            <span className={`${isColapsed ? 'hidden' : ''} text-lg`}>Sign out</span>
          </button>
        </form>
      </div>
    </div>
  );
}
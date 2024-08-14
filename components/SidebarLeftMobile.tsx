"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsArrowLeftShort, BsChevronDown } from "react-icons/bs";
import { useState } from "react";
import { MdNewspaper, MdAccountCircle, MdSettings, MdReceipt, MdInsights, MdHomeFilled, MdHistory, MdHelp, MdOutlineOndemandVideo, MdPriceChange   } from "react-icons/md";
import { IoExtensionPuzzleSharp, IoBook } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMediaQuery } from 'react-responsive';
import { FaHistory } from "react-icons/fa";
import { GiLightBulb } from "react-icons/gi";



export default function ChessboardSidebarLeft({ lout, isMobileView = false }:any) {
  const [open, setOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const router = usePathname();

  const Menus = [
    {
      title: "Home",
      icon: <MdHomeFilled />,
      path: "/home",
    },
    {
      title: "Play",
      icon: <IoExtensionPuzzleSharp />,
      path: "/chessboard",
    },
    { 
      title: "History", 
      icon: <MdHistory />, 
      path: "/history" 
    },
    {
      title: "Chat with Chessy",
      icon: <GiLightBulb/>,
      path: "/chat"
    },
    { 
      title: "Settings", 
      icon: <MdSettings />, 
      path: "/account/board_settings" 
    },
    {
      title: "FAQ",
      icon: <MdHelp/>,
      path: "/faq",
    },
    {
      title: "Learn More",
      icon: <IoBook />,
      spacing: true,
      path: "/learnmore",
      submenu: false,
      submenuItems: []
    },
  ];
  

 {/* 
     {
      title: "My Account",
      icon: <MdAccountCircle />, 
      submenu: true,
      submenuItems: [
        { title: "Settings", icon: <MdSettings />, path: "/account/board_settings" },
        { title: "Billing", icon: <MdReceipt />, path: "/account/billing" },
      ],
      path: "/account",
    },
    {
      title: "My AI Insights",
      icon: <MdInsights />,
      path: "/insights",  
    },
    {
      title: "Watch",
      icon: <MdOutlineOndemandVideo/>,
      path: "/watch"
    },
    {
      title: "Pricing",
      icon: <MdPriceChange />,
      path: "/pricing",
      submenu: false,
      submenuItems: []
    },
*/}
  const [isColapsed, setIsColapsed] = useState(false);

  return (
    <div id="sidebarMenuMain" className={`flex max-h-screen h-full left-0 flex-col z-[80] ${isColapsed ? '': 'w-[16rem]'} transition duration-300 relative rounded-r-xl p-5 bg-white `}>
      
        
          <div className="relative inline-flex justify-center w-full">
            <AnimatePresence>
             {isColapsed ?
               <motion.img
               className={`w-9 h-9  row-start-1 mb-0 mt-5 duration-300`}
               src='/chessy/Chessvia-Favicon-Black.png'
               alt="Chessvia Logo"
             />
             : <motion.img
                className={`  w-[150px] row-start-1 mb-0 mt-5 duration-300`}
                src="/chessvia.png"
                alt="Chessvia Logo"
              />}
            </AnimatePresence>
            
           {!isMobileView && <BsArrowLeftShort
              onClick={()=>setIsColapsed(prevColapsed=>!prevColapsed)}
              className={`bg-[#292828] z-[300] text-white shadow-sm shadow-gray-500 text-gray text-3xl absolute 
              -right-[30px] top-6  rounded-md cursor-pointer ${
                isColapsed && "rotate-180"
              }`}
            />}
          </div>

          <ul id="MenuPagesContainer" className="flex flex-col  mt-[36px] flex-1 overflow-y-auto">
            {Menus.map((menu, index) => (
              <React.Fragment key={index}>
                {menu.submenu ? (
                  <div>
                    <li
                      className={`text-black text-lg flex items-center gap-x-3 p-2 mx-[1px] ${
                        index === 0 ? "mt-2" : "mt-[20px]" // Adjusts the margin-top for the first item
                      } cursor-pointer ${
                        router === menu.path
                          ? " bg-[#F3F5F8]"
                          : "hover:bg-[#F3F5F8]"
                      } rounded-md duration-300 text-center`}
                    >
                      <span className={`text-2xl block float-left`}>
                        {menu.icon}
                      </span>
                      <span
                        className={`text-base font-medium duration-300`}
                      >
                        {menu.title}
                      </span>
                      {menu.submenu && (
                        <BsChevronDown
                          onClick={() => setSubmenuOpen(!submenuOpen)}
                          className={` ${!open && "hidden"} ${
                            submenuOpen && "rotate-180"
                          }`}
                        />
                      )}
                    </li>
                  </div>
                ) : (
                  <Link href={menu.path}>
                    <li
                      className={`text-black text-lg flex items-center gap-x-3 p-2 mx-[1px] ${
                        index === 0 ? "mt-2" : "mt-[20px]" // Adjusts the margin-top for the first item
                      } cursor-pointer ${
                        router === menu.path
                          ? "bg-[#F3F5F8]"
                          : "hover:bg-[#F3F5F8]"
                      } rounded-md duration-300 text-center
                      ${isColapsed ? 'justify-center' : ''}`}
                    >
                      <span className={`text-2xl block float-left`}>
                        {menu.icon}
                      </span>
                      <span
                        className={`${isColapsed ? 'hidden': ''} text-base font-medium duration-300`}
                      >
                        {menu.title}
                      </span>
                      {menu.submenu && (
                        <BsChevronDown
                          onClick={() => setSubmenuOpen(!submenuOpen)}
                          className={` ${!open && "hidden"} ${
                            submenuOpen && "rotate-180"
                          }`}
                        />
                      )}
                    </li>
                  </Link>
                )}
                {menu.submenu && submenuOpen && open && (
                  <ul key={`submenu-${index}`}>
                    {menu.submenuItems.map((submenuItem, subIndex) => (
                      <Link
                        //@ts-ignore
                        href={submenuItem.path}
                        key={`submenu-item-${subIndex}`}
                        className={`text-gray-600 text-sm flex items-center px-5 gap-x-4 p-2 ${
                          !open && "justify-center"
                        } ${
                          open && "ml-[25px] "
                        } cursor-pointer hover:bg-white hover:text-[#131313] rounded-md mt-2 duration-300 text-center ${
                          menu.spacing ? "mb-[60px]" : "mt-2"
                        }`}
                      >
                        {" "}
                        
                        {//@ts-ignore
                        submenuItem.title}{" "}
                      </Link>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        
        <form className="mt-auto mb-[20px]" action={lout}>
          {" "}
          {/* Adjust the bottom margin */}
          <button
            className={`flex items-center px-4 rounded-md gap-x-1 text-[#E72929] justify-center w-full mt-2 cursor-pointer
             py-2 bg-[#FF204E30] hover:bg-[#FF204E] transition duration-200 hover:text-white`}
            style={{ alignItems: "center" }}
          >
            <FiLogOut className=" text-xl " />
            <span className={`${isColapsed ? 'hidden': ''} text-lg`}>
              Sign out
            </span>
          </button>
        </form>
    </div>
  );
}

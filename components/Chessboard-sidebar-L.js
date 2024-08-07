"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsArrowLeftShort, BsChevronDown } from "react-icons/bs";
import { useState } from "react";
import { MdNewspaper, MdAccountCircle, MdSettings, MdReceipt, MdInsights } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { IoExtensionPuzzleSharp, IoBook } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMediaQuery } from 'react-responsive';



export default function ChessboardSidebarLeft({ lout }) {
  const [open, setOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const router = usePathname();

  const Menus = [
    {
      title: "Play",
      icon: <IoExtensionPuzzleSharp />,
      path: "/chessboard",
    },
    {
      title: "Learn",
      icon: <IoBook />,
      spacing: true,
      path: "/learnmore",
    },
    {
      title: "Customize Chessy", 
      icon: <MdNewspaper />,
      path: "/account/chessy_settings",
    },
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
      title: "History", 
      icon: <FaHistory />, 
      path: "/history" 
    },
  ];
  
  const isSmallScr = useMediaQuery({
    query: '(max-width: 768px)'
  })
 

  return (
    <div className={`fixed flex flex-row ${isSmallScr? 'left-0 right-0 top-0 w-screen' : 'left-0 h-full flex-col'} z-20`}>
      <div
        className={` flex-row bg-white  pr-5 pt-0 ${ open ? "w-[16rem]" : "w-[7rem]"} duration-300 relative ${
          !open && "pl-[13px]"
        } md:flex-grow md:flex md:flex-col ${isSmallScr? 'w-full' : 'h-full'}`}
      >
        <div>
          <div className="inline-flex justify-center w-full lg:w-auto">
            <AnimatePresence>
                <motion.img
                  className={`block w-[150px] md:w-[200px] mt-1 row-start-1 mb-0 md:mb-0 md:mt-5 duration-300 ${
                    open && "ml-[25px]"
                  } ${isSmallScr ? 'mb-0' : ''}`}
                  src="/chessvia.png"
                  alt="Chessvia Logo"
                />
            </AnimatePresence>
          </div>

          <ul className="flex justify-center md:ml-0 md:block md:pt-2 mt-0 md:mt-4">
            {Menus.map((menu, index) => (
              <React.Fragment key={index}>
                {menu.submenu ?
                <div>
                <li
                  className={`text-black text-lg flex items-center gap-x-4 p-2 ${
                    !open && "justify-center"
                  } ${open && "mx-[1px] md:ml-[25px]"} ${
                    index === 0 ? "mt-2" : "mt-[20px]" // Adjusts the margin-top for the first item
                  } cursor-pointer ${
                    router === menu.path ? "bg-gray-200" : "hover:bg-gray-200"
                  } rounded-md duration-300 text-center ${
                    menu.title === "Learn" ? "mb-2" : "mt-2" // Adjusts the margin-bottom after "Learn"
                  } ${isSmallScr ? 'mb-[1px] mt-[8px]' : ''}`}
                >
                  <span className={`text-2xl block float-left`}>{menu.icon}</span>
                  <span
                    className={`hidden text-base ${
                      !open ? "hidden" : "md:block"
                    } font-medium duration-300`}
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
              </div> :
              
                <Link href={menu.path}>
                  <li
                    className={`text-black text-lg flex items-center gap-x-4 p-2 ${
                      !open && "justify-center"
                    } ${open && "mx-[1px] md:ml-[25px]"} ${
                      index === 0 ? "mt-2" : "mt-[20px]" // Adjusts the margin-top for the first item
                    } cursor-pointer ${
                      router === menu.path ? "bg-gray-200" : "hover:bg-gray-200"
                    } rounded-md duration-300 text-center ${
                      menu.title === "Learn" ? "mb-2" : "mt-2" // Adjusts the margin-bottom after "Learn"
                    } ${isSmallScr ? 'mb-[1px] mt-[8px]' : ''}`}
                  >
                    <span className={`text-2xl block float-left`}>{menu.icon}</span>
                    <span
                      className={`hidden text-base ${
                        !open ? "hidden" : "md:block"
                      } font-medium duration-300`}
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
                </Link>}
                {menu.submenu && submenuOpen && open && (
                  <ul key={`submenu-${index}`}>
                    {menu.submenuItems.map((submenuItem, subIndex) => (
                      <Link href={menu.path}
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
                        {submenuItem.title}{" "}
                      </Link>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
        <form className="mt-auto mb-[20px]" action={lout}> {/* Adjust the bottom margin */}
          <button
            className={`hidden md:flex md:items-center pl-2 cursor-pointer ${open ? "ml-[25px]" : "ml-[20px]"} `}
            style={{alignItems: 'center'}}
          >
            <FiLogOut className="text-gray-600 text-xl mr-2" />
            <span className={`text-gray-600 text-lg ${!open && "hidden"}`}>
              Logout
            </span>
          </button>
            </form>
          </div>
        </div>
  );
}

// <div className="left-sidebar bg-gray-400 h-full min-h-screen w-1/4 flex flex-col items-center ">
// <AnimatePresence>
//  <motion.img
//     // initial={{ opacity: 0, y: 40 }}
//     // animate={{ opacity: 1, y: 0 }}
//     // transition={{
//     //   delay: 0.15,
//     //   duration: 0.95,
//     //   ease: [0.165, 0.84, 0.44, 1],
//     // }}
//     className="block w-[200px] row-start-2 mb-0 md:mb-0 mt-10"
//     src="/chessvia.png"
//     alt="Chessvia Logo"
//   />
//   </AnimatePresence>
//   </div>

import { Metadata } from "next";
import ChessboardSidebarRight from "@/components/Chessboard-sidebar-R";
import { UserStatesProvider } from "./context/userStates";
import Head from "next/head";
import { FcFeedback } from "react-icons/fc";
import "../styles/globals.css";

/*export const metadata: Metadata = {
   title: "Chessvia - Your AI Chess Coach",
	@@ -28,18 +29,19 @@ import { UserStatesProvider } from "./context/userStates";
   themeColor: "#FFF",
 }
*/
 
export const metadata: Metadata = {
  title: 'Chessvia AI',
}
const sendToFeedback = () => {
  window.open('https://forms.gle/aZ9CHTw1MymQqpRH9', '_blank');
};
export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <>
      <html lang="en">
        <body className="scroll-smooth antialiased [font-feature-settings:'ss01']">
          <UserStatesProvider>
            {children}
          </UserStatesProvider>
          <a href="https://forms.gle/aZ9CHTw1MymQqpRH9" target='_blank' className="fixed group right-8 p-[2px] z-[100] bottom-3 bg-white rounded-md  flex items-center justify-center">
            <div className="absolute hidden -top-8 w-40 group-hover:inline"> Leave feedback </div>
            <FcFeedback className="w-10 h-10 shadow-md"></FcFeedback>
          </a>
        </body>
      </html>
    </>
  );
}
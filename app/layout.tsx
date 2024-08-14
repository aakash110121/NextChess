import { Metadata } from "next";
import { UserStatesProvider } from "./context/userStates";
import "../styles/globals.css";
 
export const metadata: Metadata = {
  title: 'NextChess',
}
export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <>
      <html lang="en">
        <body className="scroll-smooth antialiased [font-feature-settings:'ss01']">
          <UserStatesProvider>
            {children}
          </UserStatesProvider>
        </body>
      </html>
    </>
  );
}
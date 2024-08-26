import { Metadata } from "next";
import { UserStatesProvider } from "./context/userStates";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../styles/globals.css";
import "../styles/aos.css";
import "../styles/swiper-bundle.min.css";
import "../styles/style.css";
import Script from 'next/script'
 
export const metadata: Metadata = {
  title: 'Squsts',
}
export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body className="scroll-smooth antialiased [font-feature-settings:'ss01'] cwkwy cdmud cci6q c8d3u ca3pf cu0vm c6zr7">
        <div className="cr227 c27c3 c54sb cnc7y">
          <UserStatesProvider>
            <Header></Header>
            <main className="c2h4q">
              {children}
            </main>
            <Footer></Footer>
          </UserStatesProvider>
        </div>
        <Script src="scripts/alpinejs.min.js" />
        <Script src="scripts/aos.js" />
        <Script src="scripts/swiper-bundle.min.js" />
        <Script src="scripts/main.js" />
      </body>
    </html>
  );
}
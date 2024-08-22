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
              {/* Page illustration */}
              <div className="cey85 czd2q czjaw cmhb9 codcr c7k83" aria-hidden="true">
                <svg className="cem1n cimtg cgdju cgk3d c2s69 c83d2 cti3h" width="800" height="502" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="400" cy="102" r="400" fill="url(#heroglow_paint0_radial)" fillOpacity=".6"></circle>
                  <circle cx="209" cy="289" r="170" fill="url(#heroglow_paint1_radial)" fillOpacity=".4"></circle>
                  <defs>
                    <radialGradient id="heroglow_paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 149 251) scale(315.089)">
                      <stop stopColor="#b70000"></stop>
                      <stop offset="1" stopColor="#b70000" stopOpacity=".01"></stop>
                    </radialGradient>
                    <radialGradient id="heroglow_paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 -40 249) scale(133.913)">
                      <stop stopColor="#000"></stop>
                      <stop offset="1" stopColor="#000" stopOpacity=".01"></stop>
                    </radialGradient>
                  </defs>
                </svg>
              </div>
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
import { Metadata } from "next";
import { cookies } from 'next/headers';
import { UserStatesProvider } from "./context/userStates";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../styles/globals.css";
import "../styles/aos.css";
import "../styles/swiper-bundle.min.css";
import "../styles/style.css";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Squsts',
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  // Retrieve the cookie value
  const darkModeCookie = cookies().get('dark-mode');

  // Check if the cookie value is 'true'
  const darkMode = darkModeCookie?.value === 'true';  // Use optional chaining and access the value property

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <body className="scroll-smooth antialiased [font-feature-settings:'ss01'] cwkwy cdmud cci6q c8d3u ca3pf cu0vm c6zr7">
        <div className="cr227 c27c3 c54sb cnc7y">
          <UserStatesProvider>
            <Header />
            <main className="c2h4q">
              {children}
            </main>
            <Footer />
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

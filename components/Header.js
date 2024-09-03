'use client'
import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from 'next/image';
import Logo from '@/public/images/logo.png';
import LogoDark from '@/public/images/dark-logo.png';
import userIcon from '@/public/images/profile-user.png';

export default function Header() {
  const [expanded, setExpanded] = useState(false);
  
  const handleToggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  useEffect(() => {
    const lightSwitches = document.querySelectorAll('.light-switch');
    if (lightSwitches.length > 0) {
      lightSwitches.forEach((lightSwitch, i) => {
        if (localStorage.getItem('dark-mode') === 'true' || !('dark-mode' in localStorage)) {
          // lightSwitch.checked = true;
        }
        lightSwitch.addEventListener('change', () => {
          const { checked } = lightSwitch;
          lightSwitches.forEach((el, n) => {
            if (n !== i) {
              el.checked = checked;
            }
          });
          if (lightSwitch.checked) {
            document.documentElement.classList.add('dark');
            // localStorage.setItem('dark-mode', true);
          } else {
            document.documentElement.classList.remove('dark');
            // localStorage.setItem('dark-mode', false);
          }
        });
      });
    }
  }, []);
  return (
    <>
      <header className="cgk3d cs8sl clzfl site-main-header">
        <div className="czd2q c92f3 cmhb9 c1plj">
          <div className="ctiy6 cxdxt cnc7y cevvc">
            {/* Site branding */}
            <div className="c2npy cbbvf">
              <Link
                href="/"
                className="block brand"
              >
                <Image
                  src={Logo}
                  alt="logo"
                  className="light-logo"
                />
                <Image
                  src={LogoDark}
                  alt="logo"
                  className="dark-logo"
                />
              </Link>
            </div>

            {/* Desktop navigation */}
            <nav className="ci5ce cqxxm cfrwd">
              {/* Desktop menu links */}
              <ul className="cxdxt cf4hw cxu0t cnc7y c2h4q justify-center">
                <li>
                  <Link className="text-gray-600 c35ee c9pff cf26p cxdxt clq5w ccb29 ceo83 cnc7y cjrai ci4w1" href="play-now">
                    Play now
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 c35ee c9pff cf26p cxdxt clq5w ccb29 ceo83 cnc7y cjrai ci4w1" href="about">
                    About
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 c35ee c9pff cf26p cxdxt clq5w ccb29 ceo83 cnc7y cjrai ci4w1" href="how-to-play">
                    How to play
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 c35ee c9pff cf26p cxdxt clq5w ccb29 ceo83 cnc7y cjrai ci4w1" href="chess-tournaments">
                  Chess Tournaments
                  </Link>
                </li>
              </ul>

              {/* Desktop lights switch */}

              <div className="user-login">
                <Link className="text-white bg-teal-500 cvy08 c9xc1 cbev1" href="/login">

              
                Login
                  </Link>
                </div>
              <div className="form-switch cw3my c54sb cahr4 cnc7y">
                <input
                  type="checkbox"
                  name="light-switch"
                  id="light-switch-desktop"
                  className="light-switch cft5d"
                />
                <label className="czjaw" htmlFor="light-switch-desktop">
                  <span className="cww77 c1cr6 clgvu chf91 c8mz9 czjaw chb9f ctlyr" aria-hidden="true"></span>
                  <svg className="cgk3d c2ysc" width="44" height="24" viewBox="0 0 44 24" xmlns="http://www.w3.org/2000/svg">
                    <g className="text-white c4u31" fillRule="nonzero" opacity=".88">
                      <path d="M32 8a.5.5 0 00.5-.5v-1a.5.5 0 10-1 0v1a.5.5 0 00.5.5zM35.182 9.318a.5.5 0 00.354-.147l.707-.707a.5.5 0 00-.707-.707l-.707.707a.5.5 0 00.353.854zM37.5 11.5h-1a.5.5 0 100 1h1a.5.5 0 100-1zM35.536 14.829a.5.5 0 00-.707.707l.707.707a.5.5 0 00.707-.707l-.707-.707zM32 16a.5.5 0 00-.5.5v1a.5.5 0 101 0v-1a.5.5 0 00-.5-.5zM28.464 14.829l-.707.707a.5.5 0 00.707.707l.707-.707a.5.5 0 00-.707-.707zM28 12a.5.5 0 00-.5-.5h-1a.5.5 0 100 1h1a.5.5 0 00.5-.5zM28.464 9.171a.5.5 0 00.707-.707l-.707-.707a.5.5 0 00-.707.707l.707.707z"></path>
                      <circle cx="32" cy="12" r="3"></circle>
                      <circle fill-opacity=".4" cx="12" cy="12" r="6"></circle>
                      <circle fill-opacity=".88" cx="12" cy="12" r="3"></circle>
                    </g>
                  </svg>
                  <span className="cft5d">Switch to light / dark version</span>
                </label>
              </div>

              {/* Desktop CTA on the right */}
              <ul className="cxdxt c138q cxu0t cnc7y">
               
                <li>
                  <Link className="text-white bg-teal-500 cvy08 c9xc1 cbev1" href="/contact">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Mobile menu */}
            
            <div className="czak8 ce20z">
            <div className="user-login">
                <Link className="text-white bg-teal-500 cvy08 c9xc1 cbev1" href="/login">

              
                Login
                  </Link>
                </div>
              {/* Mobile lights switch */}
              <div className="form-switch cw3my c54sb ccond cnc7y">
                <input
                  type="checkbox"
                  name="light-switch"
                  id="light-switch-mobile"
                  className="light-switch cft5d"
                />
                <label className="czjaw" htmlFor="light-switch-mobile">
                  <span className="cww77 c1cr6 clgvu chf91 c8mz9 czjaw chb9f ctlyr" aria-hidden="true"></span>
                  <svg className="cgk3d c2ysc" width="44" height="24" viewBox="0 0 44 24" xmlns="http://www.w3.org/2000/svg">
                    <g className="text-white c4u31" fillRule="nonzero" opacity=".88">
                      {/* SVG path omitted for brevity */}
                    </g>
                  </svg>
                  <span className="cft5d">Switch to light / dark version</span>
                </label>
              </div>

              {/* Hamburger button */}
              <button
                className={`ce3b3 ${expanded ? 'active' : ''}`}
                onClick={handleToggleExpanded}
                aria-controls="mobile-nav"
                aria-expanded={expanded}
              >
                <span className="cft5d">Menu</span>
                <svg className="c35ee c9pff cf26p c8d3u c4u31 clq5w ccb29 ceo83 cr68y cj7c4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect y="4" width="24" height="2" rx="1"></rect>
                  <rect y="11" width="24" height="2" rx="1"></rect>
                  <rect y="18" width="24" height="2" rx="1"></rect>
                </svg>
              </button>

              {/* Mobile navigation */}
              {expanded && (
                <nav
                  id="mobile-nav"
                  className="cdmud ceikc cxcxv cvbap cxslo c2k38 c6zr7 cp8ye cy740 cs8sl cvtns cti3h cg6td"
                >
                  <div className="c1t6c cb7tb chur8">
                    {/* Logo */}
                    <Link className="caun5 cyb9k brand" href="/" aria-label="Cruip">
                      <Image src="/images/logo.png" alt="logo" className="light-logo" width={100} height={50} />
                      <Image src="/images/dark-logo.png" alt="logo" className="dark-logo" width={100} height={50} />
                    </Link>
                    {/* Links */}
                    <ul>
                      <li>
                        <Link className="text-gray-600 c35ee c9pff cf26p cxdxt clq5w ccb29 ceo83 cnc7y cjrai ci4w1" href="/play-now">
                          Play now
                        </Link>
                      </li>
                      <li>
                        <Link className="text-gray-600 c35ee c9pff cf26p cxdxt clq5w ccb29 ceo83 cnc7y cjrai ci4w1" href="/about">
                          About
                        </Link>
                      </li>
                      <li>
                        <Link className="text-gray-600 c35ee c9pff cf26p cxdxt clq5w ccb29 ceo83 cnc7y cjrai ci4w1" href="/how-to-play">
                          How to play
                        </Link>
                      </li>
                      <li>
                        <Link className="text-gray-600 c35ee c9pff cf26p cxdxt clq5w ccb29 ceo83 cnc7y cjrai ci4w1" href="/chess-tournaments">
                        Chess Tournaments
                        </Link>
                      </li>
                    
                      <li>
                        <Link className="text-white bg-teal-500 co2a3 cvy08 cw3my cxdxt clq5w czak8 cf4hw ccb29 ceo83 ceg5n cs8sl civob c6cql c1plj ci4w1 mobile-nav-btn " href="/contact">
                          Contact Us
                        </Link>
                      </li>
                    </ul>
                  </div>
                </nav>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
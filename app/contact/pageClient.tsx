'use client';
import React, { useState } from 'react';


export default function Contact() {
  
  return (
    <>
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

      {/* Contact Form */}
      <section className="czjaw">
        <div className="czd2q czjaw c92f3 cmhb9 c1plj">
          <div className="cdoe6 c8lmj ccem0 c09hn">
            
            {/* Page header */}
            <div className="c5ymx calbx c1r3i cmhb9 ccem0">
              <h1 className="cps50 cyb9k c41dw">Get started with Squsts.com</h1>
              <p className="text-gray-600 c0atf czz36">
                Join our community of chess enthusiasts to discuss strategies, participate in tournaments, and share your love for the game.
              </p>
            </div>

            {/* Contact form */}
            <form className="cubvf cmhb9">
              <div className="cxu0t cv9mf co18r cnc7y">
                <div className="cwhvr c4u1v cs8sl cyb9k c5mw1">
                  <label className="block cf26p chdz1 cf4hw ceng1 ccipq" htmlFor="first-name">
                    First Name <span className="cwie5">*</span>
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    className="c3mdo cs8sl"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className="cwhvr cs8sl c5mw1">
                  <label className="block cf26p chdz1 cf4hw ceng1 ccipq" htmlFor="last-name">
                    Last Name <span className="cwie5">*</span>
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    className="c3mdo cs8sl"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div className="cxu0t cv9mf co18r cnc7y">
                <div className="cs8sl c5mw1">
                  <label className="block cf26p chdz1 cf4hw ceng1 ccipq" htmlFor="email">
                    Email <span className="cwie5">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="c3mdo cs8sl"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="cxu0t cv9mf co18r cnc7y">
                <div className="cs8sl c5mw1">
                  <div className="ctiy6 cxdxt ccipq cnc7y">
                    <label className="block cf26p chdz1 cf4hw ceng1" htmlFor="message">
                      Message
                    </label>
                    <span className="cp09e ceng1">Optional</span>
                  </div>
                  <textarea
                    id="message"
                    rows={4}
                    className="cgwmg cs8sl"
                    placeholder="What do you want to build with Appy?"
                  />
                </div>
              </div>

              <div className="cxu0t cv9mf c36nh cnc7y">
                <div className="cs8sl c5mw1">
                  <button
                    type="submit"
                    className="text-white bg-teal-500 cvy08 cxdxt cs8sl cnc7y ctr9b"
                  >
                    <span>Send</span>
                    <svg
                      className="c2npy cjt7a cgal9 c39kt cwc3u"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="c4u31"
                        d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </section>
    </>
  );
}
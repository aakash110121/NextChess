'use client'
import { useState } from "react";
import Image from 'next/image';
import Testimonial1 from '@/public/images/testimonial-01.jpg';
import Testimonial2 from '@/public/images/testimonial-02.jpg';
import Testimonial3 from '@/public/images/testimonial-03.jpg';
import Testimonial4 from '@/public/images/testimonial-04.jpg';
import Testimonial5 from '@/public/images/testimonial-05.png';




export default function HomePage() {
  const [category, setCategory] = useState(1);
  const testimonials = [
    {
      id: 1,
      imgSrc: Testimonial1,
      altText: 'Testimonial 01',
      quote: '“ This platform is a game-changer for chess enthusiasts like me. The AI analysis feature has drastically improved my understanding of the game. I can now pinpoint my mistakes and learn from them in real-time. The seamless experience across my phone and laptop makes it even better. Highly recommended for anyone serious about improving their chess skills! ”',
      author: 'Alex P.',
      company: '',
      link: '#0',
    },
    {
      id: 2,
      imgSrc: Testimonial2,
      altText: 'Testimonial 02',
      quote: "“ I've tried a few online chess platforms, but this one stands out. The interactive lessons are top-notch, making it easy to grasp even the most complex strategies. The community here is also great—I've met players from all over the world and even found a regular sparring partner. This is my go-to place for all things chess. ”",
      author: 'Sophia L.',
      company: '',
      link: '#0',
    },
    {
      id: 3,
      imgSrc: Testimonial3,
      altText: 'Testimonial 03',
      quote: '“ As someone who enjoys a good challenge, the regular tournaments on this platform are fantastic. The matchmaking is spot-on, so I always get to play against someone at my level.The puzzle trainer is another feature I love—it keeps me sharp and ready for any game.Plus, I can customize my board and pieces, making the experience more personal. ”',
      author: 'Michael R.',
      company: 'Sync',
      link: '#0',
    },
    {
      id: 4,
      imgSrc: Testimonial4,
      altText: 'Testimonial 04',
      quote: '“ I appreciate how this platform caters to both beginners and experienced players. The detailed player profiles help me track my progress and see where I stand compared to others. The cross-device sync is flawless—I can start a game on my tablet and finish it on my desktop without any issues. It’s a must-try for chess lovers. ”',
      author: 'Emma K.',
      company: 'Appicu',
      link: '#0',
    },
    {
      id: 5,
      imgSrc: Testimonial5,
      altText: 'Testimonial 05',
      quote: '“ Security is a big deal for me, and this platform doesn’t disappoint. The anti-cheating measures are robust, ensuring that every match is fair. I’ve been playing here for months, and I’ve never encountered any issues. The site also offers a great variety of features, from opening explorers to in-depth game analysis. It’s everything a chess player could ask for. ”',
      author: 'James T.',
      company: 'Appicu',
      link: '#0',
    },
  ];

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


      {/* Hero */}
      <section>
        <div className="czd2q c92f3 cmhb9 c1plj">
          <div className="c1r3i c8lmj cew09 c09hn">

            {/* Hero content */}
            <div className="ckv2s cxdxt co6hs c8zhu chdqp">
              
              {/* Content */}
              <div className="cpo9b c2igy c7z56 c5ymx c4u1v cy5hl">
                <h1 className="cps50 cbhe1 c21u3 cyb9k c41dw" data-aos="fade-down">
                Chess: Training of the mind
                </h1>
                <p className="text-gray-600 c0atf czz36" data-aos="fade-down" data-aos-delay="150">
                For centuries chess has been a tool for people to develop their minds. Chess requires you to
                think strategically take a step back and absorb the situation.
                </p>
                {/* CTA form */}
                <ul className="text-gray-600 c0atf csd7z cd663 c2k38 cmhb9 c6xwf c2bi2" data-aos="fade-down" data-aos-delay="450">
                  <li className="cxdxt csrqa cnc7y">
                    <svg className="text-teal-400 c4u31 c2npy cui34 c39kt cwc3u" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"></path>
                    </svg>
                    <span>Simple User Interface</span>
                  </li>
                  <li className="cxdxt csrqa cnc7y">
                    <svg className="text-teal-400 c4u31 c2npy cui34 c39kt cwc3u" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"></path>
                    </svg>
                    <span>Great For All Skill Levels</span>
                  </li>
                  <li className="cxdxt csrqa cnc7y">
                    <svg className="text-teal-400 c4u31 c2npy cui34 c39kt cwc3u" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"></path>
                    </svg>
                    <span>A.I. Oponent for offline play</span>
                  </li>
                </ul>
                <div className="play-now">
                  <a className="text-white bg-teal-500 cvy08 c9xc1" href="play-now">Play Now</a>
                </div>
              </div>

              {/* Mobile mockup */}
              <div className="cw9gd c8udt cob0z c5ymx" data-aos="fade-up" data-aos-delay="450">
                <div className="cw3my cxdxt czak8 czjaw vd-div">
                  {/* Glow illustration */}
                  <svg className="cey85 cimtg cgk3d cy5gd cdwzm codcr" aria-hidden="true" width="678" height="634" viewBox="0 0 678 634" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="240" cy="394" r="240" fill="url(#piphoneill_paint0_radial)" fillOpacity=".4"></circle>
                    <circle cx="438" cy="240" r="240" fill="url(#piphoneill_paint1_radial)" fillOpacity=".6"></circle>
                    <defs>
                      <radialGradient id="piphoneill_paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 -77 317) scale(189.054)">
                        <stop stopColor="#667EEA"></stop>
                        <stop offset="1" stopColor="#667EEA" stopOpacity=".01"></stop>
                      </radialGradient>
                      <radialGradient id="piphoneill_paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 99 339) scale(189.054)">
                        <stop stopColor="#9F7AEA"></stop>
                        <stop offset="1" stopColor="#9F7AEA" stopOpacity=".01"></stop>
                      </radialGradient>
                    </defs>
                  </svg>
                  {/* Image inside mockup size: 290x624px (or 580x1248px for Retina devices) */}
                  <video className="cgk3d" width="290" height="644" autoPlay loop muted controls={false} style={{ maxWidth: '84.33%', marginTop: '20px' }}>
                    <source src="images/video-cess.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {/* iPhone mockup */}
                  <img className="cey85 csd7z cvjv9 czjaw cas9o cmhb9 cb1y1" src="images/iphone-mockup.png" width="344" height="674" alt="iPhone mockup" aria-hidden="true" />
                </div>
              </div>
              
            </div>

          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="czjaw">
        {/* Background gradient (light version only) */}
        <div className="cey85 clgvu chf91 cdy81 cgk3d c35ck chb9f c2s69 cp8ye c02j9 c4shy" aria-hidden="true"></div>
        {/* End background gradient (light version only) */}
        <div className="czd2q czjaw c92f3 cmhb9 c1plj">
          <div className="cdoe6 ccem0">
            <div className="cufz0 cv9a4 c5ymx cy220 c5v0a c74as" data-aos-id-stats="">
              {/* 1st item */}
              <div className="cj3dx ch76r c6zr7 cwpmf co95y" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]">
                <div className="cps50 ckyqm c21u3 cnolr ccipq">2.4M</div>
                <div className="text-gray-600 c0atf">Member Active</div>
              </div>
              {/* 2nd item */}
              <div className="cj3dx ch76r c6zr7 cwpmf co95y" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="100">
                <div className="cps50 ckyqm c21u3 cnolr ccipq">2K+</div>
                <div className="text-gray-600 c0atf">Expert team</div>
              </div>
              {/* 3rd item */}
              <div className="cj3dx ch76r c6zr7 cwpmf co95y" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="200">
                <div className="cps50 ckyqm c21u3 cnolr ccipq">751+</div>
                <div className="text-gray-600 c0atf">Winning Competition</div>
              </div>
              {/* 4th item */}
              <div className="cj3dx ch76r c6zr7 cwpmf co95y" data-aos="fade-down" data-aos-anchor="[data-aos-id-stats]" data-aos-delay="300">
                <div className="cps50 ckyqm c21u3 cnolr ccipq">20+</div>
                <div className="text-gray-600 c0atf">years of Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="cq8p6 co2a3 czjaw cnqgv">
        {/* Background gradient */}
        <div className="cey85 cww77 c1qo9 c7l4p ccuod chf91 cgk3d chb9f c2ysc c4shy" aria-hidden="true"></div>
        {/* End background gradient */}
        <div className="czd2q czjaw c92f3 cmhb9 c1plj">
          <div className="c1xxg cxbax">

            {/* Section header */}
            <div className="c5ymx calbx c1r3i cmhb9 ccem0">
              <h2 className="cps50 cyb9k cdjn8">Why Choose Us</h2>
            </div>

            {/* Section content */}
            <div>
              <div className="cnenp cy220 crcpd c74as">

                {/* Category buttons */}
                <div className="criy0 cw3my cgjws cyb33 cxu0t cc5g5 cmcbz c198j cnc7y">
                  {[1, 2, 3, 4, 5].map((id) => (
                    <button
                      key={id}
                      className={`text-left criy0 cw3my cxdxt clq5w cf4hw ccb29 ceo83 cw81f cmcbz ceg5n cszwl cnc7y c5mw1 ci4w1 cimjo ${
                        category == id ? 'bg-teal-500 c7uhb ckzxk c9xdy cidpy ccnjx' : 'c6zr7 cco8t cj3dx cocu3'
                      }`}
                      onClick={() => setCategory(id)}
                    >
                      <svg className="c2npy cui34 ckyke cca3l" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path
                          className={`c4u31 ${
                            category === id ? 'text-teal-200 cv8tj' : 'text-teal-500 c0atf'
                          }`}
                          d={
                            id === 1
                              ? "M5 16H4a4 4 0 01-4-4v-1h2v1a2 2 0 002 2h1v2zM13 10h-1.686l-1.207-1.207L14.37 4.63a2.121 2.121 0 00-3-3L7.207 5.793 5.99 4.576 5.98 3.02 3.038.079 0 3.117 3 6h1.586l1.207 1.207L4 9l3 3 1.793-1.793L10 11.414V13l3.01 3.01 2.98-2.979L13 10z"
                              : id === 2
                              ? "M8 3l4 4H4zM8 13L4 9h8zM1 0h14v2H1zM1 14h14v2H1z"
                              : id === 3
                              ? "M6 0H1a1 1 0 00-1 1v5a1 1 0 001 1h5a1 1 0 001-1V1a1 1 0 00-1-1zM5 5H2V2h3v3zM15 9h-5a1 1 0 00-1 1v5a1 1 0 001 1h5a1 1 0 001-1v-5a1 1 0 00-1-1zm-1 5h-3v-3h3v3zM6 9H1a1 1 0 00-1 1v5a1 1 0 001 1h5a1 1 0 001-1v-5a1 1 0 00-1-1zm-1 5H2v-3h3v3zM12.5 7a1 1 0 01-.707-.293l-2.5-2.5a1 1 0 010-1.414l2.5-2.5a1 1 0 011.414 0l2.5 2.5a1 1 0 010 1.414l-2.5 2.5A1 1 0 0112.5 7z"
                              : id === 4
                              ? "M15.4.6c-.84-.8-2.16-.8-3 0L8.7 4.3c.73.252 1.388.68 1.916 1.244.469.515.83 1.119 1.065 1.775L15.4 3.6c.8-.84.8-2.16 0-3zM4.937 6.9c-1.2 1.2-1.4 5.7-1.4 5.7s4.4-.4 5.6-1.5a2.987 2.987 0 000-4.2 2.9 2.9 0 00-4.2 0z"
                              : "M11 16v-5h5V0H5v5H0v11h11zM2 7h7v7H2V7z"
                          }
                        ></path>
                      </svg>
                      <span className={`${category === id ? 'text-white cv8tj' : 'text-gray-600 cf26p'}`}>
                        {id === 1
                          ? 'Innovative Learning Tools'
                          : id === 2
                          ? 'Community-Focused'
                          : id === 3
                          ? 'Play Anywhere, Anytime'
                          : id === 4
                          ? 'Tailored Experience'
                          : 'Secure & Fair Play'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Videos */}
                <div className="cjyhr c04nn cdzyi c2k38 cmhb9">
                  <div className="co9sm cbv7r c74as">
                    {category === 1 && (
                      <div className="czjaw h-full">   
                        <div className="h-full text-white cgplj cxwxu bg-grade ch76r c54sb ccqhl cnc7y ccgug aos-init aos-animate">
                          <div className="cps50 ckyqm c21u3 czz36 ccipq">Innovative Learning Tools</div>
                          <div className="cvshg cyb9k c2h4q">Our platform provides advanced tools and resources tailored for players at every level. With
                          interactive lessons and AI-driven analysis, we help you elevate your chess game.</div>
                        </div>											
                      </div>
                    )}
                    {(category === 1 || category === 2) && (
                      <div className="czjaw h-full">   
                        <div className="h-full text-white cgplj cxwxu bg-grade ch76r c54sb ccqhl cnc7y ccgug aos-init aos-animate">
                          <div className="cps50 ckyqm c21u3 czz36 ccipq">Community-Focused</div>
                          <div className="cvshg cyb9k c2h4q">Connect with a global network of chess enthusiasts. Engage in friendly matches, competitive
                          tournaments, and seek advice—all within our supportive community.</div>
                        </div>											
                      </div>
                    )}
                    {(category === 1 || category === 3) && (
                      <div className="czjaw h-full">   
                        <div className="h-full text-white cgplj cxwxu bg-grade ch76r c54sb ccqhl cnc7y ccgug aos-init aos-animate">
                          <div className="cps50 ckyqm c21u3 czz36 ccipq">Card Limits</div>
                          <div className="cvshg cyb9k c2h4q">Players can only hold a certain number of cards at any time (e.g., 3 cards). If they draw another card, they must choose one to discard.</div>
                        </div>											
                      </div>
                    )}
                    {(category === 1 || category === 4) && (
                      <div className="czjaw h-full">   
                        <div className="h-full text-white cgplj cxwxu bg-grade ch76r c54sb ccqhl cnc7y ccgug aos-init aos-animate">
                          <div className="cps50 ckyqm c21u3 czz36 ccipq">Play Anywhere, Anytime</div>
                          <div className="cvshg cyb9k c2h4q">Enjoy a consistent chess experience across all devices. Whether you&#39;re using a desktop,
                          mobile, or tablet, your games are always at your fingertips.</div>
                        </div>											
                      </div>
                    )}
                    {(category === 2 || category === 5) && (
                      <div className="czjaw h-full">   
                        <div className="h-full text-white cgplj cxwxu bg-grade ch76r c54sb ccqhl cnc7y ccgug aos-init aos-animate">
                          <div className="cps50 ckyqm c21u3 czz36 ccipq">Tailored Experience</div>
                          <div className="cvshg cyb9k c2h4q">Customize your chess journey to fit your preferences. From personalized profiles to
                          adjustable game settings and learning paths, our platform adapts to your needs.</div>
                        </div>											
                      </div>
                    )}
                    {(category === 2 || category === 3) && (
                      <div className="czjaw h-full">   
                        <div className="h-full text-white cgplj cxwxu bg-grade ch76r c54sb ccqhl cnc7y ccgug aos-init aos-animate">
                          <div className="cps50 ckyqm c21u3 czz36 ccipq">Secure & Fair Play</div>
                          <div className="cvshg cyb9k c2h4q">We ensure the integrity of every match with advanced anti-cheating measures and a secure
                          gaming environment, guaranteeing fair and enjoyable gameplay.</div>
                        </div>											
                      </div>
                    )}
                    {(category === 2 || category === 4) && (
                      <div className="czjaw h-full">   
                        <div className="h-full text-white cgplj cxwxu bg-grade ch76r c54sb ccqhl cnc7y ccgug aos-init aos-animate">
                          <div className="cps50 ckyqm c21u3 czz36 ccipq">Frequent Tournaments & Events</div>
                          <div className="cvshg cyb9k c2h4q">Stay engaged with our regular tournaments and events. Compete with players at your skill
                          level and climb the ranks to demonstrate your abilities.</div>
                        </div>											
                      </div>
                    )}
                   
                  
                  </div>
                </div>

              </div>

            </div>
          </div>
          </div>
      </section>

      {/* Tabs */}
      <section>
        <div className="czd2q c92f3 cmhb9 c1plj">
          <div className="cq8p6 cvde3 c1xxg cnqgv cxbax">

            {/* Section header */}
            <div className="c5ymx calbx cdoe6 cmhb9 ccem0">
            <h2 className="cps50 cdjn8">Our Features</h2>
            </div>

            {/* Items */}
            <div className="clyfp cdxx5 crfqu c04nn c1xn5 cy220 c3t8k cmhb9 c5v0a c74as" data-aos-id-featbl="">

            {/* 1st item */}
            <a 
              className="text-white cgplj cxwxu cssaq cct02 ch76r c54sb ccqhl cnc7y ccgug" 
              href="#0" 
              data-aos="fade-down" 
              data-aos-anchor="[data-aos-id-featbl]"
            >
              <svg className="cyws0 csz25 cchtt" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M19 18.414l-4 4L9.586 17l.707-.707L12 14.586V8.414l-5-5L4.414 6l6.293 6.293-1.414 1.414L1.586 6 7 .586l7 7v5l8.463-8.463a3.828 3.828 0 115.414 5.414L21 16.414v6.172l5 5L28.586 25l-6.293-6.293 1.414-1.414L31.414 25 26 30.414l-7-7v-5zm-4 1.172L26.463 8.123a1.828 1.828 0 10-2.586-2.586L12.414 17 15 19.586zM11 30v2C4.925 32 0 27.075 0 21h2a9 9 0 009 9zm0-5v2a6 6 0 01-6-6h2a4 4 0 004 4z" 
                fillRule="nonzero"
              ></path>
              </svg>
              <div className="cps50 ckyqm c21u3 czz36 ccipq">Interactive Lessons & Tutorials</div>
              <div className="cvshg cyb9k c2h4q">Master chess from the basics to advanced strategies through our comprehensive, interactive
              lessons. Perfect for players at all levels.</div>
              <svg className="ca6it crgjb clq5w ccb29 ceo83 cgdju c1xg5 cr68y cj7c4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M13 11V5.057L22.72 12 13 18.943V13H2v-2h11zm2 4.057L19.28 12 15 8.943v6.114z" 
              ></path>
              </svg>
            </a>

            {/* 2nd item */}
            <a 
              className="text-white cf0yc cgplj c65d8 cppj5 ch76r c54sb ccqhl cnc7y ccgug" 
              href="#0" 
              data-aos="fade-down" 
              data-aos-anchor="[data-aos-id-featbl]" 
              data-aos-delay="100"
            >
              <svg className="cyws0 csz25 cchtt" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M20.796 20l-1.677 7.264a6 6 0 01-7.302 4.471L0 28.781V11.54l.35-.3 9.457-8.107a3.751 3.751 0 015.29 5.29L11.175 13H28.5a3.5 3.5 0 012.6 1.156c.663.736.984 1.72.878 2.74-.252 1.808-1.817 3.143-3.622 3.104h-7.56zM2 27.22l10.303 2.575a4 4 0 004.868-2.98L19.204 18h9.173c.812.018 1.508-.575 1.615-1.345A1.5 1.5 0 0028.5 15H11.173a2 2 0 01-1.517-3.3l3.922-4.577a1.755 1.755 0 00-.597-2.733 1.751 1.751 0 00-1.872.262L2 12.46v14.76zM28 .585L29.414 2 23 8.414 21.586 7 28 .586zm-8.272 6.627l-1.94-.485 1.484-5.94 1.94.484-1.484 5.94zm3.544 5l-.485-1.94 5.94-1.486.486 1.94-5.94 1.486z" 
                fillRule="nonzero"
              ></path>
              </svg>
              <div className="cps50 ckyqm c21u3 czz36 ccipq">AI-Powered Game Analysis</div>
              <div className="cvshg cyb9k c2h4q">Improve your skills with powerful AI tools that offer move suggestions, in-depth feedback,
              and detailed analysis of your games.</div>
              <svg className="ca6it crgjb clq5w ccb29 ceo83 cgdju c1xg5 cr68y cj7c4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M13 11V5.057L22.72 12 13 18.943V13H2v-2h11zm2 4.057L19.28 12 15 8.943v6.114z" 
              ></path>
              </svg>
            </a>

            {/* 3rd item */}
            <a 
              className="text-white cjrbh cgplj cykzy cn0r1 ch76r c54sb ccqhl cnc7y ccgug" 
              href="#0" 
              data-aos="fade-down" 
              data-aos-anchor="[data-aos-id-featbl]" 
              data-aos-delay="200"
            >
              <svg className="cyws0 csz25 cchtt" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M19 5.612V25a6 6 0 11-2-4.472V0h2v2.961A5.98 5.98 0 0023.497 5a8.476 8.476 0 018.444 9.474l-.253 2.13-1.469-1.563A6.472 6.472 0 0025.5 13c-1.842 0-3.634-.6-5.103-1.713l1.206-1.594A6.455 6.455 0 0025.5 11c1.557 0 3.068.428 4.376 1.217A6.475 6.475 0 0023.5 7 7.981 7.981 0 0119 5.612zM13 29a4 4 0 100-8 4 4 0 000 8zM0 5V3h14v2H0zm0 5V8h14v2H0zm0 5v-2h14v2H0z" 
                fillRule="nonzero"
              ></path>
              </svg>
              <div className="cps50 ckyqm c21u3 czz36 ccipq">Real-Time Matchmaking</div>
              <div className="cvshg cyb9k c2h4q">Instantly find opponents that match your skill level. Our smart matchmaking system ensures
              you always face a challenging and enjoyable game.</div>
              <svg className="ca6it crgjb clq5w ccb29 ceo83 cgdju c1xg5 cr68y cj7c4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M13 11V5.057L22.72 12 13 18.943V13H2v-2h11zm2 4.057L19.28 12 15 8.943v6.114z" 
              ></path>
              </svg>
            </a>

            {/* 4th item */}
            <a 
              className="text-white cgplj cyfvj chrd2 cxp5i ch76r c54sb ccqhl cnc7y ccgug" 
              href="#0" 
              data-aos="fade-down" 
              data-aos-anchor="[data-aos-id-featbl]" 
              data-aos-delay="300"
            >
              <svg className="cyws0 csz25 cchtt" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M20.243 6.757l.707.707-1.414 1.414-.707-.707a4 4 0 00-5.658 0l-.707.707-1.414-1.414.707-.707a6 6 0 018.486 0zm3.535-3.535l.707.707-1.414 1.414-.707-.707a9 9 0 00-12.728 0l-.707.707L7.515 3.93l.707-.707c4.296-4.296 11.26-4.296 15.556 0zM9 17.212V16a7 7 0 00-7-7H1V7h1a9 9 0 019 9v.788l2.302 5.18L11 23.117V24a4 4 0 01-4 4H5v3H3v-5h4a2 2 0 002-2v-2.118l1.698-.85L9 17.213zm12-.424V16a9 9 0 019-9h1v2h-1a7 7 0 00-7 7v1.212l-1.698 3.82 1.698.85V24a2 2 0 002 2h4v5h-2v-3h-2a4 4 0 01-4-4v-.882l-2.302-1.15L21 16.787zM16 12a1 1 0 110-2 1 1 0 010 2z" 
                fillRule="nonzero"
              ></path>
              </svg>
              <div className="cps50 ckyqm c21u3 czz36 ccipq">Tournaments & Leagues</div>
              <div className="cvshg cyb9k c2h4q">Join daily, weekly, and monthly tournaments. Participate in leagues to compete with others at
              your level and rise up the leaderboard.</div>
              <svg className="ca6it crgjb clq5w ccb29 ceo83 cgdju c1xg5 cr68y cj7c4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M13 11V5.057L22.72 12 13 18.943V13H2v-2h11zm2 4.057L19.28 12 15 8.943v6.114z" 
              ></path>
              </svg>
            </a>

            {/* 5th item */}
            <a 
              className="text-white cgplj cxwxu cssaq cct02 ch76r c54sb ccqhl cnc7y ccgug" 
              href="#0" 
              data-aos="fade-down" 
              data-aos-anchor="[data-aos-id-featbl]"
            >
              <svg className="cyws0 csz25 cchtt" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M19 18.414l-4 4L9.586 17l.707-.707L12 14.586V8.414l-5-5L4.414 6l6.293 6.293-1.414 1.414L1.586 6 7 .586l7 7v5l8.463-8.463a3.828 3.828 0 115.414 5.414L21 16.414v6.172l5 5L28.586 25l-6.293-6.293 1.414-1.414L31.414 25 26 30.414l-7-7v-5zm-4 1.172L26.463 8.123a1.828 1.828 0 10-2.586-2.586L12.414 17 15 19.586zM11 30v2C4.925 32 0 27.075 0 21h2a9 9 0 009 9zm0-5v2a6 6 0 01-6-6h2a4 4 0 004 4z" 
                fillRule="nonzero"
              ></path>
              </svg>
              <div className="cps50 ckyqm c21u3 czz36 ccipq">Puzzle Trainer</div>
              <div className="cvshg cyb9k c2h4q">Enhance your tactical skills with a vast collection of chess puzzles. Choose from various
              themes and difficulty levels to keep challenging yourself.</div>
              <svg className="ca6it crgjb clq5w ccb29 ceo83 cgdju c1xg5 cr68y cj7c4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M13 11V5.057L22.72 12 13 18.943V13H2v-2h11zm2 4.057L19.28 12 15 8.943v6.114z" 
              ></path>
              </svg>
            </a>

            {/* 6th item */}
            <a 
              className="text-white cf0yc cgplj c65d8 cppj5 ch76r c54sb ccqhl cnc7y ccgug" 
              href="#0" 
              data-aos="fade-down" 
              data-aos-anchor="[data-aos-id-featbl]" 
              data-aos-delay="100"
            >
              <svg className="cyws0 csz25 cchtt" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M20.796 20l-1.677 7.264a6 6 0 01-7.302 4.471L0 28.781V11.54l.35-.3 9.457-8.107a3.751 3.751 0 015.29 5.29L11.175 13H28.5a3.5 3.5 0 012.6 1.156c.663.736.984 1.72.878 2.74-.252 1.808-1.817 3.143-3.622 3.104h-7.56zM2 27.22l10.303 2.575a4 4 0 004.868-2.98L19.204 18h9.173c.812.018 1.508-.575 1.615-1.345A1.5 1.5 0 0028.5 15H11.173a2 2 0 01-1.517-3.3l3.922-4.577a1.755 1.755 0 00-.597-2.733 1.751 1.751 0 00-1.872.262L2 12.46v14.76zM28 .585L29.414 2 23 8.414 21.586 7 28 .586zm-8.272 6.627l-1.94-.485 1.484-5.94 1.94.484-1.484 5.94zm3.544 5l-.485-1.94 5.94-1.486.486 1.94-5.94 1.486z" 
                fillRule="nonzero"
              ></path>
              </svg>
              <div className="cps50 ckyqm c21u3 czz36 ccipq">Customizable Board & Pieces</div>
              <div className="cvshg cyb9k c2h4q">Make every game visually appealing by selecting from a variety of board themes and piece
              designs that suit your style.</div>
              <svg className="ca6it crgjb clq5w ccb29 ceo83 cgdju c1xg5 cr68y cj7c4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M13 11V5.057L22.72 12 13 18.943V13H2v-2h11zm2 4.057L19.28 12 15 8.943v6.114z" 
              ></path>
              </svg>
            </a>

            {/* 7th item */}
            <a 
              className="text-white cjrbh cgplj cykzy cn0r1 ch76r c54sb ccqhl cnc7y ccgug" 
              href="#0" 
              data-aos="fade-down" 
              data-aos-anchor="[data-aos-id-featbl]" 
              data-aos-delay="200"
            >
              <svg className="cyws0 csz25 cchtt" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M19 5.612V25a6 6 0 11-2-4.472V0h2v2.961A5.98 5.98 0 0023.497 5a8.476 8.476 0 018.444 9.474l-.253 2.13-1.469-1.563A6.472 6.472 0 0025.5 13c-1.842 0-3.634-.6-5.103-1.713l1.206-1.594A6.455 6.455 0 0025.5 11c1.557 0 3.068.428 4.376 1.217A6.475 6.475 0 0023.5 7 7.981 7.981 0 0119 5.612zM13 29a4 4 0 100-8 4 4 0 000 8zM0 5V3h14v2H0zm0 5V8h14v2H0zm0 5v-2h14v2H0z" 
                fillRule="nonzero"
              ></path>
              </svg>
              <div className="cps50 ckyqm c21u3 czz36 ccipq">Detailed Player Profiles</div>
              <div className="cvshg cyb9k c2h4q">Monitor your progress, review game history, and compare stats with other players. Your
              profile reflects your chess journey.</div>
              <svg className="ca6it crgjb clq5w ccb29 ceo83 cgdju c1xg5 cr68y cj7c4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M13 11V5.057L22.72 12 13 18.943V13H2v-2h11zm2 4.057L19.28 12 15 8.943v6.114z" 
              ></path>
              </svg>
            </a>

            {/* 8th item */}
            <a 
              className="text-white cgplj cyfvj chrd2 cxp5i ch76r c54sb ccqhl cnc7y ccgug" 
              href="#0" 
              data-aos="fade-down" 
              data-aos-anchor="[data-aos-id-featbl]" 
              data-aos-delay="300"
            >
              <svg className="cyws0 csz25 cchtt" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M20.243 6.757l.707.707-1.414 1.414-.707-.707a4 4 0 00-5.658 0l-.707.707-1.414-1.414.707-.707a6 6 0 018.486 0zm3.535-3.535l.707.707-1.414 1.414-.707-.707a9 9 0 00-12.728 0l-.707.707L7.515 3.93l.707-.707c4.296-4.296 11.26-4.296 15.556 0zM9 17.212V16a7 7 0 00-7-7H1V7h1a9 9 0 019 9v.788l2.302 5.18L11 23.117V24a4 4 0 01-4 4H5v3H3v-5h4a2 2 0 002-2v-2.118l1.698-.85L9 17.213zm12-.424V16a9 9 0 019-9h1v2h-1a7 7 0 00-7 7v1.212l-1.698 3.82 1.698.85V24a2 2 0 002 2h4v5h-2v-3h-2a4 4 0 01-4-4v-.882l-2.302-1.15L21 16.787zM16 12a1 1 0 110-2 1 1 0 010 2z" 
                fillRule="nonzero"
              ></path>
              </svg>
              <div className="cps50 ckyqm c21u3 czz36 ccipq">Social Features</div>
              <div className="cvshg cyb9k c2h4q">Stay connected with friends, join clubs, and follow top players. Our platform makes it easy to
              connect with others who share your passion for chess.</div>
              <svg className="ca6it crgjb clq5w ccb29 ceo83 cgdju c1xg5 cr68y cj7c4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M13 11V5.057L22.72 12 13 18.943V13H2v-2h11zm2 4.057L19.28 12 15 8.943v6.114z" 
              ></path>
              </svg>
            </a>
            {/* 9th item */}
            <a 
              className="text-white cgplj cxwxu cssaq cct02 ch76r c54sb ccqhl cnc7y ccgug" 
              href="#0" 
              data-aos="fade-down" 
              data-aos-anchor="[data-aos-id-featbl]"
            >
              <svg className="cyws0 csz25 cchtt" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M19 18.414l-4 4L9.586 17l.707-.707L12 14.586V8.414l-5-5L4.414 6l6.293 6.293-1.414 1.414L1.586 6 7 .586l7 7v5l8.463-8.463a3.828 3.828 0 115.414 5.414L21 16.414v6.172l5 5L28.586 25l-6.293-6.293 1.414-1.414L31.414 25 26 30.414l-7-7v-5zm-4 1.172L26.463 8.123a1.828 1.828 0 10-2.586-2.586L12.414 17 15 19.586zM11 30v2C4.925 32 0 27.075 0 21h2a9 9 0 009 9zm0-5v2a6 6 0 01-6-6h2a4 4 0 004 4z" 
                fillRule="nonzero"
              ></path>
              </svg>
              <div className="cps50 ckyqm c21u3 czz36 ccipq">Cross-Device Synchronization</div>
              <div className="cvshg cyb9k c2h4q">Start a game on one device and continue on another. Your games are always synchronized,
              allowing for uninterrupted play.</div>
              <svg className="ca6it crgjb clq5w ccb29 ceo83 cgdju c1xg5 cr68y cj7c4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M13 11V5.057L22.72 12 13 18.943V13H2v-2h11zm2 4.057L19.28 12 15 8.943v6.114z" 
              ></path>
              </svg>
            </a>

            {/* 10th item */}
            <a 
              className="text-white cf0yc cgplj c65d8 cppj5 ch76r c54sb ccqhl cnc7y ccgug" 
              href="#0" 
              data-aos="fade-down" 
              data-aos-anchor="[data-aos-id-featbl]" 
              data-aos-delay="100"
            >
              <svg className="cyws0 csz25 cchtt" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M20.796 20l-1.677 7.264a6 6 0 01-7.302 4.471L0 28.781V11.54l.35-.3 9.457-8.107a3.751 3.751 0 015.29 5.29L11.175 13H28.5a3.5 3.5 0 012.6 1.156c.663.736.984 1.72.878 2.74-.252 1.808-1.817 3.143-3.622 3.104h-7.56zM2 27.22l10.303 2.575a4 4 0 004.868-2.98L19.204 18h9.173c.812.018 1.508-.575 1.615-1.345A1.5 1.5 0 0028.5 15H11.173a2 2 0 01-1.517-3.3l3.922-4.577a1.755 1.755 0 00-.597-2.733 1.751 1.751 0 00-1.872.262L2 12.46v14.76zM28 .585L29.414 2 23 8.414 21.586 7 28 .586zm-8.272 6.627l-1.94-.485 1.484-5.94 1.94.484-1.484 5.94zm3.544 5l-.485-1.94 5.94-1.486.486 1.94-5.94 1.486z" 
                fillRule="nonzero"
              ></path>
              </svg>
              <div className="cps50 ckyqm c21u3 czz36 ccipq">Comprehensive Opening Explorer</div>
              <div className="cvshg cyb9k c2h4q">Dive into thousands of openings and their variations. Study the strategies of chess masters
              and build your own repertoire.</div>
              <svg className="ca6it crgjb clq5w ccb29 ceo83 cgdju c1xg5 cr68y cj7c4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="c4u31" 
                d="M13 11V5.057L22.72 12 13 18.943V13H2v-2h11zm2 4.057L19.28 12 15 8.943v6.114z" 
              ></path>
              </svg>
            </a>

            </div>
            <div className="play-now play-center">
            <a className="text-white bg-teal-500 cvy08 c9xc1" href="play-now">Play Now</a>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="czd2q c92f3 cmhb9 c1plj">
          <div className="cq8p6 co2a3 c1xxg cnqgv cxbax">

            {/* Testimonials */}
            <div className="clyfp crfqu c04nn cgv10 cn6x8 c07xy c2k38 c46gb cmhb9 cldwg c74as">

            {testimonials.map((testimonial) => (
              <div className="c5ymx" key={testimonial.id}>
              <div className="czak8 czjaw c54sb cyb9k">
                <Image
                className="cpz4m"
                src={testimonial.imgSrc}
                width={56}
                height={56}
                alt={testimonial.altText}
                />
                <svg className="cgk3d c2s69 cti3h cv0d8 cshj2" width="27" height="12" xmlns="http://www.w3.org/2000/svg">
                <path
                  className="text-mehrun c4u31"
                  d="M2.785 5.334C2.538 5.5-.2 2.944.011 2.646.826 1.483 2.183.836 3.62.5 5.064.158 6.582.117 7.92-.02c.017-.002.098.153.088.166-1.763 2.018-3.223 3.836-5.221 5.188zm3.676 6.519c-.862.184-1.937-3.403-1.07-3.711 3.422-1.22 7.078-1.671 10.728-1.766 3.655-.096 7.304.162 10.866.32.044.002.06.177.018.187-6.938 1.634-13.691 3.504-20.542 4.97z"
                />
                </svg>
              </div>
              <blockquote className="text-gray-600 c0atf czz36">
                {testimonial.quote}
              </blockquote>
              <div className="cps50 cu5hn cltxh">
                <cite className="cl4eo">—{testimonial.author}</cite>,{' '}
                <a className="text-teal-500 clq5w ccb29 ceo83" href={testimonial.link}>
                {testimonial.company}
                </a>
              </div>
              </div>
            ))}

            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="czd2q c92f3 cmhb9 c1plj">

          {/* CTA box */}
          <div className="dark bg-gray-800 c7rl6 c5dtj czjaw cxbms cg1xa">

            {/* Background illustration */}
            <div className="cey85 c8fh2 cgk3d c2ysc" aria-hidden="true">
            <svg className="c1zcx" width="400" height="232" viewBox="0 0 400 232" xmlns="http://www.w3.org/2000/svg">
              <defs>
              <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" r="39.386%" id="box-gr-a">
                <stop stopColor="#667EEA" offset="0%" />
                <stop stopColor="#667EEA" stopOpacity="0" offset="100%" />
              </radialGradient>
              <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" r="39.386%" id="box-gr-b">
                <stop stopColor="#3ABAB4" offset="0%" />
                <stop stopColor="#3ABAB4" stopOpacity="0" offset="100%" />
              </radialGradient>
              </defs>
              <g transform="translate(-85 -369)" fill="none" fillRule="evenodd">
              <circle fillOpacity=".16" fill="url(#box-gr-a)" cx="413" cy="688" r="240" />
              <circle fillOpacity=".24" fill="url(#box-gr-b)" cx="400" cy="400" r="400" />
              </g>
            </svg>
            </div>

            <div className="ctiy6 cxdxt cavyv czjaw c54sb cnc7y">

            {/* CTA content */}
            <div className="c346e c5ymx c9epb cescn crh83 cnxpd">
              <h3 className="cps50 crnbw cm36t">
              Experience the Future of Chess! 
              </h3>
            </div>

            {/* CTA form */}
            <form className="c9epb cs8sl">
              <div className="cw3my c04nn cd663 cks70 c3t8k c54sb cmhb9 cnc7y">
              <a className="text-white bg-teal-500 cvy08 c2npy ctr9b" href="/contact">Contact Us Now!</a>
              </div>
              {/* Success message */}
              {/* <p className="text-center lg:text-left lg:absolute mt-2 opacity-75 text-sm">Thanks for subscribing!</p> */}
            </form>

            </div>

          </div>

        </div>
      </section>
 
    </>
  );
}
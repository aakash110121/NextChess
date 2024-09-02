import React from 'react';
import { Metadata } from "next";
import Image from 'next/image';
import HeroBgImg from '@/public/images/hero-bg-03.jpg';

export const metadata: Metadata = {
  title: 'Chess Tournaments | Squsts',
}



export default async function Page() {
    return (
      <>
        {/* Hero */}
        <section className="czjaw">
      
          {/* Background image */}
          <div className="cbng2 cgk3d c2ysc c4shy cgjq2 codcr">
            <Image
              className="c9sso c3j32 cgk3d c2ysc c1zcx cs8sl"
              src={HeroBgImg}
              width={1440}
              height={577}
              alt="How to play"
              />
            <div 
              className="c6z3b clgvu ckfkh cgk3d c2ysc" 
              aria-hidden="true"
            ></div>
          </div>
  
          <div className="czd2q czjaw c92f3 cmhb9 c1plj">
            <div className="c1r3i c8lmj ccem0 c09hn">
              
              {/* Featured article */}
              <div className="calbx" data-aos="fade-down">
                <article>
                  <header>
                    {/* Title and excerpt */}
                    <div className="c7z56 c5ymx">
                      <a href="blog-post.html">
                        <h1 className="cps50 cyb9k c41dw">
                        Join the Excitement: Squsts Chess Tournaments
                        </h1>
                      </a>
                      <p className="text-gray-600 c0atf czz36">Welcome to the "How to Play" guide for Squsts. Whether you’re new to chess or looking to master our unique card-enhanced version, this guide will walk you through the basics and help you get started. Let’s dive in!</p>
                    </div>
                  </header>
                </article>
              </div>
  
            </div>
          </div>
          
        </section>
  
        {/* Featured posts */}
     
  
        {/* Posts list */}
        <section>
          <div className="czd2q c92f3 cmhb9 c1plj">
            <div className="cdoe6 ccem0">
              <div className="c13rv cfcoc">
  
                {/* Main content */}
                <div className="c5okk" data-aos="fade-down" data-aos-delay="200">
  
                 {/*
                  <h4 className="cps50 cy5hl cm36t">Card-Enhanced Gameplay</h4>
  
                 
                  <div className="clyfp cn6x8 c8eth ch9c5 crcpd c74as">
  
                 
                    <article className="c54sb strng cnc7y">
                      <header>
                        <a className="csz0f" href="blog-post.html">
                          <h3 className="cps50 csrqa cadh6">Understanding the Cards</h3>
                        </a>
                      </header>
                      <p className="text-gray-600 c0atf c2h4q">
                        <strong>Card Deck</strong>: Each player has a deck of 10 unique cards, each offering a special ability that can be used during the game.
                      </p>
                      <p className="text-gray-600 c0atf c2h4q">
                        <strong>Card Types</strong>: Cards may offer various effects, such as moving two pieces in one turn, protecting a piece, or even reversing a move.
                      </p>
                    </article>
  
                   
                    <article className="c54sb strng cnc7y">
                      <header>
                        <a className="csz0f" href="blog-post.html">
                          <h3 className="cps50 csrqa cadh6">How to Use Cards</h3>
                        </a>
                      </header>
                      <p className="text-gray-600 c0atf c2h4q">
                        <strong>Drawing Cards</strong>: Players start with 5 cards and may draw additional cards at certain intervals or under specific conditions.
                      </p>
                      <p className="text-gray-600 c0atf c2h4q">
                        <strong>Playing a Card</strong>: On your turn, you can choose to play a card before or after your regular chess move. Each card can only be used once per game.
                      </p>
                    </article>
  
                   
                    <article className="c54sb strng cnc7y">
                      <header>
                        <a className="csz0f" href="blog-post.html">
                          <h3 className="cps50 csrqa cadh6">Setting Up a Match</h3>
                        </a>
                      </header>
                      <p className="text-gray-600 c0atf c2h4q">
                        <strong>Classic Mode</strong>: Choose to play traditional chess without any cards for a pure, classic experience.
                      </p>
                      <p className="text-gray-600 c0atf c2h4q">
                        <strong>Card Mode</strong>: Select the card-enhanced mode to play with the additional strategic elements provided by the cards.
                      </p>
                    </article>
  
               
                    <article className="c54sb strng cnc7y">
                      <header>
                        <a className="csz0f" href="blog-post.html">
                          <h3 className="cps50 csrqa cadh6">During the Game</h3>
                        </a>
                      </header>
                      <p className="text-gray-600 c0atf c2h4q">
                        <strong>Move Your Pieces</strong>: Make your move by selecting a piece and moving it to your desired square.
                      </p>
                      <p className="text-gray-600 c0atf c2h4q">
                        <strong>Use Cards Wisely</strong>: Consider using a card to gain an advantage or counter your opponent’s strategy.
                      </p>
                    </article>
  
                  </div>*/}
  
                  {/* Call to Action Article */}
                  <div className="cszww c5v0a c74as mert">
                    <article className="cj3dx ch76r c54sb c6zr7 cnc7y cdt9h">
                      <header>
                        <h3 className="cps50 ccipq cadh6">
                          <a href="#0">Ready to Play?</a>
                        </h3>
                      </header>
                      <div className="text-gray-600 c0atf c2h4q">
                        <p>
                          Now that you know the basics, it&#39;s time to put your skills to the test! Whether you prefer the classic game or want to explore the new possibilities with card-enhanced gameplay, Squsts has something for everyone. Start a match, challenge your friends, and enjoy the exciting world of chess in a whole new way.<br />Good luck, and have fun!
                        </p>
                      </div>
                    </article>
                  </div>
  
                </div>
  
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }
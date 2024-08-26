import React from 'react';
import { Metadata } from "next";
import Image from 'next/image';
import HeroBgImg from '@/public/images/hero-bg.jpg';
import RelatedPost3 from '@/public/images/related-post-03.jpg';
import RelatedPost4 from '@/public/images/related-post-04.jpg';
import RelatedPost5 from '@/public/images/related-post-05.jpg';
import RelatedPost6 from '@/public/images/related-post-06.jpg';

export const metadata: Metadata = {
  title: 'How to play | Squsts',
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
                        How to Play Chess on Our Platform
                      </h1>
                    </a>
                    <p className="text-gray-600 c0atf czz36">
                      Welcome to the &#34;How to Play&#34; guide for Squsts. Whether you&#39;re new to chess or looking to master our unique card-enhanced version, this guide will walk you through the basics and help you get started. Let&#39;s dive in!
                    </p>
                  </div>
                </header>
              </article>
            </div>

          </div>
        </div>
        
      </section>

      {/* Featured posts */}
      <section>
        <div className="czd2q c92f3 cmhb9 c1plj">
          <div className="c1r3i ccem0">

            <div className="clyfp cdxx5 cszww c5v0a c74as" data-aos-id-featposts="">

            
              <article 
                className="czjaw cl6gq ccqhl c4bes cof2i" 
                data-aos="fade-up" 
                data-aos-anchor="[data-aos-id-featposts]" 
                data-aos-delay="100"
              >
                <figure>
                  <Image
                  className='cq9nz c9sso cez35 c3f8f ceo83 cgk3d cqlpw c2ysc c1zcx cs8sl'
                  src={RelatedPost3}
                  width={258}
                  height={154}
                  alt='Related post 03'
                  />
                  <div className="bg-teal-500 c7n3t cez35 cvdb7 ceo83 cgk3d cqlpw c2ysc" aria-hidden="true"></div>
                </figure>
                <div className="text-white czjaw c54sb c1zcx cnc7y">
                  <header className="">
                    <div className="csz0f">
                      <h3 className="cps50 cci6q cu5hn cwrry csrqa">
                      Create Your Account
                      </h3>
                    </div>
                  </header>
                  <footer>
                    <div className="cvshg ceng1">
                   <p> Start by signing up with your email, or log in using your existing account.</p>
                   <p> Customize your profile and set up your preferences.</p>
                    </div>
                  </footer>
                </div>
              </article>


              <article 
                className="czjaw cl6gq ccqhl c4bes cof2i" 
                data-aos="fade-up" 
                data-aos-anchor="[data-aos-id-featposts]" 
                data-aos-delay="200"
              >
                <figure>
                  <Image
                  className='cq9nz c9sso cez35 c3f8f ceo83 cgk3d cqlpw c2ysc c1zcx cs8sl'
                  src={RelatedPost4}
                  width={258}
                  height={154}
                  alt='Related post 04'
                  />
                  <div className="bg-purple-500 c7n3t cez35 cvdb7 ceo83 cgk3d cqlpw c2ysc" aria-hidden="true"></div>
                </figure>
                <div className="text-white czjaw c54sb c1zcx cnc7y">
                  <header className="">
                    <div className="csz0f">
                      <h3 className="cps50 cci6q cu5hn cwrry csrqa">
                      Find a Game
                      </h3>
                    </div>
                  </header>
                  <footer>
                    <div className="cvshg ceng1">
                      <p><strong>Quick Match:</strong> Instantly find an opponent at your skill level using our real-time matchmaking
                      system.</p>
                      <p><strong>Custom Game:</strong> Set your preferred game parameters (time control, rating range, etc.) and
                      invite a friend or challenge a random player.</p>
                      <p><strong>Tournaments:</strong> Join ongoing tournaments for a chance to compete in a structured
                      environment against players from all over the world.</p>
                    </div>
                  </footer>
                </div>
              </article>

      
              <article 
                className="czjaw cl6gq ccqhl c4bes cof2i" 
                data-aos="fade-up" 
                data-aos-anchor="[data-aos-id-featposts]" 
                data-aos-delay="300"
              >
                <figure>
                  <Image
                  className='cq9nz c9sso cez35 c3f8f ceo83 cgk3d cqlpw c2ysc c1zcx cs8sl'
                  src={RelatedPost5}
                  width={258}
                  height={154}
                  alt='Related post 05'
                  />
                  <div className="bg-indigo-500 c7n3t cez35 cvdb7 ceo83 cgk3d cqlpw c2ysc" aria-hidden="true"></div>
                </figure>
                <div className="text-white czjaw c54sb c1zcx cnc7y">
                  <header className="">
                    <div className="csz0f">
                      <h3 className="cps50 cci6q cu5hn cwrry csrqa">
                      Learn and Improve
                      </h3>
                    </div>
                  </header>
                  <footer>
                    <div className="cvshg ceng1">
                    <p><strong>Interactive Lessons:</strong> Access our comprehensive library of tutorials, covering everything
                    from basic rules to advanced strategies.</p>
                    <p><strong>Puzzle Trainer:</strong> Sharpen your skills by solving chess puzzles of varying difficulty levels.</p>
                    <p><strong>AI Game Analysis:</strong> After each match, review your game with our AI-powered analysis tool.
                    Get insights, suggestions, and detailed feedback to improve your play.</p>
                    </div>
                  </footer>
                </div>
              </article>

          
              <article 
                className="czjaw cl6gq ccqhl c4bes cof2i" 
                data-aos="fade-up" 
                data-aos-anchor="[data-aos-id-featposts]" 
                data-aos-delay="400"
              >
                <figure>
                  <Image
                  className='cq9nz c9sso cez35 c3f8f ceo83 cgk3d cqlpw c2ysc c1zcx cs8sl'
                  src={RelatedPost6}
                  width={258}
                  height={154}
                  alt='Related post 06'
                  />
                  <div className="bg-pink-500 c7n3t cez35 cvdb7 ceo83 cgk3d cqlpw c2ysc" aria-hidden="true"></div>
                </figure>
                <div className="text-white czjaw c54sb c1zcx cnc7y">
                  <header className="">
                    <div className="csz0f">
                      <h3 className="cps50 cci6q cu5hn cwrry csrqa">
                      During the Game
                      </h3>
                    </div>
                  </header>
                  <footer>
                    <div className="cvshg ceng1">
                    <p><strong>Make Your Moves:</strong> Play by clicking or dragging the pieces on the board. Your moves will be
                    highlighted, and legal moves will be shown to help guide you.</p>
                    <p><strong>Use Chat & Emojis:</strong> Communicate with your opponent using the chat feature or send
                    friendly emojis during the game.</p>
                    <p><strong>Pause & Resume:</strong> If you need a break, you can pause the game in casual matches and
                    resume later without losing your progress.</p>
                    </div>
                  </footer>
                </div>
              </article>







              <article 
                className="czjaw cl6gq ccqhl c4bes cof2i" 
                data-aos="fade-up" 
                data-aos-anchor="[data-aos-id-featposts]" 
                data-aos-delay="100"
              >
                <figure>
                  <Image
                  className='cq9nz c9sso cez35 c3f8f ceo83 cgk3d cqlpw c2ysc c1zcx cs8sl'
                  src={RelatedPost3}
                  width={258}
                  height={154}
                  alt='Related post 03'
                  />
                  <div className="bg-teal-500 c7n3t cez35 cvdb7 ceo83 cgk3d cqlpw c2ysc" aria-hidden="true"></div>
                </figure>
                <div className="text-white czjaw c54sb c1zcx cnc7y">
                  <header className="">
                    <div className="csz0f">
                      <h3 className="cps50 cci6q cu5hn cwrry csrqa">
                      Post-Game Options
                      </h3>
                    </div>
                  </header>
                  <footer>
                    <div className="cvshg ceng1">
                    <p><strong>Review Your Game:</strong> Immediately after the game, analyze your performance using the AI
                    analysis or save the game to review later.</p>
                    <p><strong>Rematch or New Opponent:</strong> Challenge your opponent to a rematch or return to the main
                    menu to find a new game.</p>
                    <p><strong>Share Your Game:</strong> Share your game with friends or post it on social media directly from the
                    platform.</p>
                    </div>
                  </footer>
                </div>
              </article>


              <article 
                className="czjaw cl6gq ccqhl c4bes cof2i" 
                data-aos="fade-up" 
                data-aos-anchor="[data-aos-id-featposts]" 
                data-aos-delay="200"
              >
                <figure>
                  <Image
                  className='cq9nz c9sso cez35 c3f8f ceo83 cgk3d cqlpw c2ysc c1zcx cs8sl'
                  src={RelatedPost4}
                  width={258}
                  height={154}
                  alt='Related post 04'
                  />
                  <div className="bg-purple-500 c7n3t cez35 cvdb7 ceo83 cgk3d cqlpw c2ysc" aria-hidden="true"></div>
                </figure>
                <div className="text-white czjaw c54sb c1zcx cnc7y">
                  <header className="">
                    <div className="csz0f">
                      <h3 className="cps50 cci6q cu5hn cwrry csrqa">
                      Explore More Features
                      </h3>
                    </div>
                  </header>
                  <footer>
                    <div className="cvshg ceng1">
                      <p><strong>Player Profiles:</strong> ITrack your progress, view your game history, and compare your stats with
                      other players.</p>
                      <p><strong>Opening Explorer:</strong> Study different chess openings and see how grandmasters played them.</p>
                      <p><strong>Join Clubs:</strong> Become a member of chess clubs, participate in club events, and meet
                      like-minded players.</p>
                    </div>
                  </footer>
                </div>
              </article>

      
              <article 
                className="czjaw cl6gq ccqhl c4bes cof2i" 
                data-aos="fade-up" 
                data-aos-anchor="[data-aos-id-featposts]" 
                data-aos-delay="300"
              >
                <figure>
                  <Image
                  className='cq9nz c9sso cez35 c3f8f ceo83 cgk3d cqlpw c2ysc c1zcx cs8sl'
                  src={RelatedPost5}
                  width={258}
                  height={154}
                  alt='Related post 05'
                  />
                  <div className="bg-indigo-500 c7n3t cez35 cvdb7 ceo83 cgk3d cqlpw c2ysc" aria-hidden="true"></div>
                </figure>
                <div className="text-white czjaw c54sb c1zcx cnc7y">
                  <header className="">
                    <div className="csz0f">
                      <h3 className="cps50 cci6q cu5hn cwrry csrqa">
                      Stay Connected
                      </h3>
                    </div>
                  </header>
                  <footer>
                    <div className="cvshg ceng1">
                    <p><strong>Follow Top Players:</strong> AWatch live games from top-rated players and learn from their
                    strategies.</p>
                    <p><strong>Participate in Events:</strong> Check the events calendar regularly for upcoming tournaments and
                    special events.</p>
                  
                    </div>
                  </footer>
                </div>
              </article>

          
             

            </div>

          </div>
        </div>
      </section>

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
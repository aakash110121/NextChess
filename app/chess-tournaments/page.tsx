import React from 'react';
import { Metadata } from "next";
import Image from 'next/image';
import HeroBgImgtour from '@/public/images/tournaments-banner.jpg';
import WhyIcon1 from '@/public/images/chess-type.png';
import WhyIcon2 from '@/public/images/chess-type1.png';
import WhyIcon3 from '@/public/images/chess-type2.png';
import WhyIcon4 from '@/public/images/chess-type3.png';
import WhyIcon5 from '@/public/images/chess-type4.png';

import RelatedPost3 from '@/public/images/related-post-03.jpg';
import RelatedPost4 from '@/public/images/related-post-04.jpg';
import RelatedPost5 from '@/public/images/related-post-05.jpg';
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
         src={HeroBgImgtour}
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
                     <p className="text-gray-600 c0atf czz36">Looking for thrilling online chess tournaments? Squsts offers a competitive platform for
                        chess players of all skill levels. Whether you're a beginner or a seasoned grandmaster, our
                        chess tournaments provide the perfect arena to test your strategies and compete for prizes.
                     </p>
                  </div>
               </header>
            </article>
         </div>
      </div>
   </div>
</section>
{/* Why Play */}

<section>
   <div className="czd2q c92f3 cmhb9 c1plj">
      <div className="c1r3i ccem0">
      <div className="c5okk" data-aos="fade-down" data-aos-delay="200">
      <h4 className="cps50 cyb9k cm36t">Why Play on Squsts?</h4>
         <div className="why-play">
            <div className="why-wrap">
               <div className="why-img cyb9k">
                  <figure>
                     <Image
                        src={WhyIcon1}
                        width={65}
                        height={65}
                        alt='Related post 03'
                        />
                  </figure>
               </div>
               <div className="why-text">
                  <h3 className="cps50 cci6q cu5hn cwrry csrqa">
                     Variety of
                     Formats
                  </h3>
                  <div className="cvshg ceng1">
                     <p>
                        Participate in
                        various chess
                        formats,
                        including Blitz,
                        Rapid, and
                        Classical, with
                        Swiss,
                        Knockout, and
                        Round-Robin
                        structures.
                     </p>
                  </div>
               </div>
            </div>


            <div className="why-wrap">
               <div className="why-img cyb9k">
                  <figure>
                     <Image
                        src={WhyIcon2}
                        width={65}
                        height={65}
                        alt='Related post 03'
                        />
                  </figure>
               </div>
               <div className="why-text">
                  <h3 className="cps50 cci6q cu5hn cwrry csrqa">
                  Prizes
                  </h3>
                  <div className="cvshg ceng1">
                     <p>
                     Our online
chess
tournaments
feature rewards,
exclusive
memberships,
and more,
making every
game exciting.

                     </p>
                  </div>
               </div>
            </div>

            <div className="why-wrap">
               <div className="why-img cyb9k">
                  <figure>
                     <Image
                        src={WhyIcon3}
                        width={65}
                        height={65}
                        alt='Related post 03'
                        />
                  </figure>
               </div>
               <div className="why-text">
                  <h3 className="cps50 cci6q cu5hn cwrry csrqa">
                  Fair Play

                  </h3>
                  <div className="cvshg ceng1">
                     <p>
                     We enforce
strict
anti-cheating
measures to
ensure a fair
and level
playing field in
every chess
match.

                     </p>
                  </div>
               </div>
            </div>


            <div className="why-wrap">
               <div className="why-img cyb9k">
                  <figure>
                     <Image
                        src={WhyIcon4}
                        width={65}
                        height={65}
                        alt='Related post 03'
                        />
                  </figure>
               </div>
               <div className="why-text">
                  <h3 className="cps50 cci6q cu5hn cwrry csrqa">
                  Live
Interaction

                  </h3>
                  <div className="cvshg ceng1">
                     <p>
                     Watch live
chess
tournaments,
analyze
ongoing games,
and learn from
top players in
real time.

                     </p>
                  </div>
               </div>
            </div>

            <div className="why-wrap">
               <div className="why-img cyb9k">
                  <figure>
                     <Image
                        src={WhyIcon5}
                        width={65}
                        height={65}
                        alt='Related post 03'
                        />
                  </figure>
               </div>
               <div className="why-text">
                  <h3 className="cps50 cci6q cu5hn cwrry csrqa">
                  Community

                  </h3>
                  <div className="cvshg ceng1">
                     <p>
                     Connect with
fellow chess
enthusiasts,
share
strategies, and
improve your
game in a
vibrant online
chess
community.

                     </p>
                  </div>
               </div>
            </div>

         </div>
     </div>
      </div>
   </div>
</section>



{/* Get Started */}
<section>
   <div className="czd2q c92f3 cmhb9 c1plj get-started">
      <div className="c1r3i ccem0">
         <h4 className="cps50 cyb9k cm36t">Get Started</h4>
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
                           Sign Up or Log In
                        </h3>
                     </div>
                  </header>
                  <footer>
                     <div className="cvshg ceng1">
                        <p>Create your account if
                           you’re new.
                        </p>
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
                           Browse Tournaments
                        </h3>
                     </div>
                  </header>
                  <footer>
                     <div className="cvshg ceng1">
                        <p>Check out our Tournaments
                           Page for upcoming events.
                        </p>
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
                           Compete and Win
                        </h3>
                     </div>
                  </header>
                  <footer>
                     <div className="cvshg ceng1">
                        <p>Bring your best game and
                           climb the Squsts
                           leaderboard!
                        </p>
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
   <div className="czd2q c92f3 cmhb9 c1plj how-to-play">
      <div className="cdoe6 ccem0">
         <div className="c13rv cfcoc">
            {/* Main content */}
            <div className="c5okk" data-aos="fade-down" data-aos-delay="200">
               <h4 className="cps50 csrqa cm36t">How to Play in Tournaments on Squsts</h4>
               <div className="text-gray-600 c0atf c2h4q cy5hl">
                  <p>
                     Participating in tournaments on Squsts is easy and fun! Follow these simple steps to join and
                     compete:
                  </p>
               </div>
               <div className="clyfp cn6x8 c8eth ch9c5 crcpd c74as">
                  <article className="c54sb strng cnc7y">
                     <header>
                        <h3 className="cps50 csrqa cadh6">Create an Account or Log In</h3>
                     </header>
                     <p className="text-gray-600 c0atf ">
                        <strong>New Users :</strong> If you’re new to Squsts, start by creating an account. Click on the <strong>Sign
                        Up </strong> button at the top-right corner of the page and fill in your details.
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong>Returning Users :</strong> If you already have an account, simply log in using your
                        credentials.
                     </p>
                  </article>
                  <article className="c54sb strng cnc7y">
                     <header>
                        <h3 className="cps50 csrqa cadh6">Find a Tournament</h3>
                     </header>
                     <p className="text-gray-600 c0atf ">
                        <strong>Browse Tournaments :</strong> Visit the Tournaments Page on Squsts to see a list of
                        available tournaments.
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong> Filter and Sort :</strong> Use filters to find tournaments that match your preferences, such as
                        Blitz, Rapid, or Classical formats. You can also sort by start date, prize pool, or skill
                        level.
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong> Featured Tournaments :</strong> Check out the featured tournaments at the top of the page
                        for exciting and popular events.
                        level.
                     </p>
                  </article>
                  <article className="c54sb strng cnc7y">
                     <header>
                        <h3 className="cps50 csrqa cadh6">Join a Tournament</h3>
                     </header>
                     <p className="text-gray-600 c0atf ">
                        <strong>Select a Tournament :</strong>  Click on a tournament card to view its details.
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong>Review Tournament Info :</strong> Make sure to read the tournament overview, rules,
                        schedule, and other details
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong>Registration :</strong> Click the <strong>Join Tournament</strong> button. If there’s an entry fee, you’ll be
                        prompted to complete the payment process.
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong>Confirmation :</strong> Once registered, you’ll receive a confirmation email and see the
                        tournament added to your My Tournaments page.
                     </p>
                  </article>
                  <article  className="c54sb strng cnc7y">
                     <header>
                        <h3 className="cps50 csrqa cadh6">Prepare for the Tournament</h3>
                     </header>
                     <p className="text-gray-600 c0atf ">
                        <strong>Check the Schedule :</strong> Review the tournament schedule and set reminders for when
                        your games start.
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong>Practice :</strong> Sharpen your skills by playing practice games or solving puzzles on
                        Squsts.
                     </p>
                  </article>
                  <article className="c54sb strng cnc7y">
                     <header>
                        <h3 className="cps50 csrqa cadh6">Playing Your Matches</h3>
                     </header>
                     <p className="text-gray-600 c0atf ">
                        <strong>Notifications :</strong> You’ll receive a notification when your match is about to start.
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong>Join the Game :</strong> When it’s time to play, go to the tournament page on Squsts and
                        click <strong>Play Now </strong> to join your match.
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong>Game Interface :</strong> The game will launch in our interactive chess board. Make sure to
                        stay within the time control limits to avoid losing on time.
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong>Submit Your Moves :</strong> Play your moves by clicking on the pieces and squares. Your
                        moves are automatically submitted, and your clock will switch to your opponent.
                     </p>
                  </article>
                  <article className="c54sb strng cnc7y">
                     <header>
                        <h3 className="cps50 csrqa cadh6">Between Rounds</h3>
                     </header>
                     <p className="text-gray-600 c0atf ">
                        <strong>View Leaderboard :</strong> After each round, check your standings on the tournament
                        leaderboard.
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong>Watch Other Games :</strong> While waiting for the next round, you can watch ongoing
                        games in the tournament.
                     </p>
                  </article>
                  <article className="c54sb strng cnc7y">
                     <header>
                        <h3 className="cps50 csrqa cadh6">Completing the Tournaments</h3>
                     </header>
                     <p className="text-gray-600 c0atf ">
                        <strong>Final Standings :</strong> At the end of the tournament, the final standings will be displayed.
                        Prizes will be awarded based on these standings
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong>Claim Your Prize :</strong> If you’ve won a prize, you’ll receive instructions on how to claim it
                        via email or through your Squsts profile.
                     </p>
                  </article>
                  <article className="c54sb strng cnc7y">
                     <header>
                        <h3 className="cps50 csrqa cadh6">Post-Tournament</h3>
                     </header>
                     <p className="text-gray-600 c0atf ">
                        <strong>Review Your Games :</strong> Analyze your games using our built-in game analysis tool on
                        Squsts to learn from your mistakes and improve.
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong>Feedback and Ratings :</strong> We value your feedback! Please rate the tournament and
                        leave a review to help us improve future events.
                     </p>
                  </article>
                  <article className="c54sb strng cnc7y">
                     <header>
                        <h3 className="cps50 csrqa cadh6">Important Tips</h3>
                     </header>
                     <p className="text-gray-600 c0atf ">
                        <strong>Be On Time :</strong> Ensure you are ready to play at the scheduled start time for each
                        round.
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong>Fair Play :</strong> Squsts strictly enforces fair play. Any form of cheating will result in
                        disqualification and a ban from future tournaments.
                     </p>
                     <p className="text-gray-600 c0atf ">
                        <strong>Stay Connected :</strong> Ensure a stable internet connection during your matches to avoid
                        disconnection losses.
                     </p>
                  </article>
                  <article className="c54sb strng cnc7y ">
                     <header>
                        <h3 className="cps50 csrqa cadh6">Need Help?
                        </h3>
                     </header>
                     <p className="text-gray-600 c0atf ">
                        <strong>Support :</strong> If you have any questions or encounter any issues during the tournament,
                        please visit our Support Page or contact our support team via email at 
                        <a href="mailto:info@squsts.com
                           "> info@squsts.com.
                        </a>
                     </p>
                  </article>
               </div>
               {/* Call to Action Article */}
               <div className="cszww c5v0a c74as mert">
                  <article className="cj3dx ch76r c54sb c6zr7 cnc7y cdt9h">
                     <header>
                        <h3 className="cps50 ccipq cadh6">
                           <a href="#0">Start Competing Today!</a>
                        </h3>
                     </header>
                     <div className="text-gray-600 c0atf c2h4q competing-txt">
                        <p>
                           Ready to take on the challenge? Sign up for Squsts and enter our online chess tournaments
                           today. With exciting formats, fair play, and a supportive community, Squsts is the ultimate
                           destination for competitive chess. For assistance, contact us at <br /> <a href="mailto:info@squsts.com">info@squsts.com. </a>
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
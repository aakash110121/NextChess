import React from 'react';
import { Metadata } from "next";
import Image from 'next/image';
import HeroBgImgtour from '@/public/images/tournaments-banner.jpg';

export const metadata: Metadata = {
title: 'Sign Up | Squsts',
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
   
 
  
</section>
<div className="login-wrap">
    <div className="wrapper register">
        <a href="index.html"><span className="icon-close">X</span></a>
    
    <h2>Registration</h2>
    
    <div className="input-box">
        <span className="icon"></span>
        <input type="text" required />
        <label>Username</label>
    </div>
    
    <div className="input-box">
        <span className="icon"></span>
        <input type="email" required />
        <label>Email</label>
    </div>
    <div className="input-box">
        <span className="icon"></span>
        <input type="password" required />
        <label>Password</label>
    </div>
    <div className="remember-forgot">
        <label><input type="checkbox" />Remember me</label>
    </div>
    <a href="login.html"><button type="submit" className="btn">Register</button></a>
    <div className="login-register">
      <p>Already have an account?<a href="" className="register-link"><button className="btn">Login</button>
        
       </a>
      </p>
     </div>
    </div>
</div>








</>
)
}
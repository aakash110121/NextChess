'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import TierCard from "../../components/TierCard";

export default function PricingClient({userId, subscription, products}:any){
//const [products, setProducts] = useState([]);
  {/*useEffect(()=>{
      axios({
       method: "GET",
       url: "/api/stripe/products",
     }).catch((err) => {
       // console.log("EEEEEEEEEEEEERRRRRRRRRRRRR OOOOOOOOOOOOO RRRR: ", err);
     }).then((res:any)=>{
      // console.log("DATA: ", res.data);
      //@ts-ignore
      setProducts([...res.data])

     }).catch((err)=>{
        // console.log(err);
     });
  },[])*/}
    return (
      <div className="p-4 lg:p-6">
        <div>
          <h2 className="text-3xl font-bold tracki text-center mt-5 sm:text-5xl ">
            Pricing
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-xl text-center ">
            Get started on our free plan and upgrade when you are ready.
          </p>
        </div>
        <div className="mt-12 container space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-8 grid-flow-row">
             {products.map((product:any, idx:number)=>(
              <div key={idx}>
                <TierCard product={product} userId={userId} subscription={subscription}></TierCard>
              </div>
             ))}
        </div>
      </div>
    );
}
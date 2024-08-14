"use client";
import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { products } from "../../lib/products_library";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import SubscriptionPlanCard from "@/components/SubscriptionPlanCard";
import { CgClose } from "react-icons/cg";

interface TierCardProps {
  userId: any;
  subscription: any;
  trial?: boolean; // Optional property
}

export default function PricingTable({userId, subscription, trial=false}:TierCardProps) {
  const [programCycle, setProgramCycle] = useState("monthly");
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false); //LOADING PROCESS OF SUBSCRIPTION/UPGRADE/DOWNGRADE

  const [priceId, setPriceId] = useState<null | string>(null);


  function handleProgramCycle(cycle: string) {
    if(cycle!==programCycle){
      setIsLoadingPage(true);
    }
    setProgramCycle(cycle);
  }
   
  useEffect(()=>{
    setIsLoadingPage(false);
  }, [isLoadingPage]);

  const router = useRouter();
  

    const handleGetStarted = async (priceId:string, productName:string) => {
        // console.log(priceId);
        setLoading(true);
        const res = await axios({
            method:'POST',
            url:'/api/stripe/payment',
            data:{
                priceId:priceId,
                userId:userId,
                productName:productName,
                trial:trial,
            },
            headers:{
                "Content-Type":"application/json",
            }
        }).catch((err)=>{
          setLoading(false);
        });
        if(res?.data.error){
          // console.log(res.data);
          return;
        }
        window.location.assign(res?.data);
    }

    const handleInstantUpgrade = async (priceId:string) =>{
      setLoading(true);
      const res = await axios({
        method: "POST",
        url: "/api/stripe/upgrade_subscription",
        data: {
          priceId: priceId,
          subscriptionId: subscription.id,
          immediate: true,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data.error) { 
        setLoading(false); 
        // console.log(res.data);
        return;
      }
      setLoading(false);
      setStep(0);
      setPriceId(null);
      router.push('/account/billing');
      return Swal.fire({
        title: "Subscription upgraded successfully!",
        html: "Redirecting to account...",
        timer: 2000,
        timerProgressBar: true,
      });
    }

    const handleUpdate = async (priceId: string) => {
      setLoading(true);
      const res = await axios({
        method: "POST",
        url: "/api/stripe/upgrade_subscription",
        data: {
          priceId: priceId,
          subscriptionId: subscription.id,
          immediate:false,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data.error) {
       // console.log(res.data);
       return;   
      }
      router.push('/account/billing');
    };

    
    function handleSetPriceId(priceId:any){
      setPriceId(priceId);
    }

    const [step, setStep] = useState(0);

  return (
    <div className="relative bg-[#f1f5f9] w-full min-h-screen px-2 py-[70px]  overflow-x-hidden ">
      <div className="fixed hidden md:flex w-full bottom-0 h-5 bg-gradient-to-t from-[#0f172a] to-[#1244293b] z-[10] "></div>
      {priceId ? 
          <div className="fixed left-0 right-0 top-0 bottom-0 flex justify-center items-center z-20 bg-[#12442950] backdrop-blur-sm">
             {step == 0 ? 
             <div className="w-full max-w-[500px] rounded-md relative bg-[#EEEEEE] p-8 shadow-md shadow-black-40">
              <CgClose onClick={()=>{setStep(0); setPriceId(null)}} className="w-6 h-6 absolute top-2 right-2 cursor-pointer hover:bg-gray-300 rounded-lg" />            
                 <h2 className="text-[22px] font-semibold w-full text-center text-[#124429] pb-5">Please select upgrade type</h2>
                 <div className="w-full justify-center items-center flex flex-col flex-wrap gap-y-2">
                    <button onClick={()=>setStep(1)} className="p-4 transition-all duration-100 bg-[#124429] break-words w-full text-white rounded-md hover:bg-[#132b1e]">I want this upgrade now</button>
                    <button onClick={()=>setStep(2)} className="p-4 transition-all duration-100 bg-[#124429] break-words w-full text-white rounded-md hover:bg-[#132b1e]">At the end of current cycle</button>
                 </div>
             </div> : 
             step == 1 ? 
             <div className="w-full max-w-[500px] rounded-md relative bg-[#EEEEEE] p-8 shadow-md shadow-black-40">
                 <CgClose onClick={()=>{setStep(0); setPriceId(null)}} className="w-6 h-6 absolute top-2 right-2 cursor-pointer hover:bg-gray-300 rounded-lg" />
                 <h2 className="text-[22px] font-semibold w-full text-center text-[#124429] pb-5">Immediate Upgrade</h2>
                 <p className="text-[#124429] pb-5">Note: Upgrade will take place immediately, and you will be charged immediately. If you are currently in a trial period - it will be imemediatelly ended! </p>
                 <div className="w-full justify-center items-center flex flex-col flex-wrap gap-y-2">
                    <button onClick={()=>{
                      handleInstantUpgrade(priceId);
                      setLoading(true);
                    }} className="p-4 transition-all duration-100 bg-[#124429] break-words w-full text-white rounded-md hover:bg-[#132b1e]">Continue</button>
                    <button onClick={()=>setStep(0)} className="p-4 transition-all duration-100 bg-[#124429] break-words w-full text-white rounded-md hover:bg-[#132b1e]">Back</button>
                 </div>
             </div> :
             <div className="w-full max-w-[500px] rounded-md relative bg-[#EEEEEE] p-8 shadow-md shadow-black-40">
                 <CgClose onClick={()=>{setStep(0); setPriceId(null)}} className="w-6 h-6 absolute top-2 right-2 cursor-pointer hover:bg-gray-300 rounded-lg" />
                 <h2 className="text-[22px] font-semibold w-full text-center text-[#124429] pb-5">Plan Upgrade</h2>
                 <p className="break-words text-[#124429] pb-5">Note: This action would upgrade your plan, but it will take place and charge you only at the end of your current subscription cycle.</p>
                 <div className="w-full justify-center items-center flex flex-col flex-wrap gap-y-2">
                    <button onClick={()=>{
                      handleUpdate(priceId);
                      setLoading(true);
                    }} className="p-4 transition-all duration-100 bg-[#124429] break-words w-full text-white rounded-md hover:bg-[#132b1e]">Continue</button>
                    <button onClick={()=>setStep(0)} className="p-4 transition-all duration-100 bg-[#124429] break-words w-full text-white rounded-md hover:bg-[#132b1e]">Back</button>
                 </div>
             </div> }
          </div> : <></>}
  <div className="max-w-[1600px] mx-auto flex flex-col h-full">
    <div className="text-center mb-3">
      <h1 className="font-bold text-3xl text-black mb-5">Pricing Table</h1>
      {/*<h4 className="text-gray-600 text-white/80">
        Choose one of the offered Premium Tiers.
      </h4>*/}
    </div>
    <div className="w-[235px] h-[50px] bg-slate-900 rounded-md mx-auto mb-[70px] p-[4px] flex z-[100]">
      <div
        onClick={() => handleProgramCycle("monthly")}
        className={`w-1/2 h-full cursor-pointer transition-all duration-200 ease-in-out text-center flex items-center justify-center rounded-md ${
          programCycle == "monthly"
            ? "text-[#124429] bg-white"
            : "text-white"
        } `}
      >
        Monthly
      </div>
      <div
        onClick={() => handleProgramCycle("yearly")}
        className={`w-1/2 h-full cursor-pointer transition-all duration-200 ease-in-out text-center flex items-center justify-center rounded-md  ${
          programCycle == "yearly"
            ? "text-[#124429] bg-white"
            : "text-white"
        }`}
      >
        Yearly
      </div>
    </div>
    {!isLoadingPage && <motion.div
      className="flex flex-col md:flex-row px-2 md:px-0 md:gap-y-0 md:gap-x-6 flex-grow"
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.0,
        type: "spring",
        stiffness: 20,
        damping:10,
        mass: 2,
      }}
    >
      {products.map((product, idx: number) => (
        product.period == programCycle && <div key={idx} className="w-full md:w-1/4  hover:border-[#000]  transition duration-100 ease-in-out p-6 flex flex-col border border-slate-200 rounded-lg  bg-white shadow-default">
          <SubscriptionPlanCard 
          product={product} 
          userId={userId} 
          subscription={subscription} 
          trial={trial} 
          loading={loading}
          handleSetPriceId={handleSetPriceId}
          handleUpdate={handleUpdate}
          handleInstantUpgrade={handleInstantUpgrade}
          handleGetStarted={handleGetStarted}/>  
        </div>
      ))}
    </motion.div>}
  </div>
</div>
  );
}

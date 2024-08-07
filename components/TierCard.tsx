import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from 'framer-motion';
import { CgClose } from "react-icons/cg";
import { GrValidate } from "react-icons/gr";


interface TierCardProps {
  product: any;
  userId: any;
  subscription: any;
  trial?: boolean; // Optional property
}


export default function TierCard({product, userId, subscription, trial = false}:TierCardProps){
    
    const router = useRouter();
    
    const handleGetStarted = async (priceId:string) => {
        // console.log(priceId);
        const res = await axios({
            method:'POST',
            url:'/api/stripe/payment',
            data:{
                priceId:priceId,
                userId:userId,
                productName:product.name,
                trial:trial,
            },
            headers:{
                "Content-Type":"application/json",
            }
        });
        if(res.data.error){
          // console.log(res.data);
          return;
        }
        window.location.assign(res.data);
    }

    const handleInstantUpgrade = async (priceId:string) =>{
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

    const [priceId, setPriceId] = useState<null | string>(null);

    const [step, setStep] = useState(0);

    const initialPosition = { y: -100, opacity: 0.5 };
    const finalPosition = { y: 0, opacity: 1 };
    const disappearPosition = { x: -100, opacity: 0 };

    const variants = [
      initialPosition,
      {
        ...finalPosition,
        transition: { duration: 2 },
      },
      {
        ...disappearPosition,
        transition: { duration: 1 },
      },
    ]

    const currentVariant =
      step === 1 ? "visible" : step === 2 ? "disappearing" : "hidden";

    const [loading,setLoading] = useState(false);

    return (
      <motion.div
        className={`relative bg-white p-8 h-full border border-gray-200 rounded-2xl flex flex-col shadow-md`}
        initial={{ opacity: 0, y: -180 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
        duration: 2.0,
        type: 'spring',
        stiffness: 60,
        //damping:10,
        mass:2,
        }}
      >
        <div className="flex-1">
          {priceId ? 
          <div className="fixed left-0 right-0 top-0 bottom-0 flex justify-center items-center z-20">
             {step == 0 ? 
             <div className="w-full max-w-[500px] rounded-md relative bg-[#EEEEEE]">
              <CgClose onClick={()=>{setStep(0); setPriceId(null)}} className="w-6 h-6 absolute top-2 right-2" />            
                 <h2 className="text-[20px] font-semibold">Please select upgrade type</h2>
                 <div className="w-full justify-center items-center flex flex-wrap">
                    <button onClick={()=>setStep(1)} className="p-2 break-words">I want this upgrade now</button>
                    <button onClick={()=>setStep(2)} className="p-2 break-words">At the end of current cycle</button>
                 </div>
             </div> : 
             step == 1 ? 
             <div className="w-full max-w-[500px] rounded-md relative bg-[#EEEEEE]">
                 <CgClose onClick={()=>{setStep(0); setPriceId(null)}} className="w-6 h-6 absolute top-2 right-2" />
                 <h2 className="text-[20px] font-semibold">Immediate Upgrade</h2>
                 <p>Note: Upgrade will take place immediately, and you will be charged immediately. If you are currently in a trial period - it will be imemediatelly ended! </p>
                 <div className="w-full justify-center items-center flex flex-wrap">
                    <button onClick={()=>{
                      handleInstantUpgrade(priceId);
                      setLoading(true);
                    }} className="p-2">Continue</button>
                    <button onClick={()=>setStep(0)} className="p-2">Back</button>
                 </div>
             </div> :
             <div className="w-full max-w-[500px] rounded-md relative bg-[#EEEEEE]">
                 <CgClose onClick={()=>{setStep(0); setPriceId(null)}} className="w-6 h-6 absolute top-2 right-2" />
                 <h2 className="text-[20px] font-semibold">Plan Upgrade</h2>
                 <p className="break-words">Note: This action would upgrade your plan, but it will take place and charge you only at the end of your current subscription cycle.</p>
                 <div className="w-full justify-center items-center flex flex-wrap">
                    <button onClick={()=>{
                      handleUpdate(priceId);
                      setLoading(true);
                    }} className="p-2">Continue</button>
                    <button onClick={()=>setStep(0)} className="p-2">Back</button>
                 </div>
             </div> }
          </div> : <></>}
          <h3 className="text-xl font-semibold ">{product.name}</h3>
          <div className="absolute top-0 flex space-x-2">
            {product.metadata.type == "gold" && (
              <p className="py-1.5 px-4 bg-emerald-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide  transform -translate-y-1/2">
                Most popular
              </p>
            )}
            {subscription && subscription.nextPrice==product.default_price?.unit_amount/100 && subscription.nextPrice !== subscription.price && (
              <p className="py-1.5 px-4 bg-red-600 text-white rounded-full text-xs font-semibold uppercase tracking-wide  transform -translate-y-1/2">
                Scheduled Next
              </p>
            )}
            {subscription && subscription.productName == product.name && (
              <p className="py-1.5 px-4 bg-black/90 text-white rounded-full text-xs font-semibold uppercase tracking-wide  transform -translate-y-1/2">
                Your current tier
              </p>
            )}
          </div>
          <p className="mt-4 flex items-baseline ">
            <span className="text-5xl font-extrabold tracking-tight">
              {(product.default_price?.unit_amount / 100).toLocaleString(
                "en-US",
                {
                  style: "currency",
                  currency: "USD",
                }
              )}
            </span>
            <span className="ml-1 text-xl font-semibold">/month</span>
          </p>
          <p className="mt-6 ">
            You want to learn and have a personal assistant
          </p>
          <ul role="list" className="mt-6 space-y-6">
            {product.features &&
              product.features.map((feature: any, idx: number) => (
                <li key={idx} className="flex">
                  <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width="24"
  height="24"
>
  <circle
    cx="12"
    cy="12"
    r="10"
    fill="#124429"
    className="circle"
  />
  <path
    d="M6 12l4 4 8-8"
    stroke="white"
    stroke-width="2"
    fill="none"
    className="checkmark"
  />
</svg>
                  <span className="ml-3 ">{feature.name}</span>
                </li>
              ))}
          </ul>
        </div>
        <button
          onClick={() => {
            if (subscription.price) {
              if(subscription.price<product.default_price?.unit_amount/100){
                setPriceId(product.default_price.id)
              }
              else {
                handleUpdate(product.default_price.id);
              }
            } else {
             handleGetStarted(product.default_price.id);
            }
          }}
          className="bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium"
        >
          { trial ? "Try For Free" : 
            Object.keys(subscription).length > 0
            ? subscription.price > product.default_price?.unit_amount / 100
              ? "Downgrade Plan"
              : subscription.price < product.default_price?.unit_amount / 100
              ? "Upgrade Uplan"
              : "Continue With Current"
            : "Get Started"}
        </button>
      </motion.div>
    );
}
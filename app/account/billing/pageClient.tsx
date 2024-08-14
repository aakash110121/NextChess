
"use client"
import { axiosInstance } from "@/services/base-http.service";
import axios from "axios";
import { useRouter } from 'next/navigation';
import {useState} from 'react'
import { FaCcVisa } from "react-icons/fa";
import { RiBillFill  } from "react-icons/ri";



export default function AccountClient({session, userProfile, subscription, invoices, paymentMethod}:any){
   const router  = useRouter();

   const handleSubscriptionActivity = async (idx:number) => {
      if(idx===1){
        await axiosInstance({
            url:'/api/stripe/cancel_subscription',
            method:'POST',
            data:{
              subscriptionId:userProfile.subscription,
              userId:session.user.uid
            }
           }).then((res)=>{
            router.refresh();
           }).catch((error)=>{
               // console.log(error);
           })
      }
      else if(idx==2){
        await axiosInstance({
            url:'/api/stripe/reactivate_subscription',
            method:'POST',
            data:{
              subscriptionId:userProfile.subscription,
              userId:session.user.uid
            }
           }).then((res)=>{
            router.refresh();
           }).catch((error)=>{
            console.log("ERROR: ", error);
               // console.log(error);
           })
      }
   } 

   const [action, setAction] = useState<string | null>(null);
   const handleContinue = ()=>{
     if(action=='cancel') {
      handleSubscriptionActivity(1)
     } else{
      handleSubscriptionActivity(2);
     }

     setAction(null);
   }
     return (
       <>
         {Object.keys(subscription).length == 0 ? (
           <div className="w-full h-screen bg-gray-100 ">
             <section className="w-full h-full relative flex items-center flex-col justify-center space-y-10">
               <div className="min-w-[350px] rounded-[5px] border border-stroke bg-white px-7 py-[50px] shadow-default flex flex-col items-center justify-center space-y-5 break-words">
                 <p className="text-[22px] tracking-widest text-center text-black">
                   You dont have an active premium plan.
                 </p>
                 <button
                   onClick={() => {
                     router.push("/pricing");
                   }}
                   className="px-5 py-3  rounded-md font-bold bg-black shadow-md shadow-black/40 tracking-wider text-[20px] text-[#fff]"
                 >
                   Get Premium Membership
                 </button>
               </div>
                {invoices && Object.keys(invoices).length > 0 && (
               <section className="w-full p-2">
                 <div className="rounded-md border-[1px] border-[#13131370] p-2">
                   <div className="pb-2 w-full border-b-[1px] border-[#13131360]">
                     <p className="text-[22px] font-semibold">
                       Billing history
                     </p>
                   </div>
                   <ul className="space-y-2 max-h-[330px] overflow-y-auto">
                     <li className="grid grid-cols-10 mt-4 text-[#ff7d37] text-[14px]">
                       <div className="col-span-5">Invoice name</div>
                       <div className="col-span-2">Amount</div>
                       <div className="col-span-2">Date</div>
                       <div className="col-span-1">Options</div>
                     </li>
                     {invoices && Object.keys(invoices).length > 0 &&
                       invoices.map((item: any, idx: number) => (
                         <li
                           key={idx}
                           className="grid grid-cols-10 text-[12px] py-4 border-[1px] border-[#13131360] text-[#13131370]"
                         >
                           <div className="col-span-5 px-1">
                             <span className="font-bold text-[#13131395] mr-2">
                               {item.number}
                             </span>
                             <span className="truncate">{item.lines.data[item.lines.data.length-1].description}</span>
                           </div>
                           <div className="col-span-2 px-1">
                             <span className="font-bold text-[#13131395]">
                               {(item.total / 100).toLocaleString("en-US", {
                                 style: "currency",
                                 currency: "USD",
                               })}
                             </span>
                           </div>
                           <div className="col-span-2 px-1">
                             <span className="font-bold text-[#13131395]">
                               {new Date(
                                 item.created * 1000
                               ).toLocaleDateString("en-US", {
                                 day: "2-digit",
                                 month: "long", // Use 'short' for abbreviated month name
                                 year: "numeric",
                               })}
                             </span>
                           </div>
                           <div className="col-span-1 px-1">
                              <a href={`${item.invoice_pdf}`} target='_blank' className="">
                               <RiBillFill className="w-6 h-6 hover:text-black cursor-pointer"/>
                              </a>
                           </div>
                         </li>
                       ))}
                   </ul>
                 </div>
               </section> )}
             </section>
           </div>
         ) : (
           <div className="w-full bg-gray-100 py-[70px] relative overflow-y-auto">
             <div className="w-full h-full  lg:px-5">
               {action && (
                 <div
                   className={`fixed z-[999] left-0 right-0  flex justify-center items-center bg-[#000000b3]  top-0 bottom-0`}
                 >
                   <div className="max-w-[500px]  flex flex-col items-center justify-between rounded-[5px] border border-stroke bg-white px-7 py-[40px] shadow-default">
                     <div className="w-full flex flex-col items-center justify-center space-y-4">
                       <p className="w-full text-center font-bold text-[18px]">
                         Are you sure you want to {action} subscription?
                       </p>
                       {action == "cancel" ? (
                         <p className="text-[14px] text-center ">
                           Note: After you cancel subscription you will still
                           have premium features untill the end of current
                           subscription period. You will also be able to
                           reactivate it before the end of current subscription
                           period.
                         </p>
                       ) : (
                         <p></p>
                       )}
                     </div>
                     <div className="w-full justify-center items-center flex space-x-2 mt-5">
                       <button onClick={()=>{handleContinue()}} className="tracking-wider rounded-full  text-white p-2 px-4 bg-[#131313] border border-[#131313] hover:bg-[#fff] hover:text-[#131313]">
                         Continue
                       </button>
                       <button onClick={()=>setAction(null)} className="tracking-wider rounded-full text-white p-2 px-4 bg-[#131313] border border-[#131313] hover:bg-[#fff] hover:text-[#131313]">
                         Cancel
                       </button>
                     </div>
                   </div>
                 </div>
               )}
               <section className="w-full p-2 pt-5 pb-0 lg:pt-2 flex flex-col lg:flex-row gap-y-4 lg:gap-x-4 lg:gap-y-0 ">
                 <div className="w-full lg:w-1/2 rounded-[5px] border border-stroke bg-white p-7 shadow-default">
                   <p className="text-[22px] font-semibold text-[#000]">Account type</p>
                   <ul className="flex  border-t-[1px] border-[#ddd] py-4 mt-[15px] gap-4">
                     <li className="p-2 w-1/2 border-[2px] rounded-[5px] bg-[#F3F5F8] p-5">
                       <div className="break-words">
                         <p className="text-[#000] font-bold mb-2 tracking-wide">
                           YOUR SUBSCRIPTION
                         </p>
                         <p className="font-semibold mb-2">
                           {subscription.productName}{" "}
                           <span className="tracking-tight  ml-2 font-medium text-[16px]">
                             {subscription.price &&
                               subscription.price?.toLocaleString("en-US", {
                                 style: "currency",
                                 currency: "USD",
                               })}
                           </span>
                           <span className="text-[#13131385] font-medium text-[16px]">
                             /month
                           </span>
                         </p>
                         <p className="font-medium text-[16px]">
                           Usage time left:{" "}
                           {subscription.allowedUsageTime == "Unlimited"
                             ? " Unlimited"
                             : `${Math.floor(
                                 subscription.allowedUsageTime / 60
                               )}min`}
                         </p>
                       </div>
                       <div className="flex w-full mt-5 flex-wrap gap-y-1">
                         <button onClick={()=>router.push('/pricing')} className="p-2 mr-2 px-4 text-[14px] bg-[#000] border border-[#000] hover:bg-[#fff] hover:text-[#000] text-white tracking-wider rounded-md font-semibold">
                           Upgrade
                         </button>
                         {subscription.cancel_at_period_end ? (
                           <button
                             onClick={() => setAction('reactivate')}
                             className="p-2 px-4 text-[14px] bg-[#000] border border-[#000] hover:bg-[#fff] hover:text-[#000] text-white rounded-md tracking-wide font-semibold"
                           >
                             Reactivate
                           </button>
                         ) : (
                           <button
                             onClick={() => setAction('cancel')}
                             className="p-2 px-4 text-[14px] bg-[#000] border border-[#000] hover:bg-[#fff] hover:text-[#000] text-white rounded-md tracking-wide font-semibold"
                           >
                             Cancel
                           </button>
                         )}
                       </div>
                     </li>
                     <li className="w-1/2 flex flex-col justify-between border-[2px] rounded-[5px] bg-[#F3F5F8] p-5">
                       <div className="">
                         <p className="text-[#000] font-bold tracking-wide mb-2">
                           YOUR LAST BILL
                         </p>
                         <div className="flex items-center">
                           <p className="font-semibold">
                             {" "}
                             {invoices && (invoices[0].amount_paid/100).toLocaleString("en-US", {
                               style: "currency",
                               currency: "USD",
                             })}
                           </p>
                           <p className="mx-1 font-medium text-[14px]">on</p>
                           <p className="font-medium text-[14px]">
                             {new Date(
                               subscription.start * 1000
                             ).toLocaleDateString("en-US", {
                               day: "2-digit",
                               month: "long", // Use 'short' for abbreviated month name
                               year: "numeric",
                             })}
                           </p>
                         </div>
                       </div>
                       <div>
                         <p className="text-[#000] font-bold tracking-wide mb-2">
                           YOUR NEXT BILL
                         </p>
                         <div className="flex items-center flex-wrap">
                           <p className="font-semibold">
                             {" "}
                             {subscription.nextPrice
                               ? subscription.nextPrice.toLocaleString(
                                   "en-US",
                                   {
                                     style: "currency",
                                     currency: "USD",
                                   }
                                 )
                               : subscription.price.toLocaleString("en-US", {
                                   style: "currency",
                                   currency: "USD",
                                 })}
                           </p>
                           <p className="mx-1 text-[14px]">on</p>
                           <p className="text-[14px] mr-2">
                             {new Date(
                               subscription.end * 1000
                             ).toLocaleDateString("en-US", {
                               day: "2-digit",
                               month: "long", // Use 'short' for abbreviated month name
                               year: "numeric",
                             })}
                           </p>
                           {subscription.cancel_at_period_end && <div className="text-[10px] font-medium p-1 text-white rounded-md bg-red-600">CANCELED</div>}
                         </div>
                       </div>
                     </li>
                   </ul>
                 </div>

                 {/* PAYMENT METHOD SECTION */}
                 <div className="w-full  lg:w-1/2 rounded-[5px] border border-stroke bg-white p-7 shadow-default">
                   <p className="text-[22px] font-semibold text-[#000]">Payment Method</p>
                   {paymentMethod ? (
                     <div className="w-full border-t-[1px]  px-3  lg:flex lg:space-x-3  border-[#ddd] py-4 mt-[15px]">
                       <div className="lg:w-1/2">
                         <p className="text-[#000] font-bold tracking-wide mb-2">
                           PAYMENT DETAILS
                         </p>
                         <div className="p-1">
                           <span className="font-medium text-[16px] text-[#0a0a0a]">
                             Card
                           </span>
                           <div className="w-full  border-[2px] rounded-[5px] bg-[#F3F5F8] px-2 py-2  font-medium text-black flex items-center justify-between">
                             <p className="truncate">
                               **** **** **** {paymentMethod.card.last4}
                             </p>
                             <FaCcVisa className="w-6 h-6"/>
                           </div>
                           <div className="mt-3 w-full ">
                             <span className="font-medium text-[16px] text-[#0a0a0a]">
                               Name
                             </span>
                             <div className="w-full  border-[2px] rounded-[5px] bg-[#F3F5F8] px-2 py-2  font-medium text-black flex items-center">
                               <p className="truncate">
                                 {paymentMethod.billing_details.name}
                               </p>
                             </div>
                           </div>
                         </div>
                       </div>
                       <div className="lg:w-1/2">
                         <p className="text-[#000] font-bold tracking-wide mb-2">
                           BILLING ADDRESS
                         </p>
                         {paymentMethod.billing_details && (
                           <div className="p-1">
                             <span className="font-medium text-[16px] text-[#0a0a0a]">
                               Billing Addres
                             </span>
                             <div className=" w-full flex items-center border-[2px] rounded-[5px] bg-[#F3F5F8] px-2 py-2  font-medium text-black">
                               {paymentMethod.billing_details.address
                                 .postal_code
                                 ? paymentMethod.billing_details.address
                                     .postal_code
                                 : "No address"}
                             </div>
                             <ul className="w-full  flex space-x-3 mt-3">
                               <li className="w-1/3">
                                 <span className="font-medium text-[16px] text-[#0a0a0a]">
                                   City
                                 </span>
                                 <div className="w-full border-[2px] rounded-[5px] bg-[#F3F5F8] px-2 py-2  font-medium text-black flex items-center">
                                   <p className="truncate">
                                     {paymentMethod.billing_details.address.city
                                       ? paymentMethod.billing_details.address
                                           .city
                                       : "No city"}
                                   </p>
                                 </div>
                               </li>
                               <li className="w-1/3">
                                 <span className="font-medium text-[16px] text-[#0a0a0a]">
                                   State
                                 </span>
                                 <div className="w-full border-[2px] rounded-[5px] bg-[#F3F5F8] px-2 py-2  font-medium text-black flex items-center">
                                   <p className="truncate">
                                     {paymentMethod.billing_details.address
                                       .country
                                       ? paymentMethod.billing_details.address
                                           .country
                                       : "No postal code"}
                                   </p>
                                 </div>
                               </li>
                               <li className="w-1/3">
                                 <span className="font-medium text-[16px] text-[#0a0a0a]">
                                   Zip
                                 </span>
                                 <div className="w-full border-[2px] rounded-[5px] bg-[#F3F5F8] px-2 py-2  font-medium text-black flex items-center">
                                   <p className="truncate">
                                     {paymentMethod.billing_details.address.city
                                       ? paymentMethod.billing_details.address
                                           .city
                                       : "No zip code"}
                                   </p>
                                 </div>
                               </li>
                             </ul>
                           </div>
                         )}
                       </div>
                     </div>
                   ) : (
                     <div className="w-full border-t-[1px] border-[#13131330] p-3 mt-[4px] lg:flex justify-center items-center text-center bg-white shadow-md shadow-black/40">
                       <p>No payment method added</p>
                     </div>
                   )}
                 </div>
               </section>
               <section className="w-full p-2 mt-5">
                 <div className="rounded-[5px] border border-stroke bg-white p-7 shadow-default">
                   <div className=" w-full border-b-[1px]  border-[#ddd] py-4 ">
                     <p className="text-[22px] font-semibold text-[#000]">
                       Billing history
                     </p>
                   </div>
                   <ul className="relative space-y-2 max-h-[380px] overflow-y-auto overflow-x-hidden">
                     <li className="grid grid-cols-10 mt-4 text-[#000] sticky top-0 bg-white">
                       <div className="col-span-5 font-medium text-[16px]">Invoice name</div>
                       <div className="col-span-2 font-medium text-[16px]">Amount</div>
                       <div className="col-span-2 font-medium text-[16px]">Date</div>
                       <div className="col-span-1 font-medium text-[16px]">Options</div>
                     </li>
                     {invoices && Object.keys(invoices).length > 0 &&
                       invoices.map((item: any, idx: number) => (
                         <li
                           key={idx}
                           className="grid grid-cols-10 text-[12px] py-4 border-[2px] rounded-[5px] bg-[#F3F5F8] px-2"
                         >
                           <div className="col-span-5 px-1">
                             <span className="font-bold text-[#000] mr-2">
                               {item.number}
                             </span>
                             <span className="font-medium text-[12px]">{item.lines.data[item.lines.data.length-1].description}</span>
                           </div>
                           <div className="col-span-2 px-1">
                             <span className="font-bold text-[#000]">
                               {(item.total / 100).toLocaleString("en-US", {
                                 style: "currency",
                                 currency: "USD",
                               })}
                             </span>
                           </div>
                           <div className="col-span-2 px-1">
                             <span className="font-bold text-[#000]">
                               {new Date(
                                 item.created * 1000
                               ).toLocaleDateString("en-US", {
                                 day: "2-digit",
                                 month: "long", // Use 'short' for abbreviated month name
                                 year: "numeric",
                               })}
                             </span>
                           </div>
                           <div className="col-span-1 px-1">
                              <a href={`${item.invoice_pdf}`} target='_blank' className="">
                              <RiBillFill className="w-6 h-6 hover:text-black cursor-pointer"/>
                              </a>
                           </div>
                         </li>
                       ))}
                   </ul>
                 </div>
               </section>
             </div>
           </div>
         )}
       </>
     );
}
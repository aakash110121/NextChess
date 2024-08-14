import Image from 'next/image'
import { AiOutlineLoading3Quarters } from "react-icons/ai";


interface TierCardProps {
    product: any;
    userId: any;
    subscription: any;
    trial?: boolean; // Optional property
    loading?: boolean;
    handleSetPriceId: (priceId: any) => void;
    handleUpdate: (priceId:any) => Promise<void>;
    handleGetStarted: (priceId:string, productName:string) => Promise<void>;
    handleInstantUpgrade: (priceId:string) => Promise<any>;
  }

export default function SubscriptionPlanCard({product, userId, subscription, trial=false, loading, handleSetPriceId, handleUpdate, handleGetStarted, handleInstantUpgrade}:TierCardProps){
    return(
        <>
          <div className="relative w-1/2 max-w-[70px] aspect-square border border-slate-200 rounded-full  bg-white mx-auto mt-[-50px]">
            <Image
              src={`${product.image}`}
              alt="Description of image"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <h3 className="text-[#000] text-lg font-semibold mt-5 mb-2">{product.name}</h3>
          <p className="text-[#000] mt-1 mb-2">
            <span className="font-bold text-[#000] text-4xl">{(product.default_price?.unit_amount / 100).toLocaleString(
                "en-US",
                {
                  style: "currency",
                  currency: "USD",
                }
              )}</span>{" "}
            /{product.period=='monthly' ? 'Month' : 'Year'}
          </p>
          <div className="md:h-[140px] overflow-hidden pt-2">
            <span className="text-sm text-[#000]">
               <p className="break-words">{product.description}</p>
            </span>
          </div>
          <button 
            onClick={() => {
                console.log("TUSMO!");
                console.log("SUB PRICE: ", subscription?.price);
            if (subscription?.price) {
              if(subscription.price<product.default_price?.unit_amount/100){
                handleSetPriceId(product.default_price.id)
              }
              else {
                handleUpdate(product.default_price.id);
              }
            } else {
                console.log("GET STARTED!");
             handleGetStarted(product.default_price.id, product.name);
            }
            }}
            disabled={loading} 
            className="w-full group hover:text-[#000]  hover:border-[#000] hover:bg-white  tracking-wider border  transition duration-150 ease-in-out mt-4 bg-slate-900 rounded-md py-2 text-sm font-semibold text-white text-center mb-4">
           {loading? <AiOutlineLoading3Quarters className={`text-white group-hover:text-[#124429] animate-spin m-auto`}></AiOutlineLoading3Quarters> : 
            trial ? "Try For Free" : 
            Object.keys(subscription).length > 0
            ? subscription.price > product.default_price?.unit_amount / 100
              ? "Downgrade Plan"
              : subscription.price < product.default_price?.unit_amount / 100
              ? "Upgrade Uplan"
              : "Continue With Current"
            : "Subscribe"}
          </button>
          <ul
            role="list"
            className="flex flex-col gap-y-1 text-[#000] pt-4 overflow-auto"
          >
            {product.features &&
              product.features.map((feature: any, idx: number) => (
                <li key={idx} className="flex gap-x-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 h-5 w-5 text-green-400" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M5 12l5 5l10 -10"></path>
                        </svg>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
          </ul>
        </>
    )
}
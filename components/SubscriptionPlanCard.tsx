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
          <div className="relative w-1/2 max-w-[120px] aspect-square border-[1px] border-[#124429] p-1 rounded-md">
            <Image
              src={`${product.image}`}
              alt="Description of image"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <h3 className="text-[#124429] text-lg">{product.name}</h3>
          <p className="text-[#124429] mt-1">
            <span className="font-bold text-[#124429] text-4xl">{(product.default_price?.unit_amount / 100).toLocaleString(
                "en-US",
                {
                  style: "currency",
                  currency: "USD",
                }
              )}</span>{" "}
            /{product.period=='monthly' ? 'Month' : 'Year'}
          </p>
          <div className="md:h-[120px] overflow-hidden pt-2">
            <span className="text-sm text-[#124429]">
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
            className="w-full group hover:text-[#124429] border hover:border-[#124429] hover:bg-white font-semibold tracking-wider rounded bg-[#124429] text-white hover:shadow-xl hover:shadow-black/30 transition duration-150 ease-in-out h-[58px] mt-4">
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
            className="flex flex-col gap-y-1 text-[#124429] pt-4 overflow-auto"
          >
            {product.features &&
              product.features.map((feature: any, idx: number) => (
                <li key={idx} className="flex gap-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    className="flex-shrink-0 mt-[2px]"
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
                      strokeWidth="2"
                      fill="none"
                      className="checkmark"
                    />
                  </svg>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
          </ul>
        </>
    )
}
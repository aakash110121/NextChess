import {motion} from 'framer-motion'
import { useEffect, useState } from 'react';
import TierCard from './TierCard';

const bounceTransition = {
    type: "spring",
    damping: 10,
    stiffness: 40,
};

interface TrialModalParams{
    text: string | null | undefined,
    userId: string,
    trial?: boolean,
}


export default function SubscriptionTrialModal({text, userId, trial = false}:TrialModalParams){
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const [errorFetchingProducts, setErrorFetchingProducts] = useState(false);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`/api/stripe/products`, { method: 'GET' });
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const prod = await res.json();
                setProducts(prod);
                setLoadingProducts(false);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setErrorFetchingProducts(true);
            }
        };

        fetchProducts();
    }, []);

    return(
        <div className="fixed z-[200] bg-white/40 h-screen left-0 right-0 top-0 bottom-0 p-4 lg:p-6 backdrop-blur-sm overflow-y-auto">
        <div>
          <h2 className="text-3xl font-bold tracki text-center mt-5 sm:text-5xl ">
             You Have Reached Your Limit!
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-xl text-center ">
             {trial ? 
              `You can play again in ${text} or start a free 7-day trial for unlimited access. Choose your option below!` 
              : `You can play again in ${text} or go with one of our subscription tiers for unlimited access. Choose your option below!` 
             }
          </p>
        </div>
        <div className="mt-12 container space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-8 grid-flow-row">
             {!loadingProducts ? products.map((product:any, idx:number)=>(
              <div key={idx}>
                <TierCard product={product} userId={userId} subscription={{}} trial={trial}></TierCard>
              </div>
             )) : 
             [1,2,3,4].map((itm:number, idx:number)=>(
                <div key={idx} className="relative p-8 h-full border bg-white border-black/20 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-gray-200 rounded col-span-2 animate-pulse"></div>
                  <div className="h-2 bg-gray-200 rounded col-span-1 animate-pulse"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded nimate-pulse"></div>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="h-8 bg-gray-200 rounded nimate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded nimate-pulse"></div>
            </div>
            <div className="mt-8 block w-1/2 py-3 px-6 border border-transparent rounded-md bg-gray-200"></div>
          </div>
             ))}
        </div> 
      </div>
    )
}
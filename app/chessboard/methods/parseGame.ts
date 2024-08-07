import { getDoc, getDocs } from "firebase/firestore";
import { unstable_cache } from "next/cache";

export const parseGame = unstable_cache(
    async (gameDoc) => {
        const querySnapshot = await getDoc(gameDoc); 
        // Convert to array of document formats if necessary
        if(querySnapshot.exists()){
            return querySnapshot.data();
        }
        return null; // Always return an array
    },
    ['game'],
    {revalidate:1}
)
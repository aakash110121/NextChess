import { getDocs } from "firebase/firestore";
import { unstable_cache } from "next/cache";

export const parseGames = unstable_cache(
    async (searchQuery) => {
        const querySnapshot = await getDocs(searchQuery); 
        // Convert to array of document formats if necessary
        const gamesArray:any[] = [];
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const id = doc.id;
            //@ts-ignore
            gamesArray.push({ ...data, 'gameId': id });
        });
        return gamesArray; // Always return an array
    },
    ['games'],
    {revalidate:1}
)
// import HomePage from "./home-page";
import HomePage from "./homepage";
import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";


export default async function Home() {
  // const session = await getSession();

  // if(session) await redirect('/home');
  return (
    <HomePage></HomePage>
  );
}

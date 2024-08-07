import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { gradient } from "@/components/Gradient";
import HomePage from "./home-page";
import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";


export default async function Home() {
  const session = await getSession();

  if(session) await redirect('/home');
  return (
    <HomePage></HomePage>
  );
}

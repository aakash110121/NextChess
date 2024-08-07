import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LandingNavBar() {
  const router = useRouter();
  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-transparent py-[6px] px-4 md:px-6 lg:px-16 flex justify-end items-center z-[100]">
        <div className="flex gap-x-2">
          <button
            onClick={() => router.push('/login')}
            type="button"
            className="pulse-button rounded-md text-white bg-transparent hover:text-[#124429] transition duration-300 px-6 py-[6px] font-medium z-10"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/signup')}
            type="button"
            className="pulse-button rounded-md text-white bg-transparent px-6 py-[6px] hover:text-[#124429] transition duration-300 font-medium z-10"
          >
            Register
          </button>
        </div>
      </div>
      <style jsx>{`
        .pulse-button {
          transition: color 0.3s;
        }
        .pulse-button:hover {
          color: #124429;
        }
      `}</style>
    </>
  );
}
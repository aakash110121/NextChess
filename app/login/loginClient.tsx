'use client'
import {useFormState, useFormStatus} from 'react-dom'
import { loginAction } from './action'
import Image from 'next/image'
import { useRouter } from "next/navigation";

// Import the logo image
import ChessviaLogo from '@/public/chessvia.png';
import Link from 'next/link';
import ForgotPassword from '@/utils/auth/ForgotPassword';
import { useState } from 'react';

export default function LoginClient(){
    const [state, formAction] = useFormState(loginAction, null);
    const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
    const toggleForgotPasswordModal = () => setForgotPasswordModalOpen(!forgotPasswordModalOpen);
    const [emailValue, setEmailValue] = useState('');
    return (
      <main className="flex items-center justify-center min-h-screen bg-white py-16">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-center items-center w-full">
            <Image
              src={ChessviaLogo}
              alt="Chessvia Logo"
              width={210}
              height={70}
            />
          </div>
          <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800">
                  Sign in
                </h1>
              </div>

              <div className="mt-5">
                <form action={formAction}>
                  <div className="grid gap-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm mb-2">
                        Email address
                      </label>
                      <input
                        onChange={(e)=>setEmailValue(e.target.value)}
                        type="email"
                        id="email"
                        name="email"
                        className={`py-3 px-4 block w-full border focus:border-blue-500 border-gray-300 focus:ring-blue-500 rounded-lg text-sm`}
                        required
                      />
                      {//@ts-ignore
                      state?.error?.email && <label className="text-red-600 text-[12px]">{state.error.email.at(0)}</label>}
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor="password"
                          className="block text-sm mb-2"
                        >
                          Password
                        </label>
                        <button
                          type="button"
                          className="text-sm text-blue-600 decoration-2 hover:underline font-medium"
                          onClick={() => toggleForgotPasswordModal()}
                        >
                          Forgot password?
                        </button>
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className={`py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500`}
                        required
                      />
                      {//@ts-ignore
                      state?.error?.password && <label className="text-red-600 text-[12px]">{state.error.password.at(0)}</label>}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {"Don't have an account yet?"}{" "}
                      <Link href="/signup">
                        <span className="text-blue-600 decoration-2 hover:underline font-medium cursor-pointer">
                          Sign up here
                        </span>
                      </Link>
                    </p>
                      {//@ts-ignore
                      state?.error?.loginFailed && <label className="text-red-600 text-[12px]">{state.error.loginFailed}</label>}
                    <div className="group">
                      <SubmitButton />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <ForgotPassword
                    emailValue={emailValue}
                    modalOpen={forgotPasswordModalOpen}
                    toggleModal={toggleForgotPasswordModal}
                />
        </div>
      </main>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus()
  
    return (
      <button
        disabled={pending}
        className='w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border
         border-transparent text-white bg-[#124429]  hover:bg-green-800 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
      >
        {pending ? 'Submitting...' : 'Submit'}
      </button>
    )
}

                                
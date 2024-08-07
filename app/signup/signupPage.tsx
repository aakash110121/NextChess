"use client";

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/utils/auth/FirebaseCredentials';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


// Import the logo image
import ChessviaLogo from '@/public/chessvia.png';

interface PageProps {
  params?: any;
  searchParams?: any;
}

export default function SignupPage({ params, searchParams }: PageProps) {
  const [error, setError] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(loading) return;
    setLoading(true);

    const { email, password, confirmPassword } = event.currentTarget.elements as any;

    if (password.value !== confirmPassword.value) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const created = await createUserWithEmailAndPassword(auth, email.value, password.value); 
      if(created){ 
        await sendEmailVerification(created.user);
        setLoading(false);
         router.push('/login');
      } // Redirect to the dashboard or another route
    } catch (signupError) {
      setError((signupError as Error).message);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-white py-16">
    <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center items-center w-full">
          <Image src={ChessviaLogo} alt="Chessvia Logo" width={210} height={70} />
        </div>
        <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800">Sign up</h1>
              <p className="mt-2 text-sm text-gray-600">
                Already have an account? {' '}
                <Link href="/login">
                  <span className="text-blue-600 decoration-2 hover:underline font-medium">
                    Sign in here
                  </span>
                </Link>
              </p>
            </div>

            <div className="mt-5">
              <form onSubmit={handleSignup}>
                <div className="grid gap-y-4">
                  {error && <div className="text-sm text-red-600">{error}</div>}

                  <div>
                    <label htmlFor="email" className="block text-sm mb-2">Email address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"

                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm mb-2">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"

                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm mb-2">Confirm Password</label>
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirmPassword"
                      className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"

                      required
                    />
                  </div>

                  <div className="group">
                      <button
                          type="submit"
                          style={{ backgroundColor: '#124429' }}
                          className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-green-800 disabled:opacity-50 disabled:pointer-events-none"
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0f3b30"} // Darker shade for hover
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#124429"} // Original color
                      >
                          Sign up
                      </button>
                  </div>
                </div>
              </form>
              {loading && <span>Loading...</span>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


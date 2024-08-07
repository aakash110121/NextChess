"use client"

import React, { useState } from 'react';
import { auth } from '@/utils/auth/FirebaseCredentials';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import the function
import ForgotPassword from '@/utils/auth/ForgotPassword';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/navigation";

// Import the logo image
import ChessviaLogo from '@/public/chessvia.png';

interface PageProps {
    params?: any;
    searchParams?: any;
}

export default function LoginPage({ params, searchParams }: PageProps) {
    const [error, setError] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const router = useRouter();

    const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
    const toggleForgotPasswordModal = () => setForgotPasswordModalOpen(!forgotPasswordModalOpen);

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const { email, password } = event.target as HTMLFormElement;

        try {
            await signInWithEmailAndPassword(auth, email.value, password.value);
            router.push('/form'); // Redirect on successful sign-in
        } catch (loginError) {
            setError('Incorrect password or email, please re-enter the information or sign up.');
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
                            <h1 className="block text-2xl font-bold text-gray-800">Sign in</h1>
                            <p className="mt-2 text-sm text-gray-600">
                                {"Don't have an account yet?"}{' '}
                                <Link href="/signup">
                                    <span className="text-blue-600 decoration-2 hover:underline font-medium cursor-pointer">
                                        Sign up here
                                    </span>
                                </Link>
                            </p>
                        </div>


                        <div className="mt-5">
                            <form onSubmit={handleLogin}>
                                <div className="grid gap-y-4">
                                    {error && <div className="text-sm text-red-600">{error}</div>}

                                    <div>
                                        <label htmlFor="email" className="block text-sm mb-2">Email address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                            onChange={(e) => setEmailValue(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center">
                                            <label htmlFor="password" className="block text-sm mb-2">Password</label>
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
                                            Sign in
                                        </button>
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
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './FirebaseCredentials';

export default function SignupPage({ onClose, toggleToLogin }) {
  const [error, setError] = useState('');

  async function handleSignup(event) {
    event.preventDefault();

    const { email, password, confirmPassword } = event.target.elements;

    if (password.value !== confirmPassword.value) {
      setError('Passwords do not match');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      onClose();
    } catch (signupError) {
      setError(signupError.message); // Display the actual error message, need to change before we go live
    }
  }

  return (
    <html className="h-full">
      <body className="dark:bg-slate-900 bg-gray-100 flex h-full items-center py-16">
        <main className="w-full max-w-md mx-auto p-6">
          <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign up</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?
                  <a className="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="../examples/html/signin.html">
                    Sign in here
                  </a>
                </p>
              </div>

              <div className="mt-5">
                <form onSubmit={handleSignup}>
                  <div className="grid gap-y-4">
                    {error && <div className="text-sm text-red-600">{error}</div>}

                    <div>
                      <label htmlFor="email" className="block text-sm mb-2 dark:text-white">Email address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="block text-sm mb-2 dark:text-white">Confirm Password</label>
                      <input
                        type="password"
                        id="confirm-password"
                        name="confirmPassword"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

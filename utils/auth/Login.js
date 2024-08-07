import React, { useState } from 'react';
import { auth } from './FirebaseCredentials'
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import the function
import ForgotPassword from '.ForgotPassword';

export default function LoginPage({ onClose }) {
  const [error, setError] = useState('');
  const [emailValue, setEmailValue] = useState('');

  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const toggleForgotPasswordModal = () => {
    setForgotPasswordModalOpen(!forgotPasswordModalOpen);
  };

  async function handleLogin(event) {
    event.preventDefault();

    const { email, password } = event.target.elements;
    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      onClose();
    } catch (loginError) {
      setError('Incorrect password or email, please re-enter the information or sign up.');
    }
  }

  return (
    <div>
      <html className="h-full">
        <body className="dark:bg-slate-900 bg-gray-100 flex h-full items-center py-16">
          <main className="w-full max-w-md mx-auto p-6">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="p-4 sm:p-7">
                <div className="text-center">
                  <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account yet?
                    <a className="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="../examples/html/signup.html">
                      Sign up here
                    </a>
                  </p>
                </div>

                <div className="mt-5">
                  <form onSubmit={handleLogin}>
                    <div className="grid gap-y-4">
                      {error && <div className="text-sm text-red-600">{error}</div>}

                      <div>
                        <label htmlFor="email" className="block text-sm mb-2 dark:text-white">Email address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                          onChange={(e) => setEmailValue(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center">
                          <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password</label>
                          <button
                            type="button"
                            className="text-sm text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            onClick={() => toggleForgotPasswordModal()}
                          >
                            Forgot password?
                          </button>
                        </div>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </body>
      </html>
      <ForgotPassword
        emailValue={emailValue}
        modalOpen={forgotPasswordModalOpen}
        toggleModal={toggleForgotPasswordModal}
      />
    </div>
  );
}

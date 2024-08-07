import React from 'react';
import { auth } from '@/utils/auth/FirebaseCredentials';
import { getAdditionalUserInfo, signInWithEmailAndPassword } from 'firebase/auth'; // Import the function
import ForgotPassword from '@/utils/auth/ForgotPassword';
import Image from 'next/image';
import Link from 'next/link';
import {redirect} from 'next/navigation';

// Import the logo image
import ChessviaLogo from '@/public/chessvia.png';
import { login } from '@/lib/authentication';
import LoginClient from './loginClient';

interface PageProps {
    params?: any;
    searchParams?: any;
}

type LoginFormInputs = {
    email: string;
    password: string;
}

export default async function LoginPage({ params, searchParams }: PageProps) {

    async function handleLogin(data: FormData) {
        // console.log(data);
        // console.log()

       {/* try {
            const user = await signInWithEmailAndPassword(auth, email.value, password.value);
            // console.log("USER: ", user);
            if(user){
                const mail = user.user.email ? user.user.email : '';
                const formData = new FormData();
                formData.append('uid', user.user.uid);
                formData.append('email', mail);
                await login(formData);
            }

            
            //router.push('/form'); // Redirect on successful sign-in
        } catch (loginError) {
            //HERE'S THE ERROR
            // console.log('Incorrect password or email, please re-enter the information or sign up.');
        }*/}
    }

    const toggleForgotPasswordModal = (event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
    }
    return (
        <LoginClient></LoginClient>
    );
}
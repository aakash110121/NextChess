'use server'
import { dataFocusVisibleClasses } from "@nextui-org/react";
import { FormDataSchema } from "./zodSchema";
import {login} from '../../lib/authentication'
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '@/utils/auth/FirebaseCredentials';
import { redirect } from "next/navigation";

export async function loginAction(state:any, formData: FormData) {
    const result = FormDataSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    let check = false;
    if (result.success) {
      try {
        //@ts-ignore
        const user = await signInWithEmailAndPassword(
          auth,
          result.data.email,
          result.data.password
        );
        // console.log(user);
        if (user) {
          //if(!user.user.emailVerified){
           // return {
          //    error: {
         //       loginFailed: "Account not verified yet, check your email!"
           //   }
          //  }
          //}
          const mail = user.user.email ? user.user.email : "";
          const myData = new FormData();
          myData.append("uid", user.user.uid);
          myData.append("email", mail);
          try {
            //return { error: "Failed to create a session" };
            await login(myData);
            //return {data:'Loging successfull'}
          } catch (error) {
            return { error: "Failed to create a session" };
          }
        }

        //router.push('/form'); // Redirect on successful sign-in
      } catch (loginError) {
        //HERE'S THE ERROR
        // console.log( loginError,"Incorrect password or email, please re-enter the information or sign up.");
        return {
          error: {
            loginFailed:
              "Incorrect password or email, please re-enter the information or sign up.",
          },
        };
      }
      redirect("/home");
    } else
      return {
        error: {
          email: result.error.format().email?._errors,
          password: result.error.format().password?._errors,
        },
      };
}
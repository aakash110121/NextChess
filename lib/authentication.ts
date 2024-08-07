import axios from "axios";
import { SignJWT, decodeJwt, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "KJKSZPJ";
const refreshSecretKey = "aezakmiBAGUVIX"
const key = new TextEncoder().encode(secretKey);
const refreshKey = new TextEncoder().encode(refreshSecretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expires)
    .sign(key);
}

export async function encryptCopy(payload: any) {
  return await new SignJWT(payload)
  .setProtectedHeader({ alg: "HS256"})
  .sign(key);
}

function decodeJwtWithoutVerification(token:string) {
  try {
    const decoded = decodeJwt(token);
    return decoded;
  } catch (err) {
    return null;
  }
}

export async function encryptRefresh(payload: any){
  return await new SignJWT(payload)
  .setProtectedHeader({alg: "HS256"})
  .setIssuedAt()
  .setExpirationTime(payload.refreshExpires)
  .sign(refreshKey);
}

export async function decrypt(input: string): Promise<any> {
  const verification = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  }).catch((err)=>{
    return null;
  });

  let payload = null;
  if(verification){
    payload = verification.payload;
  }
  
  return payload;
} 

export async function decryptRefresh(input: string): Promise<any> {
  const verification = await jwtVerify(input, refreshKey, {
    algorithms: ["HS256"],
  }).catch((err)=>{
    return null;
  });
  let payload = null;
  if(verification){
    payload = verification.payload;
  }
  return payload;
}

export async function login(formData: FormData) {
  // Verify credentials && get the user
 
  console.log("HEREWEARE!!!")
  console.log(formData);
  const user = { email: formData.get("email"), uid: formData.get("uid") };
 
  console.log(user);
  // Create the session
  const expires = new Date(Date.now() + 60 * 1000 * 60); //1 hour
  const refreshExpires = new Date(Date.now() + 60 * 1000 * 60 * 24 * 7); //7 days
  const session = await encrypt({ user, expires });
  const refreshToken = await encryptRefresh({ user, refreshExpires });

  const sessionClearTime = new Date(Date.now() + 60 * 1000 * 60 * 24 * 365); //1 hour
  // Save the session in a cookie
  cookies().set("session", session, {expires: sessionClearTime});
  cookies().set("refreshToken", refreshToken, { expires: refreshExpires});
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
  cookies().set("refreshToken", "", {expires: new Date(0)});
}

//export async function getSessionn() {
  //const session = cookies().get("session")?.value;
  /*const refreshToken = cookies().get("refreshToken")?.value;*/
  //if (!session) return null;
  
 /* const sessionValidity = await decrypt(session);
  if(!sessionValidity && refreshToken){
    const refreshedSession = await refreshSession(session, refreshToken);
    if(!refreshedSession){
      return refreshedSession;
    }
    cookies().set("session", refreshedSession);
    return await decrypt(refreshedSession);
  }*/

  //return await decrypt(session);
//}

export async function getSession() {
  const session = cookies().get("session")?.value;
  const refreshToken = cookies().get("refreshToken")?.value;
  if (!session) return null;
  
  const sessionValidity = await decrypt(session);
  
  if(sessionValidity){
    return sessionValidity;
  }
  
  if(!refreshToken){
    return null;
  }

  return await decryptRefresh(refreshToken);
}


export async function refreshSession(sessionToken: string, refreshToken: string) {
  //const refreshToken = request.cookies.get("refreshToken")?.value;
  //console.log("refresh Token: ", refreshToken);
  //if(!refreshToken) return null;
  
  //const session = request.cookies.get("session")?.value;
  //console.log("Session token: ", session);
  //if(!session) return null;

  const decodeSession = decodeJwtWithoutVerification(sessionToken);
  if(!decodeSession){
    return null;
  }
  

  const sessionCopy = await encryptCopy(decodeSession);
  if(sessionCopy !== sessionToken){
    return null;
  }

  const refreshPayload = await decryptRefresh(refreshToken);
  //@ts-ignore
  if(decodeSession?.user?.uid == refreshPayload?.user.uid){
    const user = { email: refreshPayload.user.email, uid: refreshPayload.user.uid };
   
    console.log(user);
    // Create the session
    const expires = new Date(Date.now() + 60 * 1000 * 60); //1 hour
    const session = await encrypt({ user, expires });
    
    return session;
  }
  
  return null;
}


export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 60 * 1000 * 60); //1 hour
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
  });
  return res;
}

export async function authentication(sessionToken: string, refreshToken: string){
  const decryptSession = await decrypt(sessionToken);
  if(decryptSession){
    return true;
  }
  const newSession = await refreshSession(sessionToken, refreshToken);
  return newSession;
}


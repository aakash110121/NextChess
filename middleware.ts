import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/authentication";


const routeConfig = {
  rateLimit: [],
  auth: ["/api/protected-route", "/api/another-protected-route"],
  both: ["/api/transcribe", "/api/generate"], // Add routes needing both
};

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent
): Promise<Response | undefined> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const ip = request.ip ?? "127.0.0.1";
  console.log("PATHNAME : ", pathname);
  // ratelimit for demo app: https://demo.useliftoff.com/
  if(routeConfig.both.includes(pathname)){
  if (
    process.env.NODE_ENV != "development" &&
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      // Rate limit to 6 attempts per 2 days
      limiter: Ratelimit.cachedFixedWindow(12, `${24 * 60 * 60}s`),
      ephemeralCache: new Map(),
      analytics: true,
    });

    const { success, pending, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_middleware_${ip}`
    );
    event.waitUntil(pending);
    
    if(!success){
      const res= NextResponse.redirect(new URL("/api/blocked", request.url));
      res.headers.set("X-RateLimit-Limit", limit.toString());
      res.headers.set("X-RateLimit-Remaining", remaining.toString());
      res.headers.set("X-RateLimit-Reset", reset.toString());
      return res;
    }
  }
  }

  const sessionToken = request.headers.get('authorization')?.split(' ')[1];
  
  if (!sessionToken) {
    return NextResponse.json({ error: 'Authentication Error' }, { status: 401 });
  }

  try {
    const auth = await decrypt(sessionToken);
    if (!auth) {
      return NextResponse.json({ error: 'Authentication Error' }, { status: 401 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Authentication Error' }, { status: 401 });
  }
  
  return NextResponse.next(); // Continue to the next middleware or the actual handler
}

export const config = {
  matcher: [
    "/api/transcribe", 
    "/api/generate",  
    "/api/stripe/cancel_subscription",
    "/api/stripe/reactivate_subscription",
    '/api/thread/chat_create',
    '/api/message/create',
    '/api/message/list',
    '/api/run/retrieve',
    '/api/run/create',
    '/api/thread/create',
    '/api/voice/text_to_sound',
    '/api/brevo/send',
    '/api/assistant/create',
    '/api/chat_assistant/create'
  ],
};


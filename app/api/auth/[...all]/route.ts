import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import aj from "@/lib/arcjet";
import { ArcjetDecision, slidingWindow, validateEmail } from "@arcjet/next";
import { NextRequest } from "next/server";
import ip from "@arcjet/ip";

// Make Email validation rule before User Signup with his/her Email.This Rule is not directly used and is used in protectedAuth function
const emailValidation = aj.withRule(
  validateEmail({
    mode: "LIVE",
    deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
  })
);
// Rate Limiting rule.This rule is not directly used instead used in protectedAuth function
const rateLimit = aj.withRule(
  slidingWindow({
    mode: "LIVE",
    interval: "1m",
    max: 3,
    characteristics: ["userId"],
  })
);

const protectedAuth = async (req: NextRequest): Promise<ArcjetDecision> => {
  const session = await auth.api.getSession({ headers: req.headers });
  // console.log("Session object:", session);
  // console.log("Session user:", session?.user);
  // console.log("Session user id:", session?.user?.id);

  let userId: string;
  if (session?.user?.id) {
    userId = session.user.id;
  } else {
    userId = ip(req);
  }
  /*
# Why clone() is needed

 1.The Request object in Next.js Middleware (and in the Web Fetch API in general) has a streaming body.
 2.That means the body can be consumed only once.
 3.When you call something like await req.json(), the underlying body stream is read and closed.
 4.If you try to read it again later (for example, by another function, or Next.js itself), you’ll get an error like:
 5.TypeError: body stream already read

# What req.clone() does

 1.req.clone() makes a copy of the request, with its own readable stream.
 2.This lets you safely consume the body in your middleware without “stealing” it from downstream code.

# 👉 So await req.clone().json() means:

 1.“Make a safe copy of the request.”
 2. “Parse the copy’s body as JSON, and leave the original request untouched.”
*/
  if (req.nextUrl.pathname.startsWith("/api/auth/sign-in")) {
    const body = await req.clone().json();
    if (typeof body.email === "string") {
      return emailValidation.protect(req, { email: body.email });
    }
  }
  // console.log("RateLimiting userId:", userId);
  return rateLimit.protect(req, { userId });
};

const authHandlers = toNextJsHandler(auth.handler);
export const { GET } = authHandlers;
export const POST = async (req: NextRequest) => {
  const decision = await protectedAuth(req);
  if (decision.isDenied() && decision.reason) {
    if (decision.reason.isEmail()) {
      throw new Error("email validation failed");
    }
    if (decision.reason.isRateLimit()) {
      throw new Error("Rate limit exceeded");
    }
    if (decision.reason.isShield()) {
      throw new Error("shield turned ON ,protected against malicious actions");
    }
  }

  return authHandlers.POST(req);
};

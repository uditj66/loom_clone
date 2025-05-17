import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import aj from "@/lib/arcjet";
import { ArcjetDecision, slidingWindow, validateEmail } from "@arcjet/next";
import { NextRequest } from "next/server";
import ip from "@arcjet/ip";

// Email validation -> block

const emailValidation = aj.withRule(
  validateEmail({
    mode: "LIVE",
    block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
  })
);
const rateLimit = await aj.withRule(
  slidingWindow({
    mode: "LIVE",
    interval: "1m",
    max: 100,
    characteristics: ["fingerprint"],
  })
);

const protectedAuth = async (req: NextRequest): Promise<ArcjetDecision> => {
  const session = await auth.api.getSession({ headers: req.headers });

  let userId: string;
  if (session?.user?.id) {
    userId = session.user.id;
  } else {
    userId = ip(req || "127.0.0.1");
  }

  if (req.nextUrl.pathname.startsWith("/api/auth/sign-in")) {
    const body = await req.clone().json();
    if (typeof body.email === "string") {
      return emailValidation.protect(req, { email: body.email });
    }
  }
  return rateLimit.protect(req, { fingerprint: userId });
};

const authHandlers = toNextJsHandler(auth.handler);
// Rate Limiting

export const { GET } = authHandlers;
export const POST = async (req: NextRequest) => {
  const decision = await protectedAuth(req);

  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      throw new Error("email validation failed");
    }
    if (decision.reason.isRateLimit()) {
      throw new Error("Rate limit exceeded");
    }
    if (decision.reason.isShield()) {
      throw new Error("shield turn ON ,protected against malicious");
    }
  }

  return authHandlers.POST(req);
};

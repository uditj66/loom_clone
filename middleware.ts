import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
import aj from "./lib/arcjet";
import { createMiddleware, detectBot, shield } from "@arcjet/next";

export async function middleware(req: NextRequest, res: NextResponse) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}
// Bot protection
const validate = aj.withRule(shield({ mode: "LIVE" })).withRule(
  detectBot({
    mode: "LIVE",
    allow: ["CATEGORY:SEARCH_ENGINE", "GOOGLE_CRAWLER"],
  })
);
export default createMiddleware(validate);
export const config = {
  matcher: [
    "/((?!api|_next|static|favicon.ico|sign-in|signup|register|public|assets).*)",
  ],

  //   Adrian Matcher
  //   matcher: [
  //     "/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)",
  //   ]
};

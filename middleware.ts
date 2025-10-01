import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import aj from "./lib/arcjet";
import { createMiddleware, detectBot, shield } from "@arcjet/next";

export async function middleware(req: NextRequest, res: NextResponse) {
  const session = await auth.api.getSession({
    headers: req.headers,
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

// Generally we define routes in matcher array where we want to run middleware ,but there is new pattern coming around ,where we define the routes in matcher array where we don't want middleware to run.Below is the same pattern
export const config = {
  // Protect everything except below routes
  matcher: [
    "/((?!api|_next|static|favicon.ico|sign-in|sign-out|register|public|assets).*)",
  ],
};

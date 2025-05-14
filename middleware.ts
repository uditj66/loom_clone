import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function middleware(req: NextRequest, res: NextResponse) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next|static|favicon.ico|sign-in|signup|register|public|assets).*)",
  ],

  //   Adrian Matcher
  //   matcher: [
  //     "/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)",
  //   ]
};

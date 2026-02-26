import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextRequest, NextResponse } from "next/server";

// We intentionally do NOT import `auth` here.
// middleware runs on the Edge Runtime which doesn't support Node.js modules
// (perf_hooks, crypto, etc.) that better-auth + postgres use internally.
// Instead we call the session endpoint via HTTP — edge-compatible.

export async function middleware(req: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: req.nextUrl.origin,
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
    },
  );

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

// Protect everything except the routes listed below
export const config = {
  matcher: [
    "/((?!api|_next|static|favicon.ico|sign-in|sign-out|register|public|assets).*)",
  ],
};

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isProtected = req.nextUrl.pathname.startsWith("/app");
  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/app/:path*"],
};

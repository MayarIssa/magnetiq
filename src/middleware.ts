import { NextRequest, NextResponse } from "next/server";
import {
  verifySessionToken,
  verifyCustomerSessionToken,
  SESSION_COOKIE_NAME,
  CUSTOMER_COOKIE_NAME,
} from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (pathname.startsWith("/account")) {
    const token = req.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
    const session = token ? await verifyCustomerSessionToken(token) : null;
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};

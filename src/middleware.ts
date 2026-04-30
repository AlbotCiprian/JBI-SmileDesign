import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.[^/]+$/;
const LEGAL_SLUGS = new Set(["privacy-policy", "cookie-policy", "termeni-conditii"]);
const AUTH_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

function requestOrigin(req: NextRequest) {
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const host = req.headers.get("host") ?? req.nextUrl.host;
  return `${proto}://${host}`;
}

function hasSessionCookie(req: NextRequest) {
  return req.cookies.getAll().some(({ name }) =>
    AUTH_COOKIE_NAMES.some((cookieName) => name === cookieName || name.startsWith(`${cookieName}.`)),
  );
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    return;
  }

  if (pathname.startsWith("/admin") && !hasSessionCookie(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  if (pathname === "/ro") {
    return NextResponse.redirect(new URL("/", requestOrigin(req)));
  }

  if (pathname.startsWith("/ro/")) {
    const url = new URL("/", requestOrigin(req));
    url.pathname = pathname.replace(/^\/ro/, "") || "/";
    return NextResponse.redirect(url);
  }

  if (pathname === "/" || LEGAL_SLUGS.has(pathname.slice(1))) return;
}

export const config = {
  matcher: ["/admin/:path*", "/((?!api|_next|.*\\..*).*)"],
};

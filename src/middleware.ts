import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Permite mereu pagina de login.
  if (pathname === "/admin/login") {
    if (req.auth) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return;
  }

  // Restul rutelor /admin/* — necesită autentificare.
  if (pathname.startsWith("/admin") && !req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};

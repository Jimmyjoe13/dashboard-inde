import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    // Rediriger les utilisateurs non autorisés de / vers /auth/signin
    if (req.nextUrl.pathname === "/" && !req.nextauth.token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico|google.svg|auth).*)"],
};

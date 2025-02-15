// middleware.ts

import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token
    const isAuthPage = req.nextUrl.pathname.startsWith("/signin") || 
                      req.nextUrl.pathname.startsWith("/signup")

    // Redirect authenticated users away from auth pages
    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Allow authenticated users to access protected routes
    if (isAuth) {
      return NextResponse.next()
    }

    // Redirect unauthenticated users to signin
    if (!isAuth && !isAuthPage) {
      return NextResponse.redirect(new URL("/signin", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true // Let middleware handle the auth check
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/signin",
    "/signup",
  ],
}

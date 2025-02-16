// middleware.ts

import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { type NextRequest } from 'next/server'
import { type NextRequestWithAuth } from 'next-auth/middleware'

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const isAuth = !!req.nextauth.token
    const isAuthPage = req.nextUrl.pathname.startsWith("/signin") || 
                      req.nextUrl.pathname.startsWith("/signup")

    // Redirect authenticated users away from auth pages
    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // For API requests, check response status
    if (req.nextUrl.pathname.startsWith('/api/')) {
      const response = await fetch(req.url, {
        headers: req.headers,
        method: req.method,
        body: req.method !== 'GET' ? await req.text() : undefined,
      })

      if (response.status === 401) {
        // If API returns 401, redirect to signin
        return NextResponse.redirect(new URL("/signin", req.url))
      }

      // Forward the API response
      return response
    }

    // Allow authenticated users to access protected routes
    if (isAuth) {
      const response = NextResponse.next()
      
      // Add a response handler to check for 401s
      response.headers.set('x-middleware-handle-401', '1')
      return response
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

// Add a custom response handler
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Check if response should be monitored for 401
  if (response.headers.get('x-middleware-handle-401')) {
    response.headers.delete('x-middleware-handle-401')

    const res = new Response(response.body, {
      ...response,
      status: response.status,
      headers: response.headers,
    })

    if (res.status === 401) {
      return NextResponse.redirect(new URL("/signin", request.url))
    }
    return res
  }

  return response
}

export const config = {
  matcher: [
    // Add API routes to the matcher
    "/api/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/signin",
    "/signup",
  ],
}

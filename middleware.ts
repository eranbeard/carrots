import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // For a real app, you would check for authentication here
  // This is just a placeholder for demonstration purposes

  const isAuthenticated = request.cookies.has("carrot-user")
  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup" ||
    request.nextUrl.pathname === "/onboarding" ||
    request.nextUrl.pathname === "/"

  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}


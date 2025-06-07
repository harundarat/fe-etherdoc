import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // Check if wallet is connected (you might need to check cookies/session)
    // This is a simplified example
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/dashboard/:path*",
};

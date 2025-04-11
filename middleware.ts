import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.get("auth")?.value === "true";


    if (request.nextUrl.pathname === "/login") return NextResponse.next();

    if (request.nextUrl.pathname.startsWith("/dashboard") && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

// Apply middleware to these routes
export const config = {
    matcher: ["/dashboard/:path*", "/login"],
};

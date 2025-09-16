import { NextResponse } from "next/server";

// Publicly accessible routes
const publicRoutes = ["/", "/login", "/signup"];

export function middleware(req) {
  const token = req.cookies.get("accessToken")?.value;
  // console.log("Access token cookie : ", token);
  // const { pathname } = req.nextUrl;

  // // If route is NOT public → check auth
  // if (!publicRoutes.includes(pathname)) {
  //   if (!token) {
  //     const loginUrl = new URL("/signup", req.url);
  //     return NextResponse.redirect(loginUrl);
  //   }
  // }

  // // Otherwise, allow access
  return NextResponse.next();
}

// Only run middleware on certain paths
export const config = {
  matcher: [
    // Match all routes except static files and API
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};

import { NextResponse } from "next/server";

const publicRoutes = ["/", "/classes", "/forum", "/login", "/register"];
const authRoutes = ["/login", "/register"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;

  let role = null;
  if (userCookie) {
    try {
      role = JSON.parse(decodeURIComponent(userCookie))?.role;
    } catch {}
  }

  // Redirect logged-in users away from auth pages
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Role-based protection
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/dashboard/trainer") && role !== "trainer" && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect private routes
  const privateRoutes = ["/classes/", "/forum/", "/payment"];
  const isPrivate = privateRoutes.some(
    (route) => pathname.startsWith(route) && pathname !== "/classes" && pathname !== "/forum"
  );

  if (isPrivate && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
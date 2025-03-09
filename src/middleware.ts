import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isPublicRoute = createRouteMatcher(["/"]);
const isStudentRoute = createRouteMatcher(["/student-dashboard"]);
const isTeacherRoute = createRouteMatcher(["/teacher-dashboard"]);

function isApiRoute(req: NextRequest): boolean {
  return req.nextUrl.pathname.startsWith("/api/");
}

function isDashboardRoute(req: NextRequest): boolean {
  return (
    req.nextUrl.pathname.startsWith("/teacher-dashboard") ||
    req.nextUrl.pathname.startsWith("/student-dashboard")
  );
}

// export default clerkMiddleware();
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims } = await auth();

  const userRole = sessionClaims?.metadata?.role;

  const redirectToDashboard = () =>
    NextResponse.redirect(
      new URL(userRole === "STUDENT" ? "/student-dashboard" : "/teacher-dashboard", req.url)
    );

  // Allow API routes to bypass checks
  if (isApiRoute(req)) {
    return NextResponse.next();
  }

  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  //   Handling user on the home route
  if (userId && isPublicRoute(req) && userRole !== "PENDING") {
    return redirectToDashboard();
  }

  //   Handling when on the dashboard page
  if (isDashboardRoute(req)) {
    if (userRole === "STUDENT" && isTeacherRoute(req)) {
      return NextResponse.redirect(new URL("/student-dashboard", req.url));
    }
    if (userRole === "TEACHER" && isStudentRoute(req)) {
      return NextResponse.redirect(new URL("/teacher-dashboard", req.url));
    }

    return NextResponse.next();
  }

  //   Handling when on the onboard page
  if (isOnboardingRoute(req)) {
    if (userRole !== "PENDING") {
      return redirectToDashboard();
    }

    if (userId && userRole === "PENDING") {
      return NextResponse.next();
    }
  }

  // If logged in but not onboarded, and not already on onboarding page
  if (userId && userRole === "PENDING" && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

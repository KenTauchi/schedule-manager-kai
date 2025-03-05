import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isPublicRoute = createRouteMatcher(["/"]);
const isStudentRoute = createRouteMatcher(["/student-dashboard"]);
const isTeacherRoute = createRouteMatcher(["/teacher-dashboard"]);

// Add this helper function
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

  // Allow API routes to bypass checks
  if (isApiRoute(req)) {
    return NextResponse.next();
  }

  // If not logged in and trying to access private route, redirect to home
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect("/");
  }

  if (isDashboardRoute(req)) {
    if (userRole === "STUDENT" && isTeacherRoute(req)) {
      return NextResponse.redirect(new URL("/student-dashboard", req.url));
    }
    if (userRole === "TEACHER" && isStudentRoute(req)) {
      return NextResponse.redirect(new URL("/teacher-dashboard", req.url));
    }

    return NextResponse.next();
  }

  if (userRole !== "PENDING" && isOnboardingRoute(req)) {
    const userRole = sessionClaims?.metadata?.role;

    if (userRole === "STUDENT") {
      return NextResponse.redirect(new URL("/student-dashboard", req.url));
    } else if (userRole === "TEACHER") {
      return NextResponse.redirect(new URL("/teacher-dashboard", req.url));
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

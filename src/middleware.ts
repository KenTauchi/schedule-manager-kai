import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { get, request } from "http";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const isPublicRoute = createRouteMatcher(["/(.*)"]);

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

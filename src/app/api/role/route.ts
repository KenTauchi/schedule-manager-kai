import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  console.log("====== running ======????");

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    return NextResponse.json({
      data: {
        user,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("401")) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
      }
      if (error.message.includes("429")) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      }
    }

    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

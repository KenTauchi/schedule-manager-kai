import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();
  try {
    await prisma.user.create({
      data: {
        clerkId: data.id,
        email: data.email,
        username: data.username ?? data.email.split("@")[0],
        name: data.name,
        role: data.role,
      },
    });

    return NextResponse.json({ message: "Role updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

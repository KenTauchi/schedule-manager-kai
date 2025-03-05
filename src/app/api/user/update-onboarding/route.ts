import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { completeOnBoarding } from "@/actions/user.actions";
import { on } from "events";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return;

  const client = await clerkClient();

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      onBoardingComplete: true,
    },
  });

  return NextResponse.json({ success: true });
}

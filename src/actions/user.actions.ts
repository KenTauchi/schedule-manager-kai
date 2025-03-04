"use server";
import { currentUser, auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { date } from "zod";

export async function completeOnBoarding() {
  const { userId } = await auth();
  if (!userId) return;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        onBoarded: true,
      },
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Error creating user", error);
  }
}

export async function createUser(data: any) {
  try {
    const newUser = await prisma.user.create({
      data: {
        clerkId: data.id,
        email: data.email,
        username: data.username ?? data.email.split("@")[0],
        name: data.name,
        role: data.role,
      },
    });

    return { success: true, data: newUser };
  } catch (error) {
    console.error("Error creating user", error);
  }
}

type UpdateUserRoleProps = {
  id: string;
  role: "STUDENT" | "TEACHER";
};

export async function updateUserRole(data: UpdateUserRoleProps) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        clerkId: data.id,
      },
      data: {
        role: data.role,
      },
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Error creating user", error);
  }
}
export async function syncUser() {
  try {
    const user = await currentUser();
    const { userId } = await auth();

    if (!user || !userId) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return existingUser;

    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        name: `${user.firstName} ${user.lastName}`,
        image: user.imageUrl,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error syncing user", error);
  }
}
